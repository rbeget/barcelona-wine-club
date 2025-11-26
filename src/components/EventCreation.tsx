import { useState } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import type { Event } from '../App';

interface EventCreationProps {
  onAddEvent: (event: Event) => void;
  onBack: () => void;
}

export function EventCreation({ onAddEvent, onBack }: EventCreationProps) {
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
  });

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventFormData,
    };
    onAddEvent(newEvent);
    setEventFormData({ title: '', date: '' });
    onBack();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-80 transition-all"
          style={{ backgroundColor: '#007C89' }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h2 style={{ color: '#681E2F' }}>Create Event</h2>
          <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Add a new tasting event</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg" style={{ border: '2px solid #D4AF37' }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md" style={{ backgroundColor: '#D4AF37' }}>
            <Calendar className="w-8 h-8" style={{ color: '#681E2F' }} />
          </div>
        </div>
        
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#4A4A4A' }}>Event Title</label>
            <input
              type="text"
              value={eventFormData.title}
              onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
              required
              className="w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ borderColor: '#D4AF37', backgroundColor: '#F8F4E3' }}
              placeholder="e.g., Mediterranean Summer Wines"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#4A4A4A' }}>Event Date</label>
            <input
              type="date"
              value={eventFormData.date}
              onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
              required
              className="w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ borderColor: '#D4AF37', backgroundColor: '#F8F4E3' }}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-2.5 rounded-xl transition-colors hover:opacity-90"
              style={{ color: '#4A4A4A', backgroundColor: '#F8F4E3', border: '1px solid #D4AF37' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-white rounded-xl hover:opacity-90 transition-all shadow-md"
              style={{ backgroundColor: '#007C89' }}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
