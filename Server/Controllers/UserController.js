const db = require("../Config/db")


// all users 
const AllUsers = (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, (err, data) => {
        if (err) return res.status(404).json("error" + err)
        return res.json(data)
    })

}

const sqlFetchMyData = (req, res, next) => {
    const myId = req.CurrentUserId

    const sqlFetchCurrentUser = "SELECT myFreind, resevedRequest, sendRequst , Noification FROM users WHERE id = ?";

    db.query(sqlFetchCurrentUser, [myId], (err, currentUserData) => {
        if (err) return res.status(500).json({ message: "Error fetching user data", error: err });

        req.myfreinds = currentUserData[0]?.myFreind ? JSON.parse(currentUserData[0].myFreind) : [];
        req.myReceivedRequests = currentUserData[0]?.resevedRequest ? JSON.parse(currentUserData[0].resevedRequest) : [];
        req.mySentRequests = currentUserData[0]?.sendRequst ? JSON.parse(currentUserData[0].sendRequst) : [];
        // req.Noification = currentUserData[0]?.Noification ? JSON.parse(currentUserData[0].Noification) : [];
        //  console.log(currentUserData)
        next()
    })
}

const sqlFetchUserData = (req, res, next) => {
    const user = req.body.freind || req.params.id

    const sqlFetchCurrentUser = "SELECT myFreind, resevedRequest, sendRequst FROM users WHERE id = ?";

    db.query(sqlFetchCurrentUser, [user], (err, currentUserData) => {
        if (err) return res.status(500).json({ message: "Error fetching user data", error: err });

        req.userfreinds = currentUserData[0]?.myFreind ? JSON.parse(currentUserData[0].myFreind) : [];
        req.userReceivedRequests = currentUserData[0]?.resevedRequest ? JSON.parse(currentUserData[0].resevedRequest) : [];
        req.userSentRequests = currentUserData[0]?.sendRequst ? JSON.parse(currentUserData[0].sendRequst) : [];

        next()
    })
}


const UsersNoTmy = (req, res) => {
    const myId = req.CurrentUserId

    const myfreinds = req.myfreinds
    const myReceivedRequests = req.myReceivedRequests
    const mySentRequests = req.mySentRequests

    const sqlFetchOtherUsers = "SELECT id, name,email,profilePhoto FROM users WHERE id != ?"
    db.query(sqlFetchOtherUsers, [myId], (err, allUsers) => {
        if (err) return res.status(500).json({ message: "Error fetching users", error: err });
        const filteredUsers = allUsers.filter(user => !myfreinds.includes(user.id)).map(user => {
            let status = "auto"
            if (myReceivedRequests.includes(user.id)) {
                status = "resevedRequestAdded"
            }
            else if (mySentRequests.includes(user.id)) {

                status = "SendRequestAdded"
            }
            return { ...user, status }
        })
        return res.json({ data: filteredUsers })
    })

}

const sendRequst = (req, res) => {

    const myId = req.CurrentUserId
    const user = req.body.freind

    const currentSendRequests = req.mySentRequests

    if (currentSendRequests?.includes(user)) return res.status(404).json("user incloudes")

    currentSendRequests.push(user)
    const UpdateSenedReuestsql = "UPDATE  users SET sendRequst =? WHERE id =?"
    db.query(UpdateSenedReuestsql, [JSON.stringify(currentSendRequests), myId], (err, response) => {
        if (err) return res.status(404).json("error" + err)



        // reseved request from sender to users

        // تجيب كل طلبات الصداقة القيدمة 
        const sqlAlladdrequiest = "SELECT resevedRequest FROM users WHERE id = ?"
        db.query(sqlAlladdrequiest, [user], (err, data) => {
            if (err) return res.status(404).json("error")
            const currentaAllRequests = req.userReceivedRequests
            if (currentaAllRequests?.includes(user)) return res.status(404).json("user incloudes")
            currentaAllRequests.push(myId)

            const UpdateAlladdReuestsql = "UPDATE  users SET resevedRequest =? WHERE id =?"
            db.query(UpdateAlladdReuestsql, [JSON.stringify(currentaAllRequests), user], (err, response) => {
                if (err) return res.status(404).json("error" + err)
                return res.json({ message: "new requst", x: data })
            })
        })



    })




}



