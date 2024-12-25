const db = require("../Config/db")

const crypto = require("crypto")






const CreateChat = (req, res) => {

    const firstId = req.CurrentUserId
    const secendId = req.body.secendId
    const FetchallChat = "SELECT * FROM chats"

    db.query(FetchallChat, (err, chats) => {

        if (err) return res.status(404).json(err)
        let isChatCreated = false
        let ChatCreated = ""
        chats?.map(chat => {
            if ((chat.firstId === firstId || chat.secendId === firstId) && (chat.firstId === secendId || chat.secendId === secendId)) {
                isChatCreated = true
                ChatCreated = chat
                return
            }

        })
        if (isChatCreated) {

            const myId = req.CurrentUserId;

            // استعلام لجلب الشاتات التي تحتوي على myId في الأعضاء
            const sql = "SELECT * FROM chats WHERE firstId = ? OR secendId = ?";

            db.query(sql, [myId, myId], (err, chats) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });

                if (chats) {

                    const freindIds = []
                    chats.map(chat => {
                        freindIds.push(chat.firstId === myId ? chat.secendId : chat.firstId)

                    })


                    if (freindIds.length > 0) {
                        const fetchfreindsSql = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;
                        db.query(fetchfreindsSql, [freindIds], (err, freindsData) => {
                            if (err) return res.status(500).json({ message: "Error fetching freind data", error: err });
                            const FrendAndChat = freindsData.map(freind => { return { ...freind, chat: chats.filter(chat => freind.id === chat.firstId || freind.id === chat.secendId) } })

                            return res.json({ ChatCreated: FrendAndChat, currentChat: true });
                        });

                    }
                }
            });

        }
        else {

            const id = crypto.randomUUID()
            const newChatSql = "INSERT INTO chats (chatId,firstId,secendId) VALUES(?,?,?)"
            db.query(newChatSql, [id, firstId, secendId], (err, response) => {
                if (err) return res.json("error data base")



                const myId = req.CurrentUserId;

                // استعلام لجلب الشاتات التي تحتوي على myId في الأعضاء
                const sql = "SELECT * FROM chats WHERE firstId = ? OR secendId = ?";

                db.query(sql, [myId, myId], (err, chats) => {
                    if (err) return res.status(500).json({ message: "Database error", error: err });

                    if (chats) {

                        const freindIds = []
                        chats.map(chat => {
                            freindIds.push(chat.firstId === myId ? chat.secendId : chat.firstId)

                        })


                        if (freindIds.length > 0) {
                            const fetchfreindsSql = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;
                            db.query(fetchfreindsSql, [freindIds], (err, freindsData) => {
                                if (err) return res.status(500).json({ message: "Error fetching freind data", error: err });
                                const FrendAndChat = freindsData.map(freind => { return { ...freind, chat: chats.filter(chat => freind.id === chat.firstId || freind.id === chat.secendId) } })

                                return res.json({ ChatCreated: FrendAndChat, currentChat: false });
                            });

                        }
                    }
                });



            })
        }



    })


}

const myChats = (req, res) => {
    const myId = req.CurrentUserId;

    // استعلام لجلب الشاتات التي تحتوي على myId في الأعضاء
    const sql = "SELECT * FROM chats WHERE firstId = ? OR secendId = ?";

    db.query(sql, [myId, myId], (err, chats) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (chats.length === 0) return res.status(404).json("No Chat")
        if (chats.length > 0) {

            const freindIds = []
            chats.map(chat => {
                freindIds.push(chat.firstId === myId ? chat.secendId : chat.firstId)

            })


            if (freindIds.length > 0) {
                const fetchfreindsSql = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;
                db.query(fetchfreindsSql, [freindIds], (err, freindsData) => {
                    if (err) return res.status(500).json({ message: "Error fetching freind data", error: err });
                    const FrendAndChat = freindsData.map(freind => { return { ...freind, chat: chats.filter(chat => freind.id === chat.firstId || freind.id === chat.secendId) } })

                    return res.json({ FrendAndChat });
                });

            }
        }
    });
};


module.exports = { CreateChat, myChats }