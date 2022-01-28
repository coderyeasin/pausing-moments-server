const express = require("express");
const app = express();
const cors = require("cors");
// const admin = require("firebase-admin");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

//middlewear
app.use(cors());
app.use(express.json());

//////////////Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tie3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Generated API
async function server() {
  try {
    await client.connect();
    console.log("db connnect");

    //Database
    const database = client.db("moments_share");
    const blogsCollection = database.collection("blogs");

    app.get("/blogs", async (req, res) => {
      const cursor = await blogsCollection.find({}).toArray();
      res.json(cursor);
    });

    app.post("/blogs", async (req, res) => {
      const newBlogs = req.body;
      const result = await blogsCollection.insertOne(newBlogs);
      console.log(result);
      res.json(result);
    });
    app.get("/allBlogs", async (req, res) => {
      const cursor = await blogsCollection.find({}).toArray();
      res.json(cursor);
    });
    //////////////////// all user
    app.get("/allusers", async (req, res) => {
      const cursor = await blogsCollection.find({}).toArray();
      res.json(cursor);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await blogsCollection.insertOne(newUser);
      console.log(result);
      res.json(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });

    ///google--registration data save data bd
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await blogsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //admin api---make admin---
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", req.headers.authorization);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await blogsCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await blogsCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { status: updateOrder.status },
      };
      const result = await blogsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });

    //   Delete API
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await blogsCollection.deleteOne(filter);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
server().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pausing Your Moments");
});

app.listen(port, () => {
  console.log(`Listening Moments At: ${port}`);
});
