import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DecklistItem } from "./DecklistPreview";

interface SidebarProps {
  decklistHistory: (DecklistItem[])[];
  handleQuickImport: (event: React.FormEvent) => Promise<void>;
  quickImportUrl: string;
  setQuickImportUrl: (url: string) => void;
  isQuickImporting: boolean;
  setApiResponse: (response: DecklistItem[] | string) => void;
  className?: string;
}

export function Sidebar({
  decklistHistory,
  handleQuickImport,
  quickImportUrl,
  setQuickImportUrl,
  isQuickImporting,
  setApiResponse,
  className,
}: SidebarProps) {
  return (
    <div className={className}>
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium space-y-4">
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
