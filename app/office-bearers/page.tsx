import { supabase } from "@/lib/supabase";
import OfficeBearerCard from "@/components/OfficeBearerCard";
import LeadershipCard from "@/components/LeadershipCard";

type Person = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  team_id: string | null;
};

type Team = {
  id: string;
  name: string;
  display_order: number;
};

export default async function OfficeBearersPage() {
  const { data: people } = await supabase
    .from("office_bearers")
    .select("*")
    .order("display_order", { ascending: true });

  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .order("display_order", { ascending: true });

  const peopleList = (people as Person[]) || [];
  const teamsList = (teams as Team[]) || [];

  // Featured: Pastor in Charge + Youth Director — shown above the heading
  const featured = peopleList.filter(
    (p) =>
      p.role?.toLowerCase().includes("pastor in charge") ||
      p.role?.toLowerCase().includes("youth director")
  );

  // Everyone else grouped by team
  const featuredIds = new Set(featured.map((p) => p.id));
  const rest = peopleList.filter((p) => !featuredIds.has(p.id));
  const standalone = rest.filter((p) => !p.team_id);

  return (
    <main className="px-8 py-16 max-w-5xl mx-auto">

      {/* Featured leaders — above the heading */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {featured.map((person) => (
              <LeadershipCard key={person.id} {...person} />
            ))}
          </div>
        </section>
      )}

      <h1 className="font-display text-3xl mb-10">Office Bearers</h1>

      {standalone.length > 0 && (
        <section className="mb-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {standalone.map((person) => (
              <OfficeBearerCard key={person.id} {...person} />
            ))}
          </div>
        </section>
      )}

      {teamsList.map((team) => {
        const members = rest.filter((p) => p.team_id === team.id);
        if (members.length === 0) return null;
        return (
          <section key={team.id} className="mb-12">
            <h2 className="font-display text-xl mb-4">{team.name}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {members.map((person) => (
                <OfficeBearerCard key={person.id} {...person} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}