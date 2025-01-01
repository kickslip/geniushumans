declare module "next-themes" {
    import { ReactNode } from "react"
    
    export interface ThemeProviderProps {
      children: ReactNode
      attribute?: string
      defaultTheme?: string
      enableSystem?: boolean
      enableColorScheme?: boolean
      storageKey?: string
      themes?: string[]
      forcedTheme?: string
      disableTransitionOnChange?: boolean
    }
  
    export interface UseThemeProps {
      themes: string[]
      setTheme: (theme: string) => void
      theme?: string
      systemTheme?: string | null
      forcedTheme?: string
      resolvedTheme?: string
      isSystem?: boolean
    }
  
    export const ThemeProvider: (props: ThemeProviderProps) => JSX.Element
    export const useTheme: () => UseThemeProps
  }