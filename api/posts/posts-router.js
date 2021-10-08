// implement your posts router here
const express = require("express");
const Post = require("./posts-model");

const router = express.Router();

//[GET] /api/posts
router.get("/", (req, res) => {
  Post.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

//[GET] /api/posts/:id
router.get("/:id", (req, res) => {
  const idVar = req.params.id;
  Post.findById(idVar)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

//[POST] /api/posts
router.post("/", (req, res) => {
  const newPost = req.body;
  //   console.log("req.body ", req.body);
  if (!newPost.title || !newPost.contents) {
    res.status(400).json("Please provide title and contents for post.");
  } else {
    Post.insert(newPost)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// [PUT] /api/posts/:id

router.put("/:id", (req, res) => {
  const idVar = req.params.id;
  const updatedPost = req.body;
  // console.log("ID: ", idVar);
  console.log("body: ", updatedPost);
  if (!updatedPost.title || !updatedPost.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post.",
    });
  } else {
    Post.findById(idVar)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: err,
        });
      });
    Post.update(idVar, updatedPost)
      .then((post) => {
        console.log("upPost:  ", post);
        res.status(200).json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const idVar = req.params.id;
  Post.remove(idVar)
    .then((deletedUser) => {
      if (!deletedUser) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(201).json(deletedUser);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "The post could not be removed" });
    });
});

router.get("/:id/comments", (req, res) => {
  const idVar = req.params.id;
  console.log(idVar);
  Post.findById(idVar)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        Post.findPostComments(post.id)
          .then((comments) => {
            res.status(200).json(comments);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "The comments information could not be retrieved",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

module.exports = router;
