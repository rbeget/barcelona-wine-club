import { ArrowLeft, Wine as WineIcon, MapPin, Calendar, Star } from 'lucide-react';
import type { Event, Wine, Rating } from '../App';

interface WineDetailProps {
  wine: Wine;
  event: Event | undefined;
  rating: Rating | undefined;
  onBack: () => void;
  onRateClick: () => void;
}

export function WineDetail({ wine, event, rating, onBack, onRateClick }: WineDetailProps) {
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

      {/* Wine Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: '2px solid #D4AF37' }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: rating ? '#D4AF37' : '#007C89' }}>
            <WineIcon className="w-7 h-7" style={{ color: '#681E2F' }} />
          </div>
          <div className="flex-1">
            <h2 style={{ color: '#681E2F' }}>{wine.name}</h2>
            <p className="text-sm mt-1" style={{ color: '#007C89' }}>
              {wine.vintage}
            </p>
          </div>
        </div>
      </div>

      {/* Wine Details */}
      <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: '2px solid #D4AF37' }}>
        <h3 className="mb-4" style={{ color: '#681E2F' }}>Wine Details</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-1" style={{ color: '#007C89' }}>VARIETAL</p>
            <p style={{ color: '#4A4A4A' }}>{wine.varietal}</p>
          </div>
          
          <div>
            <p className="text-xs mb-1" style={{ color: '#007C89' }}>PRODUCER</p>
            <p style={{ color: '#4A4A4A' }}>{wine.producer}</p>
          </div>
          
          <div>
            <p className="text-xs mb-1" style={{ color: '#007C89' }}>REGION</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: '#007C89' }} />
              <p style={{ color: '#4A4A4A' }}>{wine.region}</p>
            </div>
          </div>
          
          {event && (
            <div>
              <p className="text-xs mb-1" style={{ color: '#007C89' }}>EVENT</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: '#007C89' }} />
                <div>
                  <p style={{ color: '#4A4A4A' }}>{event.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4A4A4A' }}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Details */}
      {rating ? (
        <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: '2px solid #D4AF37' }}>
          <h3 className="mb-4" style={{ color: '#681E2F' }}>Tasting Notes</h3>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: '#F8F4E3' }}>
            <Star className="w-8 h-8 fill-current" style={{ color: '#D4AF37' }} />
            <div>
              <div className="text-xs" style={{ color: '#4A4A4A' }}>OVERALL SCORE</div>
              <div className="text-2xl" style={{ color: '#681E2F' }}>{rating.overall.toFixed(1)}</div>
            </div>
          </div>
          
          {/* Individual Scores */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ color: '#4A4A4A' }}>Appearance</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F8F4E3' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      backgroundColor: '#D4AF37',
                      width: `${(rating.appearance / 5) * 100}%` 
                    }}
                  />
                </div>
                <span className="w-8 text-right" style={{ color: '#681E2F' }}>{rating.appearance.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span style={{ color: '#4A4A4A' }}>Aroma</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F8F4E3' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      backgroundColor: '#D4AF37',
                      width: `${(rating.aroma / 5) * 100}%` 
                    }}
                  />
                </div>
                <span className="w-8 text-right" style={{ color: '#681E2F' }}>{rating.aroma.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span style={{ color: '#4A4A4A' }}>Taste</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F8F4E3' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      backgroundColor: '#D4AF37',
                      width: `${(rating.taste / 5) * 100}%` 
                    }}
                  />
                </div>
                <span className="w-8 text-right" style={{ color: '#681E2F' }}>{rating.taste.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span style={{ color: '#4A4A4A' }}>Finish</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F8F4E3' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      backgroundColor: '#D4AF37',
                      width: `${(rating.finish / 5) * 100}%` 
                    }}
                  />
                </div>
                <span className="w-8 text-right" style={{ color: '#681E2F' }}>{rating.finish.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {rating.notes && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #D4AF37' }}>
              <p className="text-xs mb-2" style={{ color: '#007C89' }}>NOTES</p>
              <p className="text-sm" style={{ color: '#4A4A4A' }}>{rating.notes}</p>
            </div>
          )}
          
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #D4AF37' }}>
            <p className="text-xs" style={{ color: '#4A4A4A' }}>
              Tasted on {new Date(rating.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          
          {/* Edit Rating Button */}
          <button
            onClick={onRateClick}
            className="w-full mt-4 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
            style={{ 
              backgroundColor: '#007C89',
              color: 'white'
            }}
          >
            Edit Rating
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md" style={{ border: '2px solid #D4AF37' }}>
          <Star className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: '#681E2F' }} />
          <p className="text-sm mb-4" style={{ color: '#4A4A4A' }}>Not yet tasted</p>
          <button
            onClick={onRateClick}
            className="px-6 py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
            style={{ 
              backgroundColor: '#681E2F',
              color: 'white'
            }}
          >
            Rate Wine
          </button>
        </div>
      )}
    </div>
  );
}