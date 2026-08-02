export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string | null
  traceId?: string | null
}

export type ApiError = {
  success: false
  error: string
  status: number
  detail?: string | null
  code?: string | null
  traceId?: string | null
  errors?: Record<string, string[]>
  message?: string | null
}

export type MeProfile = {
  id: number
  firstName: string | null
  lastName: string | null
  email: string | null
  emailConfirmed: boolean
  phoneNumber: string | null
  profilePictureUrl: string | null
  initialIntent: string | null
  isPlatformAdmin: boolean
  activeCompanyId: number | null
  companyProfileCompleted: boolean
  nextAction:
    | "select_initial_intent"
    | "user_onboarding"
    | "company_home"
    | "platform_home"
    | string
}

export type PlatformPagedResult<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type PermissionDefinition = {
  code: string
  name: string
  description: string
  group: string
  scope: "company" | "platform" | string
}

export type AccessRole = {
  id: number
  scope: "company" | "platform" | string
  companyId: number | null
  name: string
  description: string | null
  isActive: boolean
  isSystem: boolean
  permissionCodes: string[]
  assignmentCount: number
  createdAt: string
}

export type UpsertAccessRoleRequest = {
  name: string
  description?: string | null
  permissionCodes: string[]
  isActive?: boolean
}

export type AccessRoleAssignment = {
  subjectId: number
  displayName: string
  email: string | null
  accessRoleId: number | null
  accessRoleName: string | null
  baselineRole: string | null
}

export type PlatformOverview = {
  generatedAtUtc: string
  metrics: {
    totalCompanies: number
    activeCompanies: number
    totalUsers: number
    activeUsers: number
    totalShifts: number
    publishedShifts: number
    pendingInvitations: number
  }
  attention: {
    unverifiedCompanies: number
    applicationsAwaitingReview: number
    shiftsNeedingCover: number
    pendingDocumentVerifications: number
  }
  upcomingShifts: PlatformUpcomingShift[]
}

export type PlatformAnalytics = {
  generatedAtUtc: string
  monthlyActivity: Array<{ month: string; companies: number; users: number; shifts: number }>
  shiftStatuses: Array<{ status: string; count: number }>
  upcomingCoverage: { required: number; filled: number; open: number; coveragePercent: number }
}

export type PlatformUpcomingShift = {
  shiftId: number
  occurrenceId: number
  companyName: string
  jobName: string
  locationName: string
  startsAtUtc: string
  endsAtUtc: string
  peopleNeeded: number
  booked: number
}

export type PlatformCompany = {
  id: number
  name: string
  code: string
  contactEmail: string
  isActive: boolean
  emailConfirmed: boolean
  verificationStatus: string
  memberCount: number
  locationCount: number
  shiftCount: number
  createdAt: string
}

export type PlatformUser = {
  id: number
  firstName: string | null
  lastName: string | null
  email: string | null
  isActive: boolean
  emailConfirmed: boolean
  roles: string[]
  companyCount: number
  createdAt: string | null
}

export type PlatformShift = {
  id: number
  companyName: string
  jobName: string
  locationName: string
  status: string
  peopleNeeded: number
  nextStartsAtUtc: string | null
  booked: number
}

export type PlatformReferenceData = {
  id: number
  name: string
  code: string | null
  isActive: boolean
  description: string | null
  parentId: number | null
  minValue: number | null
  maxValue: number | null
  verificationRequired: boolean | null
}

export type UpsertPlatformReferenceDataRequest = {
  name: string
  code?: string | null
  description?: string | null
  parentId?: number | null
  minValue?: number | null
  maxValue?: number | null
  verificationRequired?: boolean
}

export type SetInitialIntentRequest = {
  initialIntent: "find_work" | "hire_staff"
}

export type AvailableContext = {
  kind: "Professional" | "Company" | 1 | 2
  displayName: string
  professionalProfileId: number | null
  membershipId: number | null
  companyId: number | null
  role: string | null
}

export type SetActiveContextRequest = {
  kind: 1 | 2
  membershipId?: number | null
}

export type ActiveContext = {
  kind: "Professional" | "Company" | 1 | 2
  membershipId: number | null
  companyId: number | null
  role: string | null
}

export type UserContexts = {
  availableContexts: AvailableContext[]
  activeContext: ActiveContext | null
}

export type CompanyInvitation = {
  id: number
  companyId: number
  companyName: string
  email: string
  role: string | number
  status: string | number
  invitedByUserId: number
  invitedAt: string
  expiresAt: string
  respondedAt: string | null
  lastEmailSentAt: string | null
}

