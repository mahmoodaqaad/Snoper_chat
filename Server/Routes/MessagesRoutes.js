const express = require("express")
const router = express.Router()
const { VerifyUser } = require("../Controllers/AuthController")
const { sentMessage, AllChatMessages, readMessage, deleteMassage, deleteAllMassage } = require("../Controllers/MessagesController")

router.post("/sent", VerifyUser, sentMessage)
router.get("/allMessages/:chatId", VerifyUser, AllChatMessages)
router.put("/mark-as-read/:id", VerifyUser, readMessage)
router.delete("/deleteMassage/:id", VerifyUser, deleteMassage)
router.delete("/deleteAllMassage/:id", VerifyUser, deleteAllMassage)

module.exports = router