const cancleSentRequst = (req, res) => {

    /**
        ازالة الطلب من  الرسيبفد لدي
        ازالة الطلب من  السند  لدى المستخدم

     *
    
    
     */
    const myId = req.CurrentUserId
    const user = req.body.freind

    let MyresevedRequest = req.mySentRequests

    MyresevedRequest = MyresevedRequest.filter(item => item !== user)
    const UpdateAlladdResevedReuestsql = "UPDATE  users SET sendRequst =? WHERE id =?"
    db.query(UpdateAlladdResevedReuestsql, [JSON.stringify(MyresevedRequest), myId], (err, response) => {


        if (err) return res.status(404).json("error" + err)
        // احظار بيانات الصديق





        // التحقق وازالته من الطلبات لدي 
        let currentaAllRequestsSend = req.userReceivedRequests
        if (currentaAllRequestsSend?.includes(myId)) currentaAllRequestsSend = currentaAllRequestsSend.filter(item => item != myId)

        const UpdateMyFreindsAndMyResved = "UPDATE  users SET  resevedRequest=?   WHERE id =?"
        db.query(UpdateMyFreindsAndMyResved, [JSON.stringify(currentaAllRequestsSend), user], (err, response) => {
            if (err) return res.status(404).json("error" + err)
            res.json("canseld")
        })


    })


}









const myRequstFreind = (req, res) => {


    const freindIds = req.myReceivedRequests

    if (freindIds.length === 0) {
        return res.json({ message: "No freind requests", freinds: [] });
    }

    // جلب بيانات الأصدقاء باستخدام المعرفات
    const fetchfreindsSql = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;
    db.query(fetchfreindsSql, [freindIds], (err, freindsData) => {
        if (err) return res.status(500).json({ message: "Error fetching freind data", error: err });

        return res.json({ freinds: freindsData });
    });

};



const AcceptedAdded = (req, res) => {

    /**
     * فحص مجموعة اللاصدقاء لدي واضافته ان لكم يكن مضاف 
     * فحص مجموعة اللاصدقاء لدا صديقي واضافتي ان لكم اكن مضاف 
     * ازللتي من السند لصديقي
     * ازللته من الرسيفد لصديقي
     *
     * 
     */
    const myId = req.CurrentUserId;
    const user = req.body.freind


    // التحقق واضافته في الاصدقاذلدي 
    const currentMyFreind = req.myfreinds
    if (currentMyFreind?.includes(user)) return res.status(404).json("user is freind you")
    currentMyFreind.push(user)


    // التحقق وازالته من الطلبات لدي 
    let currentaAllRequests = req.myReceivedRequests
    if (currentaAllRequests?.includes(user)) currentaAllRequests = currentaAllRequests.filter(item => item != user)

    const UpdateMyFreindsAndMyResved = "UPDATE  users SET myFreind =? , resevedRequest=? WHERE id =?"
    db.query(UpdateMyFreindsAndMyResved, [JSON.stringify(currentMyFreind), JSON.stringify(currentaAllRequests), myId], (err, response) => {
        if (err) return res.status(404).json("error" + err)


        // الصديق الاحر


        // التحقق واضافته في الاصدقاذلدي 
        const currentMyFreind = req.userfreinds
        if (currentMyFreind?.includes(user)) return res.status(404).json("user is freind you")
        currentMyFreind.push(myId)


        // التحقق وازالته من الطلبات لدي 
        let currentaAllRequestsSend = req.userSentRequests
        if (currentaAllRequestsSend?.includes(myId)) currentaAllRequestsSend = currentaAllRequestsSend.filter(item => item != myId)

        const UpdateMyFreindsAndMyResved = "UPDATE  users SET myFreind =? , sendRequst=?  WHERE id =?"
        db.query(UpdateMyFreindsAndMyResved, [JSON.stringify(currentMyFreind), JSON.stringify(currentaAllRequestsSend), user], (err, response) => {
            if (err) return res.status(404).json("error" + err)
            res.json("add my frend true")
        })




    })











}

