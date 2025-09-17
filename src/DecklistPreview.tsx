import { useState } from "react";

export interface ScryfallCard {
    name: string;
    image_uris: {
        small: string;
    };
    prices?: {
        usd: string | null;
    };
    purchase_uris: {
        tcgplayer: string;
    };
}

function CardList({ cards }: { cards: ScryfallCard[] }) {
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    const totalPrice = cards.reduce((total, card) => {
        const price = parseFloat(card.prices?.usd ?? '0');
        return total + price;
    }, 0);

    if (cards.length === 0) {
        return <p>No cards found for the given decklist.</p>;
    }

    return (
        <div className="flex gap-4">
            <div className="w-1/2 space-y-1 overflow-y-auto max-h-96 pr-2">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-2 py-2 w-8">#</th>
                            <th scope="col" className="px-2 py-2">Name</th>
                            <th scope="col" className="px-2 py-2 text-right">Price (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => (
                            <tr
                                key={card.name}
                                onMouseEnter={() => setHoveredImage(card.image_uris.small)}
                                onClick={() => window.open(card.purchase_uris.tcgplayer, '_blank')}
                                className="cursor-pointer hover:bg-muted-foreground/20"
                            >
                                <td className="px-2 py-1">{index + 1}</td>
                                <td className="px-2 py-1 truncate"><span className="underline text-blue-500">{card.name}</span></td>
                                <td className="px-2 py-1 text-right">${card.prices?.usd ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold border-t">
                            <td colSpan="2" className="px-2 py-2 text-right">Total:</td>
                            <td className="px-2 py-2 text-right">${totalPrice.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
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

interface DecklistPreviewProps {
    apiResponse: ScryfallCard[] | string;
}

export function DecklistPreview({ apiResponse }: DecklistPreviewProps) {
    if (!apiResponse) {
        return null;
    }

    return (
        <div className="text-left">
            <h3 className="font-semibold mb-2">Decklist Preview:</h3>
            {typeof apiResponse === 'string' ? (
                <pre className="whitespace-pre-wrap font-mono text-sm">{apiResponse}</pre>
            ) : (
                <CardList cards={apiResponse} />
            )}
        </div>
    );
}
