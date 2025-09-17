import { serve } from "bun";
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path'
import { getCwd } from "./lib/utils";
const app = express();
const port = process.env.PORT || 3000;
import { ScryfallClient } from "./Clients/ScryFall";
function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Route hit: ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
  next(); // Pass control to the next middleware or route handler
}
app.use(loggerMiddleware)

app.use(express.json())
let staticPath = getCwd()

app.use(express.static(path.join(staticPath, 'dist')));

app.get('/', (req: Request, res: Response) => {

  res.sendFile(path.join(staticPath, 'dist', 'index.html'));
})

app.post("/api/moxfield-import", async (req: Request, res: Response) => {
  const { decklist } = req.body;

  if (!decklist || typeof decklist !== 'string') {
    return res.status(400).send("Decklist is required as a string in the request body.");
  }

  const client = new ScryfallClient();
  const lines = decklist.split('\n').filter(line => line.trim() !== '');

  const cardNames = lines.map(line => {
    // Regex to capture card name, ignoring quantity and set info in parentheses
    const match = line.trim().match(/^(?:SB:|Commander:)?\s*\d+\s+(.+?)(?:\s+\([^()]+\)\s+[\w-]+)?$/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  }).filter((name): name is string => name !== null);

  const uniqueCardNames = [...new Set(cardNames)];

  try {
    const cardPromises = uniqueCardNames.map(name => client.getCards({ exact: name }));
    const cardDataStrings = await Promise.all(cardPromises);
    const cardData = cardDataStrings
      .filter(Boolean)
      .map(cardString => JSON.parse(cardString!));
    
    return res.json(cardData);
  } catch (error) {
    console.error('Error fetching data from Scryfall:', error);
    return res.status(500).send('An error occurred while fetching card data.');
  }
});

// development: process.env.NODE_ENV !== "production" && {
//   // Enable browser hot reloading in development
//   hmr: true,

//   // Echo console logs from the browser to the server
//   console: true,
// },

app.listen(port, () => {
  console.log(`🚀 Server running at ${port}`);
})
