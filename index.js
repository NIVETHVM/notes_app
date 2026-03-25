require('dotenv').config();
const express = require("express");

const pool = require('./db');
//test db
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
const errorHandler = require('./middleware/errorHandler');
const notesRouter = require('./routes/notes');
const logger = require('./middleware/logger');
const authRouter = require('./routes/auth');
//middleware to convert raw to json
app.use(helmet());
app.use(cors);
app.use(limiter);
app.use(logger);
app.use(express.json());
app.use('/auth',authRouter);
app.use('/notes',notesRouter);
app.use(errorHandler); 


app.get('/', (req,res) => {
    res.json({message: 'Notes API is running'});
})
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`)
})