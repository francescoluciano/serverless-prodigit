//Lambda che invoca la step functions che cancella una lezione

const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var params = {
        stateMachineArn: "arn:aws:states:us-east-1:987476018036:stateMachine:DeleteLectureStateMachineExpress",
        input: JSON.stringify(event),
        name: "test-from-lambda"
    }

    var stepfunctions = new AWS.StepFunctions();
    stepfunctions.startSyncExecution(params, function (err, data) {
        if (err)
            throw err;
        if (data.status != "SUCCEEDED") {
            callback(null, {
                statusCode: 400,
                body: data.error + ": " + data.cause,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
        } else {
            callback(null, {
                statusCode: 200,
                body: 'Lecture deleted successfully',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
        }
    });
};