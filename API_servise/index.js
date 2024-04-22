//- Node libs
const express = require('express');
const path = require('path');
const cors = require('cors');
const multer  = require("multer");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const history = require('connect-history-api-fallback');


// import {fileTypeFromFile} from 'file-type';

//- AI lib
const ai = require('./ai-connect');

const app = express();

var users_db = [];

//- Test log func
app.use(function(req , res , next){
	let date = new Date();
	console.log(`${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}\t\t${req.ip}\t${req.method}\t${req.url}\n\r${req.body}`);
	next();
});

app.use("/assets", express.static(path.join(__dirname, "www/assets")));

const upload = multer({dest:"uploads"});


app.post('/api/contest',upload.single("content") , function(req, res){
	let content_data = req.file;
	console.log(content_data);
	
	res.json({'id': content_data.filename});

});

app.get('/api/contest/:id' , function(req, res){
	// res.json({
	// 	"contest": [
	// 		{
	// 			"type": "input",
	// 			"text": "ASKAsJKSAKJSA",
	// 			"index": "1"
	// 		},
	// 		{
	// 			"type": "ratio",
	// 			"text": "RATIO",
	// 			"data": [
	// 				{
	// 					"name": "First",
	// 					"key": "1"
	// 				},
	// 				{
	// 					"name": "Second",
	// 					"key": "2"
	// 				},
	// 				{
	// 					"name": "Third",
	// 					"key": "3"
	// 				}
	// 			],
	// 			"index": "1"
	// 		},
	// 		{
	// 			"type": "checkbox",
	// 			"text": "CHKBOX",
	// 			"data": [
	// 				{
	// 					"name": "First",
	// 					"key": "1"
	// 				},
	// 				{
	// 					"name": "Second",
	// 					"key": "2"
	// 				},
	// 				{
	// 					"name": "Third",
	// 					"key": "3"
	// 				}
	// 			],
	// 			"index": "1"
	// 		}
	// 	]
	// }).end();

	user_session = ai.create_session(req.params.id);

	let data = fs.readFileSync(`/upload/${req.params.id}`, {encoding:"base64"});
	let contest = user_session.get_test(data, '');

	users_db.push(user_session);

	res.json(contest).end();
});


app.post('/api/contest/:id', function(req, res){
	user_session = users_db.filter(n => n.session_id === req.params.id)[0];

	user_session.send_answers(req.body);
})

app.use(history({
	index: '/',
	rewrites: [
		{
			from: /^\/static\/.*$/,
			to: function(context) {
				return context.parsedUrl.pathname;
			}
		},
		{
			from: /^\/api\/.*$/,
			to: function(context) {
				console.log(2330);
				return context.parsedUrl.pathname;
			}
		}
	]
}));

app.get("/" , function (req , res){
	res.sendFile(__dirname + "/www/index.html");
});


app.listen(3000, "0.0.0.0");