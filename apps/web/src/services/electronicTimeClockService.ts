import { getAuthToken } from "@/lib/auth-client";
import { getAllUsers } from "./userService";

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
	date?: string;
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

function normalizeTime(time: string): string {
	const parts = time.split(":");
	if (parts.length === 2) {
		return `${parts[0]}:${parts[1]}:00`;
	}
	return time;
}

export async function updateTimeClock(id: string, data: UpdatePointFormData) {
	const payload: Record<string, unknown> = {};

	if (data.title !== undefined) payload.title = data.title;
	if (data.observation !== undefined) payload.observations = data.observation;
	if (data.clockIn !== undefined) {
		const datePart = data.date || new Date().toISOString().split("T")[0];
		payload.clockIn = `${datePart}T${normalizeTime(data.clockIn)}`;
	}
	if (data.clockOut !== undefined) {
		const datePart = data.date || new Date().toISOString().split("T")[0];
		payload.clockOut = `${datePart}T${normalizeTime(data.clockOut)}`;
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

export interface UserStatistics {
	userId: string;
	userName: string;
	monthHours: number;
	weekHours: number;
	missingHours: number;
	hasClockedInToday: boolean;
}

function getWeekRange() {
	const now = new Date();
	const dayOfWeek = now.getDay();
	const monday = new Date(now);
	monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
	monday.setHours(0, 0, 0, 0);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	return {
		startDate: monday.toISOString().split("T")[0],
		endDate: sunday.toISOString().split("T")[0],
	};
}

export function calculateWorkedHours(
	clockIn: string,
	clockOut: string,
): number {
	if (!clockIn || !clockOut) return 0;
	const start = new Date(clockIn);
	const end = new Date(clockOut);
	const diff = end.getTime() - start.getTime();
	return diff / (1000 * 60 * 60);
}

function getExpectedMonthlyHours(): number {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const workDays = Array.from({ length: daysInMonth }, (_, i) => {
		const day = new Date(year, month, i + 1).getDay();
		return day !== 0 && day !== 6;
	}).filter(Boolean).length;

	return workDays * 8;
}

export async function getAllUsersStatistics(): Promise<UserStatistics[]> {
	const users = await getAllUsers();
	const { startDate, endDate } = getDateRangeForCurrentMonth();
	const weekRange = getWeekRange();

	const monthClocks = await getTimeClocksByDateRange(startDate, endDate);
	const weekClocks = await getTimeClocksByDateRange(
		weekRange.startDate,
		weekRange.endDate,
	);

	const today = new Date().toISOString().split("T")[0];

	return users.map((user: { id: string; name: string }) => {
		const userMonthClocks = (Array.isArray(monthClocks) ? monthClocks : [])
			.filter(
				(c: Record<string, string>) =>
					c.userId === user.id || c.user_id === user.id,
			)
			.filter((c: Record<string, string>) => c.clockIn && c.clockOut);

		const userWeekClocks = (Array.isArray(weekClocks) ? weekClocks : [])
			.filter(
				(c: Record<string, string>) =>
					c.userId === user.id || c.user_id === user.id,
			)
			.filter((c: Record<string, string>) => c.clockIn && c.clockOut);

		const monthHours = userMonthClocks.reduce(
			(total: number, c: Record<string, string>) =>
				total + calculateWorkedHours(c.clockIn, c.clockOut),
			0,
		);

		const weekHours = userWeekClocks.reduce(
			(total: number, c: Record<string, string>) =>
				total + calculateWorkedHours(c.clockIn, c.clockOut),
			0,
		);

		const hasClockedInToday = userMonthClocks.some(
			(c: Record<string, string>) => c.clockIn.startsWith(today),
		);

		const expectedMonthHours = getExpectedMonthlyHours();
		const missingHours = Math.max(0, expectedMonthHours - monthHours);

		return {
			userId: user.id,
			userName: user.name,
			monthHours: Math.round(monthHours * 10) / 10,
			weekHours: Math.round(weekHours * 10) / 10,
			missingHours: Math.round(missingHours * 10) / 10,
			hasClockedInToday,
		};
	});
}
