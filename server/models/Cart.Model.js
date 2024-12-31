import mongoose from "mongoose";

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    color: { type: String, required: true },
    size: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const virtual = CartSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

CartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
