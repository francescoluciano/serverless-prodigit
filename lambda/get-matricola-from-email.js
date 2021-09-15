//Lambda che recupera la matricola data l'email

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event, context, callback) => {
    console.log("Event: " + event)
    var email = event.email;
    console.log("Email: " + email)
    const regex_institutional_sapienza_email = /^(([a-z]+.)+)[0-9]{7}@studenti.uniroma1.it$/

    if (email.match(regex_institutional_sapienza_email)) {
        // Institutional Sapienza email address
        var matricola = email.substring(email.length - 28, email.length - 21);
    } else {
        var student = await getStudentByEmail(email);
        console.log("Student: " + student.Items[0])
        var matricola = student.Items[0].matricola;
    }

    event.matricola = matricola;
    console.log("Matricola: " + matricola)
    callback(null, event)
};

function getStudentByEmail(email) {
    const params = {
        TableName: 'studenti',
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email,
        }
    }
    return ddb.scan(params).promise();
}


