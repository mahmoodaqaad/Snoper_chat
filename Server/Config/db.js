// إعداد الاتصال بقاعدة البيانات

const mysql = require("mysql")

const db = mysql.createConnection({
    host: "btyt8yy6yrdidtwhyrik-mysql.services.clever-cloud.com",
    user: "urmnehtxmrh5o3ox",
    password: "WHmQ0ujKtxKNuw1DSSIP",
    database: "btyt8yy6yrdidtwhyrik",
    port:3306
});

db.connect((err) => {
    if (err) {
        console.error("خطأ في الاتصال بقاعدة البيانات:", err);
        return;
    }
    console.log("متصل بقاعدة البيانات بنجاح");
});
const createTables = () => {


    const chatsTable = `
        CREATE TABLE  chats (
            chatId VARCHAR(50) PRIMARY KEY,
            members VARCHAR(50) NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      
        );
    `;

    const messagesTable = `
        CREATE TABLE  messages (
            messageId VARCHAR(50) PRIMARY KEY,
            senderId VARCHAR(50) NOT NULL,
            text TEXT NOT NULL,
            chatId VARCHAR(50) NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     
        );
    `;
    const postsTable = `
        CREATE TABLE  posts (
            postId VARCHAR(50) PRIMARY KEY,
            auther VARCHAR(50) NOT NULL,
            likes TEXT NOT NULL,
            comments TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      
        );
    `;





    // db.query(postsTable, (err) => {
    //     if (err) console.error("خطأ أثناء إنشاء جدول chats:", err);
    //     else console.log("تم إنشاء جدول chats بنجاح");
    // });



    // db.query(chatsTable, (err) => {
    //     if (err) console.error("خطأ أثناء إنشاء جدول chats:", err);
    //     else console.log("تم إنشاء جدول chats بنجاح");
    // });

    // db.query(messagesTable, (err) => {
    //     if (err) console.error("خطأ أثناء إنشاء جدول messages:", err);
    //     else console.log("تم إنشاء جدول messages بنجاح");
    // });
};

// استدعاء دالة إنشاء الجداول
// createTables();


module.exports = db;
