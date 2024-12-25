const express = require("express")

const router = express.Router()
const { VerifyUser } = require("../Controllers/AuthController")
const { createPost, Upload, AllPost, likePost, getpostData, like_comment, getPost, createComments, deleteComment, deletePost, getPostToAuthor } = require("../Controllers/postController")
const { sqlFetchUserData } = require("../Controllers/UserController")
// router.post("/create", VerifyUser, Upload.array("postImages", 10), createPost)
router.post("/create", VerifyUser,  createPost)
router.delete("/deletePost/:id", VerifyUser, getpostData, deletePost)
router.get("/allPost", VerifyUser, AllPost)
router.get("/getPost/:id", VerifyUser, getPost)
router.post("/likePost/:id", VerifyUser, getpostData, likePost)
router.post("/createComments/:id", VerifyUser, getpostData, createComments)


router.post("/deleteComment/:id", VerifyUser, getpostData, deleteComment)


router.post("/like_comment/:id", VerifyUser, like_comment)

router.get("/getPostToAuthor/:id", VerifyUser, getPostToAuthor)

module.exports = router