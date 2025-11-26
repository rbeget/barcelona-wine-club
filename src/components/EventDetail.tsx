import { ArrowLeft, Calendar, Wine as WineIcon, MapPin, Plus } from 'lucide-react';
import type { Event, Wine } from '../App';

interface EventDetailProps {
  event: Event;
  wines: Wine[];
  onBack: () => void;
  onAddWineClick: () => void;
  onWineClick: (wineId: string) => void;
}

export function EventDetail({ event, wines, onBack, onAddWineClick, onWineClick }: EventDetailProps) {
  const eventWines = wines.filter(w => w.eventId === event.id);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
        style={{ color: '#681E2F' }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Event Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: '2px solid #D4AF37' }}>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#681E2F' }}>
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 style={{ color: '#681E2F' }}>{event.title}</h2>
            <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="pt-4" style={{ borderTop: '1px solid #D4AF37' }}>
          <div className="flex items-center gap-2">
            <WineIcon className="w-5 h-5" style={{ color: '#007C89' }} />
            <span style={{ color: '#681E2F' }}>
              {eventWines.length} {eventWines.length === 1 ? 'Wine' : 'Wines'}
            </span>
          </div>
        </div>
      </div>

      {/* Wines List */}
      <div className="space-y-3">
        <h3 style={{ color: '#681E2F' }}>Wines in this Event</h3>
        
        {eventWines.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md" style={{ border: '2px solid #D4AF37' }}>
            <WineIcon className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: '#681E2F' }} />
            <p className="text-sm" style={{ color: '#4A4A4A' }}>No wines added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {eventWines.map(wine => (
              <div
                key={wine.id}
                className="bg-white rounded-xl p-4 shadow-sm"
                style={{ border: '2px solid #D4AF37' }}
                onClick={() => onWineClick(wine.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
                    <WineIcon className="w-6 h-6" style={{ color: '#681E2F' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 style={{ color: '#681E2F' }}>{wine.name}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm" style={{ color: '#4A4A4A' }}>
                        <strong style={{ color: '#007C89' }}>Vintage:</strong> {wine.vintage}
                      </p>
                      <p className="text-sm" style={{ color: '#4A4A4A' }}>
                        <strong style={{ color: '#007C89' }}>Varietal:</strong> {wine.varietal}
                      </p>
                      <p className="text-sm" style={{ color: '#4A4A4A' }}>
                        <strong style={{ color: '#007C89' }}>Producer:</strong> {wine.producer}
                      </p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#007C89' }} />
                        <p className="text-sm" style={{ color: '#4A4A4A' }}>{wine.region}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Wine Button */}
        <button
          onClick={onAddWineClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
          style={{ color: '#681E2F' }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Wine</span>
        </button>
      </div>
    </div>
  );
}