import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { customSignOut } from "@/lib/auth-client";
import { useAuthGuard } from "../hooks/use-session";

export const Route = createFileRoute("/settings")({
	component: SettingsComponent,
});

interface ConfigOption {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	link: string;
}

function SettingsComponent() {
	const { session, isPending } = useAuthGuard();

	const configOptions: ConfigOption[] = [
		{
			id: "user",
			title: "Dados do usuário",
			description: "Gerencie suas informações pessoais",
			icon: <User size={24} />,
			link: "/user-settings",
		},
	];

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
							style={{ backgroundColor: "#2a374b" }}
						>
							Início
						</Link>
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
						<h2 className="mb-6 font-bold text-white text-xl">Configurações</h2>
						<div className="flex flex-col gap-4">
							{configOptions.map((option) => (
								<Link
									key={option.id}
									to={option.link}
									className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-700 p-4 transition-colors hover:border-blue-500 hover:bg-gray-800"
									style={{ borderColor: "#374151" }}
								>
									<div
										className="flex h-12 w-12 items-center justify-center rounded-lg"
										style={{ backgroundColor: "#36b0f8" }}
									>
										{option.icon}
									</div>
									<div>
										<h3 className="font-semibold" style={{ color: "#e5e7eb" }}>
											{option.title}
										</h3>
										<p className="text-sm" style={{ color: "#9ca3af" }}>
											{option.description}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
