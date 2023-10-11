const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryFunctions');
const Note = require('./../models/noteModel');

exports.getAllNotes = factory.getAll(Note);

exports.createNote = factory.createOne(Note);

exports.getOneNote = factory.getOne(Note, {path: '_collection', select: '-_id -__v -user'});


exports.updateNote = factory.updateOne(Note);

exports.deleteNote = factory.deleteOne(Note);
