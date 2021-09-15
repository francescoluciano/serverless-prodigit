// Lambda che invoca la step functions di login degli studenti

const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log("Printing event: " + event);
    var params = {
        stateMachineArn: "arn:aws:states:us-east-1:987476018036:stateMachine:StudentLoginStateMachine",
        input: event.body,
        name: "invoke" + Date.now()
    }
    console.log(params)

    var stepfunctions = new AWS.StepFunctions();
    console.log("Everything okay") //test
    stepfunctions.startSyncExecution(params, function (err, data) {
        if (err)
            throw err;
        if (data.status != "SUCCEEDED") {


            callback(null, {
                statusCode: 400,
                body: JSON.stringify(data),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
        } else {
            callback(null, {
                statusCode: 200,
                body: data.output,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
        }
    });
};
