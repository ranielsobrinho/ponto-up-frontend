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
import { LateClockInsChart } from "../components/late-clockins-chart";
import { LatestRegistriesTable } from "../components/latest-registries-table";
import { OvertimeChart } from "../components/overtime-chart";
import { WeeklyPresenceChart } from "../components/weekly-presence-chart";
import { useAuthGuard } from "../hooks/use-session";
import { customSignOut } from "../lib/auth-client";
import {
	type DashboardStatistics,
	getAllUsersStatistics,
} from "../services/electronicTimeClockService";

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
			console.log("Olha os dados =>", data);
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
