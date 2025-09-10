import express from "express";
import userroutes from "./src/routes/user.routes.js";
import cors from "cors";

const app = express();
// const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userroutes);

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);


export default app;
