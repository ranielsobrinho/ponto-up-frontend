import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { WeeklyPresenceItem } from "../services/electronicTimeClockService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface WeeklyPresenceChartProps {
	data: WeeklyPresenceItem[];
}

export function WeeklyPresenceChart({ data }: WeeklyPresenceChartProps) {
	const dayOrder = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
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
		<div style={{ height: 300 }}>
			<Bar
				data={{
					labels: sorted.map((d) => d.dayName),
					datasets: [
						{
							label: "Usuários",
							data: sorted.map((d) => d.users),
							backgroundColor: "#10b981",
							borderRadius: 4,
						},
					],
				}}
				options={{
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: {
							backgroundColor: "#222b40",
							titleColor: "#e5e7eb",
							bodyColor: "#e5e7eb",
							cornerRadius: 8,
							padding: 8,
						},
					},
					scales: {
						x: {
							ticks: { color: "#9ca3af" },
							grid: { color: "#374151" },
						},
						y: {
							ticks: { color: "#9ca3af" },
							grid: { color: "#374151" },
						},
					},
				}}
			/>
		</div>
	);
}
