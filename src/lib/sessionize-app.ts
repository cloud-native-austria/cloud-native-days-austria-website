export const sessionizeAppBaseUrl = "https://cloud-native-days-austria-2026.sessionize.com";

export const getSpeakerUrl = (speakerId: string): string =>
	`${sessionizeAppBaseUrl}/speaker/${speakerId}`;

export const getSessionUrl = (sessionId: string): string => {
	// return `${sessionizeAppBaseUrl}/session/${sessionId}`;
	return `/sessions#session-${sessionId}`;
};

export const scheduleUrl = `${sessionizeAppBaseUrl}/schedule`;
