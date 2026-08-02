import { getAccessToken } from "@/lib/auth"
import { config } from "@/lib/config"
import type { ApiError, ApiResponse } from "@/types/api"

export class ApiRequestError extends Error {
  status: number
  code?: string | null
  errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    code?: string | null,
    errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.code = code
    this.errors = errors
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  auth?: boolean
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options
  const requestHeaders = new Headers(headers)

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = await getAccessToken()
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload = await parseJson<ApiResponse<T> | ApiError>(response)

  if (!response.ok || ("success" in payload && payload.success === false)) {
    const error = payload as ApiError
    const message =
      error.detail ??
      error.message ??
      error.error ??
      "The request could not be completed."
    throw new ApiRequestError(
      message,
      error.status ?? response.status,
      error.code,
      error.errors
    )
  }

  return (payload as ApiResponse<T>).data
}

export const meApi = {
  getProfile: () => apiRequest<import("@/types/api").MeProfile>("/api/me"),
  setInitialIntent: (initialIntent: "find_work" | "hire_staff") =>
    apiRequest<import("@/types/api").MeProfile>("/api/me/initial-intent", {
      method: "PUT",
      body: { initialIntent },
    }),
  getContexts: () =>
    apiRequest<import("@/types/api").UserContexts>("/api/me/contexts"),
  setActiveContext: (payload: import("@/types/api").SetActiveContextRequest) =>
    apiRequest<import("@/types/api").ActiveContext>("/api/me/active-context", {
      method: "PUT",
      body: payload,
    }),
  getInvitations: () =>
    apiRequest<import("@/types/api").CompanyInvitation[]>(
      "/api/me/invitations"
    ),
  acceptInvitation: (invitationId: number) =>
    apiRequest<unknown>(`/api/me/invitations/${invitationId}/accept`, {
      method: "POST",
    }),
}

export const accountApi = {
  register: (payload: import("@/types/api").RegisterRequest) =>
    apiRequest<import("@/types/api").RegistrationResult>(
      "/api/Account/register",
      {
        method: "POST",
        body: payload,
        auth: false,
      }
    ),
}

export const referenceApi = {
  getIndustryTypes: () =>
    apiRequest<import("@/types/api").IndustryType[]>("/api/industrytypes"),
  getEmployeeRanges: () =>
    apiRequest<import("@/types/api").EmployeeRange[]>("/api/employeeranges"),
  getCountries: () =>
    apiRequest<import("@/types/api").Country[]>("/api/countries", {
      auth: false,
    }),
  getStatesByCountry: (countryId: number) =>
    apiRequest<import("@/types/api").State[]>(
      `/api/states/by-country/${countryId}`,
      { auth: false }
    ),
  getCitiesByState: (stateId: number) =>
    apiRequest<import("@/types/api").City[]>(`/api/cities/by-state/${stateId}`),
  getCategories: () =>
    apiRequest<import("@/types/api").Category[]>("/api/categories"),
  getSkills: () => apiRequest<import("@/types/api").Skill[]>("/api/skills"),
  getLanguages: () =>
    apiRequest<import("@/types/api").Language[]>("/api/languages"),
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "The request could not be completed."
): string {
  return error instanceof ApiRequestError ? error.message : fallback
}

export const companiesApi = {
  create: (payload: import("@/types/api").CreateCompanyRequest) =>
    apiRequest<import("@/types/api").Company>("/api/companies", {
      method: "POST",
      body: payload,
    }),
}

export const locationsApi = {
  list: (companyId: number) =>
    apiRequest<import("@/types/api").CompanyLocation[]>(
      `/api/companylocations/by-company/${companyId}`
    ),
  getManagerOptions: () =>
    apiRequest<import("@/types/api").CompanyLocationManagerOption[]>(
      "/api/companylocations/manager-options"
    ),
  get: (id: number) =>
    apiRequest<import("@/types/api").CompanyLocation>(
      `/api/companylocations/${id}`
    ),
  create: (payload: import("@/types/api").CreateCompanyLocationRequest) =>
    apiRequest<import("@/types/api").CompanyLocation>("/api/companylocations", {
      method: "POST",
      body: payload,
    }),
}

