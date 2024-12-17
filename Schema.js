const mongoose = require("mongoose");

const transactionDataSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  balance: { type: Number, required: true, default: 0 },
  targetAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true, default: 0 },
  transactions: [
    {
      date: { type: Date },
      amount: { type: Number }
    }
  ]
});

transactionDataSchema.pre("save", function (next) {
  const totalPaidAmount = this.transactions.reduce((total, txn) => total + txn.amount, 0);
  this.paidAmount = totalPaidAmount;
  this.balance = this.targetAmount - this.paidAmount;
  next();
});

const TransactionData = mongoose.model("TransactionData", transactionDataSchema);


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  TotalAmmountofcollection: { type: Number, required: true, default: 0 }, 
});


const User = mongoose.model("User", userSchema);

module.exports = {
  TransactionData,
  User
};
