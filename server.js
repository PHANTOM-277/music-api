const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const port = process.env.PORT || 8000;
const apikey = process.env.apikey;
const app = express();

const readMusic = async (mode)=>{
    try{
        let data =await fs.readdir(path.join(__dirname,'public','audio'));
        switch(mode){
            case 1:return data.length;
            case 2:return data;
        }
    }
    catch(err){
        console.log("Error in reading directory public/audio.");
        return null;//indicationg error
    }
}

//define the static route first so that 'n' is not mistaken for id in the next route
app.get('/api/n', async (req,res)=>{
    try{
        if(req.query.apikey !== apikey){
            res.status(401);
            throw new Error("Invalid Api Key Unauthorized.");
        }
        let data = await readMusic(2);
        res.status(200).json(data);
    }
    catch(err){
        res.send(err.message);
    }
})


app.get('/api/:id', async (req,res)=>{
    const id = parseInt(req.params.id);

    try{
        if(req.query.apikey !== apikey){
            res.status(401);
            throw new Error("Invalid Api Key Unauthorized.");
        }
        let totalMusic = await readMusic(1);
        if(!totalMusic){
            res.status(500);
            console.log("Could not read public/audio");
            throw new Error("Server error");
        }
        else if(!isNaN(id) && id>0 && id<=totalMusic){
            res.status(200).sendFile(path.join(__dirname,'public','audio',`${id}.mp3`));
        }
        else{
            res.status(404);
            throw new Error("Invalid id");
        }
    }
    catch(err){
        res.send(err.message);
    }
    
})

app.listen(port, ()=>{console.log(`Server up and Running on port ${port}`)});
