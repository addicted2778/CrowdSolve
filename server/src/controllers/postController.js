const Post = require("../models/Post");
const Solution = require("../models/Solution");
const {  sendResponse } = require("../helper/helper");
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/post'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + (file.originalname || 'upload'))
});
const upload = multer({ storage });

const createPost = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const imageUrl = req.file ? `/uploads/post/${req.file.filename}` : null;

    const post = new Post({
      authorId: req.user.id,
      authorName: req.user.name,
      title,
      description,
      location,
      imageUrl
    });
    await post.save();

    return sendResponse(res, {
      data: { statusCode: 200, message: 'Post created', post },
      code: 200
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, { data: { statusCode: 500, message: 'Server error' }, code: 500 });
  }
};
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    return sendResponse(res, {
      data: { statusCode: 200, message: "", posts },
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: "Server error" },
      code: 500,
    });
  }
};
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return sendResponse(res, {
        data: { statusCode: 400, message: "Post not found" },
        code: 400,
      });
    }

    const solutions = await Solution.find({
      _id: { $in: post.solutions },
    }).lean();
    return sendResponse(res, {
      data: {
        statusCode: 200,
        message: "",
        post: { ...post, solutions },
      },
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: "Server error" },
      code: 500,
    });
  }
};

const addSolution = async (req, res) => {
  try {
    const { text } = req.body;
    const solution = new Solution({
      authorId: req.user.id,
      authorName: req.user.name,
      text,
    });
    await solution.save();

    const post = await Post.findById(req.params.id);
    post.solutions.push(solution._id);
    await post.save();

    return sendResponse(res, {
      data: { statusCode: 200, message: "Solution added", solution },
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: "Server error" },
      code: 500,
    });
  }
};

const upvoteSolution = async (req, res) => {
  try {
    const sol = await Solution.findById(req.params.solutionId);
    if (!sol)
      return sendResponse(res, {
        data: { statusCode: 400, message: "Solution not found" },
        code: 400,
      });

    const userId = req.user.id;
    const idx = sol.upvotes.findIndex((u) => u.toString() === userId);
    if (idx === -1) sol.upvotes.push(userId);
    else sol.upvotes.splice(idx, 1);

    await sol.save();
    return sendResponse(res, {
      data: {
        statusCode: 200,
        message: "Upvote updated",
        upvotesCount: sol.upvotes.length,
        upvoted: idx === -1,
      },
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: "Server error" },
      code: 500,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const sol = await Solution.findById(req.params.solutionId);
    if (!sol)
      return sendResponse(res, {
        data: { statusCode: 400, message: "Solution not found." },
        code: 400,
      });

    sol.comments.push({
      authorId: req.user.id,
      authorName: req.user.name,
      text: req.body.text,
    });
    await sol.save();

    return sendResponse(res, {
      data: { statusCode: 200, message: "Comment added.", solution: sol },
      code: 200,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: "Server error." },
      code: 500,
    });
  }
};

module.exports = {
  upload,
  createPost,
  getPosts,
  getPostById,
  addSolution,
  upvoteSolution,
  addComment,
};
