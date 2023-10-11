const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: [32, 'sorry max length is 32'],
      required: [true, 'please enter a collection name'],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

collectionSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id', // Of post collection
  foreignField: '_collection', // Of user collection
  // justOne: true,
});

module.exports = mongoose.model('_Collection', collectionSchema);
