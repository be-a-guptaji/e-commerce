import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [-1, "Price can't be negative"],
    },
    discountPercentage: {
      type: Number,
      required: true,
      max: [100, "Discount can't be more than 100%"],
    },
    rating: {
      type: Number,
      required: true,
      min: [-1, "Rating can't be negative"],
      max: [5, "Rating can't be more than 5"],
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: [-1, "Stock can't be negative"],
      default: 0,
    },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const virtual = ProductSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
