import { useEffect, useState } from "react";

const getKolkataHour = () => {
  // Kolkata is UTC+5:30
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const kolkata = new Date(utcMs + 5.5 * 60 * 60000);
  return kolkata.getHours();
};

const TimeGreeting = () => {
  const [greeting, setGreeting] = useState<{ text: string; emoji: string } | null>(null);

  useEffect(() => {
    const hour = getKolkataHour();
    if (hour < 5) setGreeting({ text: "Burning the midnight oil", emoji: "🌙" });
    else if (hour < 12) setGreeting({ text: "Good morning from Kolkata", emoji: "☀️" });
    else if (hour < 17) setGreeting({ text: "Good afternoon from Kolkata", emoji: "🌤" });
    else if (hour < 21) setGreeting({ text: "Good evening from Kolkata", emoji: "🌆" });
    else setGreeting({ text: "Good night from Kolkata", emoji: "🌙" });
  }, []);

  if (!greeting) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
      <span>{greeting.emoji}</span>
      <span>{greeting.text}</span>
    </div>
  );
};

export default TimeGreeting;