
import { Trophy } from "lucide-react";

export function CricketAppHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-center">
        <Trophy className="w-8 h-8 mr-2" />
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Score-It Cricket
        </h1>
      </div>
    </header>
  );
}
