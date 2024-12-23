const { response } = require("express")
const db = require("../Config/db")
const crypto = require("crypto")


const sentMessage = (req, res) => {

    const senderId = req.CurrentUserId
    const { text, chatId } = req.body
    const id = crypto.randomUUID()
    const sqlsetnMessage = "INSERT INTO messages (messageId,senderId,chatId,text,statusRead) VALUES(?,?,? ,?,?)"

    db.query(sqlsetnMessage, [id, senderId, chatId, text, false], (err, response) => {


        if (err) return res.json(err)
        const sql = "SELECT * FROM messages WHERE messageId = ? "
        db.query(sql, id, (err, data) => {
            if (err) return res.json(err)


            res.json(data[0])
        })
    })



}

const AllChatMessages = (req, res) => {
    const { chatId } = req.params
    const sql = "SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt"
    db.query(sql, [chatId], (err, data) => {
        if (err) return res.json(err)
        res.json({ data })

    })
}


const readMessage = ("/messages/mark-as-read", async (req, res) => {
    const { chatId } = req.body;


    const sql = "UPDATE messages SET statusRead =? WHERE chatId = ?"

    db.query(sql, [true, chatId], (err, response) => {
        if (err) return res.json(err)
        res.json("readed")
    })
});

module.exports = { sentMessage, AllChatMessages, readMessage }