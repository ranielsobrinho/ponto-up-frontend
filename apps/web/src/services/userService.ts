import { getAuthToken } from "@/lib/auth-client";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

function getAuthHeader() {
	const token = getAuthToken();
	if (!token) {
		throw new Error("Unauthorized - no token found");
	}
	return {
		Authorization: `Bearer ${token}`,
	};
}

export type UpdateUserProfileData = {
	name: string;
	email: string;
};

export type UpdatePasswordData = {
	currentPassword: string;
	newPassword: string;
};

export async function updateUserProfile(data: UpdateUserProfileData) {
	const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		credentials: "include",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao atualizar perfil";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}

export async function updatePassword(data: UpdatePasswordData) {
	const response = await fetch(`${API_BASE_URL}/api/users/password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		credentials: "include",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		const errorMessage = error.message || "Erro ao atualizar senha";
		const errorWithDetails = new Error(errorMessage);
		(errorWithDetails as Error & { response: typeof error }).response = error;
		throw errorWithDetails;
	}

	return response.json();
}
