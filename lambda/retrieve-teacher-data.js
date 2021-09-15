//Lambda che recupera i dati di un docente

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {

    await retrieveTeacherData(event.id_docente).then(data => {
        console.log("Data: " + JSON.stringify(data))
        if (data.Item != null) {
            callback(null, data.Item);
        } else {
            throw new Error("No teacher found")
        }

    });
};

function retrieveTeacherData(id_docente) {
    const params = {
        TableName: 'docenti',
        Key: {
            'id_docente': Number.parseInt(id_docente)
        }
    };
    return ddb.get(params).promise();
}