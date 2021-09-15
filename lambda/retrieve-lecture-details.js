//Lambda che recupera i dati di una lezione

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event, context, callback) => {
    await retrieveLecture(event.id_lezione).then(data => {
        event.studenti = data.Item.studenti;
        event.email_data = {};
        event.email_data.lecture_start = data.Item.inizio;
        event.email_data.lecture_end = data.Item.fine;
        event.email_data.building = data.Item.codice_edificio;
        event.email_data.class = data.Item.codice_aula;
        event.id_esame = data.Item.id_corso;
    });

    await retrieveExam(event.id_esame).then(exam => {
        event.email_data.professor = exam.Item.docente;
        event.email_data.exam_name = exam.Item.nome_esame;
        callback(null, event);
    })
};

function retrieveLecture(id_lezione) {
    const params = {
        TableName: 'lezioni',
        Key: {
            'id_lezione': Number.parseInt(id_lezione)
        }
    }
    return ddb.get(params).promise();
}

function retrieveExam(id_esame) {
    const params = {
        TableName: 'esami',
        Key: {
            'id_esame': Number.parseInt(id_esame)
        }
    }
    return ddb.get(params).promise();
}