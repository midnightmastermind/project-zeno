

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlockSchema = new Schema(
  {
    tag: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pageBlock: {
      type: Boolean,
      required: false,
      default: false
    },
    blocks: [{
      type: Schema.Types.ObjectId,
      ref: "Block",
    }],
  },
  { timestamps: true}
);

const Block = mongoose.model('Block', BlockSchema);

module.exports = Block;
