const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: `${path.join(__dirname, 'config.env')}` });
mongoose
  .connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`)
  .then(() => {
    console.log('CONNECTING TO DATABASE');
  })
  .catch((err) => {
    console.log(`DATABASE ERROR: ${err.message}`);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
