import * as React from "react"
import {
  BadgeCheckIcon,
  CircleAlertIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  UsersRoundIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { accessControlApi, getApiErrorMessage } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { AccessRole, AccessRoleAssignment, PermissionDefinition, UpsertAccessRoleRequest } from "@/types/api"

type Scope = "company" | "platform"

const scopeCopy: Record<Scope, { eyebrow: string; title: string; description: string; memberNoun: string }> = {
  company: {
    eyebrow: "Workspace security",
    title: "Roles & permissions",
    description: "Create focused access roles, choose what each role can do, and assign them to your team without changing their ownership safeguards.",
    memberNoun: "team member",
  },
  platform: {
    eyebrow: "Platform governance",
    title: "Platform roles & permissions",
    description: "Delegate global operational responsibilities with explicit permissions while keeping PlatformAdmin identity access under your control.",
    memberNoun: "platform administrator",
  },
}

function groupedPermissions(permissions: PermissionDefinition[]) {
  return permissions.reduce<Record<string, PermissionDefinition[]>>((groups, permission) => {
    ;(groups[permission.group] ??= []).push(permission)
    return groups
  }, {})
}

function HeroMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex min-w-[8.5rem] flex-col gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-orange/90 text-white">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="font-heading text-2xl font-semibold tabular-nums leading-none text-white">
          {value}
        </p>
        <p className="mt-1 text-[0.6875rem] font-medium tracking-wide text-white/70 uppercase">
          {label}
        </p>
      </div>
    </div>
  )
}

