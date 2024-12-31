import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can't be negative"],
    },
    discountPercentage: {
      type: Number,
      required: true,
      max: [100, "Discount can't be more than 100%"],
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "Rating can't be negative"],
      max: [5, "Rating can't be more than 5"],
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock can't be negative"],
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Stock can't be negative",
      },
    },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [String] },
    sizes: { type: [String] },
    highlights: { type: [String], required: true },
    discountedPrice: { type: Number, required: true },
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
