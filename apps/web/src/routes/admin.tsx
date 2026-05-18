import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	Calendar,
	Clock,
	Home,
	LogOut,
	Settings,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthGuard } from "../hooks/use-session";
import { customSignOut, isAdmin } from "../lib/auth-client";
import {
	getAllUsersStatistics,
	type UserStatistics,
} from "../services/electronicTimeClockService";

export const Route = createFileRoute("/admin")({
	component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
	const { session, isPending } = useAuthGuard();
	const [stats, setStats] = useState<UserStatistics[]>([]);
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

	if (!session || !isAdmin(session)) {
		return null;
	}

	const handleSignOut = () => {
		customSignOut();
	};

	const totalUsers = stats.length;
	const usersActiveToday = stats.filter((s) => s.hasClockedInToday).length;
	const totalMonthHours = stats.reduce((sum, s) => sum + s.monthHours, 0);
	const totalMissingHours = stats.reduce((sum, s) => sum + s.missingHours, 0);

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
						<div
							className="flex items-center gap-3 rounded-md px-4 py-3 text-white"
							style={{ backgroundColor: "#2c77f9" }}
						>
							<Home size={20} />
							Início
						</div>
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
										Total Usuários
									</p>
									<p className="font-bold text-2xl text-white">{totalUsers}</p>
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
										Ativos Hoje
									</p>
									<p className="font-bold text-2xl text-white">
										{usersActiveToday}
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
										Horas Mês
									</p>
									<p className="font-bold text-2xl text-white">
										{totalMonthHours.toFixed(1)}h
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
									style={{ backgroundColor: "#f59e0b" }}
								>
									<AlertCircle size={20} style={{ color: "white" }} />
								</div>
								<div>
									<p className="text-sm" style={{ color: "#9ca3af" }}>
										Horas Faltantes
									</p>
									<p className="font-bold text-2xl text-white">
										{totalMissingHours.toFixed(1)}h
									</p>
								</div>
							</div>
						</div>
					</div>

					<div
						className="rounded-lg p-6"
						style={{ backgroundColor: "#222b40" }}
					>
						<h3 className="mb-4 font-semibold" style={{ color: "#e5e7eb" }}>
							Registro de Horas por Usuário
						</h3>

						{isLoading ? (
							<p style={{ color: "#9ca3af" }}>Carregando...</p>
						) : stats.length === 0 ? (
							<p style={{ color: "#9ca3af" }}>Nenhum dado encontrado.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr
											className="border-b text-left"
											style={{ borderColor: "#374151" }}
										>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Usuário
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Status
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Horas Semana
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Horas Mês
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Horas Faltantes
											</th>
										</tr>
									</thead>
									<tbody>
										{stats.map((stat) => (
											<tr
												key={stat.userId}
												className="border-b"
												style={{ borderColor: "#374151" }}
											>
												<td className="py-3" style={{ color: "#e5e7eb" }}>
													{stat.userName}
												</td>
												<td className="py-3">
													<span
														className={`rounded-md px-2 py-1 font-medium text-xs ${
															stat.hasClockedInToday
																? "bg-green-600"
																: "bg-red-600"
														}`}
														style={{ color: "white" }}
													>
														{stat.hasClockedInToday ? "Presente" : "Ausente"}
													</span>
												</td>
												<td className="py-3" style={{ color: "#e5e7eb" }}>
													{stat.weekHours}h
												</td>
												<td className="py-3" style={{ color: "#e5e7eb" }}>
													{stat.monthHours}h
												</td>
												<td className="py-3">
													<span
														style={{
															color:
																stat.missingHours > 0 ? "#f59e0b" : "#10b981",
														}}
													>
														{stat.missingHours}h
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
