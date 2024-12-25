const { json } = require("stream/consumers")
const db = require("../Config/db")

const crypto = require("crypto")

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { sqlFetchUserData } = require("./UserController");
// const {url}=require("../index")
const url = "http://localhost:8000/Images/"
// const url = "https://snoper-chat.onrender.com/Images/"


const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "Public/Images")
        console.log('Saving to1:'); // تسجيل المسار في الطرفية

    }, filename: (req, file, cd) => {
        cd(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        console.log('Saving to1:'); // تسجيل المسار في الطرفية

    }
})

const Upload = multer({
    storage: storage
})


const createPost = (req, res) => {

    const myId = req.CurrentUserId
    const id = crypto.randomUUID()

    // const images = req.files.map(file => url + file.filename)

    const { title, images } = req.body
    const sql = "INSERT INTO posts (postId,auther,title,images) VALUES (?,?,?,?)"
    db.query(sql, [id, myId, title, JSON.stringify(images)], (err, response) => {
        if (err) return res.json(err)

        res.json("add post")

    })


}

const deletePost = (req, res) => {

    const { id } = req.params
    const dataPost = req.dataPost

    const images = dataPost.images ? JSON.parse(dataPost.images) : []

    const defultNameImage = images.map(item => item.replace(url, ""))

    try {

        defultNameImage.map(item => {
            fs.unlinkSync(path.join(__dirname, "../Public/Images", item))
        })

    } catch (e) {

    }

    const sql = "DELETE FROM posts WHERE postId =?"
    db.query(sql, [id], (err, response) => {
        if (err) return res.json("error in ")

        res.json("deleted succusfully")

    })

}

const AllPost = (req, res) => {
    const myId = req.CurrentUserId;

    // جلب كل المنشورات
    const sqlFetchPosts = "SELECT * FROM posts";
    db.query(sqlFetchPosts, (err, postData) => {
        if (err) return res.status(500).json({ message: "Error fetching posts", error: err });
        if (postData.length === 0) return res.status(404).json({ message: "No posts found" });

        // إنشاء قائمة بالوعود (Promises) لجلب بيانات الناشرين
        const postPromises = postData.map((post) => {
            const authorId = post.auther;

            // جلب بيانات الناشر (author)
            const sqlFetchAuthor = "SELECT id, name, profilePhoto, myFreind, resevedRequest, sendRequst FROM users WHERE id = ?";
            return new Promise((resolve, reject) => {
                db.query(sqlFetchAuthor, [authorId], (err, authorData) => {
                    if (err) return reject({ message: "Error fetching author data", error: err });
                    if (authorData.length === 0) return resolve({ ...post, author: null });

                    const author = authorData[0];

                    // تحويل حقول JSON إلى مصفوفات
                    const myFriends = author.myFreind ? JSON.parse(author.myFreind) : [];
                    const receivedRequests = author.resevedRequest ? JSON.parse(author.resevedRequest) : [];
                    const sentRequests = author.sendRequst ? JSON.parse(author.sendRequst) : [];

                    // تحديد حالة العلاقة
                    let status = "auto";
                    if (myFriends.includes(myId)) status = "friend";
                    else if (receivedRequests.includes(myId)) status = "SendRequestAdded";
                    else if (sentRequests.includes(myId)) status = "resevedRequestAdded";
                    else if (author.id == myId) status = "my";


                    resolve({
                        ...post,
                        author: {
                            ...author,
                            status,

                        },
                    });

                });
            });
        });

        // تنفيذ كل الوعود
        Promise.all(postPromises)
            .then((allPosts) => res.json(allPosts))
            .catch((error) => res.status(500).json(error));
    });
};

