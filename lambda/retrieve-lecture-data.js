//Lambda che recupera i dati di una lezione

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event, context, callback) => {
    await retrieveLecture(event.id_lezione).then(data => {
        event.id_lezione = data.Item.id_lezione;
        event.inizio = data.Item.inizio;
        event.fine = data.Item.fine;
        event.id_corso = data.Item.id_corso;
        event.codice_aula = data.Item.codice_aula;
        event.codice_edificio = data.Item.codice_edificio;
        event.nome_corso = data.Item.nome_esame;

        callback(null, event);
    });
};

function retrieveLecture(id_lezione) {
    const params = {
        TableName: 'lezioni',
        Key: {
            'id_lezione': Number.parseInt(id_lezione)
        }
    }
    return ddb.get(params).promise();
}