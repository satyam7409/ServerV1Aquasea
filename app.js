import express from "express";
import userroutes from "./src/routes/user.routes.js";

const app = express();
// const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", router);

app.use("/users", userroutes);

export default app;
