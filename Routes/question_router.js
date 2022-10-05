const express = require("express");
const router = express.Router();
const questionController = require("../Controllers/question_controller");
const authorization = require("../Middleware/authorization");

router.post('/ask',[authorization.authorization], questionController.askQuestion);
router.get('/getQuestions', [authorization.authorization], questionController.getQuestions);
router.post('/answer', [authorization.authorization], questionController.answerQuestion);
router.get('/getPublicQuestions', [authorization.authorization], questionController.getPublicQuestions);

module.exports = router;