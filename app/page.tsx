"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex min-w-screen">
        <Link href="/countries">List of countries</Link>
        <Link href="/clusters">Clusters</Link>
        <Link href="/world">World map</Link>
      </div>
    </main>
  );
}
