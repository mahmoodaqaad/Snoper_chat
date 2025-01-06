const express = require("express")
const { VerifyUser } = require("../Controllers/AuthController")
const { CreateChat, myChats, deleteChat } = require("../Controllers/ChatController")
const router = express.Router()

router.post("/create", VerifyUser, CreateChat)
router.get("/allMyChat", VerifyUser, myChats)
router.delete("/deleteChat/:id", VerifyUser, deleteChat)

module.exports = router