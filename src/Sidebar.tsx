import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DecklistItem } from "./DecklistPreview";

interface SidebarProps {
  decklistHistory: (DecklistItem[])[];
  handleSidebarImport: (event: React.FormEvent) => Promise<void>;
  sidebarDecklist: string;
  setSidebarDecklist: (decklist: string) => void;
  isSidebarImporting: boolean;
  setApiResponse: (response: DecklistItem[] | string) => void;
  className?: string;
}

export function Sidebar({
  decklistHistory,
  handleSidebarImport,
  sidebarDecklist,
  setSidebarDecklist,
  isSidebarImporting,
  setApiResponse,
  className,
}: SidebarProps) {
  return (
    <div className={className}>
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium space-y-4">
                <form onSubmit={handleSidebarImport} className="space-y-2">
                    <Label htmlFor="sidebar-import">Add another decklist</Label>
                    <Textarea
                        id="sidebar-import"
                        placeholder="Paste your decklist here..."
                        value={sidebarDecklist}
                        onChange={(e) => setSidebarDecklist(e.target.value)}
                        disabled={isSidebarImporting}
                        className="min-h-[150px]"
                    />
                    <Button type="submit" className="w-full" disabled={isSidebarImporting}>
                        {isSidebarImporting ? 'Importing...' : 'Import'}
                    </Button>
                </form>
                {decklistHistory.length > 0 && (
                    <div className="grid gap-2">
                        <h2 className="px-2 text-lg font-semibold tracking-tight">
                            History
                        </h2>
                        {decklistHistory.map((decklist, index) => (
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setApiResponse(decklist)}
                                key={index}
                            >
                                {decklist[0]?.data?.name || `Decklist ${index + 1}`}
                            </Button>
                        ))}
                    </div>
                )}
            </nav>
        </div>
      </div>
    </div>
  );
}
