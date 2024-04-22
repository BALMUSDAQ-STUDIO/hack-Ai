//- Node lib
const https = require('node:https');

//- Connect config of ai servers
const ai_servers = require('./config.json').ai_servers;
const ai_server_load_max = require('./config.json').max_ai_server_load;
const ai_api_key = require('./config.json').api_key;
for(var serv_name in ai_servers){
	ai_servers[serv_name].load = 0;
}


//-


//- Class for AI server`s sessions
class AI_session {
	server;			//# AI server name
	session_id;		//# Session ID for server
	ai_session_id;	//# Session ID for AI server

					//# Get serser`s session in constructor
	#get_session(){
		const options = {
			hostname: ai_servers[this.server].ip,
			port: ai_servers[this.server].port,
			path: "/api/session",
			method: "POST",
			body: JSON.stringify({
				"api-key": ai_api_key
			})
		};

		const req = https.request(options, (res) => {
			if(res.statusCode !== 201) {
				console.error("Error get session!");
			}

			res.on('data', (d) => {
				let data = JSON.parse(d);
				if(!data.session_id) {
					console.error("Error haven`t id in request!");
				}

				this.ai_session_id = data.session_id;
			});
		});
		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	}

	constructor(serv_name , session_id){
		this.server = serv_name;
		this.session_id = session_id;
		this.#get_session();
	}

	close(){
		const options = {
			hostname: ai_servers[this.server].ip,
			port: ai_servers[this.server].port,
			path: `/api/session/${this.ai_session_id}`,
			method: "DELETE",
			body: JSON.stringify({
				"api-key": ai_api_key,
			})
		};

		const req = https.request(options, (res) => {
			if(res.statusCode !== 200) {
				console.error("Error delete session!");
			}
		});
		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	}

	get_test(data , data_type){
		const options = {
			hostname: ai_servers[this.server].ip,
			port: ai_servers[this.server].port,
			path: '/api/session/${this.#session_id}/contest',
			method: "POST",
			body: JSON.stringify({
				"api-key": ai_api_key,
				"data_type": data_type,
				"data": data
			})
		};

		const req = https.request(options, (res) => {
			if(res.statusCode !== 201) {
				console.error("Error get session!");
			}

			res.on('data', (d) => {
				let data = JSON.parse(d);
				if(!d) {
					console.error("havent data in contest!");
				}

				return data.contest;
			});
		});
		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	}

	send_answer(data){
		const options = {
			hostname: ai_servers[this.server].ip,
			port: ai_servers[this.server].port,
			path: '/api/session/${this.#session_id}/contest/answer',
			method: "POST",
			body: JSON.stringify({
				"api-key": ai_api_key,
				"data": data
			})
		};

		const req = https.request(options, (res) => {
			if(res.statusCode !== 201) {
				console.error("Error get session!");
			}

			res.on('data', (d) => {
				let data = JSON.parse(d);
				if(!data.session_id) {
					console.error("Error haven`t id in request!");
				}

				return data.ai;
			});
		});
		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	}
}

module.exports.create_session = function(session_id){
	var serv_name = null;
	{
		var min = max_ai_server_load;

		for(let serv in ai_servers){
			if(ai_servers[serv].load > min){
				min = ai_servers[serv].load;
				serv_name = serv;
			}
		}
	}

	if(!serv_name)
		return {"max_load": true};

	let session = new AI_session(serv_name, session_id);
	
	return session;
} 