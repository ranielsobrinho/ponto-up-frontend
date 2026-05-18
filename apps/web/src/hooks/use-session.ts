import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export interface User {
	id: string;
	name: string;
	email: string;
	image?: string;
	role: string;
}

export interface Session {
	user: User;
	expiresAt: string;
}

function getStoredSession(): Session | null {
	const stored = localStorage.getItem("session");
	if (!stored) return null;

	const session: Session = JSON.parse(stored);
	if (new Date(session.expiresAt) < new Date()) {
		localStorage.removeItem("session");
		return null;
	}

	return session;
}

export function useAuthGuard() {
	const [session, setSession] = useState<Session | null>(() =>
		getStoredSession(),
	);
	const [isPending, setIsPending] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const currentSession = getStoredSession();
		setSession(currentSession);
		setIsPending(false);

		if (!currentSession) {
			navigate({ to: "/signin", replace: true });
		}
	}, [navigate]);

	return { session, isPending };
}
