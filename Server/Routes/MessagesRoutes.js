const express = require("express")
const router = express.Router()
const { VerifyUser } = require("../Controllers/AuthController")
const { sentMessage, AllChatMessages, readMessage } = require("../Controllers/MessagesController")

router.post("/sent", VerifyUser, sentMessage)
router.get("/allMessages/:chatId", VerifyUser, AllChatMessages)
router.put("/mark-as-read", VerifyUser, readMessage)

module.exports = router