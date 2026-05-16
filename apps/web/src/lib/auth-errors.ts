interface BetterAuthError {
	code?: string;
	message?: string;
}

export function getAuthErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		const err = error as BetterAuthError;
		switch (err.code) {
			case "USER_ALREADY_EXISTS":
				return "Este email já está cadastrado";
			case "INVALID_CREDENTIALS":
				return "Email ou senha incorretos";
			case "SESSION_NOT_FOUND":
				return "Sessão expirada, faça login novamente";
			default:
				return err.message || "Erro de autenticação";
		}
	}
	return "Erro de autenticação";
}
