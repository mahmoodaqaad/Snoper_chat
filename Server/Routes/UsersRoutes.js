

const express = require("express")
const { sqlFetchMyData, sqlFetchUserData, UsersNoTmy, sendRequst, AllUsers, myRequstFreind, AcceptedAdded, cancleAcceptRequst, myFreinds, getUser, cancleSentRequst, unfreind, setNoificationFun, getNoification } = require("../Controllers/UserController")
const { VerifyUser } = require("../Controllers/AuthController")
const { savedPost, getSaved } = require("../Controllers/postController")




const router = express.Router()

router.get("/usersnotmy", VerifyUser, sqlFetchMyData, sqlFetchUserData, UsersNoTmy)
router.get("/allUsers", VerifyUser, AllUsers)
router.get("/myRequstFreind", VerifyUser, sqlFetchMyData, sqlFetchUserData, myRequstFreind)

router.get("/myFreind", VerifyUser, sqlFetchMyData, myFreinds)

router.post("/addFreind", VerifyUser, sqlFetchMyData, sqlFetchUserData, sendRequst)
router.post("/cancleSentRequst", VerifyUser, sqlFetchMyData, sqlFetchUserData, cancleSentRequst)
router.post("/AcceptedAdded", VerifyUser, sqlFetchMyData, sqlFetchUserData, AcceptedAdded)
router.post("/cancleAcceptRequst", VerifyUser, sqlFetchMyData, sqlFetchUserData, cancleAcceptRequst)

router.get("/", AllUsers)
router.get("/user/:id", VerifyUser, sqlFetchUserData, getUser)



router.post("/unfreind", VerifyUser, sqlFetchMyData, sqlFetchUserData, unfreind)


router.post("/setNoificationfun", VerifyUser, sqlFetchMyData, setNoificationFun)
router.get("/getNoification", VerifyUser, sqlFetchMyData, getNoification)


router.post("/saved", VerifyUser, savedPost)
router.get("/getSaved", VerifyUser, getSaved)
module.exports = router
