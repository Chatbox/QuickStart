let express = require('express');
let bodyParser = require('body-parser');
let cb_sdk = require('chatbox_sdk');

let app, server, bot;

function endpoint(endpoint, handler) {
    console.log("--> endpoint created " + endpoint);

    /*

    Generic endpoint handler of post methods

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
    });*/

    app.post("/instantApp/added", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/instantApp/customerDisconnected", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/instantApp/customerConnected", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/instantApp/statusUpdate", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/instantApp/statusUpdate", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/instantApp/update", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/interaction/added", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/interaction/status", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/interaction/joined", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/interaction/left", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/message/added", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/message/status", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/customer/added", function (req, res) {
        bot.handleEvent(req, res);
    });

    app.post("/sendMessage", function (req, res) {
        let token = req.body.token;
        let channelId = req.body.channelId;
        let chatbox = new cb_sdk(channelId, token);
        chatbox.getPhoneNumber(req.body.userId.toString(), function (phoneNumber) {
            bot.sendMessage(req, res, phoneNumber, chatbox);
        })
    })
}

// this function sets up all the endpoints for the server
function createEndpoints(bot) {
    app = express();
    app.use(bodyParser.json());

    endpoint("/instantApp/added", bot.handleEvent);
    endpoint("/instantApp/customerDisconnected", bot.handleEvent);
    endpoint("/instantApp/customerConnected", bot.handleEvent);
    endpoint("/instantApp/statusUpdate", bot.handleEvent);
    endpoint("/instantApp/statusUpdate", bot.handleEvent);
    endpoint("/instantApp/update", bot.handleEvent);
    endpoint("/interaction/added", bot.handleEvent);
    endpoint("/interaction/status", bot.handleEvent);
    endpoint("/interaction/joined", bot.handleEvent);
    endpoint("/interaction/left", bot.handleEvent);
    endpoint("/message/added", bot.handleEvent);
    endpoint("/message/status", bot.handleEvent);
    endpoint("/customer/added", bot.handleEvent);
}

let GenericBot = function () {

    let self = this;
    self.port = "{Choose a port}";

    /*
     *
     *      Event Handlers
     */

    self.handleEvent = function (req, res) {
        console.log("------ Handling " + req.originalUrl + "---------\n" +
            JSON.stringify(req.body) +
            "\n----------------------------------");

        res.status(200).send();
    };

    self.sendMessage = function (req, res, phoneNumber, chatbox) {

        let message = req.body.message;
        chatbox.sendText(message, phoneNumber);
        res.status(200).send();
    };

    /*
     *
     *      End of Event Handlers
     */

    // set up the endpoints and server
    createEndpoints(self);
    server = app.listen(self.port, function () {
        console.log('Example app listening on port %s', server.address().port);
    });
};

bot = new GenericBot();

/*


 */