import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

type View =
  | 'home'
  | 'createEvent'
  | 'eventDetail'
  | 'addWine'
  | 'selectTaster'
  | 'tastingWine';

interface TastingEvent {
  id: string;
  name: string;
  date: string;
}

interface Wine {
  id: string;
  eventId: string;
  name: string;
  vintage: string;
  grape: string;
  region: string;
  producer: string;
  style: string;
  imageDataUrl?: string;
}

interface Rating {
  id: string;
  eventId: string;
  wineId: string;
  tasterName: string;
  overall: number;
  sweetness: number;
  acidity: number;
  tannins: number;
  body: number;
  aromaTags: string[];
  notes: string;
  createdAt: string;
}

interface AppData {
  events: TastingEvent[];
  wines: Wine[];
  ratings: Rating[];
}

const STORAGE_KEY = 'barcelona-wine-club:v1';

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

const allAromaOptions = [
  'Fruity',
  'Floral',
  'Spicy',
  'Oaky',
  'Mineral',
  'Herbal',
  'Earthy',
  'Citrus',
  'Berries',
];

export default function App() {
  const [view, setView] = useState<View>('home');
  const [events, setEvents] = useState<TastingEvent[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null);
  const [currentTasterName, setCurrentTasterName] = useState('');

  // ---- Load & save from localStorage ----

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AppData>;
      if (parsed.events) setEvents(parsed.events);
      if (parsed.wines) setWines(parsed.wines);
      if (parsed.ratings) setRatings(parsed.ratings);
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    }
  }, []);

  useEffect(() => {
    const data: AppData = { events, wines, ratings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  }, [events, wines, ratings]);

  // ---- Derived selections ----

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;
  const selectedWine =
    wines.find((w) => w.id === sel
