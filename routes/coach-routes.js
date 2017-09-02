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
        if (Number(request.body.surveyType) == 3) {
            console.log(request.body.UserId);
            teamCollection.findOne({ CoachId: Number(request.body.UserId) }, function (e, team) {
                if (e) throw e;
                var teamId = Number(team.TeamId);
                console.log(team.TeamName);

                /*userCollection.find({UserType: 1, TeamId: teamId}, {}, function (e, players) {
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
                });*/

                surveyCollection.update({
                    TeamId: teamId,
                    DateDay: request.body.answers.Date.TodayDate,
                    DateMonth: request.body.answers.Date.TodayMonth,
                    DateYear: request.body.answers.Date.TodayYear
                }, {
                        $set: {
                            Q11: Number(request.body.answers.Q11)
                        }
                    }, {
                        multi: true
                    }, function (e, survey) {
                        if (e) throw e;
                        response.json(survey);
                    });

            });
        }

        else if (request.body.surveyType == 4) {
            console.log(request.body.Q12);
            surveyCollection.update({
                PlayerId: Number(request.body.PlayerId),
                DateDay: request.body.Date.TodayDate,
                DateMonth: request.body.Date.TodayMonth,
                DateYear: request.body.Date.TodayYear
            },
                {
                    $set: {
                        Q12: Number(request.body.Q12)
                    }
                });
            response.json('Data stored');
        }

        else if (Number(request.body.surveyType) == 7) {
            console.log(request.body.UserId);
            teamCollection.findOne({ CoachId: Number(request.body.UserId) }, function (e, team) {
                if (e) throw e;
                var teamId = Number(team.TeamId);
                console.log(team.TeamName);

                surveyCollection.update({
                    TeamId: teamId,
                    DateDay: request.body.answers.Date.TodayDate,
                    DateMonth: request.body.answers.Date.TodayMonth,
                    DateYear: request.body.answers.Date.TodayYear
                }, {
                        $set: {
                            Q17: Number(request.body.answers.Q17)
                        }
                    }, {
                        multi: true
                    }, function (e, survey) {
                        if (e) throw e;
                        response.json(survey);
                    });

            });
        }
    });

router.route('/allPlayers/:coachId')
    .get(function (request, response) {
        var db = request.db;
        var coachId = Number(request.params.coachId);
        console.log(coachId);
        var teamCollection = db.get('Team');
        teamCollection.findOne({ CoachId: coachId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            getPlayers(teamId);
        });

        function getPlayers(teamId) {
            var userCollection = db.get('User');
            console.log(teamId);
            userCollection.find({ TeamId: teamId, UserType: 1 }, {}, function (e, user) {
                if (e) throw e;
                console.log(user);
                response.json(user);
            });
        }
    });

router.route('/results/:coachId')
    .get(function (request, response) {
        var db = request.db;
        var coachId = Number(request.params.coachId);
        console.log(coachId);
        var teamCollection = db.get('Team');
        teamCollection.findOne({ CoachId: coachId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            getPlayers(teamId);
        });

        function getPlayers(teamId) {
            var userCollection = db.get('User');
            userCollection.find({ TeamId: teamId }, {}, function (e, users) {
                if (e) throw e;
                for (var index in users) {

                }

                response.json(user);
            });
        }
    });

//Aggregate
/*db.Survey.aggregate([{$group:{_id:"$DateDay",
    AvgQ1:{$avg: "$Q1"},
    AvgQ2:{$avg: "$Q2"},
    AvgQ3:{$avg: "$Q3"},
    AvgQ4:{$avg: "$Q4"},
    AvgQ5:{$avg: "$Q5"},
    AvgQ6:{$avg: "$Q6"},
    AvgQ7:{$avg: "$Q7"},
    AvgQ8:{$avg: "$Q8"},
    AvgQ9:{$avg: "$Q9"},
    AvgQ10:{$avg: "$Q10"},
}}])*/

