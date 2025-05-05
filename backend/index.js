import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import paymentRoute from "./routes/paymentRoute.js"
import orderRoute from "./routes/orderRoute.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoute);
app.use(paymentRoute);
app.use(orderRoute);

app.listen(3000, () => console.log("Server connected"));
