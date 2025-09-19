import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DecklistItem } from "./DecklistPreview";

interface MoxfieldImporterProps {
    setApiResponse: (response: DecklistItem[] | string) => void;
}

export function MoxfieldImporter({ setApiResponse }: MoxfieldImporterProps) {
    const [decklist, setDecklist] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setApiResponse("Loading...");

        try {
            const response = await fetch('/api/moxfield-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decklist: decklist }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Request failed with status ${response.status}`);
            }

            const result = await response.json();
            setApiResponse(result);
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                setApiResponse(`Error: ${error.message}`);
            } else {
                setApiResponse("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 md:p-8">
            <h1 className="text-4xl md:text-5xl font-bold my-4 leading-tight">Import Decklist</h1>
            <p className="text-muted-foreground max-w-lg">
                Paste your decklist from a site like Moxfield to get started. The tool will fetch card data, prices, and links.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
                <textarea
                    value={decklist}
                    onChange={(e) => setDecklist(e.target.value)}
                    className={cn(
                        "flex min-h-[200px] w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    )}
                    placeholder="1 Black Lotus&#10;4 Sol Ring&#10;..."
                />
                <Button type="submit" size="lg" className="w-full md:w-auto">Analyze Decklist</Button>
            </form>
        </div>
    );
}
