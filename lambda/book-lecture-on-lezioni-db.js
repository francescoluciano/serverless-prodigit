//Funzione che decrementa il numero di posti liberi e aggiunge l'email dello studente all'elenco dei partecipanti
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await addLecture(event).then(() => {
        callback(null, event)
    }).catch((err) => {
        throw new Error(err)
    });
};

function addLecture(event) {
    const params = {
        TableName: 'lezioni',
        Key: {
            'id_lezione': Number.parseInt(event.id_lezione)
        },
        UpdateExpression: 'SET posti_liberi = posti_liberi - :val ADD studenti :studente_set',
        ConditionExpression: '(posti_liberi > :limit) AND NOT contains(studenti, :studente)',
        ExpressionAttributeValues: {
            ':val': 1,
            ':limit': 0,
            ':studente_set': ddb.createSet(event.studente),
            ':studente': event.studente
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return ddb.update(params).promise();
}