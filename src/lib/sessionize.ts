/**
 * Sessionize API utilities for fetching speaker and session data
 * API documentation: https://sessionize.com/api-documentation
 */

const SESSIONIZE_API_ID = "fetamiym";
const BASE_URL = `https://sessionize.com/api/v2/${SESSIONIZE_API_ID}/view`;

export interface Speaker {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	bio: string;
	tagLine: string;
	profilePicture: string;
	isTopSpeaker: boolean;
	links: Array<{
		title: string;
		url: string;
		linkType: string;
	}>;
	sessions: Array<{
		id: number;
		name: string;
	}>;
	categoryItems: number[];
}

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
 * Fetch all speakers from Sessionize API
 */
export async function fetchSpeakers(): Promise<Speaker[]> {
	try {
		const response = await fetch(`${BASE_URL}/Speakers`);
		if (!response.ok) {
			throw new Error(`Failed to fetch speakers: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching speakers:", error);
		return [];
	}
}

/**
 * Fetch keynote speakers (marked as "Top Speaker" in Sessionize)
 */
export async function fetchKeynoteSpeakers(): Promise<Speaker[]> {
	const speakers = await fetchSpeakers();
	return speakers.filter((speaker) => speaker.isTopSpeaker);
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

/**
 * Sessionize URL helpers
 */
export const sessionizeUrls = {
	speaker: (speakerId: string) =>
		`https://cloud-native-days-austria.sessionize.com/speaker/${speakerId}`,
	session: (sessionId: string) =>
		`https://cloud-native-days-austria.sessionize.com/session/${sessionId}`,
	schedule: "https://cloud-native-days-austria.sessionize.com/schedule",
};
