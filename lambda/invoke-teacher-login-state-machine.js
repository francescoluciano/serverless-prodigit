// Lambda che invoca la step functions di login dei docenti

const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log("Printing event: " + JSON.stringify(event));
    console.log("Event body: " + event.body)
    var params = {
        stateMachineArn: "arn:aws:states:us-east-1:987476018036:stateMachine:TeacherLoginStateMachine",
        input: JSON.stringify(event),
        name: "invoke" + Date.now()
    }
    console.log(params)

    var stepfunctions = new AWS.StepFunctions();
    stepfunctions.startSyncExecution(params, function (err, data) {
        if (err)
            throw err;
        if (data.status != "SUCCEEDED") {
            let response = {
                statusCode: '400',
                body: { error: 'Error while retrieving data' },
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            context.succeed(response);
        }
        else {
            let response = {
                statusCode: '200',
                body: JSON.parse(data.output),
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            context.succeed(response);
        }
    });
};
