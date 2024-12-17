import mongoose from "mongoose";

const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    paymentMethod: { type: String, required: true, enum: ["card", "cash"] },
    paymentID: { type: String, required: true, default: "none" },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentSchema.virtual("id").get(function () {
  return this._id;
});

PaymentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
