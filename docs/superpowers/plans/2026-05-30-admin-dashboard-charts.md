# Admin Dashboard Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the admin dashboard's per-user statistics table with recharts visualizations driven by the new aggregated backend JSON.

**Architecture:** The backend now returns a single `DashboardStatistics` object instead of a `UserStatistics[]`. We define the new TypeScript types in the service file, create four focused chart/table components, then rewrite `admin.tsx` to consume the new shape and render the charts in a grid layout below updated stat cards.

**Tech Stack:** React 19, TypeScript 6, recharts 3.8, Tailwind CSS v4, TanStack Router

**Files:**
- Modify: `apps/web/src/services/electronicTimeClockService.ts` - replace `UserStatistics` with `DashboardStatistics` types, update `getAllUsersStatistics` signature
- Create: `apps/web/src/components/late-clockins-chart.tsx`
- Create: `apps/web/src/components/weekly-presence-chart.tsx`
- Create: `apps/web/src/components/overtime-chart.tsx`
- Create: `apps/web/src/components/latest-registries-table.tsx`
- Modify: `apps/web/src/routes/admin.tsx` - full rewrite of data fetching, stat cards, and new chart sections
- Modify: `apps/web/package.json` - add `recharts` to dependencies

---

### Task 1: Update API types and service function

**Files:**
- Modify: `apps/web/src/services/electronicTimeClockService.ts` (lines 197-266)

- [ ] **Step 1: Replace the `UserStatistics` interface with the new types**

Replace lines 197-204 (the `UserStatistics` interface) with the new dashboard types:

```ts
export interface OvertimeSummary {
  totalOvertimeHours: number;
  weekdayAfter17Hours: number;
  saturdayHours: number;
}

export interface LateClockIn {
  month: string;
  count: number;
}

export interface WeeklyPresenceItem {
  dayOfWeek: number;
  dayName: string;
  users: number;
}

export interface ExtraHoursMonth {
  month: string;
  extraHours: number;
}

export interface LatestRegistry {
  id: number;
  title: string;
  clockIn: string;
  clockOut: string;
  observations: string;
  createdAt: string;
  createdBy: string;
  userName: string;
  userEmail: string;
}

export interface DashboardStatistics {
  activeWorkers: number;
  clockedInToday: number;
  notClockedInToday: number;
  lateClockInsPerMonth: LateClockIn[];
  overtimeSummary: OvertimeSummary;
  avgHoursPerDay: number;
  weeklyPresence: WeeklyPresenceItem[];
  extraHoursLast5Months: ExtraHoursMonth[];
  latestRegistries: LatestRegistry[];
}
```

- [ ] **Step 2: Update `getAllUsersStatistics` return type**

Change line 247 from:
```ts
export async function getAllUsersStatistics(): Promise<any> {
```
to:
```ts
export async function getAllUsersStatistics(): Promise<DashboardStatistics> {
```

- [ ] **Step 3: Verify types compile**

Run: `npm run check-types -w web`
Expected: TypeScript compiles without errors (may show unused-export warnings for new types since consumers haven't been updated yet — this is fine)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/services/electronicTimeClockService.ts
git commit -m "feat(admin): add DashboardStatistics types for new API response"
```

---

### Task 2: Add recharts dependency to web app

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add recharts to apps/web/package.json dependencies**

After the `"react-toastify"` line, add:
```json
"recharts": "^3.8.1",
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: recharts added to web workspace `node_modules`

- [ ] **Step 3: Commit**

```bash
git add apps/web/package.json package-lock.json
git commit -m "chore: add recharts dependency"
```

---

### Task 3: Create LateClockInsChart component

**Files:**
- Create: `apps/web/src/components/late-clockins-chart.tsx`

- [ ] **Step 1: Write the component**

```tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LateClockIn } from "../services/electronicTimeClockService";

const MONTH_ABBREVIATIONS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatMonth(isoMonth: string): string {
  const [, month] = isoMonth.split("-");
  return MONTH_ABBREVIATIONS[Number.parseInt(month, 10) - 1] || isoMonth;
}

interface LateClockInsChartProps {
  data: LateClockIn[];
}

export function LateClockInsChart({ data }: LateClockInsChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm" style={{ color: "#9ca3af" }}>
        Nenhum atraso registrado nos últimos meses.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="month"
          stroke="#9ca3af"
          tickFormatter={formatMonth}
        />
        <YAxis stroke="#9ca3af" allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#222b40",
            border: "none",
            borderRadius: "8px",
            color: "#e5e7eb",
          }}
          labelFormatter={formatMonth}
        />
        <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run check-types -w web`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/late-clockins-chart.tsx
git commit -m "feat(admin): add LateClockInsChart component"
```

---

### Task 4: Create WeeklyPresenceChart component

**Files:**
- Create: `apps/web/src/components/weekly-presence-chart.tsx`

- [ ] **Step 1: Write the component**

```tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyPresenceItem } from "../services/electronicTimeClockService";

