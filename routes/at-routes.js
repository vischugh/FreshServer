/**
 * Created by Shobhit on 01-04-2017.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });


router.route('/survey')
    .post(function (request, response) {
        console.log(request.body);
        var db = request.db;
        var teamCollection = db.get('Team');
        var userCollection = db.get('User');
        var surveyCollection = db.get('Survey');
        if (Number(request.body.surveyType) == 5) {/*
            console.log(request.body.UserId);
            teamCollection.findOne({ ATCId: Number(request.body.UserId) }, function (e, team) {
                if (e) throw e;
                var teamId = Number(team.TeamId);
                console.log(team.TeamName);

                /!*userCollection.find({UserType: 1, TeamId: teamId}, {}, function (e, players) {
                    if (e) throw e;
                    for (var i in players){
                        var playerid = Number(players[0].UserId);
                        console.log("PlayerId = " + playerid);
                        surveyCollection.update({
                            PlayerId: playerid,
                            DateDay: request.body.answers.Date.TodayDate,
                            DateMonth: request.body.answers.Date.TodayMonth,
                            DateYear: request.body.answers.Date.TodayYear
                        }, {
                            $set: {
                                Q11: Number(request.body.answers.Q11)
                            }
                        }, function (e, survey) {
                            if (e) throw e;

                        });
                    }
                });*!/

                surveyCollection.update({
                    TeamId: teamId,
                    DateDay: request.body.answers.Date.TodayDate,
                    DateMonth: request.body.answers.Date.TodayMonth,
                    DateYear: request.body.answers.Date.TodayYear
                }, {
                        $set: {
                            Q13: Number(request.body.answers.Q13)
                        }
                    }, function (e, survey) {
                        if (e) throw e;
                        response.json(survey);
                    });

            });*/
        }

        else if (request.body.surveyType == 6) {
            surveyCollection.update({
                PlayerId: Number(request.body.PlayerId),
                DateDay: request.body.Date.TodayDate,
                DateMonth: request.body.Date.TodayMonth,
                DateYear: request.body.Date.TodayYear
            },
                {
                    $set: {
                        Q13: Number(request.body.Q13)
                    }
                });
            response.json('Data stored');
        }
    });

router.route('/pending/:atcId')
    .get(function (request, response) {
        var db = request.db;
        console.log(request.params);
        //response.json('Pending ATC');
        var playerCollection = db.get('User');
        var teamCollection = db.get('Team');
        teamCollection.findOne({ ATCId: Number(request.params.atcId) }, {}, function (e, team) {
            var teamId = Number(team.TeamId);
            console.log('Team = ' + teamId);
            playerCollection.find({ TeamId: teamId, UserType: 1, StatusCd: 2 }, {}, function (e, players) {
                response.json(players);
            });
        });
    });

router.route('/approve')
    .post(function (request, response) {
        var db = request.db;
        console.log(request.body);
        var playerCollection = db.get('User');

        var playerId = Number(request.body.PlayerId);
        playerCollection.update({ UserId: playerId, UserType: 1, StatusCd: 2 }, {
            $set: { StatusCd: 1 }
        }, function (e, players) {
            response.json(players);
        });
    });

router.route('/aggresults/:atcId')
    .get(function (request, response) {
        var db = request.db;
        var atcId = Number(request.params.atcId);
        var teamCollection = db.get('Team');
        var surveyCollection = db.get('Survey');
        teamCollection.findOne({ ATCId: atcId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            surveyCollection.aggregate([{
                $group: {
                    _id: { "DateDay": "$DateDay", "DateMonth": "$DateMonth", "DateYear": "$DateYear", "TeamId": "$TeamId" },
                    AvgQ1: { $avg: "$Q1" },
                    AvgQ2: { $avg: "$Q2" },
                    AvgQ3: { $avg: "$Q3" },
                    AvgQ4: { $avg: "$Q4" },
                    AvgQ5: { $avg: "$Q5" },
                    AvgQ7: { $avg: "$Q7" },
                    AvgQ8: { $avg: "$Q8" },
                    AvgQ9: { $avg: "$Q9" },
                    AvgQ10: { $avg: "$Q10" },
                    AvgQ11: { $avg: "$Q11" },
                    AvgQ12: { $avg: "$Q12" },
                    AvgQ13: { $avg: "$Q13" }
                }
            }], {}, function (e, survey) {
                console.log("survey");
                var atcSurvey = [];
                for (var index in survey) {
                    if (Number(survey[index]._id.TeamId) == teamId) {
                        atcSurvey.push(survey[index]);
                    }
                }
                console.log(atcSurvey);
                response.json(atcSurvey);
            })
        });
    });

