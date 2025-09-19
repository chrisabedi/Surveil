import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState, useEffect } from "react";
import { DecklistPreview, type DecklistItem } from "./DecklistPreview";
import { Header } from "./Header";


export function App() {
  const [apiResponse, setApiResponse] = useState<DecklistItem[] | string>("");

  return (
    <>
      <div className="background-container">
        <div
          className="background-image"
        />
      </div>
      <Header />
      <main className="container mx-auto p-4 md:p-8 text-center relative z-10 pt-24 w-full max-w-6xl">
        {apiResponse ? (
          <DecklistPreview apiResponse={apiResponse} />
        ) : (
          <MoxfieldImporter setApiResponse={setApiResponse} />
        )}
      </main>
    </>
  );
}

export default App;
