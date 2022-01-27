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
      
      //////////////////// all user
      app.get('/allusers', async (req, res) => {
        const cursor = await blogsCollection.find({}).toArray()
        res.json(cursor)
    })
            
    app.post('/users', async (req, res) => {
        const newUser = req.body;
        const result = await blogsCollection.insertOne(newUser)
        console.log(result);
        res.json(result)
    })
      
      
          ///google--registration data save data bd
          app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = { $set: user }
            const result = await blogsCollection.updateOne(filter, updateDoc, options)
            res.json(result)
            })

        //admin api---make admin--- with jwt token
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            // console.log('put', req.decodedEmail);
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await blogsCollection.updateOne(filter, updateDoc)
            res.json(result)
        })
      
        app.put('/updateStatus/:id', (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            // console.log(updateStatus);
            const filter = { _id: ObjectId(id) };
            blogsCollection.updateOne(filter, {
                $set: { status: updateStatus },
            })
                .then(result => {
                    res.send(result)
                });
        })
      
    //   Delete API
    app.delete('/booking/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: ObjectId(id)}
        const result = await blogsCollection.deleteOne(filter)
        console.log(result);
        res.json(result)
    })
      
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
