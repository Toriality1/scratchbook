import express from "express";
import { Router } from "express";
const app = express();
const route = Router();
app.use(express.json());
route.get("/", (req, res) => {
    res.json({ message: "hello world with Typescript" });
});
app.use(route);
app.listen(3333, () => "server running on port 3333");
//# sourceMappingURL=server.js.map