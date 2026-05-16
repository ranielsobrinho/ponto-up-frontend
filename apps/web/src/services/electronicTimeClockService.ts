import { getAuthToken } from "@/lib/auth-client";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export type CreatePointFormData = {
	clockIn: string;
	clockOut: string;
	title: string;
	observation: string;
};

export type UpdatePointFormData = {
	clockIn?: string;
	clockOut?: string;
	title?: string;
	observation?: string;
};

function getAuthHeader() {
	const token = getAuthToken();
	if (!token) {
		throw new Error("Unauthorized - no token found");
	}
	return {
		Authorization: `Bearer ${token}`,
	};
}

function getDateRangeForCurrentMonth() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();

	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	return {
		startDate: firstDay.toISOString().split("T")[0],
		endDate: lastDay.toISOString().split("T")[0],
	};
}

export async function createClockIn(data: CreatePointFormData) {
	const now = new Date();
	const datePart = now.toISOString().split("T")[0];

	const payload = {
		title: data.title,
		clockIn: `${datePart}T${data.clockIn}`,
		clockOut: `${datePart}T${data.clockOut}`,
		observations: data.observation,
	};

	const response = await fetch(`${API_BASE_URL}/api/time-clock`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		credentials: "include",
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao cadastrar ponto";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}

export async function getTimeClocksByDateRange(
	startDate: string,
	endDate: string,
) {
	const response = await fetch(
		`${API_BASE_URL}/api/time-clock?startDate=${startDate}&endDate=${endDate}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeader(),
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao buscar pontos";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}

export async function getCurrentMonthTimeClocks() {
	const { startDate, endDate } = getDateRangeForCurrentMonth();
	return getTimeClocksByDateRange(startDate, endDate);
}

export async function getTimeClocksByUserId(userId: string) {
	const response = await fetch(
		`${API_BASE_URL}/api/time-clock/user/${userId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeader(),
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao buscar pontos do usuário";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}

export async function getTimeClockById(id: string) {
	const response = await fetch(`${API_BASE_URL}/api/time-clock/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao buscar ponto";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}

export async function updateTimeClock(id: string, data: UpdatePointFormData) {
	const payload: Record<string, unknown> = {};

	if (data.title !== undefined) payload.title = data.title;
	if (data.observation !== undefined) payload.observations = data.observation;
	if (data.clockIn !== undefined) {
		const datePart = new Date().toISOString().split("T")[0];
		payload.clockIn = `${datePart}T${data.clockIn}`;
	}
	if (data.clockOut !== undefined) {
		const datePart = new Date().toISOString().split("T")[0];
		payload.clockOut = `${datePart}T${data.clockOut}`;
	}

	const response = await fetch(`${API_BASE_URL}/api/time-clock/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		credentials: "include",
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao atualizar ponto";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}
