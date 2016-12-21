"use strict";
var mongoose = require("mongoose");
var examSchema = new mongoose.Schema({
    examAvailable: Array,
    examNames: Object,
    created_at: Date,
    updated_at: Date
});
var Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
