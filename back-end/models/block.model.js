

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
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
    type: { type: String, enum: ['HomeBlock','PageBlock','TitleBlock','TextBlock']},
    children: [{
      type: Schema.Types.ObjectId,
      ref: "Block",
    }],
    expanded: { type: Boolean, default: false},
  },
  { timestamps: true}
);

BlockSchema.plugin(deepPopulate, {}); //<- {} empty options
const Block = mongoose.model('Block', BlockSchema);

module.exports = Block;
