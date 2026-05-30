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
