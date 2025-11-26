import { ArrowLeft, Wine as WineIcon } from 'lucide-react';
import { useState } from 'react';
import type { Event, Wine } from '../App';

interface AddWineProps {
  event: Event;
  onAddWine: (wine: Wine) => void;
  onBack: () => void;
}

export function AddWine({ event, onAddWine, onBack }: AddWineProps) {
  const [name, setName] = useState('');
  const [vintage, setVintage] = useState('');
  const [varietal, setVarietal] = useState('');
  const [region, setRegion] = useState('');
  const [producer, setProducer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !vintage || !varietal || !region || !producer) {
      return;
    }

    const newWine: Wine = {
      id: Date.now().toString(),
      eventId: event.id,
      name,
      vintage,
      varietal,
      region,
      producer,
    };

    onAddWine(newWine);
    onBack();
  };

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
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#681E2F' }}>
            <WineIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 style={{ color: '#681E2F' }}>Add Wine</h2>
        <p className="text-sm mt-2" style={{ color: '#007C89' }}>
          {event.title}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#681E2F' }}>
            Wine Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'white'
            }}
            placeholder="e.g., Clos Mogador"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#681E2F' }}>
            Vintage
          </label>
          <input
            type="text"
            value={vintage}
            onChange={(e) => setVintage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'white'
            }}
            placeholder="e.g., 2018"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#681E2F' }}>
            Varietal
          </label>
          <input
            type="text"
            value={varietal}
            onChange={(e) => setVarietal(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'white'
            }}
            placeholder="e.g., Garnacha, Cariñena, Syrah"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#681E2F' }}>
            Region
          </label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'white'
            }}
            placeholder="e.g., Priorat, Catalonia"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#681E2F' }}>
            Producer
          </label>
          <input
            type="text"
            value={producer}
            onChange={(e) => setProducer(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
            style={{ 
              borderColor: '#D4AF37',
              backgroundColor: 'white'
            }}
            placeholder="e.g., Clos Mogador"
            required
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
          Add Wine
        </button>
      </form>
    </div>
  );
}
