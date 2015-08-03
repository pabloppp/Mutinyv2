var low = require('lowdb');
var db = low('db.json');
var md5 = require('md5');
var uuid = require('node-uuid');

module.exports = function(app){

	//NEWS
	app.get('/db/news', function(req, res){
		res.json(db('news').first());
	});

	app.post('/users/new', function(req, res){

		if(req.body.user && req.body.user.email && req.body.user.name && req.body.user.password){

			var exists = db('users').chain().find({ email: req.body.user.email }).size() > 0;
			if(!exists) exists = db('users').chain().find({ name: req.body.user.name }).size() > 0;

			if(exists){
				res.status(400).json({message:"user already exists"});	
				return;
			}

			var new_user = db('users').push({
				id: uuid.v4(),
				name: req.body.user.name,
				email: req.body.user.email,
				email_verify_token: uuid.v4(),
			 	location: req.body.user.location,
			 	password: md5(req.body.user.password),
			 	roles : ["user"]
			});

			res.json({message:"ok"});
		}
		else{
			res.status(400).json({message:"wrong or incomplete data"});	
		}
		
	});

	app.post('/users/login', function(req, res){

		if(req.body.user && req.body.user.email && req.body.user.password){

			var user = db('users').find({ email: req.body.user.email });

			console.log(user);

			if(user && user.password == md5(req.body.user.password)){
				if(user.email_verify_token){
					res.status(403).json({message:"email still needs verification"});
					return;
				}
				else{
					user.access_token = uuid.v4();
					user.location = req.body.user.location;
					db.save()
					res.json({message:"ok", user: {
						name: user.name,
						token: user.access_token,
						roles: user.roles
					}});
				}


			}else{
				res.status(404).json({message:"wrong user or password"});	
				return;
			}

		}
		else{
			res.status(400).json({message:"wrong or incomplete data"});	
			return;
		}
		
	});

	return {};

}