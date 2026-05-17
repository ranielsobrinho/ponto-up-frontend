import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
const TOKEN_KEY = "auth_token";

export interface User {
	name: string;
	email: string;
	image?: string;
	expiresAt: string;
	role: string;
}

export interface Session {
	user: User;
	token: string;
}

function getStoredSession(): Session | null {
	const stored = localStorage.getItem("session");
	if (!stored) return null;

	const token = localStorage.getItem(TOKEN_KEY);
	if (!token) return null;

	try {
		const parsed = JSON.parse(stored);
		return { ...parsed, token };
	} catch {
		return null;
	}
}

function setStoredSession(session: Session | null): void {
	if (session) {
		localStorage.setItem("session", JSON.stringify({ user: session.user }));
		localStorage.setItem(TOKEN_KEY, session.token);
	} else {
		localStorage.removeItem("session");
		localStorage.removeItem(TOKEN_KEY);
	}
}

export function getAuthToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function useSession() {
	const [session, setSessionState] = useState<Session | null>(() =>
		getStoredSession(),
	);
	const [isPending] = useState(false);

	const setSession = (newSession: Session | null) => {
		setStoredSession(newSession);
		setSessionState(newSession);
	};

	return { session, setSession, isPending };
}

export async function customSignIn(email: string, password: string) {
	const response = await fetch(`${API_BASE_URL}/api/signin`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Erro ao realizar login");
	}

	const data = await response.json();
	const now = new Date();
	now.setHours(now.getHours() + 1);

	const session: Session = {
		user: {
			name: data.user?.name || email.split("@")[0],
			email: data.user?.email || email,
			expiresAt: data.session?.expiresAt || now.toISOString(),
			role: data.users?.role || "user",
		},
		token: data.token,
	};

	setStoredSession(session);
	return data;
}

export async function customSignUp(
	name: string,
	email: string,
	password: string,
) {
	const response = await fetch(`${API_BASE_URL}/api/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ name, email, password }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Erro ao realizar cadastro");
	}

	const data = await response.json();

	const session: Session = {
		user: {
			name: data.user?.name || name,
			email: data.user?.email || email,
			expiresAt: data.expiresAt,
			role: data.users?.role || "user",
		},
		token: data.token,
	};

	setStoredSession(session);
	return data;
}

export function customSignOut() {
	setStoredSession(null);
	window.location.href = "/signin";
}
