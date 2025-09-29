import logging
import os
import re

from conf import config


class CircularBufferHandler(logging.Handler):
    def __init__(self, file_path, max_file_size=5 * 1024 * 1024):
        super().__init__()
        self.file_path = file_path
        self.max_file_size = max_file_size
        self._buffer = []
        self._enabled = True  # toggle flag
        self._load_existing_logs()

    def _load_existing_logs(self):
        """Load existing logs into the buffer, maintaining the file size limit."""
        if os.path.exists(self.file_path):
            with open(self.file_path, 'r') as file:
                lines = file.readlines()
                self._buffer = lines[-self.max_file_size // 100:]  # approx line size
                self._write_buffer_to_file()

    def _write_buffer_to_file(self):
        """Write the buffer to the log file."""
        with open(self.file_path, 'w') as file:
            file.writelines(self._buffer)

    def emit(self, record):
        """Handle circular buffer behavior."""
        if not self._enabled:  # skip if disabled
            return

        log_entry = self.format(record) + '\n'
        log_entry = self._mask_sensitive_data(log_entry)
        self._buffer.append(log_entry)
        current_size = sum(len(line) for line in self._buffer)

        # Maintain max size
        while current_size > self.max_file_size:
            self._buffer.pop(0)
            current_size = sum(len(line) for line in self._buffer)

        self._write_buffer_to_file()

    def _mask_sensitive_data(self, log_entry):
        """Mask sensitive data in the log entry."""
        log_entry = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
                           '[EMAIL_MASKED]', log_entry)
        log_entry = re.sub(r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
                           '[CARD_MASKED]', log_entry)
        log_entry = re.sub(r"('password':\s*['\"])(.+?)(['\"])",
                           r"\1*******\3", log_entry)
        return log_entry

    def enable_logging(self):
        self._enabled = True

    def disable_logging(self):
        self._enabled = False


def setup_logger(module='APILogger'):
    """Setup logger with CircularBufferHandler + console handler."""
    log_file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'log', 'api_transactions.log')
    logger = logging.getLogger(module)
    logger.setLevel(logging.INFO)

    # Prevent duplicate handlers if setup_logger() called multiple times
    if not logger.handlers:
        # Custom circular buffer file handler
        file_handler = CircularBufferHandler(log_file_path)
        formatter = logging.Formatter('%(asctime)s - %(message)s')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger


logger = setup_logger()

logger.info("Logging is enabled by default")

if config.log_console_print:
    # Enable file logging
    for h in logger.handlers:
        if isinstance(h, CircularBufferHandler):
            h.enable_logging()
    logger.info("Logging enabled again: this goes to console AND file")
else:
    # Disable file logging
    for h in logger.handlers:
        if isinstance(h, CircularBufferHandler):
            h.disable_logging()
    logger.info("This will only show in console, not in file")

# if __name__ == "__main__":
#     logger, file_handler = setup_logger()
#
#     logger.info("Logging is enabled by default")


