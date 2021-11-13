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
		const reviewCollection = client.db("assignment12").collection("review");
		const usersCollection = client.db("assignment12").collection("users");
		//get products api
		app.get("/products", async (req, res) => {
			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		});
		//order
		app.post("/productsData", async (req, res) => {
			const productData = req.body;
			const result = await productCollection.insertOne(productData);
			console.log(productData);
			res.json(result);
		});
		// my order
		app.get("/myOrders/:email", async (req, res) => {
			const result = await productCollection
				.find({ email: req.params.email })
				.toArray();
			res.json(result);
		});
		//cancel Order
		app.delete("/products/:id"),
			async (req, res) => {
				const id = req.params.id;
				console.log(id);
				const query = { _id: ObjectId(id) };
				const result = await productsCollection.deleteOne(query);
				console.log("delete", result);
				res.json(result);
			};
		//review
		// app.post("/review", async (req, res) => {
		// 	const reviewData = req.body;
		// 	const result = await reviewCollection.insertOne(reviewData);
		// 	console.log(reviewData);
		// 	res.json(result);
		// });
		app.post("/review", async (req, res) => {
			const result = await reviewCollection.insertOne(req.body);
			// console.log(reviewData);
			res.send(result);
		});
		//show review
		app.get("/review", async (req, res) => {
			const cursor = reviewCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});
		//user
		app.post("/users", async (req, res) => {
			const user = req.body;
			const result = await usersCollection.insertOne(user);

			res.send(result);
			console.log(result);
		});
		//make admin
		app.put("/makeAdmin", async (req, res) => {
			console.log(req.body);
			const filter = { email: req.body.email };
			const result = await usersCollection.find(filter).toArray();

			if (result) {
				const documents = await usersCollection.updateOne(filter, {
					$set: { role: "admin" },
				});
				console.log(documents);
			}
			// console.log(result);
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

		// POST API
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