export type RegisterRequest = {
  email: string
  password: string
  phoneNumber: string | null
  firstName: string | null
  lastName: string | null
  twoFactorEnabled: boolean
}

export type RegistrationResult = {
  message: string
  canResendConfirmation: boolean
}

export type IndustryType = {
  id: number
  industryId: number
  typeName: string
  description?: string | null
  createdAt: string
}

export type EmployeeRange = {
  id: number
  rangeLabel: string
  minEmployees?: number | null
  maxEmployees?: number | null
}

export type Country = {
  id: number
  name: string
  code: string
}

export type State = {
  id: number
  name: string
  countryId: number
}

export type City = {
  id: number
  name: string
  stateId: number
}

export type CreateCompanyAddressInput = {
  countryId: number
  stateId: number
  cityId: number
  addressLine1: string
  addressLine2?: string | null
  postCode?: string | null
  zone?: string | null
  latitude?: number | null
  longitude?: number | null
  googlePlaceId?: string | null
  formattedAddress?: string | null
  streetNumber?: string | null
  route?: string | null
  cityName?: string | null
  district?: string | null
  stateName?: string | null
  countryName?: string | null
  countryCode?: string | null
}

export type CreateCompanyRequest = {
  companyName: string
  companyCode: string
  phoneNumber?: string | null
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  employeeRangeId: number
  termAndCondition: boolean
  industryIds: number[]
  address: CreateCompanyAddressInput
}

export type Company = {
  id: number
  companyName: string
  companyCode: string
  email?: string | null
  isProfileCompleted?: boolean
}

export type CompanyLocation = {
  id: number
  companyId: number
  locationName: string
  code: string
  managerId: number | null
  isActive: boolean
  addressLine1: string
  addressLine2: string | null
  countryId: number
  stateId: number | null
  cityId: number | null
  postCode: string | null
  zone: string | null
  comments: string | null
  formattedAddress: string | null
  cityName: string | null
  stateName: string | null
  countryName: string | null
  countryCode: string | null
  createdAt: string
  timeZoneId: string | null
  currencyCode: string | null
}

export type CompanyLocationManagerOption = {
  userId: number
  displayName: string
  email: string | null
  role: number
}

export type CreateCompanyLocationRequest = {
  companyId: number
  locationName: string
  code: string
  managerId: number | null
  isActive: boolean
  addressLine1: string
  addressLine2: string | null
  countryId: number
  stateId: number
  cityId: number
  postCode: string
  zone: string | null
  comments: string | null
  formattedAddress: string
  cityName: string | null
  stateName: string | null
  countryName: string | null
  countryCode: string | null
  timeZoneId: string
  currencyCode: string
}

export type Category = {
  id: number
  categoryName: string
  description: string | null
  isActive: boolean
}

export type Skill = {
  id: number
  skillName: string
  description: string | null
  isActive: boolean
}

export type Language = {
  id: number
  code: string
  name: string
  isActive: boolean
}

export type ApplicationReviewOption = {
  id: number
  name: string
}

export type JobProfileLanguageRequirement = {
  languageId: number
  minimumProficiency: number
}

export type JobProfileSkillRequirement = {
  skillId: number
  minimumExperienceMonths: number | null
}

export type JobProfileCredentialRequirement = {
  credentialId: number
  verificationRequired: boolean
}

export type CompanyRoleProfile = {
  id: number
  companyId: number
  jobName: string
  categoryId: number
  description: string
  hourlyRate: number
  clothingAndEquipment: string | null
  workInstructions: string | null
  workConditions: string | null
  applicationReview: number
  ageRangeId: number | null
  genderId: number | null
  securityClearance: boolean
  approvalRequired: boolean
  interviewRequired: boolean
  languageIds: number[]
  skillIds: number[]
  createdAt: string
  languageRequirements: JobProfileLanguageRequirement[] | null
  skillRequirements: JobProfileSkillRequirement[] | null
  credentialRequirements: JobProfileCredentialRequirement[] | null
}

export type JobProfileListQuery = {
  search?: string
  categoryId?: number
  applicationReview?: number
  hasRequirements?: boolean
  sortBy?: "name" | "rate" | "created" | "category"
  sortDirection?: "asc" | "desc"
}

