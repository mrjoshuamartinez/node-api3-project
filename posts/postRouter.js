const express = require("express");
const postDB = require("./postDb");

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get("/", (req, res) => {
  postDB.get().then((post) => {
    return res
      .status(200)
      .json(post)
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Could not retrieve posts.",
        });
      });
  });
});

router.get("/:id", validatePostId(), (req, res) => {
  res.status(200).json(req.post);
});

// eslint-disable-next-line no-unused-vars
router.delete("/:id", validatePostId(), (req, res) => {
  postDB.remove(req.post);
});

// eslint-disable-next-line no-unused-vars
router.put("/:id", validatePostId(), (req, res) => {
  postDB.update(req.post);
});

// custom middleware

// eslint-disable-next-line no-unused-vars
function validatePostId(req, res, next) {
  return (req, res, next) => {
    postDB
      .getById(req.params.id)
      .then((post) => {
        if (post) {
          req.post = post;
          next();
        } else {
          res.status(404).json({
            message: "invalid post id",
          });
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Error retrieving post",
        });
      });
  };
}

module.exports = router;
