import mongoose from "mongoose";

const searchPostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

searchPostSchema.index({ content: "text" });
searchPostSchema.index({ createdAt: -1 });

const Search = mongoose.model("Search", searchPostSchema);

export default Search;
