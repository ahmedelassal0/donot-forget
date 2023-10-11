const path = require('path');
const express = require('express');

const globalErrorHandler = require('./controllers/globalErrorHandler');
const AppError = require('./utils/AppError');

const app = express();

// ROUTERS --------------------------------
const collectionRouter = require('./routes/collectionRoutes');
// const noteRouter = require('./routes/noteRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: true }));

// SERVE STATIC FILES --------------------------------
app.use(express.static(path.join(__dirname, 'public')));
// ROUTES --------------------------------
app.use('/api/v1/collections', collectionRouter);
// app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res, next) => {
  res.render(path.join(__dirname, 'views', 'home-page.ejs'));
});

// HANDLE UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`the route ${req.originalUrl} is not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
