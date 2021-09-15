//Funzione che rimuove una lezione dal database esami, dopo che questa è stata eliminata dal docente:

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
    }).catch((err) => {
        console.log(err);
    });
};

function removeLecture(event) {
    const params = {
        TableName: 'esami',
        Key: {
            'id_esame': Number.parseInt(event.id_esame)
        },
        UpdateExpression: 'DELETE lezioni :lezione',
        ExpressionAttributeValues: {
            ':lezione': ddb.createSet(event.id_lezione)
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return ddb.update(params).promise();
}