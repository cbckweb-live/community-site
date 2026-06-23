"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Event = {
  id: string;
  title: string;
  event_date: string;
  description: string | null;
  image_url: string | null;
};

const emptyEvent = (): Omit<Event, "id"> => ({
  title: "",
  event_date: "",
  description: "",
  image_url: null,
});

export default function EventsSection() {
  const supabase = createSupabaseBrowserClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(emptyEvent());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setEvents((data as Event[]) || []);
  }, [supabase]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function uploadImage(file: File): Promise<string> {
    const path = `events/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let image_url = form.image_url;
      if (imageFile) image_url = await uploadImage(imageFile);
      const payload = { ...form, image_url };
      if (editingId) {
        await supabase.from("events").update(payload).eq("id", editingId);
      } else {
        await supabase.from("events").insert(payload);
      }
      setForm(emptyEvent());
      setEditingId(null);
      setImageFile(null);
      fetchEvents();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(event: Event) {
    setEditingId(event.id);
    setForm({ title: event.title, event_date: event.event_date, description: event.description, image_url: event.image_url });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1F2A]";

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5 mb-10 bg-white shadow-md rounded-2xl p-6">
        <h2 className="font-display text-lg">{editingId ? "Edit Event" : "New Event"}</h2>
        <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputCls} />
        <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required className={inputCls} />
        <textarea placeholder="Description (optional)" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={inputCls} />
        <div>
          <p className="text-sm text-[#231F1E]/60 mb-2">Event image (optional)</p>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm" />
          {form.image_url && !imageFile && (
            <img src={form.image_url} alt="Current" className="mt-2 h-20 rounded-lg object-cover" />
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#6B1F2A] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-[#7d2432] transition-colors disabled:opacity-60">
            {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(emptyEvent()); setEditingId(null); setImageFile(null); }} className="text-sm text-[#231F1E]/50 hover:underline">Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-sm rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm">{event.title}</p>
              <p className="text-xs text-[#231F1E]/50">{new Date(event.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(event)} className="text-[#6B1F2A] hover:underline">Edit</button>
              <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-[#231F1E]/50">No events yet.</p>}
      </div>
    </div>
  );
}
