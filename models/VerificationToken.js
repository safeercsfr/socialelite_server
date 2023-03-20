import mongoose from "mongoose";
import bcrypt from "bcrypt";
const verificationTokenSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

verificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.token, 10);
    this.token = hash;
  }
  next();
});

const VerificationTokenModel = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationTokenModel;
