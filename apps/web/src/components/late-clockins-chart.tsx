import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { LateClockIn } from "../services/electronicTimeClockService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

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
		<div style={{ height: 300 }}>
			<Bar
				data={{
					labels: data.map((d) => formatMonth(d.month)),
					datasets: [
						{
							label: "Atrasos",
							data: data.map((d) => d.count),
							backgroundColor: "#f59e0b",
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
