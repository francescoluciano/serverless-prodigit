//Funzione che decrementa il numero di posti liberi e aggiunge l'email dello studente all'elenco dei partecipanti
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await updateLecture(event).then(() => {
        callback(null, event);
    }).catch((err) => {
        console.error(err);
        throw (err);
    });
};

function updateLecture(event) {
    if (event.inizio >= event.fine) {
        throw new Error("Lecture end can not precede lecture start!");
    }


    return ddb.executeStatement({
        Statement: 'UPDATE lezioni SET inizio = ?, fine = ?, codice_aula = ?, codice_edificio = ?, posti_liberi = ? - (posti_totali - posti_liberi), posti_totali = ? WHERE id_lezione = ?',
        Parameters: [
            { N: String(event.inizio) },
            { N: String(event.fine) },
            { S: event.codice_aula },
            { S: event.codice_edificio },
            { N: String(event.posti_totali) },
            { N: String(event.posti_totali) },
            { N: String(event.id_lezione) }
        ]
    }).promise();
}