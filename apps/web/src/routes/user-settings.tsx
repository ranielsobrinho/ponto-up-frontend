import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, LogOut } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { customSignOut } from "@/lib/auth-client";
import { updateUserProfile } from "@/services/userService";
import { UpdatePasswordModal } from "../components/update-password-modal";
import { useAuthGuard } from "../hooks/use-session";

export const Route = createFileRoute("/user-settings")({
	component: UserSettingsComponent,
});

interface ProfileFormData {
	name: string;
	email: string;
}

function UserSettingsComponent() {
	const { session, isPending } = useAuthGuard();
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<ProfileFormData>({
		defaultValues: {
			name: session?.user.name || "",
			email: session?.user.email || "",
		},
	});

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

	async function onSubmit(data: ProfileFormData) {
		setIsLoading(true);
		try {
			await updateUserProfile({ name: data.name, email: data.email });
			toast.success("Perfil atualizado com sucesso!", {
				autoClose: 3000,
				closeOnClick: true,
			});
			const storedSession = localStorage.getItem("session");
			if (storedSession) {
				const parsed = JSON.parse(storedSession);
				parsed.user.name = data.name;
				parsed.user.email = data.email;
				localStorage.setItem("session", JSON.stringify(parsed));
			}
			reset(data);
		} catch (error: unknown) {
			let errorMsg = "Falha ao atualizar perfil";
			if (error instanceof Error) {
				errorMsg =
					(error as Error & { response?: { message?: string } })?.response
						?.message || error.message;
			}
			toast.error(errorMsg, {
				autoClose: 3000,
				closeOnClick: true,
			});
		} finally {
			setIsLoading(false);
		}
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
						<Link
							to="/settings"
							className="flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-600"
							style={{ backgroundColor: "#2a374b" }}
						>
							Configurações
						</Link>
					</nav>
				</aside>

				<main
					className="flex-1 overflow-auto p-6"
					style={{ backgroundColor: "#181f35" }}
				>
					<div
						className="mx-auto max-w-2xl rounded-lg p-6"
						style={{ backgroundColor: "#222b40" }}
					>
						<div className="mb-6 flex items-center gap-4">
							<Link
								to="/settings"
								className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-700"
								style={{ color: "#9ca3af" }}
							>
								<ArrowLeft size={20} />
							</Link>
							<h2 className="font-bold text-white text-xl">Dados do Usuário</h2>
						</div>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-6"
						>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="name"
									className="font-medium text-sm"
									style={{ color: "#e5e7eb" }}
								>
									Nome *
								</label>
								<input
									type="text"
									id="name"
									{...register("name", { required: "Nome é obrigatório" })}
									className="w-full rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
									style={{ backgroundColor: "#2a374b" }}
								/>
								{errors.name && (
									<span className="text-red-500 text-sm">
										{errors.name.message}
									</span>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="email"
									className="font-medium text-sm"
									style={{ color: "#e5e7eb" }}
								>
									Email *
								</label>
								<input
									type="email"
									id="email"
									{...register("email", {
										required: "Email é obrigatório",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Email inválido",
										},
									})}
									className="w-full rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
									style={{ backgroundColor: "#2a374b" }}
								/>
								{errors.email && (
									<span className="text-red-500 text-sm">
										{errors.email.message}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between border-gray-700 border-t pt-6">
								<button
									type="button"
									onClick={() => setIsPasswordModalOpen(true)}
									className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
									style={{ backgroundColor: "#2c77f9" }}
								>
									<KeyRound size={18} />
									Alterar Senha
								</button>

								<button
									type="submit"
									disabled={!isDirty || isLoading}
									className="cursor-pointer rounded-md px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
									style={{
										backgroundColor: isDirty ? "#2c77f9" : "#6b7280",
										cursor: isDirty && !isLoading ? "pointer" : "not-allowed",
									}}
								>
									{isLoading ? "Salvando..." : "Salvar"}
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>

			<UpdatePasswordModal
				open={isPasswordModalOpen}
				onOpenChange={setIsPasswordModalOpen}
			/>
		</div>
	);
}