// get one post 
const getPost = (req, res) => {
    const { id } = req.params

    const myId = req.CurrentUserId;

    // جلب كل المنشورات
    const sqlFetchPosts = "SELECT * FROM posts WHERE postId = ?";
    db.query(sqlFetchPosts, [id], (err, postData) => {
        if (err) return res.status(500).json({ message: "Error fetching posts", error: err });
        if (postData.length === 0) return res.status(404).json({ message: "No posts found" });

        // إنشاء قائمة بالوعود (Promises) لجلب بيانات الناشرين
        const authorId = postData[0].auther;

        // جلب بيانات الناشر (author)
        const sqlFetchAuthor = "SELECT id, name, profilePhoto, myFreind, resevedRequest, sendRequst FROM users WHERE id = ?";
        db.query(sqlFetchAuthor, [authorId], (err, authorData) => {
            if (err) return res.json({ message: "Error fetching author data", error: err });

            const author = authorData[0];

            // تحويل حقول JSON إلى مصفوفات
            const myFriends = author.myFreind ? JSON.parse(author.myFreind) : [];
            const receivedRequests = author.resevedRequest ? JSON.parse(author.resevedRequest) : [];
            const sentRequests = author.sendRequst ? JSON.parse(author.sendRequst) : [];

            // تحديد حالة العلاقة
            let status = "auto";
            if (myFriends.includes(myId)) status = "friend";
            else if (receivedRequests.includes(myId)) status = "SendRequestAdded";
            else if (sentRequests.includes(myId)) status = "request";
            else if (author.id == myId) status = "my";

            res.json({
                ...postData[0],
                author: {
                    ...author,
                    status,
                },
            });


        })



    });

    // تنفيذ كل الوعود



}

// nther ways

// const AllPost = (req, res) => {
//     const myId = req.CurrentUserId;

//     // استعلام لجلب كل المنشورات مع بيانات الناشر
//     const sql = `
//         SELECT
//             posts.*,
//             users.id AS authorId,
//             users.name AS authorName,
//             users.profilePhoto AS authorPhoto,
//             users.myFreind,
//             users.resevedRequest,
//             users.sendRequst
//         FROM
//             posts
//         JOIN
//             users
//         ON
//             posts.auther = users.id
//     `;

//     db.query(sql, (err, result) => {
//         if (err) return res.status(500).json({ message: "Error fetching posts and authors", error: err });
//         if (result.length === 0) return res.status(404).json({ message: "No posts found" });

//         // معالجة البيانات المجمعة
//         const allPosts = result.map((row) => {
//             // استخراج بيانات الناشر
//             const myFriends = row.myFreind ? JSON.parse(row.myFreind) : [];
//             const receivedRequests = row.resevedRequest ? JSON.parse(row.resevedRequest) : [];
//             const sentRequests = row.sendRequst ? JSON.parse(row.sendRequst) : [];

//             // تحديد حالة العلاقة
//             let status = "auto";
//             if (myFriends.includes(myId)) status = "friend";
//             else if (receivedRequests.includes(myId)) status = "SendRequestAdded";
//             else if (sentRequests.includes(myId)) status = "request";

//             // تجهيز بيانات المنشور مع الناشر
//             return {
//                 postId: row.id,
//                 postContent: row.content,
//                 postDate: row.createdAt,
//                 author: {
//                     id: row.authorId,
//                     name: row.authorName,
//                     profilePhoto: row.authorPhoto,
//                 },
//                 status,
//             };
//         });

//         // إرسال النتيجة النهائية
//         res.json(allPosts);
//     });
// };

const getpostData = (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM posts WHERE postId = ?"

    db.query(sql, [id], (err, data) => {
        if (err) return res.json({ message: "Error fetching data from post", error: err });
        if (data.length > 0) {

            req.dataPost = data[0]
            next()
        }

    })


}
const createComments = (req, res) => {

    const data = req.dataPost
    const myId = req.CurrentUserId
    const { text } = req.body
    const { id } = req.params
    const comments = data.comments ? JSON.parse(data.comments) : []
    const created = {
        idComment: crypto.randomUUID(),
        id: myId,
        text,
        date: new Date()
    }
    const newcomments = [...comments, created]

    const sql = "UPDATE  posts SET comments=?  WHERE postId = ?"

    db.query(sql, [JSON.stringify(newcomments), id], (err, response) => {
        if (err) return res.json({ message: "Error fetching data from post", error: err });
        res.json("add commmnt succusfully")
    })
}

