const express = require('express');
const {
  handleGenerateNewShortURL,
  handleGetAnalytics } = require("../controllers/url");
const { handleUrlDelete } = require("../controllers/user");
const { handleProfile } = require("../controllers/user");
const { handleChangePassword, handlePasswordUpdate, handleDeleteAccount } = require("../controllers/user");
const router = express.Router();

router.post('/', handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);

router.get("/delete/:id", handleUrlDelete);

router.get("/profile", handleProfile);

router.get('/reset-password', handleChangePassword);

router.post('/update-password', handlePasswordUpdate);

router.get('/deleteUser', handleDeleteAccount);

module.exports = router;

