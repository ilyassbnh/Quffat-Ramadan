import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24 text-center">
      <div className="z-10 animate-fade-in space-y-4">
        <h1 className="text-6xl font-bold tracking-tight text-casa-night drop-shadow-sm">
          Casa Ramadan 2026
        </h1>
        <p className="text-xl text-muted-foreground">
          Connecting communities through charity and faith.
        </p>
      </div>

      <div className="z-10">
        <Link href="/dashboard">
          <Button size="lg" className="h-12 bg-casa-emerald px-8 text-lg hover:bg-casa-emerald/90 text-white shadow-lg shadow-casa-emerald/20 transition-all hover:scale-105">
            Enter Application
          </Button>
        </Link>
      </div>
    </main>
  );
}
