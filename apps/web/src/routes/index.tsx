import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div
			className="flex min-h-screen items-center justify-center"
			style={{ background: "linear-gradient(to bottom, #181f35, #171e32)" }}
		>
			<div
				className="w-[30%] rounded-lg p-8 shadow-xl"
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
				<div className="flex flex-col gap-3">
					<Link
						to="/signin"
						className="block w-full rounded-md px-4 py-2 text-center font-medium text-white"
						style={{ backgroundColor: "#2c77f9" }}
					>
						Entrar
					</Link>
					<Link
						to="/signup"
						className="block w-full rounded-md px-4 py-2 text-center font-medium text-white"
						style={{ backgroundColor: "#2a374b" }}
					>
						Cadastrar
					</Link>
				</div>
			</div>
		</div>
	);
}
