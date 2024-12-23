const db = require("../Config/db")

const crypto = require("crypto")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const ModifyToken = (id) => jwt.sign({ id }, "jwtScretKey", { expiresIn: "3d" })


// const url = "http://localhost:8000/Images/"
const url = "https://snoper-chat.onrender.com/Images/"
const VerifyUser = (req, res, next) => {
    const token = req.cookies.real_chat_app || req.headers['authorization']?.split(' ')[1];; // الحصول على التوكن من الكوكيز
    if (!token) return res.status(404).json({ message: "No token Provider" })

    jwt.verify(token, "jwtScretKey", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Unauthorized", error: err.message }); // تغيير الكود إلى 403

        req.CurrentUserId = decoded.id
        next()
    })


}

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "Public/Images")
        console.log('Saving to1:');

    }, filename: (req, file, cd) => {
        cd(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        console.log('Saving to1:'); // تسجيل المسار في الطرفية

    }
})

const Upload = multer({
    storage: storage
})


const CheakEmail = (req, res, next) => {
    const email = req.headers["email"]
    const sqlCheck = "SELECT * FROM users WHERE email = ?";
    db.query(sqlCheck, email, (err, data) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (data.length > 0) return res.status(400).json({ message: "Email already exists", status: 205 });
        else {

            next()
        }
    })
}
const Register = (req, res) => {
    // return res.json("hello")
    const { name, email, password } = JSON?.parse(req.body.form);
    const image = `${url}/${req.file.filename}`
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" }); // تغيير الكود إلى 400

    else {
        bcrypt.hash(password.toString(), 10, (err, hash) => {
            if (err) return res.json({ err, message: "error in hash" })
            if (hash) {
                const id = crypto.randomUUID()
                const createSql = "INSERT INTO users (id,name, email, password,profilePhoto,myFreind, resevedRequest, sendRequst ,Noification) VALUES (?,?,?,?,?,?,?,?,?)"
                db.query(createSql, [id, name, email, hash, image, "[]", "[]", "[]", "[]"], (err, result) => {
                    if (err) return res.status(404).json(err)
                    const token = ModifyToken(id)
                    res.json({ id, token, message: "Register successfully", hash })

                })
            }

        })

    }
}



const Login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) return res.status(500).json({ message: "All fields are required" }); // تغيير الكود إلى 400


    const sqlCheck = "SELECT * FROM users WHERE email = ?";
    db.query(sqlCheck, email, (err, data) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });


        if (data.length === 0) return res.status(500).json({ message: "Email Not exists" });
        else {
            bcrypt.compare(password.toString(), data[0].password, (err, compare) => {
                if (err) return res.status(505).json({ message: "Error in password comparison", error: err });
                if (compare) {
                    const token = ModifyToken(data[0].id)

                    return res.status(200).json({ message: "User logged in successfully", token, data });


                } else return res.status(500).json({ message: "password is not correct" })


            })




        }
    })

}

const getCurrentUser = (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [req.CurrentUserId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (data.length > 0) {
            return res.status(200).json({ status: 200, user: data[0] });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    });
};


module.exports = { Upload, Register, Login, VerifyUser, getCurrentUser, CheakEmail }