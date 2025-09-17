import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState } from "react";
import { DecklistPreview, type DecklistItem } from "./DecklistPreview";
import { Header } from "./Header";


export function App() {
  const [apiResponse, setApiResponse] = useState<DecklistItem[] | string>("");

  return (
    <>
      <Header />
      <main className="container mx-auto p-8 text-center relative z-10 pt-24">
        <Card className="bg-card/50 backdrop-blur-sm border-muted w-full max-w-6xl mx-auto">
          <CardContent className="pt-6">
            {apiResponse ? (
              <DecklistPreview apiResponse={apiResponse} />
            ) : (
              <MoxfieldImporter setApiResponse={setApiResponse} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default App;
