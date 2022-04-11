const http = require('http')

const fs = require('fs')

const PORT = 5000

const server = http.createServer((req, res) => {

    const url = req.url

    const method = req.method

    // home path
    if (url == '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write("Hello From node Home");
        res.end()

    }
    // user login
    else if (url == '/login' && method == "POST") {
        let reqData = "";
        req.on("data", (chunk) => {
            reqData += chunk;
        })

        // reading file
        fs.readFile("./user.json", "utf-8", (error, data) => {
            if (error) {
                console.log(error);
                res.writeHead(400, { "Content-Type": "text/html" })
                res.end("Error While Reading File")
            }
            else {
                // convert data into object
                var obj = JSON.parse(data);

                let jsondata = JSON.parse(reqData)
                let userfound = false;

                for (let i in obj.users) {
                    if (jsondata.email == obj.users[i].email && jsondata.password == obj.users[i].password) {
                        res.writeHead(200, { "Content-Type": "text/html" })
                        res.write(JSON.stringify("Login successful"))
                        userfound = true;
                        res.end()


                    }
                }
                if (!userfound) {
                    res.writeHead(404, { "Content-Type": "text/html" })
                    res.write(JSON.stringify("Error while login ,user not found"))
                    res.end()
                }
            }

        })

    }

    // register user
    else if (url == '/register' && method == "POST") {
        let reqData = "";
        let userfound = false;
        req.on("data", (chunk) => {
            reqData += chunk;
        })

        //Read File
        fs.readFile('./user.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
            }

            else {
                let obj = JSON.parse(data);

                for (let i in obj.users) {
                    if (obj.users[i].email == JSON.parse(reqData).email) {
                        res.writeHead(400, { "Content-Type": "application/json" })
                        res.write("User Already Exist")
                        userfound = true;
                        res.end()
                    }
                }
                if (!userfound) {
                    obj.users.push(JSON.parse(reqData))

                    let json = JSON.stringify(obj, null, 2)

                    fs.writeFile('./user.json', json, 'utf-8', (err) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500, { "Content-Type": "application/json" })
                            res.end("Error occured")
                        }
                        else {
                            console.log("Registration succefull");
                            res.writeHead(200, { "Content-Type": "application/json" })
                            res.end(JSON.stringify(obj))
                        }

                    })
                }
            }

        })
    }
    // delete user by id
    else if (url == '/delete' && method == "DELETE") {
        let reqData = "";
        req.on("data",chunk=>{
            reqData +=chunk;
        })
        let idfound = false

        //readfile
        fs.readFile('./user.json', 'utf-8',(err,data)=>{
            if(err){
                console.log(err);
            }else{
                
                let obj = JSON.parse(data);
                const dele =JSON.parse(reqData)
                for(i in obj.users){
                    if(obj.users[i].id == dele.id){
                        obj.users.splice(i,1)
                        idfound = true
                    }
                }
                
                if(!idfound){
                    res.writeHead(404,{"Content-Type":"application/json"})
                    res.end("ID Not match with any user")
                }
                else{
                    const json =JSON.stringify(obj,null,2);

                    fs.writeFile('./user.json',json,'utf-8',error=>{
                        if(error){
                            console.log(error);
                            res.end("Error while writing file")
                        }
                        else{
                            console.log("deleted");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(obj))
                        }
                    })
                }
            }
        })
    }

    //update the user 

    else if(url == '/update' && method == 'PUT'){
        let reqData = "";
        req.on("data",chunk=>{
            reqData +=chunk;
        })
        let idfound = false

        //readfile
        fs.readFile('./user.json', 'utf-8',(err,data)=>{
            if(err){
                console.log(err);
            }else{
                
                let obj = JSON.parse(data);
                const update =JSON.parse(reqData)
                for(i in obj.users){
                    if(obj.users[i].id == update.id){
                        obj.users[i] = update
                        idfound = true
                    }
                }
                
                if(!idfound){
                    res.writeHead(404,{"Content-Type":"application/json"})
                    res.end("ID Not match with any user")
                }
                else{
                    const json =JSON.stringify(obj,null,2);

                    fs.writeFile('./user.json',json,'utf-8',error=>{
                        if(error){
                            console.log(error);
                            res.end("Error while writing file")
                        }
                        else{
                            console.log("updated");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(obj))
                        }
                    })
                }
            }
        })

    }

    // get specific user details by id
    else if(url =='/getuser' && method =='GET'){
        let reqData = '';
        req.on("data",chunk=>{
            reqData +=chunk;
        })
        let idfound = false;

        fs.readFile("./user.json",'utf-8',(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
                let obj = JSON.parse(data);

                let jsondata = JSON.parse(reqData)
                
                for( let i in obj.users){
                    if(obj.users[i].id==jsondata.id){
                        res.end(JSON.stringify(obj.users[i]))
                        idfound = true
                        
                    }
                }
                if(!idfound){
                    res.writeHead(404,{"Content-Type":"application/json"})
                    res.end("Id not match with any record")
                }
            }
        })


    }

    // if not any route match
    else{
        res.writeHead(404,{"Content-Type":"text/html"})
        res.end("Route not match")
    }
    })
        server.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
