const factory = require('./factoryFunctions');
const Collection = require('./../models/collectionModel');

exports.addUserToBody = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};
exports.getAllCollections = factory.getAll(Collection);

exports.createCollection = factory.createOne(Collection);

exports.getOneCollection = factory.getOne(Collection, { path: 'notes' });

exports.updateCollection = factory.updateOne(Collection);

exports.deleteCollection = factory.deleteOne(Collection);
