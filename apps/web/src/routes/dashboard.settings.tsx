import { createFileRoute } from "@tanstack/react-router";
import { useAuthGuard } from "../hooks/use-session";

export const Route = createFileRoute("/dashboard/settings")({
	component: SettingsComponent,
});

function SettingsComponent() {
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
			</header>

			<div className="flex flex-1 overflow-hidden">
				<aside className="w-48 p-4" style={{ backgroundColor: "#1a2233" }}>
					<nav className="flex flex-col gap-2">
						<a
							href="/dashboard"
							className="flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-600"
							style={{ backgroundColor: "#2a374b" }}
						>
							Início
						</a>
						<div
							className="flex items-center gap-3 rounded-md px-4 py-3 text-white"
							style={{ backgroundColor: "#2c77f9" }}
						>
							Configurações
						</div>
					</nav>
				</aside>

				<main
					className="flex-1 overflow-auto p-6"
					style={{ backgroundColor: "#181f35" }}
				>
					<div
						className="rounded-lg p-6"
						style={{ backgroundColor: "#222b40" }}
					>
						<h2 className="mb-4 font-bold text-white text-xl">Configurações</h2>
						<p className="text-gray-400">
							Página de configurações em desenvolvimento...
						</p>
					</div>
				</main>
			</div>
		</div>
	);
}
