import mongoose from "mongoose";
const connectDB = (url) => {
	mongoose.set("strictQuery", true); //this will be useful when we would be working with the search functionality

	mongoose.connect(url) //connect the database
		.then(() => console.log("MongoDB connected"))
		.catch((err) => console.log(err));
};

export default connectDB;
