import { Wine, Calendar, Star } from 'lucide-react';
import type { Event, Wine as WineType, Rating } from '../App';
import { useState } from 'react';

interface HomepageProps {
  events: Event[];
  wines: WineType[];
  ratings: Rating[];
  onNavigate: () => void;
  onEventClick: (eventId: string) => void;
  onWineClick: (wineId: string) => void;
}

export function Homepage({ events, wines, ratings, onNavigate, onEventClick, onWineClick }: HomepageProps) {
  const [activeSection, setActiveSection] = useState<'events' | 'cellar'>('events');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastEvents = events.filter(event => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getWineRating = (wineId: string) => {
    return ratings.find(r => r.wineId === wineId);
  };

  const getEventForWine = (eventId: string) => {
    return events.find(e => e.id === eventId);
  };

  const ratedWines = wines.filter(wine => getWineRating(wine.id));
  const unratedWines = wines.filter(wine => !getWineRating(wine.id));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 style={{ color: '#681E2F' }}>Welcome</h2>
      </div>

      {/* Toggle between sections */}
      <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setActiveSection('events')}
          className={`flex-1 px-4 py-3 rounded-lg transition-all ${
            activeSection === 'events'
              ? 'text-white shadow-md'
              : 'hover:bg-stone-50'
          }`}
          style={activeSection === 'events' ? { 
            backgroundColor: '#007C89'
          } : { 
            color: '#4A4A4A' 
          }}
        >
          Wine Events
        </button>
        <button
          onClick={() => setActiveSection('cellar')}
          className={`flex-1 px-4 py-3 rounded-lg transition-all ${
            activeSection === 'cellar'
              ? 'text-white shadow-md'
              : 'hover:bg-stone-50'
          }`}
          style={activeSection === 'cellar' ? { 
            backgroundColor: '#007C89'
          } : { 
            color: '#4A4A4A' 
          }}
        >
          Wine Cellar
        </button>
      </div>

      {/* Wine Events Section */}
      {activeSection === 'events' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 style={{ color: '#681E2F' }}>Wine Events</h3>
            <Calendar className="w-5 h-5" style={{ color: '#007C89' }} />
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md" style={{ border: '2px solid #D4AF37' }}>
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: '#681E2F' }} />
              <p className="text-sm" style={{ color: '#4A4A4A' }}>No events yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div>
                  <p className="text-xs mb-2 px-1" style={{ color: '#007C89' }}>UPCOMING</p>
                  <div className="space-y-2">
                    {upcomingEvents.map(event => {
                      const eventWines = wines.filter(w => w.eventId === event.id);
                      return (
                        <button
                          key={event.id}
                          onClick={() => onEventClick(event.id)}
                          className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left"
                          style={{ border: '2px solid #D4AF37' }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="truncate" style={{ color: '#681E2F' }}>{event.title}</h4>
                              <p className="text-xs mt-0.5" style={{ color: '#4A4A4A' }}>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div style={{ color: '#007C89' }}>{eventWines.length}</div>
                              <div className="text-xs" style={{ color: '#4A4A4A' }}>wines</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <p className="text-xs mb-2 px-1" style={{ color: '#4A4A4A' }}>PAST</p>
                  <div className="space-y-2">
                    {pastEvents.map(event => {
                      const eventWines = wines.filter(w => w.eventId === event.id);
                      return (
                        <button
                          key={event.id}
                          onClick={() => onEventClick(event.id)}
                          className="w-full bg-white rounded-xl p-4 shadow-sm opacity-75 hover:opacity-100 hover:shadow-md transition-all text-left"
                          style={{ border: '1px solid #D4AF37' }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="truncate" style={{ color: '#681E2F' }}>{event.title}</h4>
                              <p className="text-xs mt-0.5" style={{ color: '#4A4A4A' }}>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div style={{ color: '#4A4A4A' }}>{eventWines.length}</div>
                              <div className="text-xs" style={{ color: '#4A4A4A' }}>wines</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Wine Cellar Section */}
      {activeSection === 'cellar' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 style={{ color: '#681E2F' }}>Wine Cellar</h3>
            <Wine className="w-5 h-5" style={{ color: '#007C89' }} />
          </div>

          {wines.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md" style={{ border: '2px solid #D4AF37' }}>
              <Wine className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: '#681E2F' }} />
              <p className="text-sm" style={{ color: '#4A4A4A' }}>No wines in cellar yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Rated Wines */}
              {ratedWines.length > 0 && (
                <div>
                  <p className="text-xs mb-2 px-1" style={{ color: '#007C89' }}>TASTED & RATED</p>
                  <div className="space-y-2">
                    {ratedWines.map(wine => {
                      const rating = getWineRating(wine.id);
                      const event = getEventForWine(wine.eventId);
                      return (
                        <button
                          key={wine.id}
                          onClick={() => onWineClick(wine.id)}
                          className="w-full bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-left"
                          style={{ border: '2px solid #D4AF37' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
                              <Wine className="w-5 h-5" style={{ color: '#681E2F' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm truncate" style={{ color: '#681E2F' }}>{wine.name}</h4>
                              <p className="text-xs" style={{ color: '#4A4A4A' }}>
                                {wine.vintage} • {wine.varietal}
                              </p>
                              {event && (
                                <p className="text-xs mt-0.5" style={{ color: '#007C89' }}>
                                  {event.title}
                                </p>
                              )}
                            </div>
                            {rating && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Star className="w-4 h-4 fill-current" style={{ color: '#D4AF37' }} />
                                <span className="text-sm" style={{ color: '#681E2F' }}>
                                  {rating.overall.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unrated Wines */}
              {unratedWines.length > 0 && (
                <div>
                  <p className="text-xs mb-2 px-1" style={{ color: '#4A4A4A' }}>TO BE TASTED</p>
                  <div className="space-y-2">
                    {unratedWines.map(wine => {
                      const event = getEventForWine(wine.eventId);
                      return (
                        <button
                          key={wine.id}
                          onClick={() => onWineClick(wine.id)}
                          className="w-full bg-white rounded-xl p-3 shadow-sm opacity-75 hover:opacity-100 hover:shadow-md transition-all text-left"
                          style={{ border: '1px solid #D4AF37' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F8F4E3', border: '1px solid #D4AF37' }}>
                              <Wine className="w-5 h-5" style={{ color: '#4A4A4A' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm truncate" style={{ color: '#681E2F' }}>{wine.name}</h4>
                              <p className="text-xs" style={{ color: '#4A4A4A' }}>
                                {wine.vintage} • {wine.varietal}
                              </p>
                              {event && (
                                <p className="text-xs mt-0.5" style={{ color: '#007C89' }}>
                                  {event.title}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}