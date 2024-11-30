import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    addresses: { type: [Schema.Types.Mixed], required: true, default: [] },
    orders: { type: [Schema.Types.Mixed], required: true, default: [] },
    cart: { type: [Schema.Types.Mixed], required: true, default: [] },
  },
  {
    timestamps: true,
  }
);

const virtual = UserSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
