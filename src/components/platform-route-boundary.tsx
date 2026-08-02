import { Component, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type PlatformRouteBoundaryState = { hasError: boolean }

export class PlatformRouteBoundary extends Component<{ children: ReactNode }, PlatformRouteBoundaryState> {
  state: PlatformRouteBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PlatformRouteBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <Card><CardHeader><CardTitle>We could not render this platform view</CardTitle><CardDescription>The page data may be incomplete. Reload to try again.</CardDescription></CardHeader><CardContent><Button onClick={() => window.location.reload()}>Reload page</Button></CardContent></Card>
    }

    return this.props.children
  }
}
