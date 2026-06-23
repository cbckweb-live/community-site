"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Person = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  team_id: string | null;
  display_order: number;
};

type Team = {
  id: string;
  name: string;
  display_order: number;
};

const emptyPerson = (): Omit<Person, "id"> => ({
  name: "",
  role: "",
  photo_url: null,
  phone: "",
  email: "",
  team_id: null,
  display_order: 0,
});

export default function OfficeBearersSection() {
  const supabase = createSupabaseBrowserClient();
  const [people, setPeople] = useState<Person[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState(emptyPerson());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");

  const fetchData = useCallback(async () => {
    const [{ data: peopleData }, { data: teamsData }] = await Promise.all([
      supabase.from("office_bearers").select("*").order("display_order", { ascending: true }),
      supabase.from("teams").select("*").order("display_order", { ascending: true }),
    ]);
    setPeople((peopleData as Person[]) || []);
    setTeams((teamsData as Team[]) || []);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function uploadPhoto(file: File): Promise<string> {
    const path = `office-bearers/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let photo_url = form.photo_url;
      if (photoFile) photo_url = await uploadPhoto(photoFile);
      const payload = { ...form, photo_url };
      if (editingId) {
        await supabase.from("office_bearers").update(payload).eq("id", editingId);
      } else {
        await supabase.from("office_bearers").insert(payload);
      }
      setForm(emptyPerson());
      setEditingId(null);
      setPhotoFile(null);
      fetchData();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(person: Person) {
    setEditingId(person.id);
    setForm({ name: person.name, role: person.role, photo_url: person.photo_url, phone: person.phone, email: person.email, team_id: person.team_id, display_order: person.display_order });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this person?")) return;
    await supabase.from("office_bearers").delete().eq("id", id);
    fetchData();
  }

  async function handleAddTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    await supabase.from("teams").insert({ name: newTeamName.trim(), display_order: teams.length });
    setNewTeamName("");
    fetchData();
  }

  async function handleDeleteTeam(id: string) {
    if (!confirm("Delete this team? Members will become unassigned.")) return;
    await supabase.from("teams").delete().eq("id", id);
    fetchData();
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1F2A]";

  return (
    <div className="space-y-10">
      {/* Person form */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-md rounded-2xl p-6">
        <h2 className="font-display text-lg">{editingId ? "Edit Person" : "Add Person"}</h2>
        <input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
        <input type="text" placeholder="Role / Title" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} />
        <input type="text" placeholder="Phone (optional)" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
        <input type="email" placeholder="Email (optional)" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
        <input type="number" placeholder="Display order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={inputCls} />

        <select value={form.team_id || ""} onChange={(e) => setForm({ ...form, team_id: e.target.value || null })} className={inputCls}>
          <option value="">No team</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <div>
          <p className="text-sm text-[#231F1E]/60 mb-2">Photo (optional)</p>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className="text-sm" />
          {form.photo_url && !photoFile && (
            <img src={form.photo_url} alt="Current" className="mt-2 w-14 h-14 rounded-full object-cover" />
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#6B1F2A] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-[#7d2432] transition-colors disabled:opacity-60">
            {saving ? "Saving..." : editingId ? "Update" : "Add Person"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(emptyPerson()); setEditingId(null); setPhotoFile(null); }} className="text-sm text-[#231F1E]/50 hover:underline">Cancel</button>
          )}
        </div>
      </form>

      {/* People list */}
      <div className="space-y-3">
        {people.map((person) => (
          <div key={person.id} className="bg-white shadow-sm rounded-xl px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {person.photo_url ? (
                <img src={person.photo_url} alt={person.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
              )}
              <div>
                <p className="font-medium text-sm">{person.name}</p>
                <p className="text-xs text-[#231F1E]/50">{person.role || "—"} · {teams.find(t => t.id === person.team_id)?.name || "No team"}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(person)} className="text-[#6B1F2A] hover:underline">Edit</button>
              <button onClick={() => handleDelete(person.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {people.length === 0 && <p className="text-sm text-[#231F1E]/50">No people added yet.</p>}
      </div>

      {/* Teams */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="font-display text-lg mb-4">Teams</h2>
        <form onSubmit={handleAddTeam} className="flex gap-3 mb-4">
          <input type="text" placeholder="New team name" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} className={`${inputCls} flex-1`} />
          <button type="submit" className="bg-[#6B1F2A] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#7d2432] transition-colors">Add</button>
        </form>
        <div className="space-y-2">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50">
              <p className="text-sm">{team.name}</p>
              <button onClick={() => handleDeleteTeam(team.id)} className="text-red-500 text-sm hover:underline">Delete</button>
            </div>
          ))}
          {teams.length === 0 && <p className="text-sm text-[#231F1E]/50">No teams yet.</p>}
        </div>
      </div>
    </div>
  );
}