const deleteComment = (req, res) => {


    // return res.json("data")
    const data = req.dataPost
    const { id } = req.params
    const { idComment } = req.body
    const comments = data.comments ? JSON.parse(data.comments) : []
    const newcomments = comments?.filter(comm => comm.idComment !== idComment)

    const sql = "UPDATE  posts SET comments=?  WHERE postId = ?"

    db.query(sql, [JSON.stringify(newcomments), id], (err, response) => {
        if (err) return res.json({ message: "Error fetching data from post", error: err });
        res.json("delete commmnt succusfully")
    })
}
const like_comment = (req, res) => {
    const { id } = req.params;
    const { getCommntsData } = req.body || false;

    const sql = "SELECT likes, comments FROM posts WHERE postId = ?";
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching post data", error: err });


        const likes = data[0]?.likes ? JSON.parse(data[0].likes) : [];
        const comments = data[0]?.comments ? JSON.parse(data[0].comments) : [];

        // إذا لم يُطلب بيانات المؤلفين
        if (!getCommntsData || comments.length === 0) {
            return res.json({ likes, comments });
        }

        // جلب بيانات المؤلفين
        const userIds = comments.map((comm) => comm.id);
        const sqlFetchAuthors = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;

        db.query(sqlFetchAuthors, [userIds], (err, authors) => {
            if (err) return res.status(500).json({ message: "Error fetching authors data", error: err });


            // دمج بيانات المؤلفين مع التعليقات
            const commentsWithAuthors = comments.map((comm) => {
                const author = authors.find((auth) => auth.id === comm.id) || null;
                return { ...comm, author };
            });

            res.json({ likes, comments: commentsWithAuthors });
        });
    });
};


const getPostToAuthor = (req, res) => {
    const { id } = req.params
    const myId = req.CurrentUserId;




    // جلب كل المنشورات
    const getPostToAuthorSql = "SELECT * FROM posts WHERE auther = ? ORDER BY createdAt DESC";
    db.query(getPostToAuthorSql, [id], (err, postData) => {
        if (err) return res.status(500).json({ message: "Error fetching posts", error: err });
        if (postData.length === 0) return res.json({ message: "No posts found" });

        // إنشاء قائمة بالوعود (Promises) لجلب بيانات الناشرين
        const postPromises = postData.map((post) => {
            const authorId = post.auther;

            // جلب بيانات الناشر (author)
            const sqlFetchAuthor = "SELECT id, name, profilePhoto, myFreind, resevedRequest, sendRequst FROM users WHERE id = ?";
            return new Promise((resolve, reject) => {
                db.query(sqlFetchAuthor, [authorId], (err, authorData) => {
                    if (err) return reject({ message: "Error fetching author data", error: err });
                    if (authorData.length === 0) return resolve({ ...post, author: null });

                    const author = authorData[0];

                    // تحويل حقول JSON إلى مصفوفات
                    const myFriends = author.myFreind ? JSON.parse(author.myFreind) : [];
                    const receivedRequests = author.resevedRequest ? JSON.parse(author.resevedRequest) : [];
                    const sentRequests = author.sendRequst ? JSON.parse(author.sendRequst) : [];

                    // تحديد حالة العلاقة
                    let status = "auto";
                    if (myFriends.includes(myId)) status = "friend";
                    else if (receivedRequests.includes(myId)) status = "SendRequestAdded";
                    else if (sentRequests.includes(myId)) status = "resevedRequestAdded";
                    else if (author.id == myId) status = "my";


                    resolve({
                        ...post,
                        author: {
                            ...author,
                            status,

                        },
                    });

                });
            });
        });

        // تنفيذ كل الوعود
        Promise.all(postPromises)
            .then((allPosts) => res.json(allPosts))
            .catch((error) => res.status(500).json(error));
    });
};





