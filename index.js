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

/////////admin verify wit jwt---firebase admin
// async function verifyToken(req, res, next) {
//     if (req?.headers?.authorization?.startsWith('Bearer ')) {
//         const token = req.headers.authorization.split(' ')[1];
//         console.log(token);

//         try {

//             const decodedUser = await admin.auth().verifyIdToken(token)
//             req.decodedEmail = decodedUser.email;
//             //email ta pacchena token thik ache
//         } catch {

//         }

//     }
//     next()
// }

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