router.route('/aggresults/:coachId')
    .get(function (request, response) {
        var db = request.db;
        var coachId = Number(request.params.coachId);
        var teamCollection = db.get('Team');
        var surveyCollection = db.get('Survey');
        teamCollection.findOne({ CoachId: coachId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            surveyCollection.aggregate([
                {$project:{
                    _id:1,
                    DateDay:1,
                    DateMonth:1,
                    DateYear:1,
                    TeamId:1,
                    Q1:{$cond:
                    { if: { $eq: [ "$Q1", 0 ] },
                        then: null,
                        else: "$Q1" }},
                    Q2:{$cond:
                    { if: { $eq: [ "$Q2", 0 ] },
                        then: null,
                        else: "$Q2" }},
                    Q3:{$cond:
                    { if: { $eq: [ "$Q3", 0 ] },
                        then: null,
                        else: "$Q3" }},
                    Q4:{$cond:
                    { if: { $eq: [ "$Q4", 0 ] },
                        then: null,
                        else: "$Q4" }},
                    Q5:{$cond:
                    { if: { $eq: [ "$Q5", 0 ] },
                        then: null,
                        else: "$Q5" }},
                    Q6:{$cond:
                    { if: { $eq: [ "$Q6", 0 ] },
                        then: null,
                        else: "$Q6" }},
                    Q7:{$cond:
                    { if: { $eq: [ "$Q7", 0 ] },
                        then: null,
                        else: "$Q7" }},
                    Q8:{$cond:
                    { if: { $eq: [ "$Q8", 0 ] },
                        then: null,
                        else: "$Q8" }},
                    Q9:{$cond:
                    { if: { $eq: [ "$Q9", 0 ] },
                        then: null,
                        else: "$Q9" }},
                    Q10:{$cond:
                    { if: { $eq: [ "$Q10", 0 ] },
                        then: null,
                        else: "$Q10" }},
                    Q11:{$cond:
                    { if: { $eq: [ "$Q11", 0 ] },
                        then: null,
                        else: "$Q11" }},
                    Q12:{$cond:
                    { if: { $eq: [ "$Q12", 0 ] },
                        then: null,
                        else: "$Q12" }},
                    Q13:{$cond:
                    { if: { $eq: [ "$Q13", 0 ] },
                        then: null,
                        else: "$Q13" }},
                    Q14:{$cond:
                    { if: { $eq: [ "$Q14", 0 ] },
                        then: null,
                        else: "$Q14" }},
                    Q15:{$cond:
                    { if: { $eq: [ "$Q15", 0 ] },
                        then: null,
                        else: "$Q15" }},
                    Q17:{$cond:
                    { if: { $eq: [ "$Q17", 0 ] },
                        then: null,
                        else: "$Q17" }},
                    Q19:{$cond:
                    { if: { $eq: [ "$Q19", 0 ] },
                        then: null,
                        else: "$Q19" }}

                }},
                {$group: {
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
                    AvgQ17: { $avg: "$Q17" },
                    AvgQ19: { $avg: "$Q19" },

                }
            }], {}, function (e, survey) {
                console.log("survey");
                var coachSurvey = [];
                for (var index in survey) {
                    if (Number(survey[index]._id.TeamId) == teamId) {
                        coachSurvey.push(survey[index]);
                    }
                }
                console.log(coachSurvey);
                response.json(coachSurvey);
            })
        });
    });

router.route('/sessionrating')
    .get(function (request, response) {
        var db = request.db;
        var coachId = Number(request.params.coachId);
        var surveyCollection = db.get('Survey');
        var teamCollection = db.get('Team');
        teamCollection.findOne({ CoachId: coachId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            surveyCollection.aggregate([{
                $group: {
                    _id: { "DateDay": "$DateDay", "DateMonth": "$DateMonth", "DateYear": "$DateYear", "TeamId": "$TeamId" },
                    AvgQ9: { $avg: "$Q9" },
                    AvgQ11: { $avg: "$Q11" }
                }
            }], {}, function (e, survey) {
                console.log("survey");
                var coachSurvey = [];
                for (var index in survey) {
                    if (Number(survey[index]._id.TeamId) == teamId) {
                        coachSurvey.push(survey[index]);
                    }
                }
                console.log(coachSurvey);
                response.json(coachSurvey);
            })
        });

    });

router.route('/teampracticeavg/:coachId')
    .get(function (request, response) {
        var db = request.db;
        var coachId = Number(request.params.coachId);
        var teamCollection = db.get('Team');
        var surveyCollection = db.get('Survey');
        teamCollection.findOne({ CoachId: coachId }, {}, function (e, team) {
            if (e) throw e;
            console.log(team);
            var teamId = Number(team.TeamId);
            surveyCollection.aggregate([{
                $group: {
                    _id: { "DateDay": "$DateDay", "DateMonth": "$DateMonth", "DateYear": "$DateYear", "TeamId": "$TeamId" },
                    AvgQ9: { $avg: "$Q9" },
                    AvgQ10: { $avg: "$Q10" }
                }
            }], {}, function (e, survey) {
                console.log("survey");
                var avgpracticeSurvey = [];
                for (var index in survey) {
                    if (Number(survey[index]._id.TeamId) == teamId) {
                        avgpracticeSurvey.push(survey[index]);
                    }
                }
                console.log(avgpracticeSurvey);
                response.json(avgpracticeSurvey);
            })
        });
    });

module.exports = router;