import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ui/theme-provider"

export function ThemeControlButton() {
  const { mode, setMode } = useTheme()

  const toggleTheme = () => {
    if (mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setMode("light")
    } else {
      setMode("dark")
    }
  }

  const isDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="relative w-10 h-10 flex items-center justify-center"
      title="Toggle theme"
    >
      <Sun
        className={`absolute h-5 w-5 transition-transform duration-300 ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-transform duration-300 ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

const themeColors = {
  orange: "var(--chart-3)",
  rose: "var(--chart-3)",
  green: "var(--chart-3)",
  blue: "var(--chart-3)",
  yellow: "var(--chart-3)",
  purple: "var(--chart-3)",
  neutral: "var(--chart-3)",
  colorful: "linear-gradient(45deg, var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-4), var(--chart-5), var(--chart-6))"
}

export function ThemeControlDropDown() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Select theme"
          className="flex items-center gap-2"
        >
          {/* Mixed or single theme icon */}
          <span
            className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
            style={{
              background: theme === "colorful" ? themeColors[theme] : undefined,
              backgroundColor: theme !== "colorful" ? themeColors[theme] : undefined
            }}
          />
{/*           <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span> */}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {Object.keys(themeColors).map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => setTheme(t)}
            className="flex items-center gap-2"
          >
            {/* Color circle for each dropdown item */}
            <span
              className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700 shrink-0"
              style={{
//                  background: t === "colorful" ? themeColors[t] : undefined,
//                  backgroundColor: t !== "colorful" ? themeColors[t] : undefined
              }}
            />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}