export const jobProfilesApi = {
  list: (companyId: number, query?: import("@/types/api").JobProfileListQuery) => {
    const params = new URLSearchParams()
    if (query?.search?.trim()) params.set("search", query.search.trim())
    if (query?.categoryId) params.set("categoryId", String(query.categoryId))
    if (query?.applicationReview) {
      params.set("applicationReview", String(query.applicationReview))
    }
    if (query?.hasRequirements !== undefined) {
      params.set("hasRequirements", String(query.hasRequirements))
    }
    if (query?.sortBy) params.set("sortBy", query.sortBy)
    if (query?.sortDirection) params.set("sortDirection", query.sortDirection)
    const qs = params.toString()
    return apiRequest<import("@/types/api").CompanyRoleProfile[]>(
      `/api/companyroleprofiles/by-company/${companyId}${qs ? `?${qs}` : ""}`
    )
  },
  get: (id: number) =>
    apiRequest<import("@/types/api").CompanyRoleProfile>(
      `/api/companyroleprofiles/${id}`
    ),
  getApplicationReviewOptions: () =>
    apiRequest<import("@/types/api").ApplicationReviewOption[]>(
      "/api/companyroleprofiles/application-review-options"
    ),
  create: (payload: import("@/types/api").CreateCompanyRoleProfileRequest) =>
    apiRequest<import("@/types/api").CompanyRoleProfile>(
      "/api/companyroleprofiles",
      { method: "POST", body: payload }
    ),
  remove: (id: number) =>
    apiRequest<void>(`/api/companyroleprofiles/${id}`, { method: "DELETE" }),
}

export const teamApi = {
  getMemberships: () =>
    apiRequest<import("@/types/api").CompanyMembershipDetails[]>(
      "/api/companies/current/memberships"
    ),
  getInvitations: () =>
    apiRequest<import("@/types/api").CompanyInvitation[]>(
      "/api/companies/current/invitations"
    ),
  invite: (email: string) =>
    apiRequest<import("@/types/api").CompanyInvitationDelivery>(
      "/api/companies/current/invitations",
      { method: "POST", body: { email } }
    ),
  resendInvitation: (invitationId: number) =>
    apiRequest<import("@/types/api").CompanyInvitationDelivery>(
      `/api/companies/current/invitations/${invitationId}/resend`,
      { method: "POST" }
    ),
  revokeInvitation: (invitationId: number) =>
    apiRequest<void>(`/api/companies/current/invitations/${invitationId}`, {
      method: "DELETE",
    }),
}

export const shiftsApi = {
  list: (query?: import("@/types/api").ShiftListQuery) => {
    const params = new URLSearchParams()
    if (query?.search?.trim()) params.set("search", query.search.trim())
    if (query?.status) params.set("status", String(query.status))
    if (query?.locationId) params.set("locationId", String(query.locationId))
    if (query?.jobProfileId) {
      params.set("jobProfileId", String(query.jobProfileId))
    }
    if (query?.assignmentType) {
      params.set("assignmentType", String(query.assignmentType))
    }
    if (query?.hasUpcoming !== undefined) {
      params.set("hasUpcoming", String(query.hasUpcoming))
    }
    if (query?.sortBy) params.set("sortBy", query.sortBy)
    if (query?.sortDirection) params.set("sortDirection", query.sortDirection)
    const qs = params.toString()
    return apiRequest<import("@/types/api").CompanyShift[]>(
      `/api/shifts${qs ? `?${qs}` : ""}`
    )
  },
  createDraft: (jobProfileId: number) =>
    apiRequest<import("@/types/api").CompanyShift>("/api/shifts/drafts", {
      method: "POST",
      body: { jobProfileId },
    }),
  saveDetails: (
    shiftId: number,
    payload: import("@/types/api").ShiftDetailsRequest
  ) =>
    apiRequest<import("@/types/api").CompanyShift>(
      `/api/shifts/${shiftId}/details`,
      { method: "PUT", body: payload }
    ),
  saveHiringPreferences: (
    shiftId: number,
    payload: import("@/types/api").ShiftHiringPreferencesRequest
  ) =>
    apiRequest<import("@/types/api").CompanyShift>(
      `/api/shifts/${shiftId}/hiring-preferences`,
      { method: "PUT", body: payload }
    ),
  saveBroadcast: (shiftId: number) =>
    apiRequest<import("@/types/api").CompanyShift>(
      `/api/shifts/${shiftId}/broadcast`,
      {
        method: "PUT",
        body: {
          expansionMinutes: 30,
          groups: [5],
          selectedProfessionalIds: [],
        },
      }
    ),
  get: (shiftId: number) =>
    apiRequest<import("@/types/api").CompanyShift>(`/api/shifts/${shiftId}`),
  cancel: (shiftId: number, reason: string) =>
    apiRequest<void>(`/api/shifts/${shiftId}/cancel`, {
      method: "POST",
      body: { reason },
    }),
  listApplications: (shiftId: number) =>
    apiRequest<import("@/types/api").ShiftApplication[]>(
      `/api/shifts/${shiftId}/applications`
    ),
  publish: (shiftId: number) =>
    apiRequest<import("@/types/api").ShiftPublishResponse>(
      `/api/shifts/${shiftId}/publish`,
      {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
      }
    ),
}

export const dashboardApi = {
  getCompanyOverview: () =>
    apiRequest<import("@/types/api").CompanyDashboardOverview>(
      "/api/dashboard/company"
    ),
}

