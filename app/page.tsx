import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  MapIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import LeadershipCard from "@/components/LeadershipCard";

export default async function HomePage() {
  const { data: leadership } = await supabase
    .from("office_bearers")
    .select("*")
    .or("role.ilike.%youth director%,role.ilike.%pastor in charge%");
  <main className="bg-white text-[#231F1E]"></main>;
  return (
    <main className="bg-white text-[#231F1E]">
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-2xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-[#6B1F2A] mb-3">
          Welcome
        </p>
        <h1 className="font-display text-2xl sm:text-4xl leading-tight mb-4">
          A community rooted in faith, growing together for generations.
        </h1>
        <p className="text-[#231F1E]/80 leading-relaxed">
          A community built on shared faith and shared ground — gathering for
          fellowship, supporting one another, and growing together year after
          year.
        </p>
      </section>

      <section className="px-4 sm:px-8 pb-12 sm:pb-16">
        <HeroSlider />
      </section>

      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {[
          {
            title: "Journey",
            text: "A look back at how our community began and grew over the years.",
            href: "/about/journey",
            Icon: MapIcon,
          },
          {
            title: "Aims and Goals",
            text: "What we strive toward, together, as one community.",
            href: "/about/aims",
            Icon: PlusIcon,
          },
          {
            title: "Blog/News",
            text: "How our community is organized and led.",
            href: "/about/blog-news",
            Icon: PencilSquareIcon,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="text-center bg-white/40 backdrop-blur-sm border border-white/50 shadow-md rounded-xl p-6"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#6B1F2A] flex items-center justify-center">
              <item.Icon className="size-6 text-white" />
            </div>
            <h3 className="font-display text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-[#231F1E]/70 mb-3">{item.text}</p>
            <Link
              href={item.href}
              className="text-sm font-medium text-[#6B1F2A] hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </section>
      <section className="px-4 sm:px-8 py-12 sm:py-16">
        <h2 className="font-display text-2xl mb-6 text-center">
          Our Leadership
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {leadership?.map((person) => (
            <LeadershipCard key={person.id} {...person} />
          ))}
        </div>
      </section>
    </main>
  );
}
