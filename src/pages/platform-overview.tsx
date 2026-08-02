import * as React from "react"
import { ActivityIcon, Building2Icon, CalendarDaysIcon, ChartNoAxesCombinedIcon, ShieldAlertIcon, UsersRoundIcon } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage, platformApi } from "@/lib/api"
import { Link } from "@/lib/router"
import type { PlatformAnalytics, PlatformOverview, PlatformUpcomingShift } from "@/types/api"

const activityConfig = {
  companies: { label: "Companies", color: "var(--chart-1)" },
  users: { label: "Users", color: "var(--chart-2)" },
  shifts: { label: "Shifts", color: "var(--chart-3)" },
} satisfies ChartConfig

const statusConfig = { count: { label: "Shifts", color: "var(--chart-2)" } } satisfies ChartConfig
const coverageConfig = {
  filled: { label: "Filled", color: "var(--chart-2)" },
  open: { label: "Open", color: "var(--chart-4)" },
} satisfies ChartConfig

function formatDateTime(value: string) { return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) }
function MetricCard({ label, value, icon: Icon, hint }: { label: string; value: number | undefined; icon: typeof Building2Icon; hint: string }) {
  return <Card size="sm"><CardHeader><CardTitle className="flex items-center gap-2"><Icon />{label}</CardTitle><CardDescription>{hint}</CardDescription></CardHeader><CardContent>{value === undefined ? <Skeleton className="h-8 w-16" /> : <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">{value.toLocaleString()}</p>}</CardContent></Card>
}
function UpcomingShift({ shift }: { shift: PlatformUpcomingShift }) {
  const percent = shift.peopleNeeded ? Math.round((shift.booked / shift.peopleNeeded) * 100) : 0
  return <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-3"><CalendarDaysIcon className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{shift.jobName}</p><p className="truncate text-sm text-muted-foreground">{shift.companyName} · {shift.locationName}</p></div><div className="flex flex-col items-end gap-1"><Badge variant={percent >= 100 ? "secondary" : "outline"}>{shift.booked}/{shift.peopleNeeded} filled</Badge><span className="text-xs text-muted-foreground">{formatDateTime(shift.startsAtUtc)}</span></div></div>
}

function ActivityChart({ analytics }: { analytics: PlatformAnalytics | null }) {
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Platform momentum</CardTitle><CardDescription>New companies, users, and shifts over the last six months.</CardDescription></div><Badge variant="outline">6 months</Badge></div></CardHeader><CardContent>{analytics ? <ChartContainer config={activityConfig} className="h-72 w-full"><AreaChart accessibilityLayer data={analytics.monthlyActivity} margin={{ left: 8, right: 8 }}><defs><linearGradient id="companies-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="var(--color-companies)" stopOpacity={0.45} /><stop offset="95%" stopColor="var(--color-companies)" stopOpacity={0.03} /></linearGradient></defs><CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} /><ChartTooltip content={<ChartTooltipContent indicator="line" />} /><Area dataKey="companies" type="natural" fill="url(#companies-fill)" stroke="var(--color-companies)" strokeWidth={2} /><Area dataKey="users" type="natural" fill="none" stroke="var(--color-users)" strokeWidth={2} /><Area dataKey="shifts" type="natural" fill="none" stroke="var(--color-shifts)" strokeWidth={2} /></AreaChart></ChartContainer> : <Skeleton className="h-72 w-full" />}</CardContent></Card>
}

function StatusChart({ analytics }: { analytics: PlatformAnalytics | null }) {
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Shift state mix</CardTitle><CardDescription>Current status distribution across all companies.</CardDescription></div><ChartNoAxesCombinedIcon className="size-5 text-muted-foreground" /></div></CardHeader><CardContent>{analytics ? <ChartContainer config={statusConfig} className="h-72 w-full"><BarChart accessibilityLayer data={analytics.shiftStatuses} layout="vertical" margin={{ left: 8 }}><CartesianGrid horizontal={false} /><YAxis dataKey="status" type="category" tickLine={false} tickMargin={10} axisLine={false} width={72} /><XAxis type="number" allowDecimals={false} hide /><ChartTooltip content={<ChartTooltipContent hideLabel />} /><Bar dataKey="count" fill="var(--color-count)" radius={6} /></BarChart></ChartContainer> : <Skeleton className="h-72 w-full" />}</CardContent></Card>
}

function CoverageCard({ analytics }: { analytics: PlatformAnalytics | null }) {
  const coverage = analytics?.upcomingCoverage
  const data = coverage ? [{ name: "filled", value: coverage.filled, fill: "var(--color-filled)" }, { name: "open", value: coverage.open, fill: "var(--color-open)" }] : []
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Upcoming coverage</CardTitle><CardDescription>Scheduled capacity already staffed.</CardDescription></div><ActivityIcon className="size-5 text-muted-foreground" /></div></CardHeader><CardContent>{coverage ? <div className="flex flex-col gap-3"><ChartContainer config={coverageConfig} className="mx-auto h-48 w-full max-w-64"><PieChart><ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} /><Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={3} strokeWidth={0}>{data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}<Label content={({ viewBox }) => { if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null; return <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle"><tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-semibold">{coverage.coveragePercent}%</tspan><tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 22} className="fill-muted-foreground text-xs">covered</tspan></text> }} /></Pie></PieChart></ChartContainer><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border px-3 py-2"><p className="text-xs text-muted-foreground">Filled</p><p className="font-heading text-xl font-semibold tabular-nums">{coverage.filled}</p></div><div className="rounded-lg border px-3 py-2"><p className="text-xs text-muted-foreground">Open places</p><p className="font-heading text-xl font-semibold tabular-nums">{coverage.open}</p></div></div></div> : <Skeleton className="h-64 w-full" />}</CardContent></Card>
}

export function PlatformOverviewPage() {
  const [overview, setOverview] = React.useState<PlatformOverview | null>(null)
  const [analytics, setAnalytics] = React.useState<PlatformAnalytics | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const load = React.useCallback(async () => {
    setError(null)
    try { const [nextOverview, nextAnalytics] = await Promise.all([platformApi.getOverview(), platformApi.getAnalytics()]); setOverview(nextOverview); setAnalytics(nextAnalytics) } catch (requestError) { setError(getApiErrorMessage(requestError, "Could not load platform metrics.")) }
  }, [])
  React.useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer) }, [load])
  const metrics = overview?.metrics
  const attention = overview?.attention
  const coverage = analytics?.upcomingCoverage
  return <div className="flex w-full flex-1 flex-col gap-6">
    <section className="relative overflow-hidden rounded-xl border bg-card"><div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-end lg:justify-between"><div className="flex max-w-2xl flex-col gap-2"><div className="flex items-center gap-2"><Badge variant="secondary">Platform command centre</Badge><span className="text-xs text-muted-foreground">Live cross-tenant view</span></div><h2 className="font-heading text-3xl font-semibold tracking-tight">See the health of every business, at a glance.</h2><p className="text-sm text-muted-foreground">Track onboarding, workforce volume, shift readiness, and operational queues without choosing a company.</p></div><div className="flex flex-wrap gap-3"><div className="rounded-lg border bg-background px-4 py-3"><p className="text-xs text-muted-foreground">Coverage</p><p className="font-heading text-2xl font-semibold tabular-nums">{coverage ? `${coverage.coveragePercent}%` : "—"}</p></div><div className="rounded-lg border bg-background px-4 py-3"><p className="text-xs text-muted-foreground">Open places</p><p className="font-heading text-2xl font-semibold tabular-nums">{coverage?.open ?? "—"}</p></div></div></div></section>
    {error ? <Card><CardHeader><CardTitle>Platform data is unavailable</CardTitle><CardDescription>{error}</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={() => void load()}>Try again</Button></CardContent></Card> : <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Companies" value={metrics?.totalCompanies} icon={Building2Icon} hint={`${metrics?.activeCompanies ?? 0} active`} /><MetricCard label="Users" value={metrics?.totalUsers} icon={UsersRoundIcon} hint={`${metrics?.activeUsers ?? 0} active`} /><MetricCard label="Shifts" value={metrics?.totalShifts} icon={CalendarDaysIcon} hint={`${metrics?.publishedShifts ?? 0} published`} /><MetricCard label="Open invitations" value={metrics?.pendingInvitations} icon={ShieldAlertIcon} hint="Awaiting a response" /></section>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)]"><ActivityChart analytics={analytics} /><CoverageCard analytics={analytics} /></section>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]"><StatusChart analytics={analytics} /><Card><CardHeader><CardTitle>Attention queue</CardTitle><CardDescription>Items that deserve an operations review.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{[{ label: "Unverified companies", value: attention?.unverifiedCompanies, href: "/platform/companies" }, { label: "Applications awaiting review", value: attention?.applicationsAwaitingReview, href: "/platform/shifts" }, { label: "Shifts needing cover", value: attention?.shiftsNeedingCover, href: "/platform/shifts" }, { label: "Pending document checks", value: attention?.pendingDocumentVerifications, href: "/platform/users" }].map((item) => <Button key={item.label} variant="outline" className="h-auto justify-between px-3 py-3" asChild><Link to={item.href}><span>{item.label}</span>{item.value === undefined ? <Skeleton className="h-5 w-8" /> : <Badge variant={item.value > 0 ? "secondary" : "outline"}>{item.value}</Badge>}</Link></Button>)}</CardContent></Card></section>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]"><Card><CardHeader><CardTitle>Upcoming shifts</CardTitle><CardDescription>The next scheduled work across all active companies.</CardDescription></CardHeader><CardContent className="flex flex-col gap-2">{overview ? overview.upcomingShifts.length ? overview.upcomingShifts.map((shift) => <UpcomingShift key={shift.occurrenceId} shift={shift} />) : <Empty><EmptyHeader><EmptyMedia variant="icon"><CalendarDaysIcon /></EmptyMedia><EmptyTitle>No upcoming shifts</EmptyTitle><EmptyDescription>Scheduled global work will appear here.</EmptyDescription></EmptyHeader></Empty> : <><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></>}</CardContent></Card><Card><CardHeader><CardTitle>What the dashboard is watching</CardTitle><CardDescription>Signals are updated from the platform database on each load.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3"><div className="rounded-lg border px-3 py-3"><p className="text-sm font-medium">Tenant activity</p><p className="text-sm text-muted-foreground">Six months of new company, user, and shift activity.</p></div><div className="rounded-lg border px-3 py-3"><p className="text-sm font-medium">Workforce readiness</p><p className="text-sm text-muted-foreground">Upcoming shift capacity and remaining places to fill.</p></div><div className="rounded-lg border px-3 py-3"><p className="text-sm font-medium">Global health</p><p className="text-sm text-muted-foreground">Verification, applications, staffing gaps, and document checks.</p></div></CardContent></Card></section>
    </>}
  </div>
}
