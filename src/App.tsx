import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState, useEffect } from "react";
import { DecklistPreview, type DecklistItem } from "./DecklistPreview";
import { Header } from "./Header";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";


export function App() {
  const [apiResponse, setApiResponse] = useState<DecklistItem[] | string>("");
  const [decklistHistory, setDecklistHistory] = useState<(DecklistItem[])[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('decklistHistory');
    if (storedHistory) {
        try {
            const parsedHistory = JSON.parse(storedHistory);
            if (Array.isArray(parsedHistory)) {
                setDecklistHistory(parsedHistory);
            }
        } catch (e) {
            console.error("Failed to parse decklist history from localStorage", e);
        }
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(apiResponse) && apiResponse.length > 0) {
        setDecklistHistory(prevHistory => {
            const responseStr = JSON.stringify(apiResponse);
            const newHistory = [
              apiResponse, 
              ...prevHistory.filter(list => JSON.stringify(list) !== responseStr)
            ].slice(0, 5);
            localStorage.setItem('decklistHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    }
  }, [apiResponse]);

  return (
    <>
      <div className="background-container">
        <div
          className="background-image"
        />
      </div>
      <Header />
      <div className="container mx-auto p-4 md:p-8 relative z-10 pt-24">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="absolute top-28 right-8 z-20">
              Deck History
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-center">Surveil</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {decklistHistory.map((decklist, index) => (
                <SheetClose asChild key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setApiResponse(decklist)}
                  >
                    {decklist[0]?.data?.name || `Decklist ${index + 1}`}
                  </Button>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="max-w-6xl mx-auto">
          <main className="text-center">
            {apiResponse ? (
              <DecklistPreview apiResponse={apiResponse} />
            ) : (
              <MoxfieldImporter setApiResponse={setApiResponse} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
