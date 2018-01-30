var express = require('express');
var busboy = require("connect-busboy");
var fs  = require("fs");
var router = express.Router();
var app = require("../app");
console.log(app);
var path = require("path");
var superagent = require("superagent");


router.get("/subjectIdExists", function(req, res, next){
    var api_key = req.app.locals.api_key;
    var api = req.app.locals.api_subject_id_exists;
    var url = api + "?api_key=" + api_key + "&Subject_ID=" + req.query.case_id;

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

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var process_file = function(fieldname, file, filename){

    var api_key = req.app.locals.api_key;
    var api_exists = req.app.locals.api_subject_id_exists;
    var url = api_exists + "?api_key=" + api_key + "&Subject_ID=" + case_id;

    superagent.get(url).end(function(err, response){

        if(err){
            console.log(err);
            return res.status(400).json({"status": "Error! Couldn't connect to Bindass"});
        }
        var data = (response.body);
        console.log(data);
        if(data.length){
            //console.log("duplicate");
            return res.status(400).json({"status": "Error", "message": "Duplicate image"});
        } else {
            console.log("Uploading: "+filename);
            //add unique characters to filename to avoid overwriting existing files with same name
            var uid = makeid();
            filename = uid + "-" + filename;
            fstream = fs.createWriteStream(image_directory + '/'+filename)
            if (typeof file === 'string' || file instanceof String){
              // is it a url
              var request = http.get(file, function(response) {
                response.pipe(fstream);
              });
            } else {
              // it's a file
              file.pipe(fstream);
            }
            fstream.on("close", function(){
                //console.log(req.body);
                //var Image_ID =  req.body.id;

                console.log("Upload finished of" +filename);

                /*Once file is uploaded*/
                var data = "Id, study_id, File";
                data+="\n";
                data += case_id;
                data += ",";
                data += study_id;
                data+= ",";
                data+= path.resolve(image_directory,filename);
                /*Create input file*/
                fs.writeFileSync(path.resolve(image_directory,"input-"+uid+".csv"), data);

                /* call the dataloader python utility */
                console.log("Running dataloader.py");
                var dataLoader = require("child_process").spawn(
                    "python3",
                    [DATA_LOADER_PY, "-i", path.resolve(image_directory, "input-"+uid+".csv"), "-o", api, "-a", api_key]);
                console.log("python3 "+DATA_LOADER_PY+ " -i " + path.resolve(image_directory, "input-"+uid+".csv") + " -o "+ api + " -a " + api_key);

                var output = "";
                //console.log(dataLoader);

                dataLoader.stdout.on("data", function(data){output+=data;});
                dataLoader.on("close", function(code){
                    //console.log(code);
                    console.log(output);
                     //
                    if(code!== 0)
                        return res.status(500).json({"status": "Error", "message":"DataLoader error: "+code});


                    return res.json({"status": "success"});
                });
            });
        }
    });
}


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
    var case_id;
    var study_id = "default"
    req.busboy.on('field', function(fieldname, val){
        console.log("field recieved!");
        console.log(fieldname);
        if(fieldname == "case_id"){
            case_id = val;
            //console.log(Image_ID);
        } else if(fieldname == "study_id") {
            study_id = val;
        } else {
            console.log("invalid fieldname: "+ fieldname);
        }

    });
    req.busboy.on('file', process_file);
});

router.post('/boxData', function(req, res, next){
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
    var case_id;
    var study_id = "default"
    req.busboy.on('field', function(fieldname, val){
        console.log("field recieved!");
        console.log(fieldname);
        if(fieldname == "case_id"){
            case_id = val;
            //console.log(Image_ID);
        } else if(fieldname == "study_id") {
            study_id = val;
        } else if(fieldname == "box_url") {
            // does it come from box?
            if (val.substring(0,24)==="https://dl.boxcloud.com/"){
              src_url = val;
              process_file("", src_url, case_id)
            }
        } else {
            console.log("invalid fieldname: "+ fieldname);
        }

    });
    // TODO do we want this to be case_id?


  });

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.app.locals.api_key);
  res.render('index', { title: 'caMicroscope Image Loader' });
});

module.exports = router;
