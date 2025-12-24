const express = require("express");
const { searchAll } = require("../Controllers/SearchController");
const { VerifyUser } = require("../Controllers/AuthController");

const router = express.Router();

router.get("/", VerifyUser, searchAll);

module.exports = router;
