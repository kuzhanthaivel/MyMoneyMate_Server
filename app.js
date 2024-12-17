const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { TransactionData, User } = require('./Schema');
const moment = require("moment");
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

const initializeUser = async () => {
    const existingUser = await User.findOne();
    if (!existingUser) {
      const user = new User({ username: "defaultuser", password: "defaultpassword" });
      await user.save();
      console.log("Initial user created with username: defaultuser");
    }
  };
initializeUser();
const calculateTotalAmountOfCollection = async () => {
    try {
      const allTransactions = await TransactionData.find({});
      const totalAmount = allTransactions.reduce((total, transaction) => total + transaction.paidAmount, 0);
      const allUsers = await User.find({});
      for (const user of allUsers) {
        user.TotalAmmountofcollection = totalAmount;
        await user.save(); 
      }
  
      console.log("Total amount of collection updated for all users");
    } catch (error) {
      console.error("Error calculating total amount of collection:", error);
    }
  };

  setInterval(calculateTotalAmountOfCollection, 30000);
  app.put("/edit-profile", async (req, res) => {
    const { currentUsername, newUsername, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ username: currentUsername });
  
      if (user) {
        if (newUsername) {
          user.username = newUsername;
        }
        if (newPassword) {
          user.password = newPassword;
        }
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  app.post("/verify-user", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.status(200).json({ message: "User verified successfully" });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  app.get("/fetch-username", async (req, res) => {
    try {
      const user = await User.findOne();
      if (user) {
        res.status(200).json({ username: user.username });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.get("/api/total-amount/:username", async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        username: user.username,
        TotalAmmountofcollection: user.TotalAmmountofcollection,
      });
    } catch (error) {
      console.error("Error fetching TotalAmmountofcollection:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/get-all-transactions", async (req, res) => {
    try {
      const allTransactions = await TransactionData.find();
  
      if (!allTransactions || allTransactions.length === 0) {
        return res.status(404).json({ error: "No transactions found" });
      }

      const formattedTransactions = allTransactions.map(transaction => {
        return {
          id: transaction._id.toString(), 
          name: transaction.name,
          balance: transaction.balance.toString(),
          targetAmount: transaction.targetAmount.toString(),
          paidAmount: transaction.paidAmount.toString(),
          transactions: transaction.transactions.map(t => ({
            date: moment(t.date).format("DD/MM/YY"), 
            amount: t.amount.toString()
          }))
        };
      });
  
      res.status(200).json(formattedTransactions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });
  


  app.get("/get-all-names", async (req, res) => {
    try {
      const allNames = await TransactionData.find().select('name');
  
      if (!allNames || allNames.length === 0) {
        return res.status(404).json({ error: "No transaction names found" });
      }

      const namesList = allNames.map((item, index) => ({
        id: index + 1,
        name: item.name
      }));
      res.status(200).json(namesList);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });
  
app.post("/create-member", async (req, res) => {
    const { name, targetAmount } = req.body;
    if (!name || !targetAmount) {
      return res.status(400).json({ error: "Name and targetAmount are required" });
    }
  
    try {
      const newMember = new TransactionData({
        name,
        targetAmount,
        balance: 0,
        paidAmount: 0,
        transactions: []
      });
      await newMember.save();
      res.status(201).json({
        message: "Member created successfully",
        member: newMember
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create member" });
    }
  });

  app.post("/add-transaction", async (req, res) => {
    const { name, date, amount } = req.body;
    if (!name || !date || !amount) {
      return res.status(400).json({
        error: "Name, date, and amount are required and cannot be empty"
      });
    }
  
    try {
      const member = await TransactionData.findOne({ name });
  
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      member.transactions.push({ date, amount });
      await member.save();
      res.status(200).json({
        message: "Transaction added successfully",
        member: member
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add transaction" });
    }
  });

  
  app.delete("/delete-transaction", async (req, res) => {
    const { name, transactionId } = req.body; 
    if (!name || !transactionId) {
      return res.status(400).json({
        error: "Name and transaction ID are required to delete a transaction"
      });
    }
  
    try {
      const member = await TransactionData.findOne({ name });
  
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
  
      const transactionIndex = member.transactions.findIndex(
        (txn) => txn._id.toString() === transactionId
      );
  
      if (transactionIndex === -1) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      member.transactions.splice(transactionIndex, 1);
      await member.save();
  
      res.status(200).json({
        message: "Transaction deleted successfully",
        member: member
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });
  
  app.get("/all-transactions-date", async (req, res) => {
    try {
      const members = await TransactionData.find();
      const allTransactions = members.flatMap((member) =>
        member.transactions.map((txn) => ({
          id: txn._id, 
          name: member.name,
          date: moment(txn.date).format("DD/MM/YY"),
          amount: txn.amount,
        }))
      );
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      res.status(200).json({
        transactions: allTransactions,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  

