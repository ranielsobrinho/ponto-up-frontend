import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ExtraHoursMonth } from "../services/electronicTimeClockService";

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

interface ExtraHoursChartProps {
	data: ExtraHoursMonth[];
}

export function ExtraHoursChart({ data }: ExtraHoursChartProps) {
	if (data.length === 0) {
		return (
			<p className="text-sm" style={{ color: "#9ca3af" }}>
				Nenhum dado de horas extras nos últimos meses.
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
							label: "Horas Extras",
							data: data.map((d) => d.extraHours),
							backgroundColor: "#8b5cf6",
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
							callbacks: {
								label: (context) => `${Number(context.parsed).toFixed(1)}h`,
							},
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
							title: {
								display: true,
								text: "Horas",
								color: "#9ca3af",
							},
						},
					},
				}}
			/>
		</div>
	);
}
