import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/signup")({
	component: SignUpComponent,
});

type dataSubmit = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

function SignUpComponent() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<dataSubmit>();

	async function onSubmit(data: dataSubmit) {
		if (data.password !== data.confirmPassword) {
			toast.error("Senhas incompatíveis");
			return;
		}

		try {
			await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
			});
			toast.success("Cadastro realizado com sucesso!");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao realizar cadastro",
			);
		}
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center"
			style={{ background: "linear-gradient(to bottom, #181f35, #171e32)" }}
		>
			<div
				className="w-[40%] rounded-lg p-8 shadow-xl"
				style={{ backgroundColor: "#222b40" }}
			>
				<h1
					className="mb-2 text-center font-bold text-3xl"
					style={{ color: "#36b0f8" }}
				>
					Ponto Up
				</h1>
				<p className="mb-6 text-center" style={{ color: "#79889e" }}>
					Bem-vindo ao sistema
				</p>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mb-6 flex flex-col gap-4"
				>
					<div>
						<input
							type="text"
							placeholder="Nome"
							{...register("name", { required: "Nome é obrigatório" })}
							className="w-full rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.name && (
							<span className="mt-1 text-red-500 text-sm">
								{errors.name.message}
							</span>
						)}
					</div>
					<div>
						<input
							type="email"
							placeholder="Email"
							{...register("email", { required: "Email é obrigatório" })}
							className="w-full rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.email && (
							<span className="mt-1 text-red-500 text-sm">
								{errors.email.message}
							</span>
						)}
					</div>
					<div>
						<input
							type="password"
							placeholder="Senha"
							{...register("password", { required: "Senha é obrigatória" })}
							className="w-full rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.password && (
							<span className="mt-1 text-red-500 text-sm">
								{errors.password.message}
							</span>
						)}
					</div>
					<div>
						<input
							type="password"
							placeholder="Confirmar Senha"
							{...register("confirmPassword", {
								required: "Confirmação de senha é obrigatória",
							})}
							className="w-full rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							style={{ backgroundColor: "#2a374b" }}
						/>
						{errors.confirmPassword && (
							<span className="mt-1 text-red-500 text-sm">
								{errors.confirmPassword.message}
							</span>
						)}
					</div>
					<button
						type="submit"
						className="w-full cursor-pointer rounded-md px-4 py-2 font-medium text-white"
						style={{ backgroundColor: "#2c77f9" }}
					>
						Cadastrar
					</button>
				</form>
				<Link
					to="/"
					className="mb-4 block w-full rounded-md px-4 py-2 text-center font-medium text-white"
					style={{ backgroundColor: "#2a374b" }}
				>
					Voltar
				</Link>
				<p className="text-center" style={{ color: "#79889e" }}>
					Já tem uma conta?{" "}
					<Link
						to="/signin"
						className="hover:underline"
						style={{ color: "#36b0f8" }}
					>
						Entre aqui
					</Link>
				</p>
			</div>
		</div>
	);
}
