import express, { json } from "express";

const app = express();
app.use(json());

app.get("/api/users/currentuser", (req, res) => {
  res.send("Hello world!");
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
