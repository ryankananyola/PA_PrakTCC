import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoute);

app.listen(3000, () => console.log("Server connected"));
