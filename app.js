const express = require('express');
require('dotenv').config();

const app = express();
const routes = require('./src/app/routes/router');

const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.listen(port, (error) => {
  if (error) {
    console.log('Error: unable to run server.');
    return;
  }

  console.log(`Server is running on ${host + ':' + port}`);
});
