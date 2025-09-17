import { useState, useRef } from "react";

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
            <tr>
                <th scope="col" className="px-2 py-2 w-8">#</th>
                <th scope="col" className="px-2 py-2">Name</th>
                <th scope="col" className="px-2 py-2 text-right">Price (USD)</th>
            </tr>
        </thead>
    );

    const tableFooter = (
        <tfoot>
            <tr className="font-semibold border-t">
                <td colSpan="2" className="px-2 py-2 text-right">Total:</td>
                <td className="px-2 py-2 text-right">${totalPrice.toFixed(2)}</td>
            </tr>
        </tfoot>
    );

    return (
        <div>
            <div className="flex gap-x-8">
                <div className={`space-y-1 overflow-y-auto max-h-[60vh] pr-2 ${singleColumn ? "w-full" : "w-1/2"}`}>
                    <table className="w-full text-sm text-left">
                        {tableHeader}
                        <tbody>
                            {firstHalf.map((card, index) => {
                                const cardData = card.data;
                                return (
                                    <tr
                                        key={card.name}
                                        onMouseEnter={cardData ? (e) => handleMouseEnter(e, cardData) : undefined}
                                        onMouseLeave={cardData ? handleMouseLeave : undefined}
                                        className={cardData ? "cursor-pointer hover:bg-muted-foreground/20" : ""}
                                    >
                                        <td className="px-2 py-1">{index + 1}</td>
                                        <td className="px-2 py-1 truncate">
                                            <span className={cardData ? "underline text-blue-500" : ""}>{card.name}</span>
                                        </td>
                                        <td className="px-2 py-1 text-right">${cardData?.prices?.usd ?? 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {singleColumn && tableFooter}
                    </table>
                </div>
                {!singleColumn && (
                    <div className="w-1/2 space-y-1 overflow-y-auto max-h-[60vh] pr-2">
                        <table className="w-full text-sm text-left">
                            {tableHeader}
                            <tbody>
                                {secondHalf.map((card, index) => {
                                    const cardData = card.data;
                                    return (
                                        <tr
                                            key={card.name}
                                            onMouseEnter={cardData ? (e) => handleMouseEnter(e, cardData) : undefined}
                                            onMouseLeave={cardData ? handleMouseLeave : undefined}
                                            className={cardData ? "cursor-pointer hover:bg-muted-foreground/20" : ""}
                                        >
                                            <td className="px-2 py-1">{firstHalf.length + index + 1}</td>
                                            <td className="px-2 py-1 truncate">
                                                <span className={cardData ? "underline text-blue-500" : ""}>{card.name}</span>
                                            </td>
                                            <td className="px-2 py-1 text-right">${cardData?.prices?.usd ?? 'N/A'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {tableFooter}
                        </table>
                    </div>
                )}
            </div>

            {hoveredCard && (
                <div
                    className="fixed z-50"
                    style={{
                        top: `${modalPosition.y}px`,
                        left: `${modalPosition.x}px`,
                        transform: 'translate(20px, 20px)',
                    }}
                    onMouseEnter={() => clearTimeout(hideTimer.current)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="bg-card/50 backdrop-blur-sm border border-muted rounded-xl shadow-2xl p-2 w-fit">
                        <picture>
                            <source media="(min-width: 768px)" srcSet={hoveredCard.image_uris?.normal || hoveredCard.image_uris?.small} />
                            <img src={hoveredCard.image_uris?.small} alt="Card preview" className="rounded-lg w-64 md:w-auto md:max-w-xs" />
                        </picture>
                        <a
                            href={hoveredCard.purchase_uris?.tcgplayer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center mt-2 text-blue-500 underline"
                        >
                            View on TCGPlayer
                        </a>
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
