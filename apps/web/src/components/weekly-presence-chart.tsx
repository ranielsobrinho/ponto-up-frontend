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
