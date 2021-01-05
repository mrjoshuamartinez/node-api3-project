const express = require("express");
const userDB = require("./userDb");

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.post("/", validateUserId(), (req, res) => {});

// eslint-disable-next-line no-unused-vars
router.post("/:id/posts", validateUserId(), validatePost(), (req, res) => {});

router.get("/", (req, res) => {
  userDB
    .get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error in retrieving users.",
      });
    });
});

router.get("/:id", validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId(), (req, res) => {
  userDB
    .getUserPosts(req.user)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", validateUser(), (req, res) => {
  userDB
    .remove(req.user)
    .then((res) => {
      res.status(200).json({
        message: `User was successfully deleted.`,
      });
    })
    .then((err) => {
      console.log(err);
      res.status(500).json({
        message: "User could not be deleted.",
      });
    });
});

router.put("/:id", (req, res) => {
  userDB
    .update(req.user, req.body)
    .then((changes) => {
      res.status(200).json(changes.length);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Could not update user.",
      });
    });
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    userDB
      .getById(req.params.id)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({
            message: "Invalid user id.",
          });
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Error retrieving user.",
        });
      });
  };
}

function validateUser() {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Missing user data.",
      });
    }
    if (!req.body.name) {
      return res.status(400).json({
        message: "Missing required name field.",
      });
    }
    next();
  };
}

function validatePost() {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Missing post data.",
      });
    }
    if (!req.body.text) {
      return res.status(400).json({
        message: "Missing required text field.",
      });
    }
    next();
  };
}

module.exports = router;
