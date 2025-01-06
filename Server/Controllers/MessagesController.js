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
    const getuser = req.query.getuser || false
    const { chatId } = req.params
    const sql = "SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt"
    db.query(sql, [chatId], (err, data) => {
        if (err) return res.json(err)

        if (data.length === 0) { return res.status(404).json("no message") }
        if (data.length > 0) {
            if (getuser) {

                const id = data[0].senderId
                const fetchuserData = "SELECT id ,name ,profilePhoto FROM users WHERE id =?"

                db.query(fetchuserData, [id], (err, userData) => {

                    if (err) return res.json("user error" + err)

                    return res.json({ data, user: userData[0] })

                })


            }

            else {

                res.json({ data })
            }
        }

    })
}


const readMessage = (req, res) => {
    const { chatId } = req.body;


    const sql = "UPDATE messages SET statusRead =? WHERE chatId = ?"

    db.query(sql, [true, chatId], (err, response) => {
        if (err) return res.json(err)
        res.json("readed")
    })
}



const deleteMassage = (req, res) => {
    const { id } = req.params;


    const sql = "DELETE FROM messages WHERE messageId =?"

    db.query(sql, [id], (err, response) => {
        if (err) return res.json(err)
        res.json("delete Massage")
    })
}
const deleteAllMassage = (req, res) => {
    const { id } = req.params;


    const sql = "DELETE FROM messages WHERE chatId =?"

    db.query(sql, [id], (err, response) => {
        if (err) return res.json(err)

        res.json("delete all messages")
    })
}



module.exports = { sentMessage, AllChatMessages, readMessage, deleteMassage, deleteAllMassage }