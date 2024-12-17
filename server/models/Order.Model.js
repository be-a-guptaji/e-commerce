import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true, default: [] },
    totalAmount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "dispatched", "delivered", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

const virtual = OrderSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

OrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