router.route('/allplayers/:atcId')
    .get(function (request, response) {
        var db = request.db;
        var atcId = Number(request.params.atcId);
        var teamCollection = db.get('Team');
        var playerCollection = db.get('User');
        var surveyCollection = db.get('Survey');
        teamCollection.findOne({ ATCId: atcId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            playerCollection.find({ UserType: 1, StatusCd: 1, TeamId: teamId }, {}, function (e, players) {
                console.log(players);
                response.json(players);
            });
        });
    });

router.route('/:atcId/indresults/:playerId')
    .get(function (request, response) {
        var db = request.db;
        console.log(request.params);
        var playerId = Number(request.params.playerId);
        console.log(playerId);
        var atcId = Number(request.params.atcId);
        console.log(atcId);
        var teamCollection = db.get('Team');
        var playerCollection = db.get('User');
        var surveyCollection = db.get('Survey');
        teamCollection.findOne({ ATCId: atcId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            surveyCollection.find({ PlayerId: playerId }, { limit: 60, sort: ({ DateDay: -1, DateMonth: -1, DateYear: -1 }) }, function (e, players) {
                console.log(players);
                response.json(players);
            });
        });
    });

router.route('/:atcId/teamavg')
    .get(function (request, response) {
        var db = request.db;
        console.log(request.params);
        var atcId = Number(request.params.atcId);
        console.log(atcId);
        var teamCollection = db.get('Team');
        var playerCollection = db.get('User');
        var surveyCollection = db.get('Survey');
        teamCollection.findOne({ ATCId: atcId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            surveyCollection.aggregate([{
                $group: {
                    _id: { "DateDay": "$DateDay", "DateMonth": "$DateMonth", "DateYear": "$DateYear", "TeamId": "$TeamId" },
                    AvgQ1: { $avg: "$Q1" },
                    AvgQ2: { $avg: "$Q2" },
                    AvgQ3: { $avg: "$Q3" },
                    AvgQ4: { $avg: "$Q4" },
                    AvgQ5: { $avg: "$Q5" },
                    AvgQ7: { $avg: "$Q7" },
                    AvgQ8: { $avg: "$Q8" },
                    AvgQ9: { $avg: "$Q9" },
                    AvgQ10: { $avg: "$Q10" }
                }
            }], {}, function (e, survey) {
                console.log("survey");
                var teamAvgSurvey = [];
                for (var index in survey) {
                    if (Number(survey[index]._id.TeamId) == teamId) {
                        teamAvgSurvey.push(survey[index]);
                    }
                }
                console.log(teamAvgSurvey);
                response.json(teamAvgSurvey);
            });
        });
    });

router.route('/addteam')
    .post(function (request, response) {
        console.log(request.body);
        var db = request.db;
        var TeamCollection = db.get('Team');
        TeamCollection.findOne({}, {limit: 1, sort: ({TeamId: -1})}, function (e, team) {
            if (team) {
                var teamId = Number(team.TeamId) + 1;
                TeamCollection.insert({
                        TeamId: teamId,
                        TeamName: request.body.Name
                    });
                response.json('Team Created');
                }
            else {
                TeamCollection.insert({
                    TeamId: Number(1),
                    TeamName: request.body.Name
                });
                response.json('Team Created');
            }
        });
    });

module.exports = router;