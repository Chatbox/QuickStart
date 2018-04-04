/**
 *
 * Example node server to use to integrate the Chatbox platform with Amazon Lex
 *
 * Endpoint to hit is /message?number={chatboxUserId}
 */

/*
 *  Project workflow:
 *  1. Incoming message to /message endpoint
 *  2. callSendToLex
 *      a. In the code update {LexAlias} and {LexBotName}
 *      b. Call processLex with updated orgChannelCode
 *  3. Make a custom response for each response from Lex.
 *  4. Use Chatbox API to continue the conversation with the customer.
 *
 */



let express = require('express');
let bodyParser = require('body-parser');
let AWS = require('aws-sdk');
let url = require('url');
let fetch = require('node-fetch');

let app, server;

let lexruntime = new AWS.LexRuntime({
    region: {region},
    accessKeyId: {accessKeyId},
    secretAccessKey: {secretAccessKey}
});

function endpoint(endpoint, handler) {
    console.log("--> endpoint created " + endpoint);

    app.post(endpoint, function (req, res) {
        console.log("\nENDPOINT: " + endpoint + "\n");

        res.succeed = function (obj) {
            obj = obj || {};
            obj.success = "true";
            console.log('resp> SUCCESS %s', JSON.stringify(obj));
            this.status(200).send(obj);
        };

        res.fail = function (text) {
            console.log('resp> FAIL %s', text);
            this.status(200).send({success: "false", text: text});
        };

        if (req.body) {
            handler(req, req.body, res);
        } else {
            res.succeed();
        }
    });
}

// this function sets up all the endpoints for the server
function createEndpoints(bot) {
    app = express();
    app.use(bodyParser.json());

    endpoint("/message", bot.message);

}

function sendToLex(botAlias, botName, userId, text, callback) {

    var lc = text.toLowerCase();

    var params = {
        botAlias: botAlias,
        botName: botName,
        inputText: lc,
        userId: String(userId).concat("chatbox"),
        sessionAttributes: {}
    };

    function lexCallback(err, data) {
        if (err) {
            console.log("error: " + err);
        } else {
            callback(data);
        }
    }

    lexruntime.postText(params, lexCallback);
}

let SimpleLexBot = function () {
    let self = this;

    self.port = 7343;

    const headers = {
        orgAuthToken: {chatboxOrgAuthToken},
        'Content-Type': 'application/json'
    };
    let options = {};

    self.message = function (req, body, res) {
        console.log("processing agent message with lex");

        var params = url.parse(req.url, true).query;
        var orgChannelCode = {twilioOrFacebookChannelId};

        var customerChannelKey;
        let getCustomerNumberURL = 'https://babblebox.io/rest/1.0/customer/' + params.userId;

        options = {};
        options['headers'] = headers;

        fetch(getCustomerNumberURL, options)
            .then(function (response) {
                response.json().then(function (json) {
                    switch (response.status) {
                        case 200 :
                            customerChannelKey = json.identities[0].key;
                            sendToLex({LexAlias}, {LexBotName}, params.userId, params.message, function (lexReply) {
                                console.log("lex returned:  ");
                                console.log(lexReply);
                                self.processLex(orgChannelCode, customerChannelKey, lexReply);
                            });
                            break;
                        case 404 :
                            console.log("Customer not found in chatbox");
                            console.log(response);
                            break;
                        case 417:
                            console.log("OrgAuthToken needs to be updated");
                            console.log(response);
                            break;
                        case 500:
                            console.log("Chatbox server error");
                            console.log(response);
                            break;
                        default:
                            console.log("Something weird");
                            console.log(response);
                            break;
                    }


                })
            })
            .catch(error => {
                if (error.code == "ECONNRESET") {
                    console.log("SOCKET HANG UP. RETRYING.")
                    self.message(req, body, res);
                } else {
                    console.log(error.stack);
                }
            });

        res.status(200).send();
    };

    self.processLex = function (orgChannelCode, customerChannelKey, lexReply) {

        const sendMessageURL = "https://babblebox.io/rest/1.0/message/sendToCustomer";
        var message, body = {};

        switch (lexReply.dialogState) {
            case null:
                message = "Sorry, I don't understand. Try saying 'register'";
                break;
            case 'ElicitIntent':
                message = "Sorry, I don't understand. Try saying 'register'";
                break;
            case 'ElicitSlot':
                message = lexReply.message;
                break;
            case 'Fulfilled':
                message = "Thank you, " + lexReply.slots.name + ", you have successfully used Lex with Chatbox!";
                body['instantAppSchemaCode'] = 'registration';
                body['instantAppParameters'] = {
                    'name':lexReply.slots.name,
                    'email':lexReply.slots.email,
                    'age':lexReply.slots.age
                };

                break;
        }

        body['message'] = message;
        body['orgChannelCode'] = orgChannelCode;
        body['customerChannelKey'] = customerChannelKey;

        options['body'] = JSON.stringify(body);
        options['method'] = 'POST';

        fetch(sendMessageURL, options)
            .then(function (response) {
                response.json().then(function (json) {
                    console.log(json);
                    if (response.status == "200") {
                        console.log("Sent " + message + " to Customer");
                    } else {
                        console.log("Error sending message to Customer");
                    }
                })
            })
            .catch(error => {
                console.log("Error sending message to Customer");
                if (error.code == "ECONNRESET") {
                    console.log("SOCKET HANG UP. RETRYING.")
                    this.processLex(orgChannelCode, customerChannelKey, lexReply);
                } else {
                    console.log(error.stack);
                }
            });
    };

    // set up the endpoints and server
    createEndpoints(self);
    server = app.listen(self.port, function () {
        console.log('Example app listening on port %s', server.address().port);
    });
};

let bot = new SimpleLexBot();
