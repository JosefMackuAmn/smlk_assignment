"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStory = exports.postStory = exports.deleteCollection = exports.getCollection = exports.postCollection = void 0;
const SourceExistsError_1 = require("../errors/SourceExistsError");
const Collection_1 = require("../models/Collection");
const User_1 = require("../models/User");
const postCollection = async (req, res) => {
    const { name } = req.body;
    // Check for collection with the same name
    // belonging to current user
    const existingColl = await Collection_1.Collection.findOne({
        where: {
            name: name,
            userNick: req.decodedJwt.nick
        }
    });
    if (existingColl) {
        throw new SourceExistsError_1.SourceExistsError();
    }
    // Create new collection
    User_1.User.createCollection;
};
exports.postCollection = postCollection;
const getCollection = async (req, res) => { };
exports.getCollection = getCollection;
const deleteCollection = async (req, res) => { };
exports.deleteCollection = deleteCollection;
const postStory = async (req, res) => { };
exports.postStory = postStory;
const deleteStory = async (req, res) => { };
exports.deleteStory = deleteStory;
