//Lambda che recupera i dati delle lezioni di un docente

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {

    var query_string = "";
    var parameters = {
        ":min_free_seats": 0
    };

    if (event.id_corso !== undefined) {
        if (!isNumber(event.id_corso)) {
            event.status = "FAILED";
            event.statusCode = 400;
            event.error = "Something went wrong when searching the lectures."
            event.cause = "The course is not valid";
            callback(null, event);
            return;
        }
        //query_string += "id_corso = :course_id AND "
        parameters[":course_id"] = event.id_corso;
    } else {
        event.status = "FAILED";
        event.statusCode = 400;
        event.error = "Something went wrong when searching the lectures."
        event.cause = "The course id is required";
        callback(null, event);
        return;
    }

    if (event.inizio !== undefined) {
        if (!isNumber(event.inizio)) {
            event.status = "FAILED";
            event.statusCode = 400;
            event.error = "Something went wrong when searching the lectures."
            event.cause = "The starting lecture date is not valid";
            callback(null, event);
            return;
        }
        query_string += "inizio >= :lecture_start AND "
        parameters[":lecture_start"] = event.inizio;
    }

    if (event.fine !== undefined) {
        if (!isNumber(event.fine)) {
            event.status = "FAILED";
            event.statusCode = 400;
            event.error = "Something went wrong when searching the lectures."
            event.cause = "The ending lecture date is not valid";
            callback(null, event);
            return;
        }
        query_string += "fine <= :lecture_end AND "
        parameters[":lecture_end"] = event.fine;
    }

    if (event.codice_edificio !== undefined) {
        query_string += "codice_edificio = " + event.codice_edificio + " AND "
        if (event.codice_aula !== undefined) {
            query_string += "codice_aula = " + event.codice_aula + " AND "
        }
    }

    query_string += "posti_liberi > :min_free_seats"

    await retrieveLecturesOfTeacher(query_string, parameters).then(data => {
        event.lectures = data.Items;
        event.status = "SUCCEEDED";
        event.statusCode = 200;
        callback(null, event);
    }).catch((err) => {
        console.log(err);
        event.status = "FAILED";
        event.statusCode = 400;
        event.error = "Something went wrong when searching the lectures."
        callback(null, event);
    });
};

function retrieveLecturesOfTeacher(query_string, parameters) {
    console.log("FilterExpression: " + query_string)
    const params = {
        TableName: 'lezioni',
        IndexName: 'id_corso-index',
        KeyConditionExpression: 'id_corso = :course_id',
        FilterExpression: query_string,
        ExpressionAttributeValues: parameters,
        ProjectionExpression: "id_lezione, inizio, fine, nome_esame, posti_liberi, posti_totali, codice_aula, codice_edificio"
    }

    return ddb.query(params).promise();
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}