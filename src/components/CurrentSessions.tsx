/**
 * CurrentSessions - Preact component for live polling of current sessions
 * Only JavaScript in the project - polls Sessionize every 30 seconds
 */

import { useState, useEffect } from 'preact/hooks';

interface Session {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  room: string;
}

interface SessionsForRoomProps {
  roomName: string;
  allSessions: Session[];
}

const getSessionTime = (session: Session): string => {
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  const formatTime = (date: Date) =>
    `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const getSessionUrl = (sessionId: string): string =>
  `https://cloud-native-days-austria.sessionize.com/session/${sessionId}`;

const Session = ({ session }: { session: Session | undefined }) => {
  if (!session?.id) return null;

  return (
    <div class="session">
      <span class="session-time">{getSessionTime(session)}</span>
      <p class="session-title">
        <a href={getSessionUrl(session.id)}>{session.title}</a>
      </p>
    </div>
  );
};

const SessionsForRoom = ({ roomName, allSessions }: SessionsForRoomProps) => {
  const currentTime = new Date();
  const sessionsOfRoom = allSessions.filter(
    (s) => s.room === roomName && new Date(s.startsAt).getDate() === currentTime.getDate()
  );

  if (sessionsOfRoom.length === 0) return null;

  const currentSession = sessionsOfRoom.find(
    (s) => new Date(s.startsAt) <= currentTime && new Date(s.endsAt) > currentTime
  );

  const nextSession = sessionsOfRoom.find((s) => new Date(s.startsAt) > currentTime);

  return (
    <div class="room-sessions">
      <h3>{roomName}</h3>
      <Session session={currentSession} />
      <Session session={nextSession} />
      {!currentSession && !nextSession && <p>All done for today</p>}
    </div>
  );
};

export default function CurrentSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('https://sessionize.com/api/v2/fetamiym/view/Sessions');
        const data = await response.json();
        const allSessions = data.at(0)?.sessions ?? [];
        setSessions(allSessions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setLoading(false);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const currentDate = new Date().getDate();
  const isAnythingScheduledToday = sessions.some(
    (session) => new Date(session.startsAt).getDate() === currentDate
  );

  if (!isAnythingScheduledToday) {
    return <p>Nothing scheduled today</p>;
  }

  return (
    <div class="rooms-grid">
      <SessionsForRoom roomName="Room 4" allSessions={sessions} />
      <SessionsForRoom roomName="Room 6" allSessions={sessions} />
    </div>
  );
}
