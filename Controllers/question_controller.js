const Question = require('../Models/question').questionModel;
const Answer = require('../Models/answer').answerModel;
const User = require('../Models/user').userModel;

async function askQuestion (req, res) {

    // question contains tag, title and content
    try {
        const question = new Question({
            userId: req.user._id,
            tag: req.body.tag,
            title: req.body.title,
            content: req.body.content
        });

        await question.save();
        return res.status(200).send({message: "Question was created successfully"});
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

async function parseQuestionsHelper (questions) {
    // iterate the questions to add imgSrc to each question
    let finalQuestions = [];
    for (let i = 0; i < questions.length; i++) {
        // find the question user
        const questionUser = await User.findOne({_id: questions[i].userId});
        const profilePhoto = questionUser.profilePhoto;
        let imgSrc = "";
        if (profilePhoto) {
            // send png file url to the client
            imgSrc = "/uploads/" + questionUser._id + ".png";
        } else {
            imgSrc = "/uploads/default.png";
        }

        // get the answers for each question
        const answers = await Answer.find({questionId: questions[i]._id});
        // create the answer list
        let answerList = [];
        for (let j = 0; j < answers.length; j++) {
            // find the username of the user who answered the question
            const user = await User.findOne({_id: answers[j].userId});

            answerList.push({
                content: answers[j].content,
                userName: user.username})
        }

        let tempQuestion = {
            questionId: questions[i]._id,
            username: questionUser.username,
            tag: questions[i].tag,
            title: questions[i].title,
            content: questions[i].content,
            imgsrc: imgSrc,
            answers: answerList
        }
        finalQuestions.push(tempQuestion);
    }

    return finalQuestions;
}


async function getQuestions (req, res) {
    // get questions of the current user
    try {
        const questions = await Question.find({userId: req.user._id});
        let finalQuestions = await parseQuestionsHelper(questions);
        

        return res.status(200).send(finalQuestions);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }

}

async function getPublicQuestions (req, res) {

    // find all questions which is not belong to the current user
    try {
        const questions = await Question.find({userId: {$ne: req.user._id}});
        let finalQuestions = await parseQuestionsHelper(questions);

        return res.status(200).send(finalQuestions);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }


}

// get current user's answers
async function getAnswers (req, res) {

    try {
        const answers = await Answer.find({userId: req.user._id});
        let finalAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            // find the question user
            const questionUser = await User.findOne({_id: answers[i].questionId});
            const profilePhoto = questionUser.profilePhoto;
            let imgSrc = "";
            if (profilePhoto) {
                // send png file url to the client
                imgSrc = "/uploads/" + questionUser._id + ".png";
            } else {
                imgSrc = "/uploads/default.png";
            }

            let tempAnswer = {
                answerId: answers[i]._id,
                username: questionUser.username,
                content: answers[i].content,
                imgsrc: imgSrc
            }
            finalAnswers.push(tempAnswer);
        }
    } catch (err) {
        return res.status(500).send({message: err.message});
    }

}


async function answerQuestion (req, res) {
    // answer contains content and questionId
    try {
        // retreive the user
        const answer = new Answer({
            userId: req.user._id,
            content: req.body.content,
            questionId: req.body.questionId,
        })

        await answer.save();
        return res.status(200).send({message: "Answer was created successfully"});

    } catch (err) {
        return res.status(500).send({message: err.message});
    }

}


module.exports = {
    askQuestion,
    getQuestions,
    getPublicQuestions,
    answerQuestion
}