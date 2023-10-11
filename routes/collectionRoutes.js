const express = require('express');
const authController = require('./../controllers/authController');
const collectionController = require('./../controllers/collectionController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(collectionController.getAllCollections)
  .post(collectionController.createCollection);

router
  .route('/:id')
  .get(collectionController.getOneCollection)
  .patch(collectionController.updateCollection)
  .delete(collectionController.deleteCollection);

module.exports = router;
