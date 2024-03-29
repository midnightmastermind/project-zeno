const fs = require('fs-extra')
const path = require("path");

const Block = require("../models/block.model");
const User = require("../models/user.model");

const getBlocks = async (req, res, next) => {
  const userId = req.userId;

  try {
    if (!userId) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    const blocks = await Block.findOne({ creator: userId, type: "HomeBlock"}).deepPopulate('children children.children children.children');
    res.status(200).json({
      message: "Fetched blocks successfully.",
      blocks: blocks,
    });
  } catch (err) {
    next(err);
  }
};

const getBlock = async (req, res, next) => {
  const userId = req.userId;
  const blockId = req.params.blockId;

  try {
    const block = await Block.findById(blockId).deepPopulate('children children.children children.children');
    if (!block) {
      const err = new Error("Could not find block by id.");
      err.statusCode = 404;
      throw err;
    }

    // Public blocks have no creator, they can be accessed by anybody
    // For private blocks, creator and logged-in user have to be the same
    const creatorId = block.creator ? block.creator.toString() : null;
    if ((creatorId && creatorId === userId) || !creatorId) {
      res.status(200).json({
        message: "Fetched block successfully.",
        block: block,
      });
    } else {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const postBlock = async (req, res, next) => {
  const userId = req.userId;
  const req_block = req.body.block;

  const block = new Block({
    ...req_block,
    creator: userId || null,
  });

  if(req_block.type == "PageBlock") {
    const headerBlock = new Block({
      tag: 'h1',
      children: [],
      html: 'Untitled',
      type: 'TitleBlock',
      imageUrl: "",
      creator: userId || null,
    });
    const savedHeaderBlock = await headerBlock.save();
    block.children.push(savedHeaderBlock);
  }

  try {
    const savedBlock = await block.save();

    if(savedBlock.type == "PageBlock") {
      const homeBlock = await Block.findOne({ creator: userId, type: 'HomeBlock' });
      homeBlock.children.push(savedBlock);
      const savedHomeBlock = await homeBlock.save();
    }
    res.status(201).json({
      message: "Created block successfully.",
      blockId: savedBlock._id.toString(),
      block: block,
      creator: userId || null,
    });
  } catch (err) {
    next(err);
  }
};

const putBlock = async (req, res, next) => {
  const userId = req.userId;
  const blockId = req.params.blockId;
  let updatedBlock = req.body;
  let newBlocks = [];
  let changedTitle = null;

  try {
    if (updatedBlock.children) {
      updatedBlock.children.map(block => {
        if(block.type == "TitleBlock") {
          changedTitle = block.html;
        }
        if(block._id) {
          let updateBlock = Block.findByIdAndUpdate(block._id, block, {useFindAndModify: false, upsert: true}, function (err, doc){
          });
          newBlocks.push(updateBlock._update);
        } else {
          let newBlock = new Block({
            ...block
          });
          const savedBlock = newBlock.save();
          newBlocks.push(savedBlock);
        }
      });
    }

    if (changedTitle) {
      updatedBlock.html = changedTitle
    }
    const savedBlock = await Block.findByIdAndUpdate(blockId, updatedBlock, {useFindAndModify: false, upsert: true}, function (err, doc){
    });;

    if (newBlocks.length != 0) {
      savedBlock.children = newBlocks;
      savedBlock.save();
    }

    res.status(200).json({
      message: "Updated block successfully.",
      block: savedBlock,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBlock = async (req, res, next) => {
  const userId = req.userId;
  const blockId = req.params.blockId;

  try {
    const block = await Block.findById(blockId);

    if (!block) {
      const err = new Error("Could not find block by id.");
      err.statusCode = 404;
      throw err;
    }

    // Public blocks have no creator, they can be deleted by anybody
    // For private blocks, creator and logged-in user have to be the same
    const creatorId = block.creator ? block.creator.toString() : null;
    if ((creatorId && creatorId === userId) || !creatorId) {
      const deletedBlock = await Block.findByIdAndDelete(blockId);


      // Delete images folder too (if exists)
      const dir = `images/${blockId}`;
      fs.access(dir, (err) => {
        // If there is no error, the folder does exist
        if (!err && dir !== "images/") {
          fs.removeSync(dir);
        }
      });

      res.status(200).json({
        message: "Deleted block successfully.",
      });
    } else {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const postImage = (req, res, next) => {
  if (req.file) {
    const imageUrl = req.file.path;
    res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl: imageUrl,
    });
  } else {
    const error = new Error("No image file provided.");
    error.statusCode = 422;
    throw error;
  }
};

const deleteImage = (req, res, next) => {
  const imageName = req.params.imageName;
  if (imageName) {
    const imagePath = `images/${imageName}`;
    clearImage(imagePath);
    res.status(200).json({
      message: "Deleted image successfully.",
    });
  } else {
    const error = new Error("No imageName provided.");
    error.statusCode = 422;
    throw error;
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.getBlocks = getBlocks;
exports.getBlock = getBlock;
exports.postBlock = postBlock;
exports.putBlock = putBlock;
exports.deleteBlock = deleteBlock;
exports.postImage = postImage;
exports.deleteImage = deleteImage;
