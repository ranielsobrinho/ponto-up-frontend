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
