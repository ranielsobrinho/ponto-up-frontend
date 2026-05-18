import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Pencil, Users as UsersIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customSignOut } from "@/lib/auth-client";
import { useAuthGuard } from "../hooks/use-session";
import {
	getAllUsers,
	type User as UserType,
	updateUser,
} from "../services/userService";

export const Route = createFileRoute("/users")({
	component: SettingsUsersComponent,
});

function SettingsUsersComponent() {
	const { session, isPending } = useAuthGuard();
	const [users, setUsers] = useState<UserType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingUser, setEditingUser] = useState<UserType | null>(null);

	const fetchUsers = useCallback(async () => {
		try {
			const data = await getAllUsers();
			setUsers(Array.isArray(data) ? data : []);
		} catch (_error) {
			toast.error("Erro ao buscar usuários.", {
				autoClose: 3000,
				closeOnClick: true,
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

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

	async function handleRoleChange(userId: string, newRole: string) {
		try {
			await updateUser(userId, { role: newRole });
			toast.success("Função atualizada com sucesso!", {
				autoClose: 3000,
				closeOnClick: true,
			});
			setEditingUser(null);
			fetchUsers();
		} catch (error) {
			let errorMsg = "Falha ao atualizar função";
			if (error instanceof Error) {
				errorMsg =
					(error as Error & { response?: { message?: string } })?.response
						?.message || error.message;
			}
			toast.error(errorMsg, {
				autoClose: 3000,
				closeOnClick: true,
			});
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
							<UsersIcon size={20} />
							Início
						</Link>
						<Link
							to="/settings"
							className="flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-600"
							style={{ backgroundColor: "#2a374b" }}
						>
							<SettingsIcon size={20} />
							Configurações
						</Link>
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
						<div className="mb-6 flex items-center gap-4">
							<Link
								to="/settings"
								className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-700"
								style={{ color: "#9ca3af" }}
							>
								<ArrowLeft size={20} />
							</Link>
							<h2 className="font-bold text-white text-xl">
								Gerenciar Usuários
							</h2>
						</div>

						{isLoading ? (
							<p style={{ color: "#9ca3af" }}>Carregando...</p>
						) : users.length === 0 ? (
							<p style={{ color: "#9ca3af" }}>Nenhum usuário encontrado.</p>
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
												Nome
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Email
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Função
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Criado em
											</th>
											<th
												className="pb-3 font-semibold"
												style={{ color: "#9ca3af" }}
											>
												Ações
											</th>
										</tr>
									</thead>
									<tbody>
										{users.map((user) => (
											<tr
												key={user.id}
												className="border-b"
												style={{ borderColor: "#374151" }}
											>
												<td className="py-4" style={{ color: "#e5e7eb" }}>
													{user.name}
												</td>
												<td className="py-4" style={{ color: "#e5e7eb" }}>
													{user.email}
												</td>
												<td className="py-4">
													{editingUser?.id === user.id ? (
														<select
															value={editingUser.role}
															onChange={(e) =>
																handleRoleChange(user.id, e.target.value)
															}
															className="rounded-md px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
															style={{ backgroundColor: "#2a374b" }}
														>
															<option value="user">Usuário</option>
															<option value="admin">Administrador</option>
														</select>
													) : (
														<span
															className={`rounded-md px-2 py-1 font-medium text-xs ${
																user.role === "admin"
																	? "bg-purple-600"
																	: "bg-blue-600"
															}`}
															style={{ color: "white" }}
														>
															{user.role === "admin"
																? "Administrador"
																: "Usuário"}
														</span>
													)}
												</td>
												<td className="py-4" style={{ color: "#e5e7eb" }}>
													{new Date(user.createdAt).toLocaleDateString("pt-BR")}
												</td>
												<td className="py-4">
													<button
														type="button"
														onClick={() =>
															setEditingUser(
																editingUser?.id === user.id ? null : user,
															)
														}
														className="cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-700"
														style={{ color: "#36b0f8" }}
													>
														<Pencil size={16} />
													</button>
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

function SettingsIcon({ size }: { size: number }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Settings</title>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}
