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
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez",
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
				<XAxis dataKey="month" stroke="#9ca3af" tickFormatter={formatMonth} />
				<YAxis stroke="#9ca3af" allowDecimals={false} />
				<Tooltip
					contentStyle={{
						backgroundColor: "#222b40",
						border: "none",
						borderRadius: "8px",
						color: "#e5e7eb",
					}}
					labelFormatter={(label) => formatMonth(String(label))}
				/>
				<Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