type PlatformListQuery = {
  search?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

function platformQueryString(query?: PlatformListQuery & { status?: string }) {
  const params = new URLSearchParams()
  if (query?.search?.trim()) params.set("search", query.search.trim())
  if (query?.isActive !== undefined) params.set("isActive", String(query.isActive))
  if (query?.status) params.set("status", query.status)
  if (query?.page) params.set("page", String(query.page))
  if (query?.pageSize) params.set("pageSize", String(query.pageSize))
  const value = params.toString()
  return value ? `?${value}` : ""
}

export const platformApi = {
  getOverview: () =>
    apiRequest<import("@/types/api").PlatformOverview>("/api/platform/overview"),
  getAnalytics: () =>
    apiRequest<import("@/types/api").PlatformAnalytics>("/api/platform/analytics"),
  getCompanies: (query?: PlatformListQuery) =>
    apiRequest<import("@/types/api").PlatformPagedResult<import("@/types/api").PlatformCompany>>(
      `/api/platform/companies${platformQueryString(query)}`
    ),
  setCompanyStatus: (id: number, isActive: boolean) =>
    apiRequest<void>(`/api/platform/companies/${id}/status`, { method: "PATCH", body: { isActive } }),
  getUsers: (query?: PlatformListQuery) =>
    apiRequest<import("@/types/api").PlatformPagedResult<import("@/types/api").PlatformUser>>(
      `/api/platform/users${platformQueryString(query)}`
    ),
  setUserStatus: (id: number, isActive: boolean) =>
    apiRequest<void>(`/api/platform/users/${id}/status`, { method: "PATCH", body: { isActive } }),
  getShifts: (query?: PlatformListQuery & { status?: string }) =>
    apiRequest<import("@/types/api").PlatformPagedResult<import("@/types/api").PlatformShift>>(
      `/api/platform/shifts${platformQueryString(query)}`
    ),
  getReferenceData: (kind: string, query?: PlatformListQuery) =>
    apiRequest<import("@/types/api").PlatformPagedResult<import("@/types/api").PlatformReferenceData>>(
      `/api/platform/reference-data/${kind}${platformQueryString(query)}`
    ),
  setReferenceDataStatus: (kind: string, id: number, isActive: boolean) =>
    apiRequest<void>(`/api/platform/reference-data/${kind}/${id}/status`, { method: "PATCH", body: { isActive } }),
  createReferenceData: (kind: string, body: import("@/types/api").UpsertPlatformReferenceDataRequest) =>
    apiRequest<import("@/types/api").PlatformReferenceData>(`/api/platform/reference-data/${kind}`, { method: "POST", body }),
  updateReferenceData: (kind: string, id: number, body: import("@/types/api").UpsertPlatformReferenceDataRequest) =>
    apiRequest<import("@/types/api").PlatformReferenceData>(`/api/platform/reference-data/${kind}/${id}`, { method: "PUT", body }),
  deleteReferenceData: (kind: string, id: number) =>
    apiRequest<void>(`/api/platform/reference-data/${kind}/${id}`, { method: "DELETE" }),
}

const accessControlRequest = {
  permissions: (scope: "company" | "platform") =>
    apiRequest<import("@/types/api").PermissionDefinition[]>(
      `/api/access-control/${scope}/permissions`
    ),
  roles: (scope: "company" | "platform") =>
    apiRequest<import("@/types/api").AccessRole[]>(
      `/api/access-control/${scope}/roles`
    ),
  createRole: (scope: "company" | "platform", body: import("@/types/api").UpsertAccessRoleRequest) =>
    apiRequest<import("@/types/api").AccessRole>(`/api/access-control/${scope}/roles`, { method: "POST", body }),
  updateRole: (scope: "company" | "platform", id: number, body: import("@/types/api").UpsertAccessRoleRequest) =>
    apiRequest<import("@/types/api").AccessRole>(`/api/access-control/${scope}/roles/${id}`, { method: "PUT", body }),
  setRoleStatus: (scope: "company" | "platform", id: number, isActive: boolean) =>
    apiRequest<void>(`/api/access-control/${scope}/roles/${id}/status`, { method: "PATCH", body: { isActive } }),
  assignments: (scope: "company" | "platform") =>
    apiRequest<import("@/types/api").AccessRoleAssignment[]>(
      `/api/access-control/${scope}/assignments`
    ),
  setAssignment: (scope: "company" | "platform", subjectId: number, accessRoleId: number | null) =>
    apiRequest<void>(`/api/access-control/${scope}/assignments/${subjectId}`, {
      method: "PUT",
      body: { accessRoleId },
    }),
}

export const accessControlApi = accessControlRequest

export function getPostAuthPath(
  profile: import("@/types/api").MeProfile
): string {
  if (profile.isPlatformAdmin) {
    return "/platform"
  }
  if (profile.nextAction === "select_initial_intent") {
    return "/onboarding"
  }

  return "/onboarding/contexts"
}
