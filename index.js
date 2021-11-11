const express = require("express");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbibs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
app.get("/", (req, res) => {
	res.send("Hello World!");
});
async function run() {
	try {
		await client.connect();
		const productsCollection = client.db("assignment12").collection("products");
		const productCollection = client.db("assignment12").collection("product");
		//get products api
		app.get("/products", async (req, res) => {
			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		});
		app.post("/productsData", async (req, res) => {
			const productData = req.body;
			const result = await productCollection.insertOne(productData);
			console.log(productData);
			res.json(result);
		});

		//Get single service
		// app.get("/services/:id", async (req, res) => {
		// 	const id = req.params.id;
		// 	console.log("hitting special id", id);
		// 	const query = { _id: ObjectId(id) };
		// 	const service = await touristPlace.findOne(query);
		// 	res.json(service);
		// });
		//Delete Api
		// app.delete("/services/:id", async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: ObjectId(id) };
		// 	const service = await touristPlace.deleteOne(query);
		// 	res.json(service);
		// });

		//POST API
		app.post("/products", async (req, res) => {
			const products = req.body;
			console.log("hit data", products);

			const result = await productsCollection.insertOne(products);
			console.log(result);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
