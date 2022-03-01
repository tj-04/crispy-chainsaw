'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const implio = new Schema({
    id: Number,
    content: Object,
    user: Number,
    status: String,
    images: Object,
    videos: Object,
});

module.exports = mongoose.model('implio', implio);