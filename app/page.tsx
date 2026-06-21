import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";

const partnerLogos = [
  "https://picsum.photos/120/60?random=10",
  "https://picsum.photos/120/60?random=11",
  "https://picsum.photos/120/60?random=12",
  "https://picsum.photos/120/60?random=13",
];

export default function HomePage() {
  return (
    <main className="bg-white text-[#231F1E]">
      <section className="px-8 py-16 max-w-2xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-[#6B1F2A] mb-3">
          Welcome
        </p>
        <h1 className="font-display text-4xl leading-tight mb-4">
          A community rooted in faith, growing together for generations.
        </h1>
        <p className="text-[#231F1E]/80 leading-relaxed">
          A community built on shared faith and shared ground — gathering for
          fellowship, supporting one another, and growing together year after
          year.
        </p>
      </section>

      <section className="px-8 pb-16">
        <HeroSlider />
      </section>


      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-8 py-16">
        {[
          {
            title: "History",
            text: "A look back at how our community began and grew over the years.",
            href: "/about/history",
          },
          {
            title: "Aims and Goals",
            text: "What we strive toward, together, as one community.",
            href: "/about/aims",
          },
          {
            title: "General Administration",
            text: "How our community is organized and led.",
            href: "/about/administration",
          },
        ].map((item) => (
          <div key={item.title} className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-[#6B1F2A] rotate-45" />
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

      <section className="px-8 py-12 border-t border-gray-200">
        <p className="text-center text-xs uppercase tracking-widest text-[#231F1E]/50 mb-6">
          In Partnership With
        </p>
        <div className="flex justify-center gap-10 flex-wrap items-center">
          {partnerLogos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Partner logo"
              className="h-10 opacity-70"
            />
          ))}
        </div>
      </section>
       <section className="px-8 py-16">
        <h2 className="font-display text-2xl mb-6 text-center">
          News & Updates
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <p className="text-xs uppercase tracking-wide text-[#6B1F2A] mb-2">
                News
              </p>
              <h3 className="font-display text-lg mb-2">
                Sample news headline {i}
              </h3>
              <p className="text-sm text-[#231F1E]/70">
                Short preview of this news item will appear here once added by
                the admin.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
