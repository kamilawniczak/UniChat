const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/upload-file", userController.uploadFile);
router.patch("/update-me", authController.protect, userController.updateMe);
router.get("/get-users", authController.protect, userController.getUsers);
router.get("/get-friends", authController.protect, userController.getFriends);
router.get(
  "/get-friend-request",
  authController.protect,
  userController.getRequest
);

module.exports = router;
