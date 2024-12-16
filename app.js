const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Schema
const { TransactionData, User } = require('./Schema');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGO_URL; 

mongoose.connect(mongoUrl).then(() => {
    console.log("MongoDB successfully connected");
}).catch((e) => {
    console.error("Failed to connect to MongoDB", e);
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
