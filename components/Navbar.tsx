import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "20px", borderBottom: "1px solid #ddd" }}>
      <Link href="/">Home</Link>
      <Link href="/gallery">Gallery</Link>
      <Link href="/events">Events</Link>
      <Link href="/team">Team</Link>
      <Link href="/members">Members</Link>
    </nav>
  );
}