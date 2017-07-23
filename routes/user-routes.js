/**
 * Created by Shobhit on 01-04-2017.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

router.route('/login')
    .post(function (request, response) {
        console.log(request.body.username);
        var db = request.db;
        var UserLoginCollection = db.get('UserLogin');
        var UserCollection = db.get('User');
        UserLoginCollection.findOne({ Email: request.body.username }, function (e, user) {
            console.log(user);
            if (user.Password == request.body.password) {
                var login = true;
                console.log(login);
                var userId = Number(user.UserId);
                UserCollection.findOne({UserId: userId}, function(e, user){
                    response.json(user);
                });
            }
            else {
                var login = false;
                console.log(login);
                response.json('Login Failed');
            }
        });
    });

router.route('/signup')
    .post(function (request, response) {
        var db = request.db;
        var UserLoginCollection = db.get('UserLogin');
        console.log(request.body);
        var userid = 0;
        UserLoginCollection.findOne({ Email: request.body.email }, function (e, user) {
            console.log(user);
            if (user) {
                response.json("User Exists!");
            }
            else {
                console.log("Else");
                UserLoginCollection.findOne({}, { limit: 1, sort: ({ UserId: -1 }) }, function (e, user) {
                    console.log(user);
                    console.log("inside user login");
                    if (user) {
                        if (Number(request.body.usertype) == 1)
                            CreateNewUser(user.UserId + 1, 2);
                        else
                            CreateNewUser(user.UserId + 1, 1);
                    }
                    else {
                        console.log("Inside else");
                        if (Number(request.body.usertype) == 1)
                            CreateNewUser(1, 2);
                        else
                            CreateNewUser(1, 1);

                    }
                });
            }
        });

        function CreateNewUser(userid, StatusCd) {
            var UserLoginCollection = db.get('UserLogin');
            console.log("Got User Login table");
            var UserCollection = db.get('User');
            console.log("Got User table")
            UserLoginCollection.insert({
                UserId: Number(userid),
                Email: request.body.email,
                Password: request.body.password,
                UserType: Number(request.body.usertype)
            });
            UserCollection.insert({
                UserId: Number(userid),
                Name: request.body.name,
                Email: request.body.email,
                UserType: Number(request.body.usertype),
                StatusCd: StatusCd,
                TeamId: 10
            });
            response.json("User Created");
            console.log("User Created");
        }
    });

router.route('/try')
    .get(function (request, response) {
        response.json("Working");
    });
module.exports = router;