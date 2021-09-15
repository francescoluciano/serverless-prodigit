//Lambda che recupera i posti totali in un'aula

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event, context, callback) => {
    await retrieveNumberOfSeats(event).then(data => {
        var aule = data.Item.aule;
        var posti_totali = 0;
        console.log(aule[0].codice_aula)
        for (var i = 0; i < aule.length && posti_totali == 0; i++) {
            if (aule[i].codice_aula == event.codice_aula) {
                posti_totali = aule[i].posti_totali;
            }
        }
        if (posti_totali != 0) {
            event.posti_totali = posti_totali;
            callback(null, event)
        } else {
            console.error("Room not found");
            throw new Error("Rooma not found");
        }
    }).catch((err) => {
        console.error(err);
    })
};

function retrieveNumberOfSeats(event) {
    const params = {
        TableName: 'edifici',
        Key: {
            'codice_edificio': event.codice_edificio
        }
    }
    return ddb.get(params).promise();
}
