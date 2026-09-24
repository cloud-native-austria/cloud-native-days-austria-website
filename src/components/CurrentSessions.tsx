/**
 * CurrentSessions - Preact component for live polling of current sessions
 * Only JavaScript in the project - polls Sessionize every 30 seconds
 */

import { fetchAllSessions, fetchSpeakers, type Session, type Speaker } from "@lib/sessionize";
import { getSessionUrl } from "@lib/sessionize-app";
import { useState, useEffect } from "preact/hooks";

// Pass ?fakeDate=YYYY-MM-DDTHH:MM in the URL to simulate a specific point in time.
const getNow = (): Date => {
	const param = new URLSearchParams(window.location.search).get("fakeDate");
	return param ? new Date(param) : new Date();
};

const ROOMS = ["Room 4", "Room 6"];

const formatTime = (date: Date) =>
	`${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

const SessionCard = ({
	session,
	label,
	currentTime,
	speakersById,
}: {
	session: Session | undefined;
	label: string;
	currentTime: Date;
	speakersById: Map<string, Speaker>;
}) => {
	if (!session?.id) return <div />;

	const start = new Date(session.startsAt);
	const end = new Date(session.endsAt);
	const progress = label === "Right now"
		? Math.min(100, Math.max(0, ((currentTime.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100))
		: 0;

	const sessionSpeakers = session.speakers
		.map((s) => speakersById.get(s.id))
		.filter((s): s is Speaker => !!s);

	return (
		<div class="session">
			<span class="session-label">{label}</span>
			<div class="session-timing">
				<span class="session-time">{formatTime(start)}</span>
				<div
					class="session-progress"
					role="progressbar"
					aria-valuenow={Math.round(progress)}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div class="session-progress-bar" style={`width: ${progress}%`} />
				</div>
				<span class="session-time">{formatTime(end)}</span>
			</div>
			{sessionSpeakers.length > 0 && (
				<div class="session-speakers">
					{sessionSpeakers.map((speaker) => (
						<img
							key={speaker.id}
							src={speaker.profilePicture}
							alt={speaker.fullName}
							class="heptagon session-speaker-img"
							width={40}
							height={40}
						/>
					))}
				</div>
			)}
			{session.description ? (
				<details class="session-details">
					<summary class="session-title">{session.title}</summary>
					<p class="session-description">{session.description}</p>
				</details>
			) : (
				<p class="session-title">{session.title}</p>
			)}
			{session.topics.length > 0 && (
				<ul class="session-meta" aria-label="Session topics">
					{session.topics.map((topic) => (
						<li key={topic}>{topic}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default function CurrentSessions() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [speakersById, setSpeakersById] = useState<Map<string, Speaker>>(new Map());
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [allSessions, allSpeakers] = await Promise.all([
					fetchAllSessions(),
					fetchSpeakers(),
				]);
				setSessions(allSessions);
				setSpeakersById(new Map(allSpeakers.map((s) => [s.id, s])));
				setLoading(false);
			} catch (error) {
				console.error("Error fetching sessions:", error);
				setLoading(false);
			}
		};

		loadData();
		const interval = setInterval(loadData, 30000);

		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return <p>Loading...</p>;
	}

	const currentTime = getNow();

	const roomData = ROOMS.map((room) => {
		const roomSessions = sessions.filter(
			(s) => s.room === room && new Date(s.startsAt).getDate() === currentTime.getDate(),
		);
		const current = roomSessions.find(
			(s) => new Date(s.startsAt) <= currentTime && new Date(s.endsAt) > currentTime,
		);
		const next = roomSessions.find((s) => new Date(s.startsAt) > currentTime);
		return { room, current, next, hasAny: roomSessions.length > 0 };
	});

	if (!roomData.some((r) => r.hasAny)) {
		return <p>Nothing scheduled today</p>;
	}

	const hasAnyCurrent = roomData.some((r) => r.current);
	const hasAnyNext = roomData.some((r) => r.next);

	if (!hasAnyCurrent && !hasAnyNext) {
		return <p>All done for today</p>;
	}

	return (
		<div class="rooms-grid">
			{roomData.map(({ room }) => (
				<h3 key={room} class="room-name">{room}</h3>
			))}
			{hasAnyCurrent && roomData.map(({ room, current }) => (
				<SessionCard
					key={`${room}-current`}
					session={current}
					label="Right now"
					currentTime={currentTime}
					speakersById={speakersById}
				/>
			))}
			{hasAnyNext && roomData.map(({ room, next }) => (
				<SessionCard
					key={`${room}-next`}
					session={next}
					label="Up next"
					currentTime={currentTime}
					speakersById={speakersById}
				/>
			))}
		</div>
	);
}
