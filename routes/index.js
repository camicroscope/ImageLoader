var express = require('express');
var busboy = require("connect-busboy");
var fs  = require("fs");
var router = express.Router();
var app = require("../app");
console.log(app);
var path = require("path");
var superagent = require("superagent");
//var DATA_LOADER_PY = "/home/ganesh/dev/DataLoader_Api/DataLoader/dataLoader/dataloader.py";

//var api = "http://imaging.cci.emory.edu:9099/services/test/DataLoaderApiTest/submit/json";

//router.get("/

router.get("/subjectIdExists", function(req, res, next){
    var api_key = req.app.locals.api_key;
    var api = req.app.locals.api_subject_id_exists;
    var url = api + "?api_key=" + api_key + "&Subject_ID=" + req.query.SubjectUID;

    superagent.get(url).end(function(err, response){
        if(err){
            res.json({"status": "Error! Couldn't connect to Bindass"});
        }
        var data = (response.body);
        /*
        if(!data){
            res.json({});
        } 
        */
        res.json(data);
    });
});

router.get("/getMD5ForImage", function(req, res, next){
    
    var api_key = req.app.locals.api_key;
    var api = req.app.locals.api_get_md5_for_image;
    var image_directory = req.app.locals.image_directory;
    var url = api + "?api_key=" +api_key + "&File_Location="+image_directory +"/"+ req.query.imageFileName;
    console.log(url);
    superagent.get(url).end(function(err, response){
        if(err){
            res.json({"status": "error"})
        }
        else{
            res.json(response.body);
        }
        //console.log(response.body);
        //console.log(res);
        //res.json({"status": "ok"});
    });
 
})

//console.log(express.static(__dirname));
router.post('/submitData', function(req, res, next){
//    console.log("submitting datA");
//    console.log(req);
    var DATA_LOADER_PY = req.app.locals["dataLoader.py"];
    var api_key = req.app.locals.api_key;
    var image_directory = req.app.locals.image_directory;
    var api = req.app.locals.api_submit_entry;  
    //var Image_ID =  req.body.id;
    req.pipe(req.busboy);
    var Image_ID ="";
    /*Upload file*/

    req.busboy.on('field', function(fieldname, val){
        console.log("field rcvd!");
        Image_ID = val;
        console.log(Image_ID);

        //console.log(url);


    });


    req.busboy.on('file', function(fieldname, file, filename){
        //console.log(fieldname);
        //
        //
        var api_key = req.app.locals.api_key;
        var api_exists = req.app.locals.api_subject_id_exists;
        var url = api_exists + "?api_key=" + api_key + "&Subject_ID=" + Image_ID;

        superagent.get(url).end(function(err, response){
        
            if(err){
                res.json({"status": "Error! Couldn't connect to Bindass"});
            }
            var data = (response.body);
            console.log(data);
            if(data.length){
                res.json({"status": "Error", "message": "Duplicate image"});
            } else {

                console.log("Uploading: "+filename);    
                fstream = fs.createWriteStream(image_directory + '/'+filename)
                file.pipe(fstream);
                fstream.on("close", function(){
                    //console.log(req.body);
                    //var Image_ID =  req.body.id;

                    console.log("Upload finished of" +filename);
                     
                    /*Once file is uploaded*/
                    var data = "Id, File";
                    data+="\n";
                    data += Image_ID;
                    data+= ",";
                    data+= path.resolve(image_directory,filename);
                    /*Create input file*/
                    fs.writeFileSync(path.resolve(image_directory,"input.csv"), data);
                                
                    /* call the dataloader python utility */
                    console.log("Running dataloader.py"); 
                    var dataLoader = require("child_process").spawn(
                        "python3", 
                        [DATA_LOADER_PY, "-i", path.resolve(image_directory, "input.csv"), "-o", api, "-a", api_key]);

                    var output = "";
                    //console.log(dataLoader);

                    dataLoader.stdout.on("data", function(data){output+=data;});
                    dataLoader.on("close", function(code){
                        //console.log(code);            
                        if(code!== 0)
                            return res.json({"status": "Error", "message":"DataLoader error: "+code});
                        console.log(output);
                        
                        return res.json({"status": "success"});
                    });
                    
                });
                }   
            });


    });
    
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.app.locals.api_key);
  res.render('index', { title: 'Express' });
});

module.exports = router;
