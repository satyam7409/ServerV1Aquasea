import { Router } from "express";

const router = Router();

import { upload } from "../middlewares/multer.middleware.js";
import { uploadFasta } from "../controllers/user.controller.js";

router.post("/upload-fasta", upload.single("file"), uploadFasta);

router.post("/hello", (req, res) => {
  res.send("Hello World!");
});

export default router;
