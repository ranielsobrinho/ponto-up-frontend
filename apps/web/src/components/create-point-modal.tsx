import { Button } from "@ponto-up-frontend/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ponto-up-frontend/ui/components/dialog";
import { Textarea } from "@ponto-up-frontend/ui/components/textarea";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	type CreatePointFormData,
	createClockIn,
	updateTimeClock,
} from "@/services/electronicTimeClockService";

interface CreatePointModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	updateData: () => void;
	initialData?: {
		id: string;
		title: string;
		clockIn: string;
		clockOut: string;
		observation: string;
		date: string;
	} | null;
	onClose?: () => void;
}

function CreatePointModal({
	open,
	onOpenChange,
	updateData,
	initialData,
	onClose,
}: CreatePointModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreatePointFormData>();

	useEffect(() => {
		if (open) {
			if (initialData) {
				const [clockInHour, clockInMin] = initialData.clockIn.split(":");
				const [clockOutHour, clockOutMin] = initialData.clockOut.split(":");
				setIsUpdate(true);
				reset({
					title: initialData.title,
					clockIn: `${clockInHour}:${clockInMin}`,
					clockOut: `${clockOutHour}:${clockOutMin}`,
					observation: initialData.observation,
				});
			} else {
				reset({
					title: "",
					clockIn: "",
					clockOut: "",
					observation: "",
				});
			}
		}
	}, [open, initialData, reset]);

	async function onSubmit(data: CreatePointFormData) {
		setIsLoading(true);
		try {
			if (isUpdate && initialData) {
				await updateTimeClock(initialData.id, {
					...data,
					date: initialData.date,
				});
				toast.success("Ponto atualizado com sucesso!", {
					autoClose: 3000,
					closeOnClick: true,
				});
			} else {
				await createClockIn(data);
				toast.success("Ponto cadastrado com sucesso!", {
					autoClose: 3000,
					closeOnClick: true,
				});
			}
			reset();
			onOpenChange(false);
			updateData();
		} catch (error: unknown) {
			let errorMsg = isUpdate
				? "Falha ao atualizar ponto"
				: "Falha ao cadastrar ponto";
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
		onClose?.();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-lg">
				<DialogHeader>
					<DialogTitle>
						<h1 className="font-bold text-2xl" style={{ color: "#36b0f8" }}>
							{initialData ? "Editar Ponto" : "Adicionar Ponto"}
						</h1>
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="mt-2 flex flex-col gap-2">
						<label
							htmlFor="title"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Título *
						</label>
						<input
							type="text"
							id="title"
							step="1"
							placeholder="Ex: Trabalho remoto"
							{...register("title", { required: "Título é obrigatório" })}
							className="w-full rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.title && (
							<span className="text-red-500 text-sm">
								{errors.title.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="clockIn"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Entrada *
						</label>
						<input
							type="time"
							id="clockIn"
							step="2"
							lang="en-GB"
							{...register("clockIn", { required: "Entrada é obrigatória" })}
							className="w-full rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.clockIn && (
							<span className="text-red-500 text-sm">
								{errors.clockIn.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="clockOut"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Saída *
						</label>
						<input
							type="time"
							id="clockOut"
							step="3"
							lang="en-GB"
							{...register("clockOut", { required: "Saída é obrigatória" })}
							className="w-full rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.clockOut && (
							<span className="text-red-500 text-sm">
								{errors.clockOut.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="observation"
							className="font-medium text-sm"
							style={{ color: "#e5e7eb" }}
						>
							Observação
						</label>
						<Textarea
							id="observation"
							placeholder="Alguma observação adicional..."
							{...register("observation")}
							className="text-white placeholder-gray-400"
							style={{ backgroundColor: "#2a374b" }}
							rows={3}
						/>
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
								{isLoading
									? "Salvando..."
									: initialData
										? "Atualizar"
										: "Salvar"}
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

export { CreatePointModal };
