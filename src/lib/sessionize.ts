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
	topics: string[];
}

export interface Speaker {
	id: string;
	fullName: string;
	profilePicture: string;
}

export interface SessionGroup {
	groupId: number | null;
	groupName: string;
	sessions: Session[];
}

function extractTopics(categories: Array<Record<string, unknown>>): string[] {
	const topicCategory = categories.find((c) => c.name === "Topic(s)");
	if (!topicCategory || !Array.isArray(topicCategory.categoryItems)) return [];
	return (topicCategory.categoryItems as Array<Record<string, unknown>>).map((item) =>
		String(item.name ?? ""),
	);
}

export async function fetchAllSessions(): Promise<Session[]> {
	try {
		const response = await fetch(`${BASE_URL}/Sessions`);
		if (!response.ok) {
			throw new Error(`Failed to fetch sessions: ${response.status}`);
		}
		const groups = (await response.json()) as Array<Record<string, unknown>>;
		return groups.flatMap((group) => {
			const groupSessions = Array.isArray(group.sessions) ? group.sessions : [];
			return (groupSessions as Array<Record<string, unknown>>).map((s) => ({
				id: String(s.id ?? ""),
				title: String(s.title ?? ""),
				description: String(s.description ?? ""),
				startsAt: String(s.startsAt ?? ""),
				endsAt: String(s.endsAt ?? ""),
				isServiceSession: s.isServiceSession === true,
				isPlenumSession: s.isPlenumSession === true,
				speakers: Array.isArray(s.speakers)
					? (s.speakers as Array<Record<string, unknown>>).map((sp) => ({
							id: String(sp.id ?? ""),
							name: String(sp.name ?? ""),
						}))
					: [],
				categoryItems: Array.isArray(s.categoryItems) ? (s.categoryItems as number[]) : [],
				roomId: Number(s.roomId ?? 0),
				room: String(s.room ?? ""),
				status: String(s.status ?? ""),
				topics: extractTopics(
					Array.isArray(s.categories) ? (s.categories as Array<Record<string, unknown>>) : [],
				),
			}));
		});
	} catch (error) {
		console.error("Error fetching sessions:", error);
		return [];
	}
}

export async function fetchSpeakers(): Promise<Speaker[]> {
	try {
		const response = await fetch(`${BASE_URL}/Speakers`);
		if (!response.ok) {
			throw new Error(`Failed to fetch speakers: ${response.status}`);
		}
		const data = (await response.json()) as Array<Record<string, unknown>>;
		return data.map((s) => ({
			id: String(s.id ?? ""),
			fullName: String(s.fullName ?? ""),
			profilePicture: String(s.profilePicture ?? ""),
		}));
	} catch (error) {
		console.error("Error fetching speakers:", error);
		return [];
	}
}
