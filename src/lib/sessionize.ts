/**
 * Sessionize API utilities for fetching speaker and session data
 * API documentation: https://sessionize.com/api-documentation
 */

const SESSIONIZE_API_ID = "7o54a33i";
export const BASE_URL = `https://sessionize.com/api/v2/${SESSIONIZE_API_ID}/view`;

export interface Session {
	id: string;
	title: string;
	description: string;
	startsAt: string;
	endsAt: string;
	isServiceSession: boolean;
	isPlenumSession: boolean;
	speakers: Array<{
		id: string;
		name: string;
	}>;
	categoryItems: number[];
	roomId: number;
	room: string;
	status: string;
}

export interface SessionGroup {
	groupId: number | null;
	groupName: string;
	sessions: Session[];
}

/**
 * Fetch all sessions from Sessionize
 */
export async function fetchSessions(): Promise<SessionGroup[]> {
	try {
		const response = await fetch(`${BASE_URL}/Sessions`);
		if (!response.ok) {
			throw new Error(`Failed to fetch sessions: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching sessions:", error);
		return [];
	}
}

/**
 * Get a flat list of all sessions
 */
export async function fetchAllSessions(): Promise<Session[]> {
	const groups = await fetchSessions();
	return groups.flatMap((group) => group.sessions);
}
