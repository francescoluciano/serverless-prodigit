//Funzione che rimuove una lezione dal database Lezioni

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await addLecture(event).then(data => {
        callback(null, event)
    }).catch((err) => {
        console.log(err);
    });
};

function addLecture(event) {
    const params = {
        TableName: 'lezioni',
        Key: {
            'id_lezione': event.id_lezione
        }
    }

    return ddb.delete(params).promise();
}