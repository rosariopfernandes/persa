'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var firebase = require("firebase");
        var config = {
            apiKey: "AIzaSyBLxDcSTP5_nc1sLaGz03NCYBB3-u70AAM",
            authDomain: "persa-3a8b4.firebaseapp.com",
            databaseURL: "https://persa-3a8b4.firebaseio.com",
            storageBucket: "persa-3a8b4.appspot.com",
            messagingSenderId: "1053030430140"
        };
        firebase.initializeApp(config);

        var speech = 'empty speech';
        var action = '';
        var parameters;

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
                }

                if(requestBody.result.parameters)
                {
                    parameters = requestBody.result.parameters;
                }
            }
        }

        console.log('result: ', speech);

        return res.json({                                 //the return
            speech: speech,
            action: action,
            displayText: speech,
            source: 'persa-custom-webhook'
        });
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
