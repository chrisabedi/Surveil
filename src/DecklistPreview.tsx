import { Fragment, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface ScryfallCard {
    name: string;
    image_uris?: {
        small: string;
        normal?: string;
    };
    prices?: {
        usd: string | null;
    };
    purchase_uris?: {
        tcgplayer: string;
    };
    mana_cost?: string;
    cmc?: number;
}

export interface DecklistItem {
    name: string;
    data: ScryfallCard | null;
}

function ManaCost({ manaCost }: { manaCost: string | undefined }) {
    if (!manaCost) {
        return null;
    }

    const symbols = manaCost.match(/\{(.+?)\}/g);

    if (!symbols) {
        return <span>{manaCost}</span>; // Fallback for unexpected formats
    }

    return (
        <span className="inline-flex items-center gap-x-0.5 align-middle">
            {symbols.map((symbol, index) => {
                const symbolCode = symbol.replace(/\{|\}/g, '').replace(/\//g, '');
                const imageUrl = `https://svgs.scryfall.io/card-symbols/${symbolCode}.svg`;
                return (
                    <img
                        key={index}
                        src={imageUrl}
                        alt={symbol}
                        className="w-4 h-4"
                        title={symbol}
                    />
                );
            })}
        </span>
    );
}

function CardList({ cards }: { cards: DecklistItem[] }) {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ScryfallCard | null>(null);

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const totalPrice = cards.reduce((total, card) => {
        const price = parseFloat(card.data?.prices?.usd ?? '0');
        return total + price;
    }, 0);

    if (cards.length === 0) {
        return <p>No cards found for the given decklist.</p>;
    }

    const columnThreshold = 15;
    const singleColumn = cards.length <= columnThreshold;

    const halfwayIndex = Math.ceil(cards.length / 2);
    const firstHalf = singleColumn ? cards : cards.slice(0, halfwayIndex);
    const secondHalf = singleColumn ? [] : cards.slice(halfwayIndex);

    const tableHeader = (
        <thead className="text-xs text-muted-foreground uppercase">
            <tr className="border-b border-white/10">
                <th scope="col" className="p-3 w-8 text-left">#</th>
                <th scope="col" className="p-3 text-left">Name</th>
                <th scope="col" className="p-3 text-right">Cost</th>
                <th scope="col" className="p-3 text-right">Price (USD)</th>
            </tr>
        </thead>
    );

    const tableFooter = (
        <tfoot>
            <tr className="font-semibold border-t border-white/10">
                <td colSpan={3} className="p-3 text-right">Total:</td>
                <td className="p-3 text-right">${totalPrice.toFixed(2)}</td>
            </tr>
        </tfoot>
    );

    return (
        <div>
            {selectedCard && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setSelectedCard(null)}
                >
                    <div className="p-4" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={selectedCard.image_uris?.normal || selectedCard.image_uris?.small} 
                            alt={selectedCard.name} 
                            className="rounded-lg max-w-[80vw] max-h-[80vh]" 
                        />
                        <Button
                            as="a"
                            href={selectedCard.purchase_uris?.tcgplayer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full mt-2"
                            size="sm"
                        >
                            View on TCGPlayer
                        </Button>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-x-8">
                {[firstHalf, secondHalf].map((column, colIndex) => (
                    <Fragment key={colIndex}>
                        {column.length > 0 && (
                            <div className="flex-1 overflow-y-auto max-h-[60vh]">
                                <table className="w-full text-sm text-left">
                                    {tableHeader}
                                    <tbody>
                                        {column.map((card, index) => {
                                            const cardData = card.data;
                                            const overallIndex = colIndex === 0 ? index : firstHalf.length + index;
                                            if (!cardData) {
                                                return (
                                                    <tr key={card.name} className="border-b border-white/5 opacity-50">
                                                        <td className="p-3">{overallIndex + 1}</td>
                                                        <td className="p-3 truncate">
                                                            <span>{card.name}</span>
                                                        </td>
                                                        <td className="p-3 text-right"></td>
                                                        <td className="p-3 text-right">N/A</td>
                                                    </tr>
                                                );
                                            }

                                            if (isMobile) {
                                                return (
                                                    <tr
                                                        key={card.name}
                                                        className={`border-b border-white/5 transition-colors cursor-pointer hover:bg-white/10`}
                                                        onClick={() => setSelectedCard(cardData)}
                                                    >
                                                        <td className="p-3">{overallIndex + 1}</td>
                                                        <td className="p-3 truncate">
                                                            <span className="text-primary">{card.name}</span>
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <ManaCost manaCost={cardData.mana_cost} />
                                                        </td>
                                                        <td className="p-3 text-right">${cardData.prices?.usd ?? 'N/A'}</td>
                                                    </tr>
                                                );
                                            }

                                            return (
                                                <HoverCard key={card.name} openDelay={100} closeDelay={50}>
                                                    <HoverCardTrigger asChild>
                                                        <tr
                                                            className={`border-b border-white/5 transition-colors cursor-pointer hover:bg-white/10`}
                                                        >
                                                            <td className="p-3">{overallIndex + 1}</td>
                                                            <td className="p-3 truncate">
                                                                <span className="text-primary">{card.name}</span>
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                <ManaCost manaCost={cardData.mana_cost} />
                                                            </td>
                                                            <td className="p-3 text-right">${cardData.prices?.usd ?? 'N/A'}</td>
                                                        </tr>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent side="right" align="start" className="w-fit p-2 border-white/10 bg-card/80 backdrop-blur-lg">
                                                        <picture>
                                                            <source media="(min-width: 768px)" srcSet={cardData.image_uris?.normal || cardData.image_uris?.small} />
                                                            <img src={cardData.image_uris?.small} alt="Card preview" className="rounded-lg w-64 md:w-auto md:max-w-xs" />
                                                        </picture>
                                                        <Button
                                                            as="a"
                                                            href={cardData.purchase_uris?.tcgplayer}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full mt-2"
                                                            size="sm"
                                                        >
                                                            View on TCGPlayer
                                                        </Button>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            );
                                        })}
                                    </tbody>
                                    {(singleColumn || colIndex === 1) && tableFooter}
                                </table>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>

        </div>
    );
}

interface DecklistPreviewProps {
    apiResponse: DecklistItem[] | string;
}

export function DecklistPreview({ apiResponse }: DecklistPreviewProps) {
    if (!apiResponse) {
        return null;
    }

    return (
        <div className="text-left">
            {typeof apiResponse === 'string' ? (
                <pre className="whitespace-pre-wrap font-mono text-sm">{apiResponse}</pre>
            ) : (
                <CardList cards={apiResponse} />
            )}
        </div>
    );
}
