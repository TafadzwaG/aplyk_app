import * as React from "react"
import { BookOpenCheckIcon, Building2Icon, CalendarDaysIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon, UsersRoundIcon } from "lucide-react"
import { toast } from "sonner"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage, platformApi } from "@/lib/api"
import type { PlatformCompany, PlatformPagedResult, PlatformReferenceData, PlatformShift, PlatformUser, UpsertPlatformReferenceDataRequest } from "@/types/api"

type PageKind = "companies" | "users" | "shifts" | "reference-data"
type Row = PlatformCompany | PlatformUser | PlatformShift | PlatformReferenceData
type StatusRow = (PlatformCompany | PlatformUser | PlatformReferenceData) & { label: string }

const referenceKinds = ["industries", "industry-types", "categories", "skills", "languages", "age-ranges", "genders", "employee-ranges", "week-days", "credentials"] as const
type PlatformReferenceKind = (typeof referenceKinds)[number]

const referenceLabels: Record<PlatformReferenceKind, string> = {
  industries: "Industries", "industry-types": "Industry types", categories: "Categories", skills: "Skills", languages: "Languages", "age-ranges": "Age ranges", genders: "Genders", "employee-ranges": "Employee ranges", "week-days": "Week days", credentials: "Credentials",
}

const configuration: Record<PageKind, { title: string; description: string; icon: typeof Building2Icon; searchPlaceholder: string }> = {
  companies: { title: "Companies", description: "Review every tenant, verification state, footprint, and availability.", icon: Building2Icon, searchPlaceholder: "Search name, code, or contact email" },
  users: { title: "Users", description: "Review users, their roles, active memberships, and account access.", icon: UsersRoundIcon, searchPlaceholder: "Search name or email" },
  shifts: { title: "Shifts", description: "A global view of work opportunities without switching company context.", icon: CalendarDaysIcon, searchPlaceholder: "Search company, job, or location" },
  "reference-data": { title: "Reference data", description: "Create and maintain the shared catalogues used throughout every company.", icon: BookOpenCheckIcon, searchPlaceholder: "Search reference records" },
}

const newReference = (): UpsertPlatformReferenceDataRequest => ({ name: "", code: "", description: "", parentId: null, minValue: null, maxValue: null, verificationRequired: false })
const hasStatus = (kind: PlatformReferenceKind) => kind !== "employee-ranges" && kind !== "week-days"
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—" }
function displayName(user: PlatformUser) { return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email || `User #${user.id}` }
function isMutable(row: Row): row is PlatformCompany | PlatformUser | PlatformReferenceData { return "isActive" in row }