interface WeeklyPresenceChartProps {
  data: WeeklyPresenceItem[];
}

export function WeeklyPresenceChart({ data }: WeeklyPresenceChartProps) {
  const dayOrder = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];

  const sorted = [...data].sort(
    (a, b) => dayOrder.indexOf(a.dayName) - dayOrder.indexOf(b.dayName),
  );

  if (data.length === 0) {
    return (
      <p className="text-sm" style={{ color: "#9ca3af" }}>
        Nenhum dado de presença semanal disponível.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="dayName" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#222b40",
            border: "none",
            borderRadius: "8px",
            color: "#e5e7eb",
          }}
        />
        <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run check-types -w web`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/weekly-presence-chart.tsx
git commit -m "feat(admin): add WeeklyPresenceChart component"
```

---

### Task 5: Create OvertimeChart component

**Files:**
- Create: `apps/web/src/components/overtime-chart.tsx`

- [ ] **Step 1: Write the component**

```tsx
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { OvertimeSummary } from "../services/electronicTimeClockService";

const COLORS = ["#f59e0b", "#8b5cf6"];

interface OvertimeChartProps {
  data: OvertimeSummary;
}

export function OvertimeChart({ data }: OvertimeChartProps) {
  if (data.totalOvertimeHours === 0) {
    return (
      <p className="text-sm" style={{ color: "#9ca3af" }}>
        Nenhuma hora extra registrada.
      </p>
    );
  }

  const chartData = [
    { name: "Dias de Semana (após 17h)", value: data.weekdayAfter17Hours },
    { name: "Sábados", value: data.saturdayHours },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value.toFixed(1)}h`}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#222b40",
            border: "none",
            borderRadius: "8px",
            color: "#e5e7eb",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run check-types -w web`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/overtime-chart.tsx
git commit -m "feat(admin): add OvertimeChart component"
```

---

### Task 6: Create LatestRegistriesTable component

**Files:**
- Create: `apps/web/src/components/latest-registries-table.tsx`

- [ ] **Step 1: Write the component**

```tsx
import type { LatestRegistry } from "../services/electronicTimeClockService";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface LatestRegistriesTableProps {
  data: LatestRegistry[];
}

export function LatestRegistriesTable({ data }: LatestRegistriesTableProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm" style={{ color: "#9ca3af" }}>
        Nenhum registro recente.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "#374151" }}>
            <th className="pb-3 font-semibold" style={{ color: "#9ca3af" }}>
              Usuário
            </th>
            <th className="pb-3 font-semibold" style={{ color: "#9ca3af" }}>
              Título
            </th>
            <th className="pb-3 font-semibold" style={{ color: "#9ca3af" }}>
              Entrada
            </th>
            <th className="pb-3 font-semibold" style={{ color: "#9ca3af" }}>
              Saída
            </th>
            <th className="pb-3 font-semibold" style={{ color: "#9ca3af" }}>
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((registry) => (
            <tr
              key={registry.id}
              className="border-b"
              style={{ borderColor: "#374151" }}
            >
              <td className="py-3" style={{ color: "#e5e7eb" }}>
                {registry.userName}
              </td>
              <td className="py-3" style={{ color: "#e5e7eb" }}>
                {registry.title}
              </td>
              <td className="py-3" style={{ color: "#e5e7eb" }}>
                {formatTime(registry.clockIn)}
              </td>
              <td className="py-3" style={{ color: "#e5e7eb" }}>
                {formatTime(registry.clockOut)}
              </td>
              <td className="py-3" style={{ color: "#e5e7eb" }}>
                {formatDateTime(registry.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run check-types -w web`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/latest-registries-table.tsx
