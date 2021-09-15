//Funzione che incrementa il numero di posti liberi e rimuove l'email dello studente all'elenco dei partecipanti
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await removeLecture(event).then(() => {
        callback(null, event)
    });
};

function removeLecture(event) {

    console.log(event);

    const params = {
        TableName: 'lezioni',
        Key: {
            'id_lezione': Number.parseInt(event.id_lezione)
        },
        UpdateExpression: 'SET posti_liberi = posti_liberi + :val DELETE studenti :studente_set',
        ConditionExpression: 'contains(studenti, :studente) ',
        ExpressionAttributeValues: {
            ':val': 1,
            ':studente_set': ddb.createSet(event.studente),
            ':studente': event.studente
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return ddb.update(params).promise();
}