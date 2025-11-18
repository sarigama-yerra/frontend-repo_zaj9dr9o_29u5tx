import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

function formatDate(d) {
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}

export default function BookingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/bookings`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      guest_name: item.guest_name,
      email: item.email || "",
      start_date: item.start_date,
      duration_days: item.duration_days,
      rooms: item.rooms,
      room_type: item.room_type || 'standard',
      notes: item.notes || "",
      status: item.status
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchData();
      setEditingId(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="text-blue-200">Loading bookings...</div>;
  if (error) return <div className="text-red-300">{error}</div>;

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Your bookings</h2>
        <button onClick={fetchData} className="text-sm px-3 py-1 rounded bg-slate-700 text-white">Refresh</button>
      </div>
      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-blue-200">No bookings yet</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-700 p-4 bg-slate-900/40">
            {editingId === item.id ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" value={editForm.guest_name} onChange={e=>setEditForm(v=>({...v, guest_name: e.target.value}))} />
                <input type="email" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" value={editForm.email} onChange={e=>setEditForm(v=>({...v, email: e.target.value}))} />
                <input type="date" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" value={editForm.start_date} onChange={e=>setEditForm(v=>({...v, start_date: e.target.value}))} />
                <input type="number" min="1" max="60" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" value={editForm.duration_days} onChange={e=>setEditForm(v=>({...v, duration_days: Number(e.target.value)}))} />
                <input type="number" min="1" max="20" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" value={editForm.rooms} onChange={e=>setEditForm(v=>({...v, rooms: Number(e.target.value)}))} />
                <select className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" value={editForm.room_type} onChange={e=>setEditForm(v=>({...v, room_type: e.target.value}))}>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
                <textarea rows={2} className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 sm:col-span-2" value={editForm.notes} onChange={e=>setEditForm(v=>({...v, notes: e.target.value}))} />
                <div className="sm:col-span-2 flex gap-2 justify-end">
                  <button className="px-3 py-2 rounded bg-slate-600 text-white" onClick={()=>setEditingId(null)}>Cancel</button>
                  <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={saveEdit}>Save</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                <div>
                  <div className="text-white font-medium">{item.guest_name}</div>
                  <div className="text-xs text-blue-300/70">{item.email || '—'}</div>
                </div>
                <div className="text-blue-200">
                  <div>{formatDate(item.start_date)}</div>
                  <div className="text-xs">{item.duration_days} nights</div>
                </div>
                <div className="text-blue-200">{item.rooms} rooms • {item.room_type}</div>
                <div className="text-white font-semibold">${item.total_price.toFixed(2)}</div>
                <div className="flex gap-2 justify-end">
                  <button className="px-3 py-2 rounded bg-slate-600 text-white" onClick={()=>startEdit(item)}>Edit</button>
                  <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={()=>remove(item.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
