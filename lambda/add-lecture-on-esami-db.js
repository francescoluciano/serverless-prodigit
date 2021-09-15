//Funzione che aggiunge una lezione al database esami

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    await addLecture(event).then(() => {
        callback(null, {
            statusCode: 200,
            body: 'Lecture added',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    }).catch((err) => {
        console.log(err);
        event.error = 1;
        callback(null, event);
    });
};

function addLecture(event){
    const params = {
        TableName: 'esami',
        Key: {
            'id_esame': Number.parseInt(event.id_corso)
        },
        UpdateExpression: 'ADD lezioni :lezione',
        ExpressionAttributeValues: {
            ':lezione' : ddb.createSet(event.id_lezione)
        },
        ReturnValues : 'ALL_NEW'
    }
    
    return ddb.update(params).promise();
}