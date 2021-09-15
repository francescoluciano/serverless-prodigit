//Lambda che recupera i dati degli studenti che parteciperanno a una lezione

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event, context, callback) => {
    console.log("Id Lezione: " + event.id_lezione)
    await retrieveStudents(event.id_lezione).then(data => {
        console.log("Studenti: " + JSON.stringify(data))
        if (data != null) {
            var attending_sudents = Object.keys(data.Item.studenti).length;
            if (attending_sudents > 0) {
                event.studenti = data.Item.studenti;
                callback(null, event)
            }
        }
    })
};

function retrieveStudents(id_lezione) {
    const params = {
        TableName: 'lezioni',
        Key: {
            'id_lezione': Number.parseInt(id_lezione)
        }
    }
    return ddb.get(params).promise();
}
