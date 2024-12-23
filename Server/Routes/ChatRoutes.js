const express = require("express")
const { VerifyUser } = require("../Controllers/AuthController")
const { CreateChat, myChats } = require("../Controllers/ChatController")
const router = express.Router()

router.post("/create", VerifyUser, CreateChat)
router.get("/allMyChat", VerifyUser, myChats)

module.exports = router