export type CreateCompanyRoleProfileRequest = {
  companyId: number
  jobName: string
  categoryId: number
  description: string
  hourlyRate: number
  clothingAndEquipment: string | null
  workInstructions: string | null
  workConditions: string | null
  applicationReview: number
  ageRangeId: number | null
  genderId: number | null
  securityClearance: boolean
  approvalRequired: boolean
  interviewRequired: boolean
  languageIds: number[]
  skillIds: number[]
  languageRequirements: JobProfileLanguageRequirement[]
  skillRequirements: JobProfileSkillRequirement[]
  credentialRequirements: JobProfileCredentialRequirement[]
}

export type CompanyMembershipUser = {
  id: number
  firstName: string | null
  lastName: string | null
  email: string | null
  phoneNumber: string | null
  emailConfirmed: boolean
  phoneNumberConfirmed: boolean
  isActive: boolean
}

export type CompanyMembershipDetails = {
  id: number
  companyId: number
  userId: number
  role: number
  roleName: string
  status: number
  statusName: string
  createdAt: string
  modifiedAt: string | null
  user: CompanyMembershipUser | null
}

export type CompanyInvitationDelivery = {
  invitation: CompanyInvitation
  emailSent: boolean
}

export type ShiftSchedule = {
  pattern: number
  interval: number
  startsOn: string
  endsOn: string | null
  noEndDate: boolean
  startTime: string
  endTime: string
  isoDaysOfWeek: number[]
  materializedThrough: string | null
}

export type ShiftOccurrence = {
  id: number
  localDate: string
  startsAtUtc: string
  endsAtUtc: string
  status: number
  peopleNeeded: number
  booked: number
}

export type ShiftListQuery = {
  search?: string
  status?: number
  locationId?: number
  jobProfileId?: number
  assignmentType?: number
  hasUpcoming?: boolean
  sortBy?: "name" | "rate" | "created" | "status" | "location" | "schedule"
  sortDirection?: "asc" | "desc"
}

export type CompanyShift = {
  id: number
  status: number
  companyId: number
  jobProfileId: number
  locationId: number
  jobName: string
  description: string
  locationName: string
  locationAddress: string
  timeZoneId: string
  hourlyRate: number
  currencyCode: string
  peopleNeeded: number
  shiftInstructions: string | null
  acceptanceMethod: number
  keepWaitingList: boolean
  serviceFeePercentage: number
  schedule: ShiftSchedule | null
  requirements: Array<{
    type: string
    referenceId: number
    name: string
  }>
  occurrences: ShiftOccurrence[]
  publishedAtUtc: string | null
  rowVersion: string
}

export type ShiftDetailsRequest = {
  jobProfileId: number
  locationId: number
  assignmentType: number
  schedule: {
    pattern: number
    interval: number
    startsOn: string
    endsOn: string | null
    noEndDate: boolean
    startTime: string
    endTime: string
    isoDaysOfWeek: number[]
  }
  hourlyRate: number
  peopleNeeded: number
  shiftInstructions: string | null
}

export type ShiftHiringPreferencesRequest = {
  acceptanceMethod: number
  keepWaitingList: boolean
  skills: Array<{ skillId: number; minimumExperienceMonths: number | null }>
  languages: Array<{ languageId: number; minimumProficiency: number }>
  credentials: Array<{ credentialId: number; verificationRequired: boolean }>
}

export type ShiftPublishResponse = {
  shiftId: number
  status: number
  publishedAtUtc: string
  occurrencesCreated: number
  firstOutboxMessageId: number | null
}

export type ShiftApplication = {
  id: number
  shiftId: number
  candidateId: number
  status: number
  appliedAtUtc: string
  decisionAtUtc: string | null
  eligibilityJson: string
}

export type CompanyDashboardOverview = {
  generatedAtUtc: string
  metrics: {
    totalShifts: number
    activeShifts: number
    upcomingOccurrences: number
    attendancePercentage: number
  }
  setup: {
    companyDetailsComplete: boolean
    locationCount: number
    jobProfileCount: number
    teamMemberCount: number
    pendingInvitationCount: number
  }
  upcomingShifts: CompanyDashboardUpcomingShift[]
  attention: {
    applicantsAwaitingReview: number
    shiftsNeedingCover: number
    attendanceToConfirm: number
  }
}

export type CompanyDashboardUpcomingShift = {
  shiftId: number
  occurrenceId: number
  status: number
  jobName: string
  locationName: string
  timeZoneId: string
  hourlyRate: number
  currencyCode: string
  peopleNeeded: number
  booked: number
  applicantCount: number
  localDate: string
  startsAtUtc: string
  endsAtUtc: string
}
