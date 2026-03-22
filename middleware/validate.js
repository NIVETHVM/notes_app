function validateNewNote(req,res,next){
    const {content,title} = req.body;
    
    if(!content || !title){
        return res.status(400).json({error:"content or title missing"}) 
    }
    next();
}
function validateUpdateNote(req,res,next){
    const {content,title } = req.body;
    if(!content && !title){
        return res.status(400).json({error:"content and title missing"})
    }
    next();
}

module.exports = { validateNewNote, validateUpdateNote };