const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require("../controllers/userController");

router.get('/current', authMiddleware.authenticateToken, userController.getCurrentUser);
router.get("/", authMiddleware.authenticateToken, userController.getUsers);
router.get("/:id", userController.getUserById);

module.exports = router;