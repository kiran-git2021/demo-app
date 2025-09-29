import logging
from keycloak import KeycloakOpenID, KeycloakAdmin
from conf import config as cfg


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("KeycloakClient")

#logger.info("{} {} {} {} {} ".format(cfg.keycloak_url,cfg.keycloak_password,cfg.keycloak_username,cfg.client_id,cfg.client_secret))

class KeycloakClient:
    def __init__(self):
        """Initialize and confirm OpenID + Admin Keycloak connections."""
        try:
            try:
                # OpenID client (user login / tokens)
                self.openid = KeycloakOpenID(
                    server_url=cfg.keycloak_url,
                    client_id=cfg.client_id,
                    realm_name=cfg.realm_name,
                    client_secret_key=cfg.client_secret,
                    verify=True
                )
                logger.info("Connecting to Keycloak URL : {}".format(str(cfg.keycloak_url)))
                # Confirm OpenID connection (fetch OpenID config)
                openid_config = self.openid.well_known()

                logger.info("✅ OpenID client confirmed. Issuer: %s", openid_config.get("issuer"))
            except Exception as e:
                logger.info("❌ OpenID client connection failed.")
            try:
                # Admin client (user & realm management)
                self.admin = KeycloakAdmin(
                    server_url=cfg.keycloak_url,
                    username=cfg.keycloak_username,
                    password=cfg.keycloak_password,
                    realm_name=cfg.realm_name,
                    client_id="admin-cli",   # safer default for admin
                    client_secret_key=cfg.admin_client_secret,
                    verify=True
                )
                logger.info("Connecting to Keycloak URL : {}".format(str(cfg.keycloak_url)))
                # Confirm Admin connection (fetch realms info)
                realms = self.admin.get_realms()
                logger.info("✅ Admin client confirmed. Found realms: %s",
                            [realm['realm'] for realm in realms])
            except Exception as e:
                logger.info("❌ Admin client connection failed.")

        except Exception as e:
            logger.error(f"❌ Failed to initialize Keycloak clients: {e}")
            raise

    def get_openid(self) -> KeycloakOpenID:
        """Return the Keycloak OpenID client."""
        return self.openid

    def get_admin(self) -> KeycloakAdmin:
        """Return the Keycloak Admin client."""
        return self.admin