export function PlatformTablePage({ kind, referenceKind }: { kind: PageKind; referenceKind?: PlatformReferenceKind }) {
  const meta = configuration[kind]
  const Icon = meta.icon
  const [search, setSearch] = React.useState("")
  const [active, setActive] = React.useState("all")
  const [catalogue, setCatalogue] = React.useState<PlatformReferenceKind>(referenceKind ?? "industries")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [result, setResult] = React.useState<PlatformPagedResult<Row> | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [target, setTarget] = React.useState<StatusRow | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<PlatformReferenceData | null>(null)
  const [editorTarget, setEditorTarget] = React.useState<PlatformReferenceData | null>(null)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const selectedReferenceKind = referenceKind ?? catalogue
  const pageTitle = kind === "reference-data" ? referenceLabels[selectedReferenceKind] : meta.title

  const load = React.useCallback(async () => {
    setLoading(true); setError(null)
    const query = { search, isActive: active === "all" ? undefined : active === "active", page, pageSize: 20 }
    try {
      if (kind === "companies") setResult(await platformApi.getCompanies(query))
      else if (kind === "users") setResult(await platformApi.getUsers(query))
      else if (kind === "shifts") setResult(await platformApi.getShifts({ ...query, status: status === "all" ? undefined : status }))
      else setResult(await platformApi.getReferenceData(selectedReferenceKind, { ...query, isActive: hasStatus(selectedReferenceKind) ? query.isActive : undefined }))
    } catch (requestError) { setError(getApiErrorMessage(requestError, `Could not load ${pageTitle.toLowerCase()}.`)); setResult(null) }
    finally { setLoading(false) }
  }, [active, kind, page, pageTitle, search, selectedReferenceKind, status])

  React.useEffect(() => { const timer = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(timer) }, [load])

  async function changeStatus() {
    if (!target || !isMutable(target)) return
    setSaving(true)
    try {
      const next = !target.isActive
      if (kind === "companies") await platformApi.setCompanyStatus(target.id, next)
      else if (kind === "users") await platformApi.setUserStatus(target.id, next)
      else await platformApi.setReferenceDataStatus(selectedReferenceKind, target.id, next)
      toast.success(`${target.label} ${next ? "activated" : "deactivated"}.`); setTarget(null); await load()
    } catch (requestError) { toast.error(getApiErrorMessage(requestError, "The status change could not be saved.")) }
    finally { setSaving(false) }
  }

  async function removeReference() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await platformApi.deleteReferenceData(selectedReferenceKind, deleteTarget.id)
      toast.success(`${deleteTarget.name} removed.`); setDeleteTarget(null); await load()
    } catch (requestError) { toast.error(getApiErrorMessage(requestError, "This record could not be removed.")) }
    finally { setSaving(false) }
  }

  const rows = Array.isArray(result?.items) ? result.items : []
  const clearFilters = () => { setSearch(""); setActive("all"); setStatus("all"); setPage(1) }
  return <div className="flex w-full flex-1 flex-col gap-6">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-primary">Platform administration</p><h2 className="font-heading text-2xl font-semibold tracking-tight">{pageTitle}</h2><p className="text-sm text-muted-foreground">{meta.description}</p></div><div className="flex items-center gap-2">{kind === "reference-data" && <Button onClick={() => { setEditorTarget(null); setEditorOpen(true) }}><PlusIcon data-icon="inline-start" />Add {pageTitle.slice(0, -1)}</Button>}<Badge variant="secondary">{result ? `${result.totalCount.toLocaleString()} records` : "Loading records"}</Badge></div></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon />Find and filter</CardTitle><CardDescription>Changes are scoped to the platform and remain auditable.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 md:flex-row md:items-center"><div className="relative min-w-0 flex-1"><SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value) }} placeholder={meta.searchPlaceholder} className="pl-9" /></div>{kind === "reference-data" && !referenceKind && <Select value={catalogue} onValueChange={(value) => { setPage(1); setCatalogue(value as PlatformReferenceKind); setActive("all") }}><SelectTrigger><SelectValue placeholder="Catalogue" /></SelectTrigger><SelectContent><SelectGroup>{referenceKinds.map((value) => <SelectItem key={value} value={value}>{referenceLabels[value]}</SelectItem>)}</SelectGroup></SelectContent></Select>}{kind === "shifts" && <Select value={status} onValueChange={(value) => { setPage(1); setStatus(value) }}><SelectTrigger><SelectValue placeholder="Shift status" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All statuses</SelectItem>{["Draft", "Published", "Filled", "Completed", "Cancelled", "Archived"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectGroup></SelectContent></Select>}{kind !== "shifts" && (kind !== "reference-data" || hasStatus(selectedReferenceKind)) && <Select value={active} onValueChange={(value) => { setPage(1); setActive(value) }}><SelectTrigger><SelectValue placeholder="Account state" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">All states</SelectItem><SelectItem value="active">Active only</SelectItem><SelectItem value="inactive">Inactive only</SelectItem></SelectGroup></SelectContent></Select>}</CardContent></Card>
    {error ? <StateCard title={`Could not load ${pageTitle.toLowerCase()}`} detail={error} onAction={() => void load()} action="Try again" /> : loading ? <LoadingCard title={pageTitle} /> : rows.length === 0 ? <Empty><EmptyHeader><EmptyMedia variant="icon"><Icon /></EmptyMedia><EmptyTitle>No matching records</EmptyTitle><EmptyDescription>Try another search or remove a filter.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={clearFilters}>Clear filters</Button></EmptyContent></Empty> : <Card><CardHeader><CardTitle>{kind === "reference-data" ? `${pageTitle} catalogue` : `All ${meta.title.toLowerCase()}`}</CardTitle><CardDescription>Page {result?.page} of {Math.max(result?.totalPages ?? 0, 1)}</CardDescription></CardHeader><CardContent>{kind === "companies" ? <CompanyTable rows={rows as PlatformCompany[]} onChange={setTarget} /> : kind === "users" ? <UserTable rows={rows as PlatformUser[]} onChange={setTarget} /> : kind === "shifts" ? <ShiftTable rows={rows as PlatformShift[]} /> : <ReferenceTable rows={rows as PlatformReferenceData[]} kind={selectedReferenceKind} onEdit={(row) => { setEditorTarget(row); setEditorOpen(true) }} onDelete={setDeleteTarget} onStatus={hasStatus(selectedReferenceKind) ? setTarget : undefined} />}</CardContent><div className="flex items-center justify-between px-4 pb-4"><span className="text-sm text-muted-foreground">Showing {rows.length} of {result?.totalCount}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= (result?.totalPages ?? 0)} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div></Card>}
    <AlertDialog open={Boolean(target)} onOpenChange={(open) => { if (!open && !saving) setTarget(null) }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{target?.isActive ? "Deactivate record?" : "Activate record?"}</AlertDialogTitle><AlertDialogDescription>{target?.isActive ? `This will make ${target.label} unavailable. The action is reversible.` : `This will make ${target?.label ?? "this record"} available again.`}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel><AlertDialogAction disabled={saving} onClick={(event) => { event.preventDefault(); void changeStatus() }}>{saving && <Spinner data-icon="inline-start" />}{target?.isActive ? "Deactivate" : "Activate"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open && !saving) setDeleteTarget(null) }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove {deleteTarget?.name}?</AlertDialogTitle><AlertDialogDescription>Used weekday and employee-range records are protected. Other catalogues are safely deactivated and can be restored.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel><AlertDialogAction disabled={saving} onClick={(event) => { event.preventDefault(); void removeReference() }}>{saving && <Spinner data-icon="inline-start" />}Remove</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    {editorOpen && <ReferenceEditor open={editorOpen} onOpenChange={setEditorOpen} kind={selectedReferenceKind} record={editorTarget} onSaved={() => void load()} />}
  </div>
}

function StateCard({ title, detail, action, onAction }: { title: string; detail: string; action: string; onAction: () => void }) { return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={onAction}>{action}</Button></CardContent></Card> }
function LoadingCard({ title }: { title: string }) { return <Card><CardHeader><CardTitle>Loading {title.toLowerCase()}</CardTitle><CardDescription>Gathering live platform data.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card> }
function ActiveBadge({ active }: { active: boolean }) { return <Badge variant={active ? "secondary" : "outline"}>{active ? "Active" : "Inactive"}</Badge> }
function StatusButton<T extends PlatformCompany | PlatformUser | PlatformReferenceData>({ row, label, onChange }: { row: T; label: string; onChange: (row: T & { label: string }) => void }) { return <Button size="sm" variant={row.isActive ? "outline" : "secondary"} onClick={() => onChange({ ...row, label })}>{row.isActive ? "Deactivate" : "Activate"}</Button> }
function CompanyTable({ rows, onChange }: { rows: PlatformCompany[]; onChange: (row: PlatformCompany & { label: string }) => void }) { return <Table><TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Verification</TableHead><TableHead>Footprint</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell><div className="flex flex-col"><span className="font-medium">{row.name}</span><span className="text-xs text-muted-foreground">{row.code} · {row.contactEmail}</span></div></TableCell><TableCell><Badge variant={row.emailConfirmed ? "secondary" : "outline"}>{row.verificationStatus}</Badge></TableCell><TableCell>{row.memberCount} members · {row.locationCount} locations · {row.shiftCount} shifts</TableCell><TableCell><ActiveBadge active={row.isActive} /></TableCell><TableCell className="text-right"><StatusButton row={row} label={row.name} onChange={onChange} /></TableCell></TableRow>)}</TableBody></Table> }
function UserTable({ rows, onChange }: { rows: PlatformUser[]; onChange: (row: PlatformUser & { label: string }) => void }) { return <Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Roles</TableHead><TableHead>Companies</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => { const roles = Array.isArray(row.roles) ? row.roles : []; return <TableRow key={row.id}><TableCell><div className="flex flex-col"><span className="font-medium">{displayName(row)}</span><span className="text-xs text-muted-foreground">{row.email ?? "No email"}</span></div></TableCell><TableCell><div className="flex flex-wrap gap-1">{roles.length ? roles.map((role) => <Badge key={role} variant="outline">{role}</Badge>) : <span className="text-muted-foreground">No role</span>}</div></TableCell><TableCell>{row.companyCount ?? 0}</TableCell><TableCell><ActiveBadge active={Boolean(row.isActive)} /></TableCell><TableCell className="text-right"><StatusButton row={row} label={displayName(row)} onChange={onChange} /></TableCell></TableRow> })}</TableBody></Table> }
function ShiftTable({ rows }: { rows: PlatformShift[] }) { return <Table><TableHeader><TableRow><TableHead>Shift</TableHead><TableHead>Company</TableHead><TableHead>Next occurrence</TableHead><TableHead>Coverage</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell><div className="flex flex-col"><span className="font-medium">{row.jobName}</span><span className="text-xs text-muted-foreground">{row.locationName}</span></div></TableCell><TableCell>{row.companyName}</TableCell><TableCell>{formatDate(row.nextStartsAtUtc)}</TableCell><TableCell>{row.booked}/{row.peopleNeeded} filled</TableCell><TableCell><Badge variant="outline">{row.status}</Badge></TableCell></TableRow>)}</TableBody></Table> }
function ReferenceTable({ rows, kind, onEdit, onDelete, onStatus }: { rows: PlatformReferenceData[]; kind: PlatformReferenceKind; onEdit: (row: PlatformReferenceData) => void; onDelete: (row: PlatformReferenceData) => void; onStatus?: (row: PlatformReferenceData & { label: string }) => void }) { return <Table><TableHeader><TableRow><TableHead>Reference record</TableHead><TableHead>Details</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell><div className="flex flex-col"><span className="font-medium">{row.name}</span><span className="text-xs text-muted-foreground">{row.description ?? (row.parentId ? `Industry #${row.parentId}` : row.code ?? "Platform record")}</span></div></TableCell><TableCell>{kind === "employee-ranges" ? `${row.minValue}–${row.maxValue} employees` : kind === "credentials" ? `${row.code ?? "No code"} · ${row.verificationRequired ? "Verification required" : "No verification"}` : row.code ?? "—"}</TableCell><TableCell>{hasStatus(kind) ? <ActiveBadge active={row.isActive} /> : <Badge variant="secondary">System list</Badge>}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => onEdit(row)}><PencilIcon data-icon="inline-start" />Edit</Button>{onStatus && <StatusButton row={row} label={row.name} onChange={onStatus} />}<Button size="sm" variant="outline" onClick={() => onDelete(row)}><Trash2Icon data-icon="inline-start" />Remove</Button></div></TableCell></TableRow>)}</TableBody></Table> }

