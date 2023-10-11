const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    maxLength: [32, 'sorry max length is 32'],
    required: [true, 'please enter a note text'],
  },
  _collection: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: '_Collection',
    required: [true, 'please enter a collection to a note'],
  },
});

module.exports = mongoose.model('Note', noteSchema);
// module.exports = mongoose.model('Collection', collectionSchema);
