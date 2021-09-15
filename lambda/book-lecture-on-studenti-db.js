//Funzione che aggiunge una lezione al database studenti
// !!!!
// Da invocare solo dopo aver invocato l'update della lezione nella tabella Esami
// !!!!

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await addLecture(event).then(() => {
        callback(null, event)
    }).catch((err) => {
        console.log(err);
        event.error = true;
        callback(null, event);
    });
};

function addLecture(event) {
    const params = {
        TableName: 'studenti',
        Key: {
            'matricola': Number.parseInt(event.matricola)
        },
        UpdateExpression: 'ADD lezioni :lezione',
        ExpressionAttributeValues: {
            ':lezione': ddb.createSet(event.id_lezione)
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return ddb.update(params).promise();
}