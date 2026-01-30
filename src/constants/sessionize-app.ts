const appBaseUrl = 'https://cloud-native-days-austria.sessionize.com';

export const getSpeakerUrl = (speakerId: string): string => `${appBaseUrl}/speaker/${speakerId}`;

export const getSessionUrl = (sessionId: string): string => `${appBaseUrl}/session/${sessionId}`;

export const scheduleUrl = `${appBaseUrl}/schedule`;
