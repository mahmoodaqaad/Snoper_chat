const express = require("express")
const cors = require("cors")

const crypto = require("crypto")
const { Server } = require("socket.io");

const UserRoutes = require("./Routes/UsersRoutes")
const AuthRoutes = require("./Routes/AuthRoutes")
const chatRoutes = require("./Routes/ChatRoutes")
const MessagesRoutes = require("./Routes/MessagesRoutes")
const PostRoutes = require("./Routes/PostRoutes")
const app = express()
const cookieParser = require('cookie-parser');
const db = require("./Config/db");
app.use(express.static('public'));

app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use("/api", AuthRoutes)
app.use("/api/users", UserRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/messages", MessagesRoutes)
app.use("/api/post", PostRoutes)



const ExpressServer = app.listen(8000, () => {
    console.log("--------- server is running ------------")
})


const io = new Server(ExpressServer, { cors: "http://localhost:3000" })

let onlineUser = []


app.post("/api/test", (req, res) => {
    res.json("hello")
})

io.on("connection", (socket) => {

    // add user online

    socket.on("addNewUser", (userId) => {
        !onlineUser.some(user => user.userId === userId) &&
            onlineUser.push({
                userId,
                socketId: socket.id
            })

        // send online 



        io.emit("getOnlineUsers", onlineUser)
    })


    // sent Messagw


    socket.on("sentStatusMessage", (message) => {

        const user = onlineUser.find((user) => user.userId === message.reseved)
        if (user) {
            io.to(user.socketId).emit("getStatusMessage", {
                id: crypto.randomUUID(),
                massageReaded: message.openChat ? "read" : "reseved",
                Quickstatus: "readMassage",
                message,
                date: new Date()
            })
        }

    })


    // sent Messagw

    socket.on("sendMessage", (message) => {
        const user = onlineUser.find((user) => user.userId === message.userReseved);
        const obj = {
            id: crypto.randomUUID(),
            status: "Sent message",
            Quickstatus: "message",
            message,
            author: {

                id: message?.author?.id,
                name: message?.author?.name,
                profilePhoto: message?.author?.profilePhoto

            },
            isRead: false,
            date: new Date()
        }
        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNoifications", obj)

        }
        else {
            udatebACK(message.userReseved, obj)
        }
    });

    socket.on("addcomment", (data) => {

        const user = onlineUser.find((user) => user.userId === data.reseved)
        const obj = {
            id: crypto.randomUUID(),
            status: "add comments to your post",
            Quickstatus: "comment_like",
            postId: data.postId,
            text: data.text,
            author: {

                id: data.author.id,
                name: data.author.name,
                profilePhoto: data.author.profilePhoto

            },
            isRead: false,
            date: new Date()
        }
        if (user && user.userId !== data.author.id) {
            io.to(user.socketId).emit("getcomments", obj)
        }
        else {
            udatebACK(data.reseved, obj)
        }

    })

    socket.on("addLike", (data) => {

        const user = onlineUser.find((user) => user.userId === data.reseved)

        const obj = {
            id: crypto.randomUUID(),
            status: "Like to your post",
            Quickstatus: "comment_like",
            postId: data.postId,
            text: data.text,
            author: {

                id: data.author.id,
                name: data.author.name,
                profilePhoto: data.author.profilePhoto

            },
            isRead: false,
            date: new Date()
        }
        if (user && user.userId !== data.author.id) {
            io.to(user.socketId).emit("getLikes", obj)
        }
        else {
            udatebACK(data.reseved, obj)
        }


    })

    socket.on("sentrequstAdd", (data) => {

        const user = onlineUser.find((user) => user.userId === data.reseved)
        const obj = {
            id: crypto.randomUUID(),
            status: "sent requst add friend",
            Quickstatus: "freindreq",

            author: {

                id: data.author.id,
                name: data.author.name,
                profilePhoto: data.author.profilePhoto

            },
            isRead: false,
            date: new Date()
        }
        if (user) {
            io.to(user.socketId).emit("getrequstAdd", obj)
        }
        else {
            udatebACK(data.reseved, obj)
        }

    })



    socket.on("setAcceptRequst", (data) => {

        const user = onlineUser.find((user) => user.userId === data.reseved)
        const obj = {
            id: crypto.randomUUID(),
            status: "accept your requst",
            Quickstatus: "freind",

            author: {

                id: data.author.id,
                name: data.author.name,
                profilePhoto: data.author.profilePhoto

            },
            isRead: false,
            date: new Date()
        }
        if (user) {
            io.to(user.socketId).emit("getAcceptRequst", obj)
        }
        else {
            udatebACK(data.reseved, obj)
        }

    })


    const udatebACK = (id, obj) => {
        const sqlFetchCurrentUser = "SELECT Noification FROM users WHERE id = ?";
        db.query(sqlFetchCurrentUser, [id], (err, dataNoft) => {
            if (err) return console.log("err>>>>>>>>>>>>>>", err);

            if (dataNoft.length > 0) {
                const curentnofi = dataNoft[0].Noification ? JSON.parse(dataNoft[0].Noification) : [];
                const x = [obj, ...curentnofi];

                const sql = "UPDATE users SET Noification = ? WHERE id = ?";
                db.query(sql, [JSON.stringify(x), id], (err, response) => {
                    if (err) return console.log(err);
                    console.log("added");
                });
            }
        });

    }
    // disconnect
    socket.on("disconnect", () => {
        onlineUser = onlineUser.filter(user => user.socketId !== socket.id)
        io.emit('getOnlineUsers', onlineUser)
    })
})