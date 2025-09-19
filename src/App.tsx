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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        setIsSheetOpen(false);
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="absolute top-28 left-8 z-20">
              Surveil
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="text-center">Surveil</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-8">
              <MoxfieldImporter setApiResponse={setApiResponse} />
              <div className="grid gap-4">
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
            </div>
          </SheetContent>
        </Sheet>
        <div className="max-w-6xl mx-auto">
          <main className="text-center">
            {apiResponse ? (
              <DecklistPreview apiResponse={apiResponse} />
            ) : (
                <div className="flex items-center justify-center h-[60vh]">
                    <p className="text-muted-foreground text-lg">Import a decklist to get started using the Surveil panel.</p>
                </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
