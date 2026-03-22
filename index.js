require('dotenv').config();
const express = require("express");
const app = express();

const errorHandler = require('./middleware/errorHandler');
const notesRouter = require('./routes/notes');
const logger = require('./middleware/logger');
const authRouter = require('./routes/auth');
//middleware to convert raw to json
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