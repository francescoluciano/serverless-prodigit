//Lambda che fa il controllo che email e matricola corrispondano

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    await read_student(event.matricola).then(data => {
        if (data.Item != null && data.Item.email == event.studente) {
            callback(null, event)
        } else {
            // Matricola and email does not correspond
            throw new Error('Matricola and Email does not match')
        }
    })
};

function read_student(matricola) {
    const params = {
        TableName: 'studenti',
        Key: {
            'matricola': Number.parseInt(matricola)
        }
    }
    return ddb.get(params).promise();
}