function RoleRow({
  role,
  permissions,
  onEdit,
  onToggleStatus,
}: {
  role: AccessRole
  permissions: PermissionDefinition[]
  onEdit: (role: AccessRole) => void
  onToggleStatus: (role: AccessRole) => void
}) {
  const permissionLabels = role.permissionCodes.map(
    (code) => permissions.find((item) => item.code === code)?.name ?? code
  )

  return (
    <Card
      size="sm"
      className={cn(
        "overflow-hidden transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_10px_32px_color-mix(in_oklab,var(--brand-navy)_12%,transparent)]",
        !role.isActive && "opacity-75"
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5 md:p-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white ring-1 ring-brand-navy/20">
            <ShieldCheckIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{role.name}</CardTitle>
              <Badge variant={role.isActive ? "secondary" : "outline"}>
                {role.isActive ? "Active" : "Inactive"}
              </Badge>
              {role.isSystem && (
                <Badge variant="outline" className="text-[0.625rem]">
                  System
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 line-clamp-2">
              {role.description || "No purpose provided."}
            </CardDescription>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {permissionLabels.length ? (
                <>
                  {permissionLabels.slice(0, 4).map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="max-w-[12rem] truncate text-[0.625rem]"
                    >
                      {label}
                    </Badge>
                  ))}
                  {permissionLabels.length > 4 && (
                    <Badge variant="outline" className="text-[0.625rem]">
                      +{permissionLabels.length - 4} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No permissions selected
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          <div className="rounded-lg bg-brand-blend-soft/70 px-3 py-2 text-sm ring-1 ring-brand-navy/10">
            <p className="text-[0.625rem] font-medium tracking-wide text-muted-foreground uppercase">
              Assigned
            </p>
            <p className="font-heading text-xl font-semibold tabular-nums text-brand-navy">
              {role.assignmentCount}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(role)}>
              <PencilIcon data-icon="inline-start" />
              Edit
            </Button>
            <Button
              size="sm"
              variant={role.isActive ? "outline" : "secondary"}
              disabled={role.isSystem}
              onClick={() => onToggleStatus(role)}
            >
              {role.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RoleEditor({
  scope,
  open,
  onOpenChange,
  role,
  permissions,
  onSaved,
}: {
  scope: Scope
  open: boolean
  onOpenChange: (value: boolean) => void
  role: AccessRole | null
  permissions: PermissionDefinition[]
  onSaved: () => Promise<void>
}) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selected, setSelected] = React.useState<string[]>([])
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    setName(role?.name ?? "")
    setDescription(role?.description ?? "")
    setSelected(role?.permissionCodes ?? [])
    setError(null)
  }, [open, role])

  function togglePermission(code: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...new Set([...current, code])] : current.filter((item) => item !== code)
    )
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const payload: UpsertAccessRoleRequest = {
      name: name.trim(),
      description: description.trim() || null,
      permissionCodes: selected,
      isActive: role?.isActive ?? true,
    }
    try {
      if (role) await accessControlApi.updateRole(scope, role.id, payload)
      else await accessControlApi.createRole(scope, payload)
      toast.success(role ? "Role updated" : "Role created", {
        description: `${payload.name} now has ${selected.length} permission${selected.length === 1 ? "" : "s"}.`,
      })
      onOpenChange(false)
      await onSaved()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "The role could not be saved."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? `Edit ${role.name}` : `Create ${scope === "platform" ? "platform " : ""}role`}</DialogTitle>
          <DialogDescription>
            Select only the responsibilities this role needs. You can change or deactivate it later without losing its assignment history.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <DialogBody>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="role-name">Role name</FieldLabel>
                  <Input id="role-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Shift coordinator" maxLength={100} required autoFocus />
                </Field>
                <Field>
                  <FieldLabel htmlFor="role-description">Purpose</FieldLabel>
                  <Input id="role-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A short explanation for the team" maxLength={500} />
                </Field>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheckIcon className="size-4" /></span>
                  <div><p className="font-medium">Permission set</p><p className="text-sm text-muted-foreground">{selected.length} selected. Permissions are deliberately scoped to this {scope === "company" ? "company" : "platform"}.</p></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(groupedPermissions(permissions)).map(([group, items]) => (
                    <section key={group} className="rounded-lg border border-border/70 bg-background p-3">
                      <h3 className="mb-2 text-sm font-semibold">{group}</h3>
                      <div className="flex flex-col gap-2">
                        {items.map((permission) => {
                          const checked = selected.includes(permission.code)
                          return <label key={permission.code} className="flex cursor-pointer items-start gap-2 rounded-md p-1.5 transition-colors hover:bg-muted/60"><Checkbox checked={checked} onCheckedChange={(value) => togglePermission(permission.code, value === true)} aria-label={permission.name} /><span className="flex flex-col gap-0.5"><span className="text-sm font-medium">{permission.name}</span><span className="text-xs leading-relaxed text-muted-foreground">{permission.description}</span></span></label>
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
              {error && <FieldDescription className="text-destructive">{error}</FieldDescription>}
            </FieldGroup>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !name.trim()}>{saving && <Spinner data-icon="inline-start" />}{role ? "Save role" : "Create role"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RolesPermissionsPage({ scope }: { scope: Scope }) {
  const copy = scopeCopy[scope]
  const [permissions, setPermissions] = React.useState<PermissionDefinition[]>([])
  const [roles, setRoles] = React.useState<AccessRole[]>([])
  const [assignments, setAssignments] = React.useState<AccessRoleAssignment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<AccessRole | null>(null)
  const [statusTarget, setStatusTarget] = React.useState<AccessRole | null>(null)
  const [busy, setBusy] = React.useState<number | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextPermissions, nextRoles, nextAssignments] = await Promise.all([
        accessControlApi.permissions(scope),
        accessControlApi.roles(scope),
        accessControlApi.assignments(scope),
      ])
      setPermissions(nextPermissions)
      setRoles(nextRoles)
      setAssignments(nextAssignments)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, `Could not load ${copy.title.toLowerCase()}.`))
    } finally {
      setLoading(false)
    }
  }, [copy.title, scope])

  React.useEffect(() => {
    void load()
  }, [load])

  async function changeAssignment(subjectId: number, roleId: string) {
    setBusy(subjectId)
    try {
      await accessControlApi.setAssignment(scope, subjectId, roleId === "none" ? null : Number(roleId))
      await load()
      toast.success("Access assignment updated")
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Could not update this assignment."))
    } finally {
      setBusy(null)
    }
  }

  async function changeStatus() {
    if (!statusTarget) return
    setBusy(statusTarget.id)
    try {
      await accessControlApi.setRoleStatus(scope, statusTarget.id, !statusTarget.isActive)
      toast.success(statusTarget.isActive ? "Role deactivated" : "Role activated")
      setStatusTarget(null)
      await load()
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Could not change this role's status."))
    } finally {
      setBusy(null)
    }
  }

  const activeRoles = roles.filter((role) => role.isActive)
  const grantedPermissions = new Set(activeRoles.flatMap((role) => role.permissionCodes)).size
  const assignedCount = assignments.filter((assignment) => assignment.accessRoleId).length
  const roleForAssignment = (assignment: AccessRoleAssignment) => assignment.accessRoleId ? String(assignment.accessRoleId) : "none"
  const [roleSearch, setRoleSearch] = React.useState("")

  const filteredRoles = React.useMemo(() => {
    const query = roleSearch.trim().toLowerCase()
    if (!query) return roles
    return roles.filter((role) => {
      const haystack = [role.name, role.description ?? ""]
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [roles, roleSearch])

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl bg-brand-navy px-5 py-6 text-white md:px-6 md:py-7">
        <div className="absolute -top-16 right-0 size-56 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <Badge className="w-fit border-white/20 bg-white/10 text-white hover:bg-white/10">
              {copy.eyebrow}
            </Badge>
            <div className="flex items-start gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/25">
                <ShieldCheckIcon className="size-6" />
              </span>
              <div>
                <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                  {copy.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">
                  {copy.description}
                </p>
              </div>
            </div>
            <Button
              className="w-fit bg-white text-brand-navy hover:bg-white/90"
              onClick={() => {
                setEditing(null)
                setEditorOpen(true)
              }}
            >
              <PlusIcon data-icon="inline-start" />
              Create role
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeroMetric
              label="Active roles"
              value={activeRoles.length}
              icon={ShieldCheckIcon}
            />
            <HeroMetric
              label="Permissions in use"
              value={grantedPermissions}
              icon={BadgeCheckIcon}
            />
            <HeroMetric
              label={`Assigned ${scope === "company" ? "members" : "admins"}`}
              value={assignedCount}
              icon={UsersRoundIcon}
            />
          </div>
        </div>
      </section>

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load access controls</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
          <section className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold">Role library</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reusable permission bundles. Deactivate to stop new assignments without
                  deleting history.
                </p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={roleSearch}
                  onChange={(event) => setRoleSearch(event.target.value)}
                  placeholder="Search roles..."
                  className="pl-9"
                />
              </div>
            </div>

            {roles.length ? (
              filteredRoles.length ? (
                <div className="flex flex-col gap-3">
                  {filteredRoles.map((role) => (
                    <RoleRow
                      key={role.id}
                      role={role}
                      permissions={permissions}
                      onEdit={(nextRole) => {
                        setEditing(nextRole)
                        setEditorOpen(true)
                      }}
                      onToggleStatus={setStatusTarget}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
                    <SearchIcon className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No roles match your search.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setRoleSearch("")}>
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-blend-soft ring-1 ring-foreground/8">
                    <ShieldCheckIcon className="size-5 text-brand-navy" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-semibold">
                      Build your first role
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start with the responsibilities you want to delegate.
                    </p>
                  </div>
                  <Button onClick={() => setEditorOpen(true)}>
                    <PlusIcon data-icon="inline-start" />
                    Create role
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <aside className="flex flex-col gap-4 xl:sticky xl:top-20">
            <div>
              <h3 className="font-heading text-lg font-semibold">People assignments</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Custom access layers on top of baseline{" "}
                {scope === "company" ? "Owner or Manager" : "PlatformAdmin"} identity.
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/70 pb-4">
                <CardTitle className="text-base">
                  {scope === "company" ? "Team members" : "Platform administrators"}
                </CardTitle>
                <CardDescription>
                  {assignedCount} of {assignments.length} with a custom role
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[32rem] overflow-y-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.length ? (
                      assignments.map((assignment) => (
                        <TableRow key={assignment.subjectId}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                {assignment.displayName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {assignment.email ?? "No email"}
                              </span>
                              <Badge variant="outline" className="mt-1 w-fit text-[0.625rem]">
                                {assignment.baselineRole ?? "—"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={roleForAssignment(assignment)}
                              disabled={busy === assignment.subjectId}
                              onValueChange={(value) =>
                                void changeAssignment(assignment.subjectId, value)
                              }
                            >
                              <SelectTrigger className="w-full min-w-[10rem]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No custom role</SelectItem>
                                {activeRoles.map((role) => (
                                  <SelectItem key={role.id} value={String(role.id)}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="py-10 text-center text-muted-foreground"
                        >
                          No {copy.memberNoun}s have a custom role assignment yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {scope === "platform" && (
              <div className="flex items-start gap-2 rounded-lg border border-brand-orange/25 bg-brand-orange-soft/40 p-3 text-sm text-muted-foreground">
                <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-brand-orange" />
                <span>
                  Only accounts that already carry the PlatformAdmin identity role can be
                  assigned a platform custom role. This preserves the platform entry
                  safeguard.
                </span>
              </div>
            )}
          </aside>
        </div>
      )}
      <RoleEditor scope={scope} open={editorOpen} onOpenChange={setEditorOpen} role={editing} permissions={permissions} onSaved={load} />
      <AlertDialog open={Boolean(statusTarget)} onOpenChange={(open) => !open && busy === null && setStatusTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{statusTarget?.isActive ? "Deactivate this role?" : "Activate this role?"}</AlertDialogTitle><AlertDialogDescription>{statusTarget?.isActive ? "People retain the historical assignment, but the role cannot be selected for new access until it is reactivated." : "The role will be available for assignment again."}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy !== null}>Cancel</AlertDialogCancel><AlertDialogAction disabled={busy !== null} onClick={(event) => { event.preventDefault(); void changeStatus() }}>{busy !== null && <Spinner data-icon="inline-start" />}{statusTarget?.isActive ? "Deactivate role" : "Activate role"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}
