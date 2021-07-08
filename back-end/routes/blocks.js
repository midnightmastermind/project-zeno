const express = require("express");
const blocksController = require("../controllers/blocks.controller");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

// GET /blocks
router.get("/", isAuth, blocksController.getBlocks);

// GET /blocks/{id}
router.get("/:blockId", isAuth, blocksController.getBlock);

// POST /blocks
router.post("/", isAuth, blocksController.postBlock);

// PUT /blocks/{id}
router.put("/:blockId", isAuth, blocksController.putBlock);

// DELETE /blocks/{id}
router.delete("/:blockId", isAuth, blocksController.deleteBlock);

// POST /blocks/images
router.post("/images", isAuth, blocksController.postImage);

// DELETE /blocks/images/{name}
router.delete("/images/:imageName", isAuth, blocksController.deleteImage);


module.exports = router;
