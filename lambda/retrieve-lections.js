//Lambda che recupera i dati delle lezioni di uno studente dal database, data la matricola

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event, context, callback) => {
    await read_student(event.matricola).then(data => {
        //console.log(data);
        //console.log(data.Item.email)
        event.lezioni = data.Item.lezioni;
        callback(null, event);
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