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

app.get("/api/hello", async (req: Request, res: Response) => {


  const client = new ScryfallClient()

  let data = {
    fuzzy: 'aust com'
  }
  let message = await client.getCards(data)

  return res.json({
    message,
    method: "GET",
  });
});
app.get("/api/hello", (req: Request, res: Response) => {

  return res.json({
    message: "Hello, world!",
    method: "GET",
  });
});

app.put("/api/hello", (req: Request, res: Response) => {

  return res.json({
    message: "Hello, world!",
    method: "PUT",
  });

});

app.get("/api/hello/:name", (req: Request, res: Response) => {
  const name = req.params.name;
  return res.json({
    message: `Hello, ${name}!`,
  });

})

// development: process.env.NODE_ENV !== "production" && {
//   // Enable browser hot reloading in development
//   hmr: true,

//   // Echo console logs from the browser to the server
//   console: true,
// },

app.listen(port, () => {
  console.log(`🚀 Server running at ${port}`);
})
