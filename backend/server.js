const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const uri=process.env.MONGO_URI
const app = express();
const PORT = process.env.PORT || 4000

const corsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let items
async function connect() {
    try {
        const client = await MongoClient.connect(
            uri
        );
        const myDB = client.db("Multiplier");
        items = myDB.collection("Todo_items");

        console.log("Connected to the database");
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

connect().then();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/allItems", async (req, res) => {
    try {
        const result = await items.find().toArray();
        res.status(200).json({ items: result });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to fetch items" });
    }
});

app.post("/addItem", async (req, res) => {
    try {
        const { task } = req.body;
        const result = await items.insertOne({ task: task });
        res.status(200).json({ message: "Item added", item: { task, _id: result.insertedId } });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Task failed" });
    }
});

app.delete("/deleteItem/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        const { id } = req.params;
        const result = await items.findOneAndDelete({ _id: new ObjectId(id) });
        console.log(result)
        if (result) {
            res.send({ message: "Deleted successfully" }).status(200);
        } else {
            res.status(404).send({ message: "Item not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to delete" });
    }
});
