type EventCardProps = {
  title: string;
  event_date: string | null;
  description: string | null;
  image_url: string | null;
};

export default function EventCard({ title, event_date, description, image_url }: EventCardProps) {
  const formattedDate = event_date
    ? new Date(event_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date to be announced";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {image_url && (
        <img src={image_url} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <p className="text-xs uppercase tracking-wide text-[#6B1F2A] mb-2">{formattedDate}</p>
        <h3 className="font-display text-lg mb-2">{title}</h3>
        <p className="text-sm text-[#231F1E]/70">{description}</p>
      </div>
    </div>
  );
}