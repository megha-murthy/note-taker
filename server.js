const express= require('express');
const path= require('path');
const fs= require('fs');
const uuid1=require('uuid/v1');


const app = express();
const port= 3008;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

let count=1;

app.get('/api/notes',(req,res)=>{
    
        fs.readFile("./db/db.json",'utf8', function(err,data){
            if(err){
                throw err;
            }
            console.log("got back a response, click on it");
            
            const result=res.json(JSON.parse(data));
          
    })
})

app.post('/api/notes',(req,res)=>{
    console.log("SAVEDDD");
    let newNo=req.body;
    newNo.id=uuid1();

    let newInsert=fs.readFile('./db/db.json','utf8',function(err,data){
            if (data){
                json=JSON.parse(data);
                json.push(newNo);
            }
            else{
                json=[]
                json.push(newNo);
            }
           
            console.log(json);

            const output=fs.writeFile('./db/db.json',JSON.stringify(json),function(err){
                    if(err){
                        throw err;
                    }
                    console.log("Note written successfully to db.json");
                    
                })

            res.send(output);
    }) 
    

})

app.delete('/api/notes/:id',(req,res)=>{
    fs.readFile("./db/db.json",'utf8', function(err,data){
        if(err) throw err;
        let jsonNew=JSON.parse(data)
        for(let i=0;i<jsonNew.length;i++){
            if(req.params.id==jsonNew[i].id){
                console.log("Found the id to delete");
                jsonNew.splice(i,1);
                console.log(jsonNew);
            }
            else{
                console.log("Id does not match")
            }

        }
        const out=fs.writeFile('./db/db.json',JSON.stringify(jsonNew),function(err){
            if(err){
                throw err;
            }
            console.log("rewrite Success!!");
            
        })

        res.send(out);
    })
})


app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/notes.html'));
});

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})

app.listen(port,()=>{
    console.log(`App is running on port number:${port}`);
})