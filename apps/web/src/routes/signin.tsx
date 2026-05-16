import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { customSignIn } from "../lib/auth-client";
import { getAuthErrorMessage } from "../lib/auth-errors";

export const Route = createFileRoute("/signin")({
	component: SignInComponent,
});

type SignInData = {
	email: string;
	password: string;
};

function SignInComponent() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInData>();

	async function onSubmit(data: SignInData) {
		if (Object.keys(errors).length > 0) {
			Object.values(errors).forEach((error) => {
				if (error?.message) {
					toast.error(error.message);
				}
			});
			return;
		}

		await customSignIn(data.email, data.password)
			.then(() => {
				toast.success("Login realizado com sucesso!", {
					autoClose: 3000,
					closeOnClick: true,
				});
				navigate({ to: "/dashboard" });
			})
			.catch((error) => {
				toast.error(getAuthErrorMessage(error));
			});
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
					<button
						type="submit"
						className="w-full cursor-pointer rounded-md px-4 py-2 font-medium text-white"
						style={{ backgroundColor: "#2c77f9" }}
					>
						Entrar
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
					Não tem uma conta ainda?{" "}
					<Link
						to="/signup"
						className="hover:underline"
						style={{ color: "#36b0f8" }}
					>
						Cadastre-se aqui
					</Link>
				</p>
			</div>
		</div>
	);
}