function ReferenceEditor({ open, onOpenChange, kind, record, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; kind: PlatformReferenceKind; record: PlatformReferenceData | null; onSaved: () => void }) {
  const [form, setForm] = React.useState<UpsertPlatformReferenceDataRequest>(() => record ? { name: record.name, code: record.code ?? "", description: record.description ?? "", parentId: record.parentId, minValue: record.minValue, maxValue: record.maxValue, verificationRequired: Boolean(record.verificationRequired) } : newReference())
  const [industries, setIndustries] = React.useState<PlatformReferenceData[]>([])
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const requiresCode = kind === "languages" || kind === "credentials"
  const requiresParent = kind === "industry-types"
  const requiresRange = kind === "employee-ranges"
  const isCredential = kind === "credentials"
  React.useEffect(() => { if (!open || !requiresParent) return; void platformApi.getReferenceData("industries", { isActive: true, pageSize: 100 }).then((value) => setIndustries(value.items)).catch(() => setIndustries([])) }, [open, requiresParent])
  function update(values: Partial<UpsertPlatformReferenceDataRequest>) { setForm((current) => ({ ...current, ...values })) }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null)
    try {
      const payload = { ...form, name: form.name.trim(), code: form.code?.trim() || null, description: form.description?.trim() || null }
      if (record) await platformApi.updateReferenceData(kind, record.id, payload)
      else await platformApi.createReferenceData(kind, payload)
      toast.success(`${referenceLabels[kind].slice(0, -1)} ${record ? "updated" : "created"}.`); onOpenChange(false); onSaved()
    } catch (requestError) { setError(getApiErrorMessage(requestError, "The record could not be saved.")) }
    finally { setSaving(false) }
  }
  return <Dialog open={open} onOpenChange={(next) => { if (!saving) onOpenChange(next) }}><DialogContent><DialogHeader><DialogTitle>{record ? `Edit ${referenceLabels[kind].slice(0, -1)}` : `Add ${referenceLabels[kind].slice(0, -1)}`}</DialogTitle><DialogDescription>These records are shared by every company on the platform.</DialogDescription></DialogHeader><form onSubmit={submit}><DialogBody><FieldGroup><Field data-invalid={Boolean(error)}><FieldLabel htmlFor="reference-name">Name</FieldLabel><Input id="reference-name" value={form.name} onChange={(event) => update({ name: event.target.value })} required aria-invalid={Boolean(error)} autoFocus /></Field>{requiresCode && <Field><FieldLabel htmlFor="reference-code">Code</FieldLabel><Input id="reference-code" value={form.code ?? ""} onChange={(event) => update({ code: event.target.value })} required /><FieldDescription>Use a short stable identifier.</FieldDescription></Field>}{requiresParent && <Field><FieldLabel>Industry</FieldLabel><Select value={form.parentId ? String(form.parentId) : undefined} onValueChange={(value) => update({ parentId: Number(value) })}><SelectTrigger><SelectValue placeholder="Choose an industry" /></SelectTrigger><SelectContent><SelectGroup>{industries.map((industry) => <SelectItem key={industry.id} value={String(industry.id)}>{industry.name}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>}{requiresRange && <div className="grid grid-cols-2 gap-3"><Field><FieldLabel htmlFor="reference-min">Minimum employees</FieldLabel><Input id="reference-min" type="number" min="0" value={form.minValue ?? ""} onChange={(event) => update({ minValue: event.target.value === "" ? null : Number(event.target.value) })} required /></Field><Field><FieldLabel htmlFor="reference-max">Maximum employees</FieldLabel><Input id="reference-max" type="number" min="0" value={form.maxValue ?? ""} onChange={(event) => update({ maxValue: event.target.value === "" ? null : Number(event.target.value) })} required /></Field></div>}{["industries", "industry-types", "categories", "skills"].includes(kind) && <Field><FieldLabel htmlFor="reference-description">Description</FieldLabel><Input id="reference-description" value={form.description ?? ""} onChange={(event) => update({ description: event.target.value })} /></Field>}{isCredential && <Field orientation="horizontal"><Checkbox id="reference-verify" checked={Boolean(form.verificationRequired)} onCheckedChange={(checked) => update({ verificationRequired: checked === true })} /><FieldLabel htmlFor="reference-verify">Verification required by default</FieldLabel></Field>}{error && <FieldDescription className="text-destructive">{error}</FieldDescription>}</FieldGroup></DialogBody><DialogFooter><Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Spinner data-icon="inline-start" />}{record ? "Save changes" : "Create record"}</Button></DialogFooter></form></DialogContent></Dialog>
}
