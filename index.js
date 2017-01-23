'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const firebase = require("firebase");
const fbconfig = {
    apiKey: "AIzaSyBLxDcSTP5_nc1sLaGz03NCYBB3-u70AAM",
    authDomain: "persa-3a8b4.firebaseapp.com",
    databaseURL: "https://persa-3a8b4.firebaseio.com",
    storageBucket: "persa-3a8b4.appspot.com",
    messagingSenderId: "1053030430140"
};
firebase.initializeApp(fbconfig);


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');
    console.log('Firebase initialized');
    try {

        var speech = 'empty speech';
        var action = '';
        var rootRef = firebase.database().ref();

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    //speech += 'action: ' + requestBody.result.action;
                    action += requestBody.result.action;
                    if(action == 'timetable.read')
                    {
                        if(requestBody.result.parameters.weekday)
                        {
                            var weekday = requestBody.result.parameters.weekday;
                            var query = rootRef.child('users/rosy/timetable/'+ weekday);
                            query.once('value').then(function(snapshot) {
                //speech += snapshot.val();
                            snapshot.forEach(function(childSnapshot) {
                                if(childSnapshot.val()!=null)
                                    speech += childSnapshot.val() + ' at ' + childSnapshot.key+', \n';
                                else
                                    speech = 'You have no classes on '+weekday;
                    //var eName = childSnapshot.val().resultname;
                                });
                                return res.json({                                 //the return
                                speech: speech,
                                action: action,
                                emoji: ":)",
                                displayText: speech,
                                source: 'my-persa-webhook'
                                });
                            });
                        }
                        else
                        {
                                return res.json({                                 //the return
                                speech: speech,
                                action: action,
                                displayText: speech,
                                source: 'my-persa-webhook'
                                });
                        }
                    }
                    if(action == 'timetable.create')
                    {
                        var subject;
                        var weekday;
                        var time;
                        if(requestBody.result.parameters.subject)
                        {
                            subject = requestBody.result.parameters.subject;
                            if(requestBody.result.parameters.weekday)
                            {
                                weekday = requestBody.result.parameters.weekday;
                                if(requestBody.result.parameters.time)
                                {
                                    time = requestBody.result.parameters.time;
                                    rootRef.child('users/rosy/timetable/'+weekday+'/'+time).set(subject);
                                }
                            }
                        }
                        return res.json({                                 //the return
                            speech: speech,
                            action: action,
                            displayText: speech,
                            source: 'my-persa-webhook'
                        });
                    }
                }
            }
        }

        console.log('result: ', speech);


    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
