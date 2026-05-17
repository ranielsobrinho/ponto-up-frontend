import { Button } from "@ponto-up-frontend/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ponto-up-frontend/ui/components/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updatePassword } from "@/services/userService";

interface UpdatePasswordModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface PasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

function UpdatePasswordModal({ open, onOpenChange }: UpdatePasswordModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<PasswordFormData>();

	const newPassword = watch("newPassword");

	async function onSubmit(data: PasswordFormData) {
		setIsLoading(true);
		try {
			await updatePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
			toast.success("Senha atualizada com sucesso!", {
				autoClose: 3000,
				closeOnClick: true,
			});
			reset();
			onOpenChange(false);
		} catch (error: unknown) {
			let errorMsg = "Falha ao atualizar senha";
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

	function handleClose() {
		reset();
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-lg">
				<DialogHeader>
					<DialogTitle>
						<h1 className="font-bold text-2xl" style={{ color: "#36b0f8" }}>
							Alterar Senha
						</h1>
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="mt-2 flex flex-col gap-2">
						<label
							htmlFor="currentPassword"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Senha Atual *
						</label>
						<input
							type="password"
							id="currentPassword"
							{...register("currentPassword", {
								required: "Senha atual é obrigatória",
							})}
							className="w-full rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.currentPassword && (
							<span className="text-red-500 text-sm">
								{errors.currentPassword.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="newPassword"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Nova Senha *
						</label>
						<input
							type="password"
							id="newPassword"
							{...register("newPassword", {
								required: "Nova senha é obrigatória",
								minLength: {
									value: 6,
									message: "Senha deve ter pelo menos 6 caracteres",
								},
							})}
							className="w-full rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.newPassword && (
							<span className="text-red-500 text-sm">
								{errors.newPassword.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="confirmPassword"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Confirmar Nova Senha *
						</label>
						<input
							type="password"
							id="confirmPassword"
							{...register("confirmPassword", {
								required: "Confirmação de senha é obrigatória",
								validate: (value) =>
									value === newPassword || "As senhas não coincidem",
							})}
							className="w-full rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.confirmPassword && (
							<span className="text-red-500 text-sm">
								{errors.confirmPassword.message}
							</span>
						)}
					</div>

					<DialogFooter className="mt-2">
						<div className="flex w-full flex-col">
							<Button
								type="submit"
								className="font-bold"
								disabled={isLoading}
								style={{
									backgroundColor: isLoading ? "#6b7280" : "#2c77f9",
									color: "white",
									borderRadius: ".2rem",
									cursor: isLoading ? "not-allowed" : "pointer",
								}}
							>
								{isLoading ? "Salvando..." : "Alterar Senha"}
							</Button>
							<Button
								type="button"
								variant="outline"
								className="font-bold"
								onClick={handleClose}
								disabled={isLoading}
								style={{
									backgroundColor: "#e53e3e",
									borderColor: "#e53e3e",
									borderRadius: ".2rem",
									marginTop: ".5rem",
									cursor: isLoading ? "not-allowed" : "pointer",
								}}
							>
								Cancelar
							</Button>
						</div>
					</DialogFooter>
				</form>

				<DialogClose>
					<button
						type="button"
						className="absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
						style={{ color: "#9ca3af" }}
						onClick={handleClose}
					>
						<X size={18} />
					</button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}

export { UpdatePasswordModal };
