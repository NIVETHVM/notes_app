const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt  = require('jsonwebtoken');
const pool = require('../db');

const SALT_ROUNDS = 10;

let users = [];
let nextId = 1;

router.post('/register', async (req,res,next) => {
    try {
        const { email , password } = req.body;

        if(!email || !password){
            return res.status(400).json({error: "email & password is required"});
        }
        //user exist checking
        const existingUser = users.find(u => u.email === email);
        if(existingUser){
            return res.status(409).json({error : "email already registered"});
        }
        //hashing
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // const user = { id: nextId++,email,password: hashedPassword};
        // users.push(user);
        const result = await pool.query(
            'INSERT INTO users (email,password) VALUES ($1,$2) RETURNING id, email',[email,hashedPassword]
        );
        const user = result.rows[0];
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch(err){
        next(err);
    }
});

router.post('/login', async (req,res,next) => {
    try {
        const { email , password } = req.body;
        if(!email || !password){
            res.status(400).json({error: "email & password required"});
        }
        //db
        const result = await pool.query(
            'SELECT * from users WHERE email = $1',[email]
        );
        //old
        //const user = users.find(u => u.email === email);
        // if(!user){
        //     return res.status(401).json({ error: 'invalid email or password' });
        // } 
        if(result.rows.length === 0){
            return res.status(401).json({error: "invalid email or password"});
        }
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password,user.password);
        console.log(passwordMatch);
        if(!passwordMatch){
            return res.status(401).json({ error: 'invalid email or password' });
        }
        
        //create jwt token
        const token = jwt.sign(
            { id: user.id,email:user.email },
            process.env.SECRET_KEY,
            {expiresIn:'24h' }
        );
        res.json({token});
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;