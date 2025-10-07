import mongoose, { Schema } from "mongoose";

const RepositorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    content: [
      {
        type: String,
      },
    ],
    visibility: {
      type: Boolean,
    },

    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  { timestamps: true } 
);

const Repository = mongoose.model("Repository", RepositorySchema);
export default Repository;
