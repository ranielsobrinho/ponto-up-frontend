import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@ponto-up-frontend/ui/components/dialog";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ChartColumnDecreasing,
	Home,
	LogOut,
	Pencil,
	Plus,
	Settings,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCurrentMonthTimeClocks } from "@/services/electronicTimeClockService";
import { CreatePointModal } from "../components/create-point-modal";
import { useAuthGuard } from "../hooks/use-session";
import { customSignOut } from "../lib/auth-client";

export const Route = createFileRoute("/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const { session, isPending } = useAuthGuard();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [showDayModal, setShowDayModal] = useState(false);
	const [editingEvent, setEditingEvent] = useState<{
		id: string;
		title: string;
		clockIn: string;
		clockOut: string;
		observation: string;
		date: string;
	} | null>(null);
	const [calendarEvents, setCalendarEvents] = useState<
		Array<{
			id: string;
			title: string;
			start: string;
			end: string;
			observation?: string;
		}>
	>([]);

	function handleDateClick(info: { dateStr: string }) {
		setSelectedDate(info.dateStr);
		setShowDayModal(true);
	}

	const dayEvents = selectedDate
		? calendarEvents.filter((event) => event.start.startsWith(selectedDate))
		: [];

	function formatTime(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	const fetchTimeClocks = useCallback(async () => {
		try {
			const data = await getCurrentMonthTimeClocks();
			const events = Array.isArray(data)
				? data.map((item: Record<string, string | Date>) => ({
						id: String(item.id),
						title: String(item.title || "Ponto"),
						start: String(item.clockIn),
						end: String(item.clockOut),
						extendedProps: {
							observation: String(item.observations || ""),
						},
					}))
				: [];
			setCalendarEvents(events);
		} catch (_error) {
			toast.error("Erro ao buscar pontos.", {
				autoClose: 3000,
				closeOnClick: true,
			});
		}
	}, []);

	useEffect(() => {
		fetchTimeClocks();
	}, [fetchTimeClocks]);

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
					<div className="mb-6">
						<button
							type="button"
							className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
							style={{ backgroundColor: "#2c77f9" }}
							onClick={() => setIsModalOpen(true)}
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
							events={calendarEvents}
							dateClick={handleDateClick}
							eventClick={(info) => {
								const event = info.event;
								const clockInTime = formatTime(
									event.start?.toISOString() ?? "",
								);
								const clockOutTime = event.end
									? formatTime(event.end.toISOString())
									: "";
								const originalDate =
									event.start?.toISOString().split("T")[0] ?? "";
								const extProps = event.extendedProps as {
									observation?: string;
								} | null;
								setEditingEvent({
									id: event.id,
									title: event.title || "",
									clockIn: clockInTime,
									clockOut: clockOutTime,
									observation: extProps?.observation || "",
									date: originalDate,
								});
								setIsModalOpen(true);
							}}
							dayCellDidMount={(arg) => {
								arg.el.style.cursor = "pointer";
							}}
						/>
					</div>
				</main>
			</div>

			<CreatePointModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				updateData={fetchTimeClocks}
				initialData={editingEvent}
				onClose={() => setEditingEvent(null)}
			/>

			<Dialog open={showDayModal} onOpenChange={setShowDayModal}>
				<DialogContent className="min-w-lg">
					<DialogHeader>
						<DialogTitle>
							<h1 className="font-bold text-2xl" style={{ color: "#36b0f8" }}>
								{selectedDate
									? new Date(selectedDate).toLocaleDateString("pt-BR", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										})
									: "Detalhes do dia"}
							</h1>
						</DialogTitle>
					</DialogHeader>

					<div className="mt-2 flex flex-col gap-3">
						{dayEvents.length === 0 ? (
							<p style={{ color: "#9ca3af" }}>
								Nenhum registro de ponto neste dia.
							</p>
						) : (
							dayEvents.map((event) => (
								<div
									key={event.id}
									className="rounded-md p-4"
									style={{ backgroundColor: "#2a374b" }}
								>
									<div className="flex items-center justify-between">
										<span
											className="font-semibold"
											style={{ color: "#e5e7eb" }}
										>
											{event.title}
										</span>
										<button
											type="button"
											onClick={() => {
												const clockInTime = formatTime(event.start);
												const clockOutTime = event.end
													? formatTime(event.end)
													: "";
												const originalDate = event.start.split("T")[0];
												setEditingEvent({
													id: event.id,
													title: event.title,
													clockIn: clockInTime,
													clockOut: clockOutTime,
													observation: event.observation || "",
													date: originalDate,
												});
												setIsModalOpen(true);
												setShowDayModal(false);
											}}
											className="cursor-pointer rounded-md p-1 transition-colors hover:bg-blue-600"
											style={{ color: "#36b0f8" }}
										>
											<Pencil size={16} />
										</button>
									</div>
									<div
										className="mt-2 flex gap-4 text-sm"
										style={{ color: "#9ca3af" }}
									>
										<div>
											<span className="font-medium">Entrada: </span>
											<span style={{ color: "#36b0f8" }}>
												{formatTime(event.start)}
											</span>
										</div>
										<div>
											<span className="font-medium">Saída: </span>
											<span style={{ color: "#36b0f8" }}>
												{event.end ? formatTime(event.end) : "-"}
											</span>
										</div>
									</div>
									{event.observation && (
										<p className="mt-2 text-sm" style={{ color: "#9ca3af" }}>
											{event.observation}
										</p>
									)}
								</div>
							))
						)}
					</div>

					<button
						type="button"
						className="absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
						style={{ color: "#9ca3af" }}
						onClick={() => setShowDayModal(false)}
					>
						<X size={18} />
					</button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
