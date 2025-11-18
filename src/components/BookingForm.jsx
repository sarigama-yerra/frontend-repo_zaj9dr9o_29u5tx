import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

export default function BookingForm({ onCreated }) {
  const [form, setForm] = useState({
    guest_name: "",
    email: "",
    start_date: "",
    duration_days: 1,
    rooms: 1,
    room_type: "standard",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'duration_days' || name === 'rooms' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create booking');
      }
      const data = await res.json();
      setForm({ guest_name: "", email: "", start_date: "", duration_days: 1, rooms: 1, room_type: "standard", notes: "" });
      onCreated?.(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-semibold text-lg mb-4">Create a booking</h2>
      {error && (
        <div className="mb-3 text-sm text-red-300 bg-red-900/30 border border-red-700/40 rounded px-3 py-2">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Guest name</label>
          <input name="guest_name" value={form.guest_name} onChange={handleChange} required className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Check-in date</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Nights</label>
          <input type="number" min="1" max="60" name="duration_days" value={form.duration_days} onChange={handleChange} required className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Rooms</label>
          <input type="number" min="1" max="20" name="rooms" value={form.rooms} onChange={handleChange} required className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Room type</label>
          <select name="room_type" value={form.room_type} onChange={handleChange} className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-2 flex items-center justify-end gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">
            {loading ? 'Creating...' : 'Create booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
