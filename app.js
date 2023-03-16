const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const availabilityRoutes = require('./routes/availability');
const bodyParser = require('body-parser');
const app = express();
const {verify} = require('./middlewares/verify');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use('/availability',verify,availabilityRoutes);

app.listen(3000);