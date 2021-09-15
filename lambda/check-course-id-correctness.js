//Funzione che controlla che il course_id esista e recupera il nome del corso

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
var error;

exports.handler = async (event, context, callback) => {
    await retrieveCourse(event).then(data => {
        event.nome_esame = data.Item.nome_esame;
        callback(null, event)
    }).catch((err) => {
        console.log(err);
        throw err;
    });
};

function retrieveCourse(event) {
    const params = {
        TableName: 'esami',
        Key: {
            'id_esame': Number.parseInt(event.id_corso)
        }
    }

    return ddb.get(params).promise();
}