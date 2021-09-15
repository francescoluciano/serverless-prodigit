//Funzione che controlla l'esistenza dell'edificio e dell'aula

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
var error;

exports.handler = async (event, context, callback) => {
    await retrieveLectures(event).then(data => {
        data.Items.forEach(item => {
            if ((item.inizio >= event.inizio && item.inizio < event.fine) || (item.fine > event.inizio && item.fine <= event.fine)) {
                throw new Error("Another lecture is already booked for that room!");
            }
        })
        callback(null, event)
    }).catch((err) => {
        console.log(err);
        throw err;
    });
};

function retrieveLectures(event) {
    const params = {
        TableName: 'lezioni',
        FilterExpression: 'codice_edificio = :codice_edificio AND codice_aula = :codice_aula',
        ExpressionAttributeValues: {
            ':codice_edificio': event.codice_edificio,
            ':codice_aula': event.codice_aula
        }
    }

    return ddb.scan(params).promise();
}