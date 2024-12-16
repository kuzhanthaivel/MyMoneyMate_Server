const mongoose = require("mongoose");

const transactionDataSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  balance: { type: Number, required: true, default: 0 },
  targetAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true, default: 0 },
  transactions: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true }
    }
  ]
});

const TransactionData = mongoose.model("TransactionData", transactionDataSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  lastModificationDate: { type: Date, default: Date.now }
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.lastModificationDate = Date.now();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = {
  TransactionData,
  User
};
