import { useState } from 'react';
import { EventCreation } from './components/EventCreation';
import { Homepage } from './components/Homepage';
import { EventDetail } from './components/EventDetail';
import { WineDetail } from './components/WineDetail';
import { AddWine } from './components/AddWine';
import { RateWine } from './components/RateWine';
import { Menu, X, Calendar, Home } from 'lucide-react';
import logo from './assets/8c9f82209a149b0ba432ea5d8a40ee8de2bb30a6.png';

export interface Event {
  id: string;
  title: string;
  date: string;
}

export interface Wine {
  id: string;
  eventId: string;
  name: string;
  vintage: string;
  varietal: string;
  region: string;
  producer: string;
}

export interface Rating {
  id: string;
  wineId: string;
  wineName: string;
  eventId: string;
  appearance: number;
  aroma: number;
  taste: number;
  finish: number;
  overall: number;
  notes: string;
  date: string;
}

type AppView = 'homepage' | 'eventCreation' | 'eventDetail' | 'wineDetail' | 'addWine' | 'rateWine';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('homepage');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null);
  
  // Initialize with dummy data
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Priorat Treasures',
      date: '2025-12-15'
    }
  ]);
  const [wines, setWines] = useState<Wine[]>([
    {
      id: '1',
      eventId: '1',
      name: 'Clos Mogador',
      vintage: '2018',
      varietal: 'Garnacha, Cariñena, Syrah',
      region: 'Priorat, Catalonia',
      producer: 'Clos Mogador'
    }
  ]);
  const [ratings, setRatings] = useState<Rating[]>([
    {
      id: '1',
      wineId: '1',
      wineName: 'Clos Mogador',
      eventId: '1',
      appearance: 4.5,
      aroma: 4.8,
      taste: 4.7,
      finish: 4.6,
      overall: 4.7,
      notes: 'Complex nose with dark fruit, mineral notes, and hints of Mediterranean herbs. Rich and elegant on the palate with well-integrated tannins and a long, memorable finish.',
      date: '2025-11-20'
    }
  ]);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
    setCurrentView('homepage');
  };

  const addWine = (wine: Wine) => {
    setWines([...wines, wine]);
  };

  const addRating = (rating: Rating) => {
    setRatings([...ratings, rating]);
  };

  const updateRating = (updatedRating: Rating) => {
    setRatings(ratings.map(r => r.id === updatedRating.id ? updatedRating : r));
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('eventDetail');
  };

  const handleWineClick = (wineId: string) => {
    setSelectedWineId(wineId);
    setCurrentView('wineDetail');
  };

  const handleAddWineClick = () => {
    setCurrentView('addWine');
  };

  const handleRateWineClick = () => {
    setCurrentView('rateWine');
  };

  const handleBackToHomepage = () => {
    setCurrentView('homepage');
    setSelectedEventId(null);
    setSelectedWineId(null);
  };

  const handleBackToEventDetail = () => {
    setCurrentView('eventDetail');
    setSelectedWineId(null);
  };

  const handleBackToWineDetail = () => {
    setCurrentView('wineDetail');
  };

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : undefined;
  const selectedWine = selectedWineId ? wines.find(w => w.id === selectedWineId) : undefined;
  const selectedWineRating = selectedWineId ? ratings.find(r => r.wineId === selectedWineId) : undefined;
  const selectedWineEvent = selectedWine ? events.find(e => e.id === selectedWine.eventId) : undefined;

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      {/* Mobile Phone Frame */}
      <div className="w-full max-w-[380px] h-[812px] bg-black rounded-[3rem] p-3 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
          {/* App Content */}
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F8F4E3' }}>
            {/* Header */}
            <header className="text-white relative" style={{ backgroundColor: '#681E2F' }}>
              <div className="px-4 py-6">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="absolute left-4 top-6 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  {menuOpen ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Menu className="w-6 h-6 text-white" />
                  )}
                </button>
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <img 
                      src={logo} 
                      alt="Barcelona Wine Tasting Club" 
                      className="h-16 w-auto object-contain rounded-2xl"
                    />
                  </div>
                  <h1 className="text-white">Barcelona Wine Tasting Club</h1>
                </div>
              </div>
            </header>

            {/* Sliding Menu */}
            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div 
                  className="fixed top-0 left-0 bottom-0 w-64 z-50 shadow-2xl"
                  style={{ backgroundColor: '#681E2F' }}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white">Menu</h3>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleBackToHomepage();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D4AF37' }}>
                        <Home className="w-5 h-5" style={{ color: '#681E2F' }} />
                      </div>
                      <span>Homepage</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setCurrentView('eventCreation');
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D4AF37' }}>
                        <Calendar className="w-5 h-5" style={{ color: '#681E2F' }} />
                      </div>
                      <span>Create Event</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Content */}
            <main className="px-4 py-6 pb-8">
              {currentView === 'homepage' && (
                <Homepage 
                  events={events}
                  wines={wines}
                  ratings={ratings}
                  onNavigate={() => {}}
                  onEventClick={handleEventClick}
                  onWineClick={handleWineClick}
                />
              )}

              {currentView === 'eventCreation' && (
                <EventCreation 
                  onAddEvent={addEvent}
                  onBack={handleBackToHomepage}
                />
              )}

              {currentView === 'eventDetail' && selectedEvent && (
                <EventDetail 
                  event={selectedEvent}
                  wines={wines}
                  onBack={handleBackToHomepage}
                  onAddWineClick={handleAddWineClick}
                  onWineClick={handleWineClick}
                />
              )}

              {currentView === 'wineDetail' && selectedWine && (
                <WineDetail 
                  wine={selectedWine}
                  event={selectedWineEvent}
                  rating={selectedWineRating}
                  onBack={handleBackToHomepage}
                  onRateClick={handleRateWineClick}
                />
              )}

              {currentView === 'addWine' && selectedEvent && (
                <AddWine 
                  event={selectedEvent}
                  onAddWine={addWine}
                  onBack={handleBackToEventDetail}
                />
              )}

              {currentView === 'rateWine' && selectedWine && (
                <RateWine 
                  wine={selectedWine}
                  existingRating={selectedWineRating}
                  onAddRating={addRating}
                  onUpdateRating={updateRating}
                  onBack={handleBackToWineDetail}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
