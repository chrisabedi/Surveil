import { Card, CardContent } from "@/components/ui/card";
import "./index.css";
import { MoxfieldImporter } from "./MoxfieldImporter";
import { useState } from "react";
import { DecklistPreview, type ScryfallCard } from "./DecklistPreview";


export function App() {
  const [apiResponse, setApiResponse] = useState<ScryfallCard[] | string>("");

  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardContent className="pt-6">
          <MoxfieldImporter setApiResponse={setApiResponse} />
        </CardContent>
      </Card>

      {apiResponse && (
        <Card className="bg-card/50 backdrop-blur-sm border-muted mt-8">
          <CardContent className="pt-6">
            <DecklistPreview apiResponse={apiResponse} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;
