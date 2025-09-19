import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState, useEffect } from "react";
import { DecklistPreview, type DecklistItem } from "./DecklistPreview";
import { Header } from "./Header";


export function App() {
  const [apiResponse, setApiResponse] = useState<DecklistItem[] | string>("");
  const firstCardData = Array.isArray(apiResponse) && apiResponse.length > 0 ? apiResponse[0]?.data : null;
  const imageUrl = firstCardData
    ? firstCardData.card_faces?.[0]?.image_uris?.normal ||
      firstCardData.card_faces?.[0]?.image_uris?.small ||
      firstCardData.image_uris?.normal ||
      firstCardData.image_uris?.small
    : null;

  return (
    <>
      <div className="background-container">
        <div
          className="background-image"
        />
      </div>
      <Header />
      <div className="container mx-auto p-4 md:p-8 relative z-10 pt-24">
        <div className="flex gap-x-8 max-w-6xl mx-auto">
          <main className="flex-1 text-center">
            {apiResponse ? (
              <DecklistPreview apiResponse={apiResponse} />
            ) : (
              <MoxfieldImporter setApiResponse={setApiResponse} />
            )}
          </main>
          {firstCardData && imageUrl && (
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="text-center font-bold text-lg mb-4">
                  Surveil
                </h2>
                <img
                  src={imageUrl}
                  alt={firstCardData.name}
                  className="rounded-lg w-full"
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
