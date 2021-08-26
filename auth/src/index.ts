import express, { json } from "express";

const app = express();
app.use(json());

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
