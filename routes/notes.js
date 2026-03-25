const express = require("express");
//returns a router object with res,req as methods
const router = express.Router();
const {validateNewNote,validateUpdateNote} = require('../middleware/validate');
const auth = require('../middleware/auth');
const pool = require('../db');

let notes = [];

let nextId = 1; 
router.get('/',auth, async(req,res,next) => {
    try{
        const result = await pool.query(
            "select * from notes where user_id = $1 order by created_at DESC",[req.user.id]
        );
        res.json(result.rows);
    }
    catch(err){
        next(err);
    }
    //const userNotes = notes.filter(n => n.userId === req.user.id);
}
);
router.get("/:id",auth,async (req,res,next) => {
    // const userNotes = notes.filter(n => n.userId === req.user.id);
    // const note = userNotes.find(n => n.id === parseInt(req.params.id));
    try{
        const result = await pool.query("SELECT * from notes where user_id = $1 and id = $2",[req.user.id,req.params.id]);
        if(result.rows.length === 0){
            const err = new Error("note not found");
            err.status = 404;
            return next(err);
        }
        res.json(result.rows);
    }
    catch(err){
        next(err);
    }
})
router.post("/",auth,validateNewNote,async(req,res,next) => {
    
    try{// console.log('req.body is:', req.body);
        const title = req.body.title;
        const content = req.body.content;
        //now handled in middleware
        // if(!title || !content){
        //     return res.status(404).json({error: "no details"});
        // }
        //const note = {id: nextId++,title,content,userId:req.user.id};
        const result = await pool.query(
            "insert into notes (title, content, user_id) values ($1,$2,$3) returning *",[title,content,req.user.id]
        )
        // notes.push(note);
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        next(err);
    }
})
router.put("/:id",auth,validateUpdateNote,async(req,res,next) => {
    // const userNotes = notes.filter(n => n.userId === req.user.id);
    // const note = userNotes.find(n => n.id === parseInt(req.params.id));
    try{
        const existing = await pool.query(
            "SELECT * from notes where id = $1 and user_id = $2",[req.params.id,req.user.id]
        )

        if(existing.rows.length === 0){
            const err = new Error("no note for the id");
            err.status = 404;
            return next(err);
        }
        const note = existing.rows[0];
        const title = req.body.title || note.title;
        const content = req.body.content || note.content;
        const result = await pool.query(
            "update notes set title = $1,content = $2,updated_at = NOW() where id = $3 and user_id = $4 returning *",
            [title, content, req.params.id, req.user.id]
        );
        res.json(result.rows[0]);
    }
    catch(err){
        next(err);
    }
})
router.delete("/:id",auth,async(req,res,next) => {
    // const userNotes = notes.filter(n => n.userId === req.user.id);
    // const note = userNotes.find(n => n.id === parseInt(req.params.id));
    
    try{
        const existing = await pool.query(
            "delete from notes where user_id =$1 and id = $2 returning *",[req.user.id,req.params.id]
        )
        if(existing.rows.length === 0){
            const err = new Error("no note for the id");
            err.status = 404;
            return next(err);
        }
        res.json({ message: 'Note deleted' });
    }
    catch(err){
        next(err);
    }
    // const index = notes.findIndex(n => n.id === note.id);
    // notes.splice(index,1);
   
})

module.exports = router;