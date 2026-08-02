import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { AuthProvider } from "@/contexts/auth-context.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RouterProvider } from "@/lib/router"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <RouterProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </RouterProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
