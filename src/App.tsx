import { AssistantPage } from "@/pages/assistant"
import { Toaster } from "@/components/ui/sonner"
import { RequireAuth } from "@/components/require-auth"
import { RequirePlatformAdmin } from "@/components/require-platform-admin"
import { PlatformRouteBoundary } from "@/components/platform-route-boundary"
import { AppLayout } from "@/layouts/app-layout"
import { PlatformLayout } from "@/layouts/platform-layout"
import { AuthLayout } from "@/layouts/auth-layout"
import { useLocation } from "@/lib/router"
import { AuthCallbackPage } from "@/pages/auth-callback"
import { DashboardPage } from "@/pages/dashboard"
import { CreateJobProfilePage } from "@/pages/create-job-profile"
import { JobProfileDetailPage } from "@/pages/job-profile-detail"
import { JobProfilesPage } from "@/pages/job-profiles"
import { LoginPage } from "@/pages/login"
import { LocationDetailPage } from "@/pages/location-detail"
import { LocationsPage } from "@/pages/locations"
import { NotFoundPage } from "@/pages/not-found"
import { ChoosePathPage } from "@/pages/onboarding/choose-path"
import { CreateCompanyPage } from "@/pages/onboarding/create-company"
import { SelectContextPage } from "@/pages/onboarding/select-context"
import { RegisterPage } from "@/pages/register"
import { SettingsPage } from "@/pages/settings"
import { CreateShiftPage } from "@/pages/create-shift"
import { ShiftDetailPage } from "@/pages/shift-detail"
import { ShiftsPage } from "@/pages/shifts"
import { TeamPage } from "@/pages/team"
import { WelcomePage } from "@/pages/welcome"
import { PlatformOverviewPage } from "@/pages/platform-overview"
import { PlatformTablePage } from "@/pages/platform-table-page"
import { RolesPermissionsPage } from "@/pages/roles-permissions"

const platformReferenceKinds = ["industries", "industry-types", "categories", "skills", "languages", "age-ranges", "genders", "employee-ranges", "week-days", "credentials"] as const
type PlatformReferenceKind = (typeof platformReferenceKinds)[number]

export default function App() {
  const { pathname } = useLocation()
  const shiftDetailMatch = pathname.match(/^\/shifts\/(\d+)$/)
  const jobProfileDetailMatch = pathname.match(/^\/job-profiles\/(\d+)$/)
  const locationDetailMatch = pathname.match(/^\/locations\/(\d+)$/)
  const platformReferenceMatch = pathname.match(/^\/platform\/reference-data\/([a-z-]+)$/)
  const platformReferenceKind = platformReferenceMatch && platformReferenceKinds.includes(platformReferenceMatch[1] as PlatformReferenceKind)
    ? platformReferenceMatch[1] as PlatformReferenceKind
    : null

  let page: React.ReactNode

  if (shiftDetailMatch) {
    page = (
      <RequireAuth>
        <AppLayout>
          <ShiftDetailPage shiftId={Number(shiftDetailMatch[1])} />
        </AppLayout>
      </RequireAuth>
    )
  } else if (jobProfileDetailMatch) {
    page = (
      <RequireAuth>
        <AppLayout>
          <JobProfileDetailPage profileId={Number(jobProfileDetailMatch[1])} />
        </AppLayout>
      </RequireAuth>
    )
  } else if (locationDetailMatch) {
    page = (
      <RequireAuth>
        <AppLayout>
          <LocationDetailPage locationId={Number(locationDetailMatch[1])} />
        </AppLayout>
      </RequireAuth>
    )
  } else if (platformReferenceKind) {
    page = (
      <RequirePlatformAdmin>
        <PlatformLayout><PlatformRouteBoundary><PlatformTablePage kind="reference-data" referenceKind={platformReferenceKind} /></PlatformRouteBoundary></PlatformLayout>
      </RequirePlatformAdmin>
    )
  } else {
    switch (pathname) {
      case "/":
        page = <WelcomePage />
        break
      case "/assistant":
        page = <RequireAuth><AppLayout><AssistantPage /></AppLayout></RequireAuth>
        break
      case "/dashboard":
        page = (
          <RequireAuth>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/platform":
        page = (
          <RequirePlatformAdmin>
            <PlatformLayout><PlatformRouteBoundary><PlatformOverviewPage /></PlatformRouteBoundary></PlatformLayout>
          </RequirePlatformAdmin>
        )
        break
      case "/platform/companies":
        page = (
          <RequirePlatformAdmin>
            <PlatformLayout><PlatformRouteBoundary><PlatformTablePage kind="companies" /></PlatformRouteBoundary></PlatformLayout>
          </RequirePlatformAdmin>
        )
        break
      case "/platform/users":
        page = (
          <RequirePlatformAdmin>
            <PlatformLayout><PlatformRouteBoundary><PlatformTablePage kind="users" /></PlatformRouteBoundary></PlatformLayout>
          </RequirePlatformAdmin>
        )
        break
      case "/platform/shifts":
        page = (
          <RequirePlatformAdmin>
            <PlatformLayout><PlatformRouteBoundary><PlatformTablePage kind="shifts" /></PlatformRouteBoundary></PlatformLayout>
          </RequirePlatformAdmin>
        )
        break
      case "/platform/roles":
        page = (
          <RequirePlatformAdmin>
            <PlatformLayout><PlatformRouteBoundary><RolesPermissionsPage scope="platform" /></PlatformRouteBoundary></PlatformLayout>
          </RequirePlatformAdmin>
        )
        break
      case "/platform/reference-data":
        page = (
          <RequirePlatformAdmin>
            <PlatformLayout><PlatformRouteBoundary><PlatformTablePage kind="reference-data" /></PlatformRouteBoundary></PlatformLayout>
          </RequirePlatformAdmin>
        )
        break
      case "/locations":
        page = (
          <RequireAuth>
            <AppLayout>
              <LocationsPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/job-profiles/new":
        page = (
          <RequireAuth>
            <AppLayout>
              <CreateJobProfilePage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/job-profiles":
        page = (
          <RequireAuth>
            <AppLayout>
              <JobProfilesPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/team":
        page = (
          <RequireAuth>
            <AppLayout>
              <TeamPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/roles":
        page = (
          <RequireAuth>
            <AppLayout>
              <RolesPermissionsPage scope="company" />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/shifts/new":
        page = (
          <RequireAuth>
            <AppLayout>
              <CreateShiftPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/shifts":
        page = (
          <RequireAuth>
            <AppLayout>
              <ShiftsPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/settings":
        page = (
          <RequireAuth>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </RequireAuth>
        )
        break
      case "/login":
        page = (
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        )
        break
      case "/register":
        page = (
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        )
        break
      case "/auth/callback":
        page = <AuthCallbackPage />
        break
      case "/onboarding":
        page = <ChoosePathPage />
        break
      case "/onboarding/contexts":
        page = <SelectContextPage />
        break
      case "/onboarding/company":
        page = <CreateCompanyPage />
        break
      default:
        page = <NotFoundPage />
    }
  }

  return (
    <>
      {page}
      <Toaster richColors position="bottom-right" />
    </>
  )
}
