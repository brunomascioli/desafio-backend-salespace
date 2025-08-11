import express from "express";
import { orderRoutes } from "./infra/routes/order.routes.js";
import { errorHandler } from "./infra/middleware/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/v1/orders', orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});