const likePost = (req, res) => {
    const data = req.dataPost
    const myId = req.CurrentUserId
    const { id } = req.params
    const { addLike } = req.body
    const likes = data.likes ? JSON.parse(data.likes) : []

    const newLike = addLike ? [...likes, myId] : likes.filter(item => item != myId)


    const sql = "UPDATE  posts SET likes=?  WHERE postId = ?"

    db.query(sql, [JSON.stringify(newLike), id], (err, reaponse) => {
        if (err) return res.json({ message: "Error fetching data from post 1212", error: err });
        res.json("liket")

    })



}

const savedPost = (req, res) => {

    const { savedIt, postId } = req.body

    const myId = req.CurrentUserId
    const sqlFetchTypeUser = `SELECT saved FROM users WHERE id = ?`;
    db.query(sqlFetchTypeUser, [myId], (err, data) => {
        if (err) return res.json(err)
        if (data.length > 0) {
            // return data

            const currentSaved = data[0].saved ? JSON.parse(data[0].saved) : []

            const newSaved = savedIt ? [...currentSaved, postId] : currentSaved.filter(item => item !== postId)

            const updatesql = "UPDATE users SET saved =? WHERE id = ? "

            db.query(updatesql, [JSON.stringify(newSaved), myId], (err, response) => {

                if (err) return res.json(err)

                res.json({ message: savedIt ? "saved" : "not saved" })
            })
        }

    })
    // return data
    // res.json(fetchMyData(myId,""))


}

// const fetchMyData = (myId, type) => {
//     const sqlFetchTypeUser = `SELECT * FROM users WHERE id = ?`;
//     const data = db.query(sqlFetchTypeUser, [myId], (err, data) => {
//         if (err) return err
//         if (data) {
//             return data
//         }

//     })
//     return data
// }

const getSaved = (req, res) => {

    const myId = req.CurrentUserId
    const sqlFetchTypeUser = `SELECT saved FROM users WHERE id = ?`;
    db.query(sqlFetchTypeUser, [myId], (err, savedData) => {
        if (err) return ("error fetch saved" + err)
        if (savedData.length > 0) {
            const currentSaved = savedData[0].saved ? JSON.parse(savedData[0].saved) : []

            const postPromises = currentSaved.map(postId => {

                const fetchPostSql = "SELECT * FROM posts WHERE postId = ? "
                return new Promise((resolve, reject) => {
                    db.query(fetchPostSql, [postId], (err, postData) => {
                        if (err) return ("error fetch post" + err)

                        if (postData.length > 0) {
                            const authorId = postData[0].auther
                            const sqlFetchAuthor = "SELECT id, name, profilePhoto, myFreind, resevedRequest, sendRequst FROM users WHERE id = ?";
                            db.query(sqlFetchAuthor, [authorId], (err, authorData) => {
                                if (err) return ("error fetch auther" + err)
                                const author = authorData[0];

                                // تحويل حقول JSON إلى مصفوفات
                                const myFriends = author.myFreind ? JSON.parse(author.myFreind) : [];
                                const receivedRequests = author.resevedRequest ? JSON.parse(author.resevedRequest) : [];
                                const sentRequests = author.sendRequst ? JSON.parse(author.sendRequst) : [];

                                // تحديد حالة العلاقة
                                let status = "auto";
                                if (myFriends.includes(myId)) status = "friend";
                                else if (receivedRequests.includes(myId)) status = "SendRequestAdded";
                                else if (sentRequests.includes(myId)) status = "resevedRequestAdded";
                                else if (author.id == myId) status = "my";


                                resolve({ ...postData[0], author: { ...authorData[0], status } })

                            })

                        }

                    })
                })

            })

            // res.json(data)

            Promise.all(postPromises)
                .then((allPosts) => res.json(allPosts))
                .catch((error) => res.status(500).json(error));

        }
    })

}

module.exports = { createPost, deletePost, savedPost, Upload, createComments, getPostToAuthor, AllPost, getPost, likePost, getpostData, like_comment, deleteComment, getSaved }