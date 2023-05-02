import express from "express";
const router = express.Router();

router.get("/game/add", (req: any, res: any) => {
  res.render("formGames");
});

export default router;
