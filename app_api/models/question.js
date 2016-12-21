"use strict";
var mongoose = require("mongoose");
var questionSchema = new mongoose.Schema({
    examNum: Number,
    selectTwo: String,
    question: String,
    answerA: String,
    answerB: String,
    answerC: String,
    answerD: String,
    answerE: String,
    correctAnswer: Array,
    created_at: Date,
    updated_at: Date
});
var Question = mongoose.model('Question', questionSchema);
module.exports = Question;
