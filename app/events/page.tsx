import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <main className="px-8 py-16 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl mb-8">Events</h1>

      {error && (
        <p className="text-red-600">Something went wrong loading events.</p>
      )}

      {events && events.length === 0 && (
        <p className="text-[#231F1E]/60">No events have been added yet.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            event_date={event.event_date}
            description={event.description}
            image_url={event.image_url}
          />
        ))}
      </div>
    </main>
  );
}
