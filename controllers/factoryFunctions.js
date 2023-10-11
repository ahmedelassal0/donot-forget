const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const ApiFeatures = require('./../utils/ApiFeatures');

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    // (user  user: req.user._id) is to make sure the user get his won data
    const query = model.find({ _id: req.params.id, user: req.user._id });

    const doc = await query;

    // check if doc exists
    if (!doc) {
      return next(
        new AppError(
          `No ${model.collection.collectionName} for id ${req.params.id}`,
          404
        )
      );
    }

    // send the response
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    // add current user to the body
    req.body.user = req.user._id;

    const doc = await model.create(req.body);
    // check if doc exists
    if (!doc) {
      return next(
        new AppError(
          `No ${model.collection.collectionName} for id ${req.params.id}`,
          404
        )
      );
    }

    // send the response
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    // add current user to the body
    req.body.user = req.user._id;

    const doc = await model.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    // check if doc exists
    if (!doc) {
      return next(new AppError(`No docs for id ${req.params.id}`, 404));
    }
    
    // send the response
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getOne = (model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.find({ _id: req.params.id, user: req.user._id });

    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;

    // check if doc exists
    if (!doc) {
      return next(
        new AppError(
          `No ${model.collection.collectionName} for id ${req.params.id}`,
          404
        )
      );
    }

    console.log(doc);
    // send the response
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    // Prepare the query
    const features = new ApiFeatures(
      model.find({ user: req.user._id }),
      req.query
    )
      .filter()
      .sort()
      .fieldLimit()
      .paginate();
    // Excute the query
    const doc = await features.query;
    // Send response
    res.status(200).json({
      length: doc.length,
      status: 'success',
      data: doc,
    });
  });
