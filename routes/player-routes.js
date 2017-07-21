/**
 * Created by Shobhit on 01-04-2017.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});

router.route('/survey')
    .post(function(request, response){
        var db = request.db;
        console.log(request.body);
        var surveyCollection = db.get('Survey');
        var userCollection = db.get('User');
        if(request.body.surveyType == 1){
            surveyCollection.findOne({PlayerId: Number(request.body.UserId),
                DateDay: request.body.answers.Date.TodayDate,
                DateMonth: request.body.answers.Date.TodayMonth,
                DateYear: request.body.answers.Date.TodayYear}, {}, function(e, survey){
                if(survey){
                    console.log("Survey =" + survey.PlayerId);
                    surveyCollection.update({
                            PlayerId: Number(request.body.UserId),
                            DateDay: request.body.answers.Date.TodayDate,
                            DateMonth: request.body.answers.Date.TodayMonth,
                            DateYear: request.body.answers.Date.TodayYear},
                        {$set: {
                            Q1: Number(request.body.answers.Q1),
                            Q2: Number(request.body.answers.Q2),
                            Q3: Number(request.body.answers.Q3),
                            Q4: Number(request.body.answers.Q4),
                            Q5: Number(request.body.answers.Q5),
                            Q6: request.body.answers.Q6,
                            Q7: Number(request.body.answers.Q7),
                            Q8: Number(request.body.answers.Q8)
                        }
                        }, function(e, survey){
                            console.log('Pre Survey updated');
                            response.json(survey);

                        });
                }
                else {
                    userCollection.findOne({UserId: Number(request.body.UserId)}, function(e, player){
                        var teamId = Number(player.TeamId);
                        surveyCollection.insert({
                            PlayerId: Number(request.body.UserId),
                            TeamId: teamId,
                            DateDay: request.body.answers.Date.TodayDate,
                            DateMonth: request.body.answers.Date.TodayMonth,
                            DateYear: request.body.answers.Date.TodayYear,
                            Q1: Number(request.body.answers.Q1),
                            Q2: Number(request.body.answers.Q2),
                            Q3: Number(request.body.answers.Q3),
                            Q4: Number(request.body.answers.Q4),
                            Q5: Number(request.body.answers.Q5),
                            Q6: request.body.answers.Q6,
                            Q7: Number(request.body.answers.Q7),
                            Q8: Number(request.body.answers.Q8),
                            Q9: 0,
                            Q10: 0,
                            Q11: 0,
                            Q12: 0,
                            Q13:0
                        }, function(survey){
                            console.log('Pre survey created')
                            response.json(survey);
                        });
                    });
                }
            });
        }
        else if(request.body.surveyType == 2){
            console.log('yes');
            surveyCollection.update({
                PlayerId: Number(request.body.UserId),
                DateDay: request.body.answers.Date.TodayDate,
                DateMonth: request.body.answers.Date.TodayMonth,
                DateYear: request.body.answers.Date.TodayYear},{
                $set: {
                    Q9: Number(request.body.answers.Q9),
                    Q10: Number(request.body.answers.Q10)
                }
            }, function(survey){
                console.log("Post Survey Updated");
                response.json(survey);
            });
        }
    });

router.route('/getdata/:playerId')
    .get(function(request, response){
        var db = request.db;
        console.log(request.body);
        var playerId = Number(request.params.playerId);
        var surveyCollection = db.get('Survey');
        surveyCollection.find({PlayerId: playerId}, {}, function(e, survey){
            response.json(survey);
        });
    });
module.exports = router;