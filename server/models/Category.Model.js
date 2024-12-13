import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    label: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const virtual = CategorySchema.virtual("id");

virtual.get(function () {
  return this._id;
});

CategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;