const cancleAcceptRequst = (req, res) => {

    /**
        ازالة الطلب من  الرسيبفد لدي
        ازالة الطلب من  السند  لدى المستخدم

     *
    
    
     */
    const myId = req.CurrentUserId
    const user = req.body.freind

    let MyresevedRequest = req.myReceivedRequests

    MyresevedRequest = MyresevedRequest.filter(item => item !== user)
    const UpdateAlladdResevedReuestsql = "UPDATE  users SET resevedRequest =? WHERE id =?"
    db.query(UpdateAlladdResevedReuestsql, [JSON.stringify(MyresevedRequest), myId], (err, response) => {


        if (err) return res.status(404).json("error" + err)
        // احظار بيانات الصديق





        // التحقق وازالته من الطلبات لدي 
        let currentaAllRequestsSend = req.userSentRequests
        if (currentaAllRequestsSend?.includes(myId)) currentaAllRequestsSend = currentaAllRequestsSend.filter(item => item != myId)

        const UpdateMyFreindsAndMyResved = "UPDATE  users SET  sendRequst=?  WHERE id =?"
        db.query(UpdateMyFreindsAndMyResved, [JSON.stringify(currentaAllRequestsSend), user], (err, response) => {
            if (err) return res.status(404).json("error" + err)
            res.json("canseld")
        })


    })


}


const myFreinds = (req, res) => {

    const freindIds = req.myfreinds

    if (freindIds.length === 0) {
        return res.json({ message: "No freind requests", freinds: [] });
    }

    // جلب بيانات الأصدقاء باستخدام المعرفات
    const fetchfreindsSql = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;
    db.query(fetchfreindsSql, [freindIds], (err, freindsData) => {
        if (err) return res.status(500).json({ message: "Error fetching freind data", error: err });
        return res.json({ data: freindsData });
    });


}

const getUser = (req, res) => {
    const { id } = req.params

    const myId = req.CurrentUserId
    const sqlFetchCurrentUser = "SELECT id,  name, profilePhoto  FROM users WHERE id = ?";

    db.query(sqlFetchCurrentUser, [id], (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching user data", error: err });
        if (data.length > 0) {

            let status;

            req.userfreinds?.some(id => id === myId) ? status = "freind" :
                req.userReceivedRequests?.some(id => id === myId) ? status = "SendRequestAdded" :
                    req.userSentRequests?.some(id => id === myId) ? status = "requst" : status = "auto"

            const freindIds = req.userfreinds

            if (freindIds.length === 0) {
                return res.json({ data: { ...data[0], freindfreind: [], status } });

            }

            // جلب بيانات الأصدقاء باستخدام المعرفات
            const fetchfreindsSql = `SELECT id, name, profilePhoto FROM users WHERE id IN (?)`;
            db.query(fetchfreindsSql, [freindIds], (err, freindfreind) => {
                if (err) return res.status(500).json({ message: "Error fetching freind data", error: err });
                return res.json({ data: { ...data[0], freindfreind, status } });
            });



        }
    })
}

const unfreind = (req, res) => {

    const myId = req.CurrentUserId;
    const user = req.body.freind
    // ازالته من عندي
    // return res.json(req.myfreinds)
    if (!req.myfreinds.includes(user)) return res.status(404).json("user not defind my")
    const myfreindss = req?.myfreinds?.filter(item => item !== user)

    const UpdateMyFreindsAndMyResved = "UPDATE  users SET myFreind =?  WHERE id =?"

    db.query(UpdateMyFreindsAndMyResved, [JSON.stringify(myfreindss), myId], (err, response) => {

        if (err) return res.status(404).json("error" + err)


        // ازالته من صديقي

        if (!req.userfreinds.includes(myId)) return res.status(404).json("user not defind him")

        const userfreindss = req?.userfreinds?.filter(item => item !== myId)
        const UpdateMyFreindsAndMyResved = "UPDATE  users SET myFreind =?  WHERE id =?"

        db.query(UpdateMyFreindsAndMyResved, [JSON.stringify(userfreindss), user], (err, response) => {

            if (err) return res.status(404).json("error" + err)

            return res.json("un freind")
        })
    })


}


const setNoificationFun = (req, res) => {
    // return res.json("hello")
    const myId = req.CurrentUserId
    const newNotif = req.body.notifi


    const sql = "UPDATE users SET Noification =? WHERE id =?"
    db.query(sql, [JSON.stringify(newNotif), myId], (err, response) => {

        if (err) return res.status(404).json("error" + err)

        return res.json("add notif")
    })


}
const getNoification = (req, res) => {
    res.json({ data: req.Noification })
}

module.exports = { setNoificationFun, getNoification, UsersNoTmy, sqlFetchMyData, sqlFetchUserData, sendRequst, AllUsers, myRequstFreind, AcceptedAdded, cancleAcceptRequst, myFreinds, getUser, cancleSentRequst, unfreind }