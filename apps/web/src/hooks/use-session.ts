import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "../lib/auth-client";

export function useAuthGuard() {
	const { data: session, isPending } = authClient.useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isPending && !session) {
			navigate({ to: "/signin", replace: true });
		}
	}, [session, isPending, navigate]);

	return { session, isPending };
}
