//Lambda che recupera i dati delle lezioni di un docente

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {

    var lectures_map = {};
    var i = 0;
    var query_string = "";

    event.corsi.forEach(function (course) {
        lectures_map[":value_" + i] = course.id_corso;
        query_string += ":value_" + i + ", ";
        i += 1;
    });

    query_string = query_string.substring(0, query_string.length - 2);

    await retrieveLecturesOfTeacher(query_string, lectures_map).then(data => {
        event.lectures = data.Items;
        callback(null, event);
    });
};

function retrieveLecturesOfTeacher(query_string, attribute_values) {
    var filterExpression = 'id_corso IN ( ' + query_string + ' ) '
    console.log("FilterExpression: ")
    const params = {
        TableName: 'lezioni',
        FilterExpression: filterExpression,
        ExpressionAttributeValues: attribute_values
    }
    console.log(JSON.stringify(params))
    return ddb.scan(params).promise();
}