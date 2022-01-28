const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Posts = require("../../models/Posts");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

const { check, validationResult } = require("express-validator");

//route post api/posts
//@description post adding
//access auth req

router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      });

      const posts = await newPost.save();
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/posts/:post_id
// @desc   Get particular post
// @access   Private

router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    if (!post) {
      res.status(500).json({ msg: "post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "objectId") {
      res.status(500).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});

// @route    Delete api/posts/:post_id
// @desc   delete particular post
// @access   Private

router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    if (!post) {
      res.status(500).json({ msg: "post not found" });
    }
    await post.remove();
    res.json({ msg: "post deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "objectId") {
      res.status(500).json({ msg: "post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Privaterivate

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    // Check if the post has already been liked using some function
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private

router.delete("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // Check if the post has already been liked using some function
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already unliked" });
    }
    post.likes = post.likes.filter(({ user }) => {
      user.toString() !== req.user.id;
    });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST  api/comment/:post_id
// @desc   comment for particular post
// @access   Private

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Posts.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).status("server error");
    }
  }
);

// @route  DELETE  api/comment/:id/:comment_id
// @desc delete comment for particular post
// @access   Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).status("server error");
  }
});

module.exports = router;
