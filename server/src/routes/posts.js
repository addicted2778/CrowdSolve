const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  upload,
  createPost,
  getPosts,
  getPostById,
  addSolution,
  upvoteSolution,
  addComment,
} = require("../controllers/postController");

const router = express.Router();

// Post routes
router.post("/", auth, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/:id/solutions", auth, addSolution);
router.post("/solutions/:solutionId/upvote", auth, upvoteSolution);
router.post("/solutions/:solutionId/comments", auth, addComment);

module.exports = router;
