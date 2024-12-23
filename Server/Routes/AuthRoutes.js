const express = require("express")

const router = express.Router()
const { Register, CheakEmail, Login, VerifyUser, getCurrentUser, Upload } = require("../Controllers/AuthController")

router.post("/register", CheakEmail, Upload.single("image"), Register)
router.post("/login", Login)
router.get("/currentUser", VerifyUser, getCurrentUser)


module.exports = router