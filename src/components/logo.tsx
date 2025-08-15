import { Home } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg text-foreground">
      <div className="p-2 bg-primary/20 rounded-lg">
        <Home className="w-5 h-5 text-primary" />
      </div>
      <span className="font-bold">HomeWise</span>
    </div>
  );
}