git commit -m "feat(admin): add LatestRegistriesTable component"
```

---

### Task 7: Rewrite admin.tsx to use new data shape and chart components

**Files:**
- Modify: `apps/web/src/routes/admin.tsx` (full rewrite, 321 lines → ~220 lines)

- [ ] **Step 1: Rewrite admin.tsx**

Replace the entire file content:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  ChartColumnDecreasing,
  Clock,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthGuard } from "../hooks/use-session";
import { customSignOut } from "../lib/auth-client";
import {
  getAllUsersStatistics,
  type DashboardStatistics,
} from "../services/electronicTimeClockService";
import { LateClockInsChart } from "../components/late-clockins-chart";
import { LatestRegistriesTable } from "../components/latest-registries-table";
import { OvertimeChart } from "../components/overtime-chart";
import { WeeklyPresenceChart } from "../components/weekly-presence-chart";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  const { session, isPending } = useAuthGuard();
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getAllUsersStatistics();
      setStats(data);
    } catch (_error) {
      toast.error("Erro ao buscar estatísticas.", {
        autoClose: 3000,
        closeOnClick: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    customSignOut();
  };

  return (
    <div className="flex h-screen flex-col">
      <header
        className="flex h-16 items-center justify-between px-6"
        style={{ backgroundColor: "#222b40" }}
      >
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl" style={{ color: "#36b0f8" }}>
            Ponto Up
          </h1>
          <span className="text-lg" style={{ color: "#79889e" }}>
            Bem-vindo(a) {session.user.name}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
          style={{ backgroundColor: "#e53e3e" }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 p-4" style={{ backgroundColor: "#1a2233" }}>
          <nav className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-600"
              style={{ backgroundColor: "#2c77f9" }}
            >
              <Home size={20} />
              Início
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-600"
              style={{ backgroundColor: "oklch(60.9% 0.126 221.723)" }}
            >
              <ChartColumnDecreasing size={20} />
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-600"
              style={{ backgroundColor: "#2a374b" }}
            >
              <Settings size={20} />
              Configurações
            </Link>
          </nav>
        </aside>

        <main
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: "#181f35" }}
        >
          <h2 className="mb-6 font-bold text-white text-xl">
            Dashboard Administrador
          </h2>

          {isLoading ? (
            <p style={{ color: "#9ca3af" }}>Carregando...</p>
          ) : stats ? (
            <>
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#2c77f9" }}
                    >
                      <Users size={20} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        Total Trabalhadores
                      </p>
                      <p className="font-bold text-2xl text-white">
                        {stats.activeWorkers}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#10b981" }}
                    >
                      <Calendar size={20} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        Registraram Hoje
                      </p>
                      <p className="font-bold text-2xl text-white">
                        {stats.clockedInToday}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#ef4444" }}
                    >
                      <AlertCircle size={20} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        Não Registraram Hoje
                      </p>
                      <p className="font-bold text-2xl text-white">
                        {stats.notClockedInToday}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#8b5cf6" }}
                    >
                      <Clock size={20} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        Média Horas/Dia
                      </p>
                      <p className="font-bold text-2xl text-white">
                        {stats.avgHoursPerDay.toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div
                  className="rounded-lg p-6"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <h3
                    className="mb-4 font-semibold"
                    style={{ color: "#e5e7eb" }}
                  >
                    Atrasos por Mês
                  </h3>
                  <LateClockInsChart data={stats.lateClockInsPerMonth} />
                </div>

                <div
                  className="rounded-lg p-6"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <h3
                    className="mb-4 font-semibold"
                    style={{ color: "#e5e7eb" }}
                  >
                    Presença Semanal
                  </h3>
                  <WeeklyPresenceChart data={stats.weeklyPresence} />
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div
                  className="rounded-lg p-6"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <h3
                    className="mb-4 font-semibold"
                    style={{ color: "#e5e7eb" }}
                  >
                    Horas Extras
                  </h3>
                  <OvertimeChart data={stats.overtimeSummary} />
                </div>

                <div
                  className="rounded-lg p-6"
                  style={{ backgroundColor: "#222b40" }}
                >
                  <h3
                    className="mb-4 font-semibold"
                    style={{ color: "#e5e7eb" }}
                  >
                    Últimos Registros
                  </h3>
                  <LatestRegistriesTable data={stats.latestRegistries} />
                </div>
              </div>
            </>
          ) : (
            <p style={{ color: "#9ca3af" }}>Nenhum dado encontrado.</p>
          )}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run check-types -w web`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/admin.tsx
git commit -m "feat(admin): integrate recharts dashboard with new API data shape"
```
