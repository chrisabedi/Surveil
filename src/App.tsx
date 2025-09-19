import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState, useEffect } from "react";
import { DecklistPreview, type DecklistItem } from "./DecklistPreview";
import { Header } from "./Header";


export function App() {
  const [apiResponse, setApiResponse] = useState<DecklistItem[] | string>("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 40;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 40;

  return (
    <>
      <div className="background-container">
        <div
          className="background-image"
          style={{
            transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.1)`,
          }}
        />
      </div>
      <Header />
      <main className="container mx-auto p-4 md:p-8 text-center relative z-10 pt-24">
        <Card className="bg-card/70 backdrop-blur-lg border-white/10 w-full max-w-6xl mx-auto shadow-2xl shadow-black/50">
          <CardContent className="p-4 md:p-6">
            {apiResponse ? (
              <DecklistPreview apiResponse={apiResponse} />
            ) : (
              <MoxfieldImporter setApiResponse={setApiResponse} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default App;
