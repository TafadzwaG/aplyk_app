/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type NavigateOptions = {
  replace?: boolean
}

type RouterContextValue = {
  pathname: string
  navigate: (to: string, options?: NavigateOptions) => void
}

const RouterContext = React.createContext<RouterContextValue | null>(null)

function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = React.useState(window.location.pathname)

  React.useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigate = React.useCallback(
    (to: string, options: NavigateOptions = {}) => {
      if (to === window.location.pathname) return

      window.history[options.replace ? "replaceState" : "pushState"]({}, "", to)
      setPathname(window.location.pathname)
      window.scrollTo({ top: 0 })
    },
    []
  )

  const value = React.useMemo(
    () => ({ pathname, navigate }),
    [navigate, pathname]
  )

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  )
}

function useRouter() {
  const context = React.useContext(RouterContext)
  if (!context) throw new Error("useRouter must be used inside RouterProvider")
  return context
}

function useLocation() {
  const { pathname } = useRouter()
  return { pathname }
}

function useNavigate() {
  const { navigate } = useRouter()
  return navigate
}

type LinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  to: string
}

function Link({ to, onClick, target, ...props }: LinkProps) {
  const navigate = useNavigate()

  return (
    <a
      href={to}
      target={target}
      onClick={(event) => {
        onClick?.(event)
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (target && target !== "_self")
        ) {
          return
        }

        event.preventDefault()
        navigate(to)
      }}
      {...props}
    />
  )
}

export { Link, RouterProvider, useLocation, useNavigate }
