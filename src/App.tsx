import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState, useEffect } from "react";
import { DecklistPreview, type DecklistItem } from "./DecklistPreview";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";


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

  const sidebarProps = {
    decklistHistory,
    handleQuickImport,
    quickImportUrl,
    setQuickImportUrl,
    isQuickImporting,
    setApiResponse,
  };

  return (
    <>
      <div className="background-container">
        <div
          className="background-image"
        />
      </div>
      <div className="w-full">
        <div className="flex flex-col min-h-screen">
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                 <Sidebar {...sidebarProps} />
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-800 to-primary">
                Surveil
            </h1>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center">
                  {apiResponse ? (
                    <DecklistPreview apiResponse={apiResponse} />
                  ) : (
                    <MoxfieldImporter setApiResponse={setApiResponse} />
                  )}
                </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
