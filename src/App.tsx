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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function App() {
  const [apiResponse, setApiResponse] = useState<DecklistItem[] | string>("");
  const [decklistHistory, setDecklistHistory] = useState<(DecklistItem[])[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [quickImportUrl, setQuickImportUrl] = useState("");
  const [isQuickImporting, setIsQuickImporting] = useState(false);

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

  const handleQuickImport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!quickImportUrl) return;

    setIsQuickImporting(true);
    try {
        const response = await fetch('/api/moxfield', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ decklist: quickImportUrl }),
        });
        const data = await response.json();
        setApiResponse(data);
        setQuickImportUrl('');
    } catch (error) {
        console.error("Quick import failed:", error);
    } finally {
        setIsQuickImporting(false);
    }
  };

  return (
    <>
      <div className="background-container">
        <div
          className="background-image"
        />
      </div>
      <Header />
      <div className="container mx-auto p-4 md:p-8 relative z-10 pt-24">
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="fixed top-28 right-8 z-20">
            History
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="text-center">Surveil</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-8">
            <form onSubmit={handleQuickImport} className="space-y-2">
              <Label htmlFor="quick-import">Add another decklist</Label>
              <Input
                id="quick-import"
                placeholder="Paste Moxfield URL..."
                value={quickImportUrl}
                onChange={(e) => setQuickImportUrl(e.target.value)}
                disabled={isQuickImporting}
              />
              <Button type="submit" className="w-full" disabled={isQuickImporting}>
                {isQuickImporting ? 'Importing...' : 'Import'}
              </Button>
            </form>
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
    </>
  );
}

export default App;
