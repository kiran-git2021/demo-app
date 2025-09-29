import { createContext, useContext, useEffect, useState } from "react"

const initialState = {
  mode: "system",     // light / dark / system
  theme: "orange",   // neutral / stone / zinc / gray / slate
  setMode: () => null,
  setTheme: () => null
}

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultTheme = "orange",
  storageKeyMode = "vite-ui-mode",
  storageKeyTheme = "vite-ui-theme",
  ...props
}) {
  const [mode, setModeState] = useState(
    () => localStorage.getItem(storageKeyMode) || defaultMode
  )
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(storageKeyTheme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous mode classes
    root.classList.remove("light", "dark")

    // Remove previous theme classes
    root.classList.remove(

    "theme-gray",
    "theme-orange",
    "theme-rose",
    "theme-green",
    "theme-blue",
    "theme-yellow",
    "theme-purple",
    "theme-colorful",

    "theme-gray-dark",
    "theme-orange-dark",
    "theme-rose-dark",
    "theme-green-dark",
    "theme-blue-dark",
    "theme-yellow-dark",
    "theme-purple-dark",
    "theme-colorful-dark"


    )

    // Determine applied mode
    let appliedMode = mode
    if (mode === "system") {
      appliedMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }

    root.classList.add(appliedMode)
    if (appliedMode == "light") {
        root.classList.add(`theme-${theme}`)
        }
    else {
//         root.classList.add(`theme-${theme}`)
        root.classList.add(`theme-${theme}-dark`)
        }


  }, [mode, theme])

  const setMode = newMode => {
    localStorage.setItem(storageKeyMode, newMode)
    setModeState(newMode)
  }

  const setTheme = newTheme => {
    localStorage.setItem(storageKeyTheme, newTheme)
    setThemeState(newTheme)
  }

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{ mode, setMode, theme, setTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
