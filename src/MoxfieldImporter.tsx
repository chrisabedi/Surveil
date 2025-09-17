import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MoxfieldImporter() {
    const [decklist, setDecklist] = useState("");
    const [apiResponse, setApiResponse] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setApiResponse("Loading...");

        try {
            const response = await fetch('/api/moxfield-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decklist: decklist }),
            });
            const result = await response.text();
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
                    <h3 className="font-semibold">API Response:</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm">{apiResponse}</pre>
                </div>
            )}
        </>
    );
}
