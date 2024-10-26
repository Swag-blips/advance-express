import express, { Request, Response } from "express";
import { randomBytes } from "crypto";

const app = express();

app.use(express.json());

interface Post {
  [key: string]: {
    id: string;
    title: string;
  };
}
let posts: Post = {};

app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.post("/posts", (req: Request, res: Response) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  res.status(201).send(posts[id]);
});

app.listen(5000, () => {
  console.log("Listening on 5000");
});
