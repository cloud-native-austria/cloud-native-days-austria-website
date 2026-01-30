/**
 * Sessionize API utilities for fetching speaker and session data
 * API documentation: https://sessionize.com/api-documentation
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SESSIONIZE_API_ID = 'fetamiym';
const BASE_URL = `https://sessionize.com/api/v2/${SESSIONIZE_API_ID}/view`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const SPEAKERS_IMAGE_DIR = path.join(PUBLIC_DIR, 'images/speakers');
const CACHE_DIR = path.join(PUBLIC_DIR, 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'speakers-cache.json');

export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  tagLine: string;
  profilePicture: string;
  localProfilePicture: string; // Local cached image path
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
 * Download an image from URL and save it locally
 */
async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Cache speakers data with local images
 */
export async function cacheSpeakersData(): Promise<void> {
  console.log('📥 Fetching speakers from Sessionize...');

  try {
    const response = await fetch(`${BASE_URL}/Speakers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch speakers: ${response.status}`);
    }
    const speakers: Speaker[] = await response.json();

    // Ensure directories exist
    ensureDir(SPEAKERS_IMAGE_DIR);
    ensureDir(CACHE_DIR);

    console.log(`📸 Downloading ${speakers.length} speaker images...`);

    // Download images and update local paths
    const speakersWithLocalImages = await Promise.all(
      speakers.map(async (speaker) => {
        const ext = speaker.profilePicture.split('.').pop()?.split('?')[0] || 'jpg';
        const filename = `${speaker.id}.${ext}`;
        const filepath = path.join(SPEAKERS_IMAGE_DIR, filename);
        const localPath = `/images/speakers/${filename}`;

        // Download image
        await downloadImage(speaker.profilePicture, filepath);

        return {
          ...speaker,
          localProfilePicture: localPath,
        };
      })
    );

    // Save cached data
    fs.writeFileSync(CACHE_FILE, JSON.stringify(speakersWithLocalImages, null, 2));
    console.log(`✅ Successfully cached ${speakersWithLocalImages.length} speakers`);
  } catch (error) {
    console.error('❌ Error caching speakers data:', error);
    throw error;
  }
}

/**
 * Fetch all speakers from Sessionize (uses local cache if available)
 */
export async function fetchSpeakers(): Promise<Speaker[]> {
  // Read from cache - cache must exist (created by prebuild script)
  if (!fs.existsSync(CACHE_FILE)) {
    throw new Error(
      'Speaker cache not found. Please run: bun run scripts/cache-sessionize.ts'
    );
  }

  try {
    const cached = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading speaker cache:', error);
    throw error;
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
    console.error('Error fetching sessions:', error);
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
  schedule: 'https://cloud-native-days-austria.sessionize.com/schedule',
};
