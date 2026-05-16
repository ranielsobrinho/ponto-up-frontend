import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export interface User {
	name: string;
	email: string;
	image?: string;
}

export interface Session {
	user: User;
	expiresAt: string;
}

function getStoredSession(): Session | null {
	const stored = localStorage.getItem("session");
	return stored ? JSON.parse(stored) : null;
}

function setStoredSession(session: Session | null): void {
	if (session) {
		localStorage.setItem("session", JSON.stringify(session));
	} else {
		localStorage.removeItem("session");
	}
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
	console.log("Olha o data =>", data);
	const now = new Date();
	now.setHours(now.getHours() + 1);

	// FIX: error on setting session data
	const session: Session = {
		user: {
			name: data.user?.name || email.split("@")[0],
			email: data.user?.email || email,
		},
		expiresAt: data.session?.expiresAt || now,
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
		},
		expiresAt: data.expiresAt,
	};

	setStoredSession(session);
	return data;
}

export function customSignOut() {
	setStoredSession(null);
	window.location.href = "/signin";
}
