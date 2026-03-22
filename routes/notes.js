const express = require("express");
//returns a router object with res,req as methods
const router = express.Router();
const {validateNewNote,validateUpdateNote} = require('../middleware/validate');
const auth = require('../middleware/auth');


let notes = [];

let nextId = 1; 
router.get('/',auth,(req,res) => {
    const userNotes = notes.filter(n => n.userId === req.user.id);
    res.json(userNotes);
}
)
router.get("/:id",auth,(req,res,next) => {
    const userNotes = notes.filter(n => n.userId === req.user.id);
    const note = userNotes.find(n => n.id === parseInt(req.params.id));
    if(!note){
        const err = new Error("no note for the id");
        err.status = 404;
        return next(err);
    } // now errorHandler handles it -> return res.status(404).json({error: "no note"});
    res.json(note);
})
router.post("/",auth,validateNewNote,(req,res) => {
    // console.log('req.body is:', req.body);
    const title = req.body.title;
    const content = req.body.content;
    //now handled in middleware
    // if(!title || !content){
    //     return res.status(404).json({error: "no details"});
    // }
    const note = {id: nextId++,title,content,userId:req.user.id};
    notes.push(note);
    res.status(201).json(note);
})
router.put("/:id",auth,validateUpdateNote,(req,res,next) => {
    const userNotes = notes.filter(n => n.userId === req.user.id);
    const note = userNotes.find(n => n.id === parseInt(req.params.id));
    if(!note){
        const err = new Error("no note for the id");
        err.status = 404;
        return next(err);
    }
    const {title ,content} = req.body;
    if(title) note.title = title;
    if(content) note.content = content;
    res.json(note);
})
router.delete("/:id",auth,(req,res,next) => {
    const userNotes = notes.filter(n => n.userId === req.user.id);
    const note = userNotes.find(n => n.id === parseInt(req.params.id));
    if(!note){
        const err = new Error("no note for the id");
        err.status = 404;
        return next(err);
    }
    const index = notes.findIndex(n => n.id === note.id);
    notes.splice(index,1);
    res.json({ message: 'Note deleted' });
})

module.exports = router;