import { ArrowLeft, Wine as WineIcon, Star } from 'lucide-react';
import { useState } from 'react';
import type { Wine, Rating } from '../App';

interface RateWineProps {
  wine: Wine;
  existingRating?: Rating;
  onAddRating: (rating: Rating) => void;
  onUpdateRating: (rating: Rating) => void;
  onBack: () => void;
}

export function RateWine({ wine, existingRating, onAddRating, onUpdateRating, onBack }: RateWineProps) {
  const [appearance, setAppearance] = useState(existingRating?.appearance || 0);
  const [aroma, setAroma] = useState(existingRating?.aroma || 0);
  const [taste, setTaste] = useState(existingRating?.taste || 0);
  const [finish, setFinish] = useState(existingRating?.finish || 0);
  const [notes, setNotes] = useState(existingRating?.notes || '');

  const overall = appearance && aroma && taste && finish 
    ? (appearance + aroma + taste + finish) / 4 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appearance || !aroma || !taste || !finish) {
      return;
    }

    const rating: Rating = {
      id: existingRating?.id || Date.now().toString(),
      wineId: wine.id,
      wineName: wine.name,
      eventId: wine.eventId,
      appearance,
      aroma,
      taste,
      finish,
      overall,
      notes,
      date: existingRating?.date || new Date().toISOString(),
    };

    if (existingRating) {
      onUpdateRating(rating);
    } else {
      onAddRating(rating);
    }
    
    onBack();
  };

  const RatingSlider = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm" style={{ color: '#681E2F' }}>
          {label}
        </label>
        <span style={{ color: '#007C89' }}>{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          backgroundColor: '#F8F4E3',
          accentColor: '#D4AF37',
        }}
      />
    </div>
  );

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

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: '2px solid #D4AF37' }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
            <WineIcon className="w-7 h-7" style={{ color: '#681E2F' }} />
          </div>
          <div className="flex-1">
            <h2 style={{ color: '#681E2F' }}>{existingRating ? 'Edit Rating' : 'Rate Wine'}</h2>
            <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>
              {wine.name}
            </p>
            <p className="text-sm" style={{ color: '#007C89' }}>
              {wine.vintage}
            </p>
          </div>
        </div>
      </div>

      {/* Overall Score Display */}
      {overall > 0 && (
        <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-sm" style={{ border: '2px solid #D4AF37' }}>
          <Star className="w-8 h-8 fill-current" style={{ color: '#D4AF37' }} />
          <div>
            <div className="text-xs" style={{ color: '#4A4A4A' }}>OVERALL SCORE</div>
            <div className="text-2xl" style={{ color: '#681E2F' }}>{overall.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-5" style={{ border: '2px solid #D4AF37' }}>
          <h3 style={{ color: '#681E2F' }}>Rating Criteria</h3>
          
          <RatingSlider 
            label="Appearance" 
            value={appearance} 
            onChange={setAppearance} 
          />
          
          <RatingSlider 
            label="Aroma" 
            value={aroma} 
            onChange={setAroma} 
          />
          
          <RatingSlider 
            label="Taste" 
            value={taste} 
            onChange={setTaste} 
          />
          
          <RatingSlider 
            label="Finish" 
            value={finish} 
            onChange={setFinish} 
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#681E2F' }}>
            Tasting Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 min-h-[120px]"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'white'
            }}
            placeholder="Share your impressions about this wine..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
          style={{ 
            backgroundColor: '#681E2F',
            color: 'white'
          }}
        >
          {existingRating ? 'Update Rating' : 'Save Rating'}
        </button>
      </form>
    </div>
  );
}
