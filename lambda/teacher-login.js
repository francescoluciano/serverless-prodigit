//Lambda che recupera i dati di un docente dal database, dato l'id

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event, context, callback) => {
    await read_teacher(event.id).then(data => {
        callback(null, {
            statusCode: 200,
            body: data.Item,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        })
    }).catch((err) => {
        console.error(err);
    })
};

function read_teacher(id) {
    console.log("id: " + id);
    const params = {
        TableName: 'docenti',
        Key: {
            'id_docente': Number.parseInt(id)
        }
    }
    return ddb.get(params).promise();
}
