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
    wines.find((w) => w.id === selectedWineId && w.eventId === selectedEventId) ||
    null;

  const currentWineRating =
    selectedEvent && selectedWine && currentTasterName
      ? ratings.find(
          (r) =>
            r.eventId === selectedEvent.id &&
            r.wineId === selectedWine.id &&
            r.tasterName === currentTasterName,
        ) || null
      : null;

  const tastersForEvent = selectedEvent
    ? Array.from(
        new Set(
          ratings
            .filter((r) => r.eventId === selectedEvent.id)
            .map((r) => r.tasterName),
        ),
      )
    : [];

  // ---- Event creation ----

  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  function handleCreateEvent(e: FormEvent) {
    e.preventDefault();
    if (!newEventName.trim()) {
      alert('Please enter a tasting name');
      return;
    }
    const event: TastingEvent = {
      id: createId('evt'),
      name: newEventName.trim(),
      date: newEventDate || '',
    };
    setEvents((prev) => [...prev, event]);
    setNewEventName('');
    setNewEventDate('');
    setSelectedEventId(event.id);
    setView('eventDetail');
  }

  // ---- Wine creation ----

  const [wineForm, setWineForm] = useState({
    name: '',
    vintage: '',
    grape: '',
    region: '',
    producer: '',
    style: 'Red',
  });
  const [wineImageDataUrl, setWineImageDataUrl] = useState<string | undefined>();

  function handleWineFieldChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setWineForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleWineImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setWineImageDataUrl(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setWineImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleAddWine(e: FormEvent) {
    e.preventDefault();
    if (!selectedEvent) return;
    if (!wineForm.name.trim() || !wineForm.vintage.trim()) {
      alert('Please provide at least a name and vintage');
      return;
    }
    const wine: Wine = {
      id: createId('wine'),
      eventId: selectedEvent.id,
      name: wineForm.name.trim(),
      vintage: wineForm.vintage.trim(),
      grape: wineForm.grape.trim(),
      region: wineForm.region.trim(),
      producer: wineForm.producer.trim(),
      style: wineForm.style,
      imageDataUrl: wineImageDataUrl,
    };
    setWines((prev) => [...prev, wine]);
    setWineForm({
      name: '',
      vintage: '',
      grape: '',
      region: '',
      producer: '',
      style: 'Red',
    });
    setWineImageDataUrl(undefined);
    setView('eventDetail');
  }

  // ---- Rating form ----

  const [ratingForm, setRatingForm] = useState({
    overall: 3,
    sweetness: 2,
    acidity: 2,
    tannins: 2,
    body: 2,
    aromaTags: [] as string[],
    notes: '',
  });

  useEffect(() => {
    // When we change wine or taster, load their rating if exists
    if (currentWineRating) {
      setRatingForm({
        overall: currentWineRating.overall,
        sweetness: currentWineRating.sweetness,
        acidity: currentWineRating.acidity,
        tannins: currentWineRating.tannins,
        body: currentWineRating.body,
        aromaTags: currentWineRating.aromaTags,
        notes: currentWineRating.notes,
      });
    } else {
      setRatingForm({
        overall: 3,
        sweetness: 2,
        acidity: 2,
        tannins: 2,
        body: 2,
        aromaTags: [],
        notes: '',
      });
    }
  }, [selectedWineId, currentTasterName, selectedEventId]);

  function handleRatingNumberChange(
    e: ChangeEvent<HTMLInputElement>,
    key:
      | 'overall'
      | 'sweetness'
      | 'acidity'
      | 'tannins'
      | 'body',
  ) {
    const value = Number(e.target.value);
    setRatingForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAromaTag(tag: string) {
    setRatingForm((prev) => {
      const exists = prev.aromaTags.includes(tag);
      if (exists) {
        return { ...prev, aromaTags: prev.aromaTags.filter((t) => t !== tag) };
      }
      return { ...prev, aromaTags: [...prev.aromaTags, tag] };
    });
  }

  function handleNotesChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setRatingForm((prev) => ({ ...prev, notes: e.target.value }));
  }

  function handleSaveRating(e: FormEvent) {
    e.preventDefault();
    if (!selectedEvent || !selectedWine || !currentTasterName.trim()) {
      alert('Missing event, wine or taster name');
      return;
    }
    const base: Omit<Rating, 'id'> = {
      eventId: selectedEvent.id,
      wineId: selectedWine.id,
      tasterName: currentTasterName.trim(),
      overall: ratingForm.overall,
      sweetness: ratingForm.sweetness,
      acidity: ratingForm.acidity,
      tannins: ratingForm.tannins,
      body: ratingForm.body,
      aromaTags: ratingForm.aromaTags,
      notes: ratingForm.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setRatings((prev) => {
      const existingIndex = prev.findIndex(
        (r) =>
          r.eventId === base.eventId &&
          r.wineId === base.wineId &&
          r.tasterName === base.tasterName,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...base };
        return updated;
      }
      return [...prev, { ...base, id: createId('rating') }];
    });
    alert('Rating saved ✅');
  }

  // ---- Simple layout helpers ----

  function goHome() {
    setView('home');
    setSelectedEventId(null);
    setSelectedWineId(null);
    setCurrentTasterName('');
  }

  function openEvent(eventId: string) {
    setSelectedEventId(eventId);
    setView('eventDetail');
  }

  function openAddWine() {
    if (!selectedEvent) return;
    setView('addWine');
  }

  function openSelectTaster() {
    if (!selectedEvent) return;
    setView('selectTaster');
  }

  function startTastingForTaster(name: string) {
    setCurrentTasterName(name.trim());
    setView('tastingWine');
    setSelectedWineId(
      (wines.find((w) => w.eventId === selectedEventId)?.id) || null,
    );
  }

  function openWineInTasting(id: string) {
    setSelectedWineId(id);
    setView('tastingWine');
  }

  // ---- UI ----

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111827',
        padding: '24px',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,system-ui,Segoe UI,Roboto,sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          background: '#f9fafb',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <header
          style={{
            marginBottom: 24,
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              Barcelona Wine Club
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              Simple tasting notebook for small events
            </p>
          </div>
          <button
            onClick={goHome}
            style={{
              borderRadius: 999,
              border: '1px solid #d1d5db',
              background: 'white',
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Home
          </button>
        </header>

        {/* HOME VIEW */}
        {view === 'home' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>Tasting events</h2>
              <button
                onClick={() => setView('createEvent')}
                style={{
                  background: '#7c2d12',
                  color: 'white',
                  border: 'none',
                  borderRadius: 999,
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                + New tasting
              </button>
            </div>
            {events.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 14 }}>
                No events yet. Create your first tasting.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {events.map((evt) => {
                  const winesForEvent = wines.filter(
                    (w) => w.eventId === evt.id,
                  );
                  const ratingsForEvent = ratings.filter(
                    (r) => r.eventId === evt.id,
                  );
                  const uniqueTasters = new Set(
                    ratingsForEvent.map((r) => r.tasterName),
                  );
                  return (
                    <button
                      key={evt.id}
                      onClick={() => openEvent(evt.id)}
                      style={{
                        textAlign: 'left',
                        borderRadius: 12,
                        border: '1px solid #e5e7eb',
                        padding: 12,
                        background: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: '#111827',
                          }}
                        >
                          {evt.name}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#6b7280',
                          }}
                        >
                          {evt.date || 'No date'}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>
                        {winesForEvent.length} wine
                        {winesForEvent.length !== 1 ? 's' : ''} ·{' '}
                        {uniqueTasters.size} taster
                        {uniqueTasters.size !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CREATE EVENT */}
        {view === 'createEvent' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
              Create a new tasting
            </h2>
            <form onSubmit={handleCreateEvent} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>
                  Tasting name
                </label>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="e.g. Priorat Night, Riojas of 2018..."
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Date</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="submit"
                  style={{
                    background: '#7c2d12',
                    color: 'white',
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Create tasting
                </button>
                <button
                  type="button"
                  onClick={goHome}
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EVENT DETAIL */}
        {view === 'eventDetail' && selectedEvent && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>{selectedEvent.name}</h2>
              <button
                onClick={openSelectTaster}
                style={{
                  background: '#92400e',
                  color: 'white',
                  border: 'none',
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Start tasting
              </button>
            </div>
            <p style={{ marginTop: 0, marginBottom: 16, fontSize: 13, color: '#6b7280' }}>
              Date: {selectedEvent.date || 'No date set'}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15 }}>Wines in this tasting</h3>
              <button
                onClick={openAddWine}
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                + Add wine
              </button>
            </div>

            {wines.filter((w) => w.eventId === selectedEvent.id).length === 0 ? (
              <p style={{ fontSize: 13, color: '#6b7280' }}>
                No wines yet. Add your first wine.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                }}
              >
                {wines
                  .filter((w) => w.eventId === selectedEvent.id)
                  .map((wine) => {
                    const wineRatings = ratings.filter(
                      (r) => r.eventId === selectedEvent.id && r.wineId === wine.id,
                    );
                    const avgOverall =
                      wineRatings.length === 0
                        ? null
                        : wineRatings.reduce((sum, r) => sum + r.overall, 0) /
                          wineRatings.length;
                    return (
                      <div
                        key={wine.id}
                        style={{
                          borderRadius: 12,
                          border: '1px solid #e5e7eb',
                          background: 'white',
                          padding: 10,
                          display: 'flex',
                          gap: 8,
                        }}
                      >
                        {wine.imageDataUrl && (
                          <img
                            src={wine.imageDataUrl}
                            alt={wine.name}
                            style={{
                              width: 60,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 8,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: 14,
                                  marginBottom: 2,
                                }}
                              >
                                {wine.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: '#6b7280',
                                }}
                              >
                                {wine.vintage} · {wine.region || 'Region unknown'}
                              </div>
                              {wine.grape && (
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: '#6b7280',
                                  }}
                                >
                                  {wine.grape}
                                </div>
                              )}
                            </div>
                            <div style={{ textAlign: 'right', fontSize: 12 }}>
                              <div
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: 999,
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  marginBottom: 4,
                                }}
                              >
                                {wine.style || 'Wine'}
                              </div>
                              <div style={{ color: '#6b7280' }}>
                                {wineRatings.length} rating
                                {wineRatings.length !== 1 ? 's' : ''}
                              </div>
                              {avgOverall !== null && (
                                <div style={{ fontWeight: 600 }}>
                                  ★ {avgOverall.toFixed(1)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ADD WINE */}
        {view === 'addWine' && selectedEvent && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
              Add a wine to “{selectedEvent.name}”
            </h2>
            <form onSubmit={handleAddWine} style={{ display: 'grid', gap: 12 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={wineForm.name}
                    onChange={handleWineFieldChange}
                    placeholder="Wine name"
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Vintage*</label>
                  <input
                    type="text"
                    name="vintage"
                    value={wineForm.vintage}
                    onChange={handleWineFieldChange}
                    placeholder="e.g. 2018"
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Grape / blend</label>
                  <input
                    type="text"
                    name="grape"
                    value={wineForm.grape}
                    onChange={handleWineFieldChange}
                    placeholder="e.g. Garnacha, Tempranillo..."
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Region</label>
                  <input
                    type="text"
                    name="region"
                    value={wineForm.region}
                    onChange={handleWineFieldChange}
                    placeholder="e.g. Priorat, Rioja..."
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Producer</label>
                  <input
                    type="text"
                    name="producer"
                    value={wineForm.producer}
                    onChange={handleWineFieldChange}
                    placeholder="e.g. Clos Mogador"
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Style</label>
                  <select
                    name="style"
                    value={wineForm.style}
                    onChange={handleWineFieldChange}
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      fontSize: 14,
                      background: 'white',
                    }}
                  >
                    <option>Red</option>
                    <option>White</option>
                    <option>Rosé</option>
                    <option>Sparkling</option>
                    <option>Orange</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block' }}>
                  Wine image (label / bottle)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWineImageChange}
                  style={{ marginTop: 4, fontSize: 13 }}
                />
                {wineImageDataUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={wineImageDataUrl}
                      alt="Preview"
                      style={{
                        height: 120,
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="submit"
                  style={{
                    background: '#7c2d12',
                    color: 'white',
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Save wine
                </button>
                <button
                  type="button"
                  onClick={() => setView('eventDetail')}
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SELECT TASTER */}
        {view === 'selectTaster' && selectedEvent && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
              Who is tasting?
            </h2>
            <p style={{ marginTop: 0, marginBottom: 12, fontSize: 13, color: '#6b7280' }}>
              Enter your name or pick an existing taster for this event.
            </p>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Your name</label>
              <input
                type="text"
                value={currentTasterName}
                onChange={(e) => setCurrentTasterName(e.target.value)}
                placeholder="e.g. Romain"
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                }}
              />
            </div>
            <button
              onClick={() => {
                if (!currentTasterName.trim()) {
                  alert('Please enter your name');
                  return;
                }
                startTastingForTaster(currentTasterName);
              }}
              style={{
                background: '#7c2d12',
                color: 'white',
                border: 'none',
                borderRadius: 999,
                padding: '8px 16px',
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              Start tasting as {currentTasterName || '...'}
            </button>

            {tastersForEvent.length > 0 && (
              <div>
                <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 15 }}>
                  Or continue as:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tastersForEvent.map((name) => (
                    <button
                      key={name}
                      onClick={() => startTastingForTaster(name)}
                      style={{
                        borderRadius: 999,
                        border: '1px solid #d1d5db',
                        background: 'white',
                        padding: '6px 12px',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => setView('eventDetail')}
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Back to event
              </button>
            </div>
          </div>
        )}

        {/* TASTING: RATE ONE WINE */}
        {view === 'tastingWine' && selectedEvent && selectedWine && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 8,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>
                {selectedWine.name} ({selectedWine.vintage})
              </h2>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Taster: <strong>{currentTasterName}</strong>
              </div>
            </div>
            <p style={{ marginTop: 0, marginBottom: 8, fontSize: 13, color: '#6b7280' }}>
              {selectedWine.region || 'Region unknown'} · {selectedWine.grape || 'Grape unknown'}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 16,
              }}
            >
              {selectedWine.imageDataUrl && (
                <img
                  src={selectedWine.imageDataUrl}
                  alt={selectedWine.name}
                  style={{
                    width: 120,
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
                  Other wines in this tasting
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {wines
                    .filter((w) => w.eventId === selectedEvent.id)
                    .map((w) => (
                      <button
                        key={w.id}
                        onClick={() => openWineInTasting(w.id)}
                        style={{
                          borderRadius: 999,
                          border:
                            w.id === selectedWine.id
                              ? '2px solid #7c2d12'
                              : '1px solid #d1d5db',
                          background:
                            w.id === selectedWine.id ? '#fef3c7' : 'white',
                          padding: '6px 12px',
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        {w.name} {w.vintage && `(${w.vintage})`}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveRating} style={{ display: 'grid', gap: 16 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
                  gap: 16,
                }}
              >
                <RatingSlider
                  label="Overall"
                  value={ratingForm.overall}
                  min={1}
                  max={5}
                  onChange={(e) => handleRatingNumberChange(e, 'overall')}
                />
                <RatingSlider
                  label="Sweetness"
                  value={ratingForm.sweetness}
                  min={0}
                  max={5}
                  onChange={(e) => handleRatingNumberChange(e, 'sweetness')}
                />
                <RatingSlider
                  label="Acidity"
                  value={ratingForm.acidity}
                  min={0}
                  max={5}
                  onChange={(e) => handleRatingNumberChange(e, 'acidity')}
                />
                <RatingSlider
                  label="Tannins"
                  value={ratingForm.tannins}
                  min={0}
                  max={5}
                  onChange={(e) => handleRatingNumberChange(e, 'tannins')}
                />
                <RatingSlider
                  label="Body"
                  value={ratingForm.body}
                  min={0}
                  max={5}
                  onChange={(e) => handleRatingNumberChange(e, 'body')}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block' }}>
                  Aromas & flavors
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {allAromaOptions.map((tag) => {
                    const selected = ratingForm.aromaTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleAromaTag(tag)}
                        style={{
                          borderRadius: 999,
                          border: selected
                            ? '1px solid #7c2d12'
                            : '1px solid #d1d5db',
                          background: selected ? '#fef3c7' : 'white',
                          padding: '4px 10px',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block' }}>
                  Notes
                </label>
                <textarea
                  value={ratingForm.notes}
                  onChange={handleNotesChange}
                  placeholder="What did you notice? Aromas, texture, finish..."
                  rows={4}
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  style={{
                    background: '#7c2d12',
                    color: 'white',
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Save rating
                </button>
                <button
                  type="button"
                  onClick={() => setView('selectTaster')}
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Change taster
                </button>
                <button
                  type="button"
                  onClick={() => setView('eventDetail')}
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Back to event
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'tastingWine' && (!selectedEvent || !selectedWine) && (
          <p style={{ color: '#b91c1c' }}>Something is missing. Go back to the event.</p>
        )}
      </div>
    </div>
  );
}

interface RatingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function RatingSlider({ label, value, min, max, onChange }: RatingSliderProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: '#6b7280' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
