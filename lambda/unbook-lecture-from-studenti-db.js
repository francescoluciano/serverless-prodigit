//Funzione che rimuove una lezione dal database studenti
// !!!!
// Da invocare solo dopo aver invocato l'update della lezione nella tabella Esami
// !!!!
//
// Necessita di numero di matricola e dell'id della lezione
//
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await removeLecture(event).then(() => {
        callback(null, {
            statusCode: 200,
            body: 'Lecture removed',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    });
};

function removeLecture(event) {
    const params = {
        TableName: 'studenti',
        Key: {
            'matricola': Number.parseInt(event.matricola)
        },
        UpdateExpression: 'DELETE lezioni :lezione_set',
        ConditionExpression: 'contains(lezioni, :lezione)',
        ExpressionAttributeValues: {
            ':lezione_set': ddb.createSet(event.id_lezione),
            ':lezione': Number.parseInt(event.id_lezione)
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return ddb.update(params).promise();
}