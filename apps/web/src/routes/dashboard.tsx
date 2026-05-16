import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, LogOut, Plus, Settings } from "lucide-react";
import { useAuthGuard } from "../hooks/use-session";
import { customSignOut } from "../lib/auth-client";

export const Route = createFileRoute("/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const { session, isPending } = useAuthGuard();

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
							to="/dashboard/settings"
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
					<div className="mb-6">
						<button
							type="button"
							className="flex cursor-pointer items-center justify-center rounded-md px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
							style={{ backgroundColor: "#2c77f9" }}
						>
							<Plus size={18} />
							Criar ponto
						</button>
					</div>

					<div
						className="rounded-lg p-4"
						style={{ backgroundColor: "#222b40" }}
					>
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							initialView="dayGridMonth"
							headerToolbar={{
								left: "prev,next today",
								center: "title",
								right: "dayGridMonth,timeGridWeek,timeGridDay",
							}}
							height="auto"
							locale="pt-BR"
							buttonText={{
								today: "Hoje",
								month: "Mês",
								week: "Semana",
								day: "Dia",
							}}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}
