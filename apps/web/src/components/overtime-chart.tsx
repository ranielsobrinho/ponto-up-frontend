import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { OvertimeSummary } from "../services/electronicTimeClockService";

ChartJS.register(ArcElement, Tooltip, Legend);

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

	return (
		<div style={{ height: 300 }}>
			<Doughnut
				data={{
					labels: ["Dias de Semana (após 17h)", "Sábados"],
					datasets: [
						{
							data: [data.weekdayAfter17Hours, data.saturdayHours],
							backgroundColor: COLORS,
							borderWidth: 0,
						},
					],
				}}
				options={{
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: { color: "#e5e7eb" },
						},
						tooltip: {
							backgroundColor: "#222b40",
							titleColor: "#e5e7eb",
							bodyColor: "#e5e7eb",
							cornerRadius: 8,
							padding: 8,
							callbacks: {
								label: (context) => {
									const value = context.parsed as number;
									return `${context.label}: ${value.toFixed(1)}h`;
								},
							},
						},
					},
				}}
			/>
		</div>
	);
}
