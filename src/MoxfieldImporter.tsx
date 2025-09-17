import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScryfallCard {
    name: string;
    image_uris: {
        small: string;
    };
}

function CardList({ cards }: { cards: ScryfallCard[] }) {
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    if (cards.length === 0) {
        return <p>No cards found for the given decklist.</p>;
    }

    return (
        <div className="flex gap-4">
            <ul className="w-1/2 space-y-1 overflow-y-auto max-h-96 pr-2">
                {cards.map((card) => (
                    <li
                        key={card.name}
                        onMouseEnter={() => setHoveredImage(card.image_uris.small)}
                        onMouseLeave={() => setHoveredImage(null)}
                        className="cursor-pointer p-1 hover:bg-muted-foreground/20 rounded truncate"
                    >
                        {card.name}
                    </li>
                ))}
            </ul>
            <div className="w-1/2 flex items-center justify-center">
                {hoveredImage ? (
                    <img src={hoveredImage} alt="Card preview" className="rounded-lg shadow-lg" />
                ) : (
                    <div className="text-muted-foreground">Hover over a card to see its image.</div>
                )}
            </div>
        </div>
    );
}


export function MoxfieldImporter() {
    const [decklist, setDecklist] = useState("");
    const [apiResponse, setApiResponse] = useState<ScryfallCard[] | string>("");

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
        <>
            <h1 className="text-5xl font-bold my-4 leading-tight">moxfield</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={decklist}
                    onChange={(e) => setDecklist(e.target.value)}
                    className={cn(
                        "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    placeholder="Paste your decklist here"
                />
                <Button type="submit">Submit</Button>
            </form>
            {apiResponse && (
                <div className="mt-4 p-4 border rounded bg-muted text-left">
                    <h3 className="font-semibold mb-2">Decklist Preview:</h3>
                    {typeof apiResponse === 'string' ? (
                        <pre className="whitespace-pre-wrap font-mono text-sm">{apiResponse}</pre>
                    ) : (
                        <CardList cards={apiResponse} />
                    )}
                </div>
            )}
        </>
    );
}
