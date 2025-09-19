import { useState, useRef, Fragment } from "react";
import { Button } from "@/components/ui/button";

export interface ScryfallCard {
    name: string;
    image_uris?: {
        small: string;
        normal?: string;
    };
    prices?: {
        usd: string | null;
    };
    purchase_uris: {
        tcgplayer: string;
    };
}

export interface DecklistItem {
    name: string;
    data: ScryfallCard | null;
}

function CardList({ cards }: { cards: DecklistItem[] }) {
    const [hoveredCard, setHoveredCard] = useState<ScryfallCard | null>(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const hideTimer = useRef<number>();

    const handleMouseEnter = (event: React.MouseEvent<HTMLTableRowElement>, card: ScryfallCard) => {
        clearTimeout(hideTimer.current);
        setHoveredCard(card);
        setModalPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = () => {
        hideTimer.current = window.setTimeout(() => {
            setHoveredCard(null);
        }, 100);
    };

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
                <th scope="col" className="p-3 text-right">Price (USD)</th>
            </tr>
        </thead>
    );

    const tableFooter = (
        <tfoot>
            <tr className="font-semibold border-t border-white/10">
                <td colSpan={2} className="p-3 text-right">Total:</td>
                <td className="p-3 text-right">${totalPrice.toFixed(2)}</td>
            </tr>
        </tfoot>
    );

    return (
        <div>
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
                                            return (
                                                <tr
                                                    key={card.name}
                                                    onMouseEnter={cardData ? (e) => handleMouseEnter(e, cardData) : undefined}
                                                    onMouseLeave={cardData ? handleMouseLeave : undefined}
                                                    className={`border-b border-white/5 transition-colors ${cardData ? "cursor-pointer hover:bg-white/10" : "opacity-50"}`}
                                                >
                                                    <td className="p-3">{overallIndex + 1}</td>
                                                    <td className="p-3 truncate">
                                                        <span className={cardData ? "text-primary" : ""}>{card.name}</span>
                                                    </td>
                                                    <td className="p-3 text-right">${cardData?.prices?.usd ?? 'N/A'}</td>
                                                </tr>
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

            {hoveredCard && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        top: `${modalPosition.y}`,
                        left: `${modalPosition.x}`,
                        transform: "translate(20px, 20px)",
                    }}
                >
                    <div
                        className="bg-card/80 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-2 w-fit pointer-events-auto"
                        onMouseEnter={() => clearTimeout(hideTimer.current)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <picture>
                            <source media="(min-width: 768px)" srcSet={hoveredCard.image_uris?.normal || hoveredCard.image_uris?.small} />
                            <img src={hoveredCard.image_uris?.small} alt="Card preview" className="rounded-lg w-64 md:w-auto md:max-w-xs" />
                        </picture>
                        <Button
                            as="a"
                            href={hoveredCard.purchase_uris?.tcgplayer}
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
