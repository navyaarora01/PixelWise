import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import pixelwiseRoutes from "./routes/pixelwiseRoutes.js";

dotenv.config(); //this line allows us to pull our envirnment variables form our dotenv file
const app = express(); //express application
app.use(cors({ allow: "*" })); //middleware
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoutes);    //these are api end points
app.use("/api/v1/pixelwise", pixelwiseRoutes); //using this to hook on to our frontend side

app.get("/", async (req, res) => {
	res.send("Hello from pixelwise");
});

const startServer = async () => {
	try {
		connectDB(process.env.MONGODB_URL);
		app.listen(process.env.PORT, () => console.log(`server has started`));
	} catch (error) {
		console.log(error);
	}
};

startServer();

