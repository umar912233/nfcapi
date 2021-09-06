const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
var cors = require('cors');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'nodeuser',
    password:'nodepassword9122@',
    database:'nodeapi'
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connected');
    else
    console.log('Not Connecte');
});

app.listen(3000,()=>console.log('Express Server is running at port no: 3000'));
// Add headers

// Register User
app.post('/register',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    mysqlConnection.query('SELECT * FROM users WHERE email="'+email+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
               message:'email already exist', 
               status: false
            });
        else
        mysqlConnection.query('INSERT INTO users(name,email,password) VALUES("'+name+'","'+email+'","'+password+'")',(err,rows,fields)=>{
            if(!err)
            res.send({
				message:'User Registered Successfully',
				status: true
			});
            else
            console.log(err);
        })
    });
})

// Login User
app.post('/login',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    var email = req.body.email;
    var password = req.body.password;
	
    mysqlConnection.query('SELECT * FROM users WHERE email="'+email+'" AND password="'+password+'"',(err,rows,fields)=>{
        if(rows.length == 1)
            res.send({
				data:rows,
				status:true,
			});
        else
            res.send({
				message:'User Not Found',
				status: false
			});
    });
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else if(file.mimetype == 'video/mp4'){
        cb(null, true);
    } else if(file.mimetype == 'audio/mp3' || file.mimetype == 'audio/wave' || file.mimetype == 'audio/flac'|| file.mimetype == 'audio/aac'){
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Upload Image
app.post('/uploadimg', upload.single('image_url'), (req, res, next) => {
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    console.log(req.file);
    mysqlConnection.query('INSERT INTO imgmedia(user_id,image_url,image_name) VALUES("'+req.headers['userid']+'","'+req.file.filename+'","'+req.headers['imagename']+'")',(err,rows,fields)=>{
        if(!err)
            res.send(
                {
                    message:'Image Uploaded In Database',
                    status: true
                }
            );
        else
            res.send(
                {
                    message:'Something Went Wrong',
                    status: false
                }
            );
    });
});

// Upload Video
app.post('/uploadvideo', upload.single('video_url'), (req, res, next) => {
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
	mysqlConnection.query('INSERT INTO videomedia(user_id,video_url,video_name) VALUES("'+req.headers['userid']+'","'+req.file.filename+'","'+req.headers['videoname']+'")',(err,rows,fields)=>{
        if(!err)
            res.send(
                {
                    message:'Video Uploaded In Database',
                    status: true,
                }
            );
        else
            res.send(
                {
                    message:'Something Went Wrong',
                    status: false
                }
            );
    });
});

// Upload Audio
app.post('/uploadaudio', upload.single('audio_url'), (req, res, next) => {
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('INSERT INTO audiomedia(user_id,audio_url,audio_name) VALUES("'+req.headers['userid']+'","'+req.file.filename+'","'+req.headers['audioname']+'")',(err,rows,fields)=>{
        if(!err)
            res.send(
                {
                    message:'Audio Uploaded In Database',
                    status: true
                }
            );
        else
            res.send(
                {
                    message:'Something Went Wrong',
                    status: false
                }
            );
    });
});

// Upload Link
app.post('/uploadlink',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('INSERT INTO linkmedia(user_id,link_url,link_name) VALUES("'+req.body.user_id+'","'+req.body.link_url+'","'+req.body.link_name+'")',(err,rows,fields)=>{
        if(!err)
            res.send({
                message:'Link Uploaded In Database',
                status: true
            });
        else
            res.send({
                message: 'Something Went Wrong',
                status:false
            });
    })
})

// Get Image
app.get('/getimage',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM imgmedia WHERE user_id="'+req.param('userId')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Get Image
app.get('/getsingleimage',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    mysqlConnection.query('SELECT * FROM imgmedia WHERE id="'+req.param('id')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Get Video
app.get('/getvideo',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM videomedia WHERE user_id="'+req.param('userId')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Get video
app.get('/getsinglevideo',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM videomedia WHERE id="'+req.param('id')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Get Audio
app.get('/getaudio',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM audiomedia WHERE user_id="'+req.param('userId')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Get video
app.get('/getsingleaudio',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM audiomedia WHERE id="'+req.param('id')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

//Get Link
app.get('/getlink',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM linkmedia WHERE user_id="'+req.param('userId')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Get video
app.get('/getsinglelink',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM linkmedia WHERE id="'+req.param('id')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

//Get Profile
app.get('/getprofile',(req,res,next)=>{
	
	res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
    mysqlConnection.query('SELECT * FROM users WHERE id="'+req.param('userId')+'"',(err,rows,fields)=>{
        if(rows.length > 0)
            res.send({
                data:rows,
                status: true
            });
        else
            res.send(
                {
                    message:'Data Not Found Against This User',
                    status: false
                }
            );
    });
})

// Update Profile
app.post('/updateprofile',(req,res,next)=>{
    mysqlConnection.query("UPDATE users SET name='"+req.body.name+"',email='"+req.body.email+"',password='"+req.body.password+"' WHERE id='"+req.body.user_id+"'",(err,rows,fields)=>{
        if(!err)
            res.send({
                message:'Profile Updated Successfully',
                status: true
            });
        else
            res.send(
                {
                    message:'User Not Found Or Something Went Wrong!',
                    status: false
                }
            );
    });
})

// Upload Image
app.post('/contactus', (req, res) => {
    console.log(req.file);
    mysqlConnection.query('INSERT INTO contactus(name,email,message) VALUES("'+req.body.name+'","'+req.body.email+'","'+req.body.message+'")',(err,rows,fields)=>{
        if(!err)
            res.send(
                {
                    message:'Contact Details Added Successfully',
                    status: true
                }
            );
        else
            res.send(
                {
                    message:'Something Went Wrong',
                    status: false
                }
            );
    });
});