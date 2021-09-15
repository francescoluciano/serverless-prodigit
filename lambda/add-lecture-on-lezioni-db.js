//Funzione che aggiunge una lezione al database Lezioni

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
var id_lezione;

exports.handler = async (event, context, callback) => {
    await addLecture(event).then(() => {
        event.id_lezione = id_lezione;
        callback(null, event)
    }).catch((err) => {
        console.log(err);
        throw err;
    });
};

function addLecture(event) {
    id_lezione = Date.now();
    const params = {
        TableName: 'lezioni',
        Item: {
            'id_lezione': id_lezione,
            'codice_aula': event.codice_aula,
            'codice_edificio': event.codice_edificio,
            'inizio': Number.parseInt(event.inizio),
            'fine': Number.parseInt(event.fine),
            'id_corso': Number.parseInt(event.id_corso),
            'posti_liberi': Number.parseInt(event.posti_totali),
            'posti_totali': Number.parseInt(event.posti_totali),
            'nome_esame': event.nome_esame
        },
        ConditionExpression: ':inizio < :fine',
        ExpressionAttributeValues: {
            ':inizio': Number.parseInt(event.inizio),
            ':fine': Number.parseInt(event.fine)
        }
    }

    return ddb.put(params).promise();
}