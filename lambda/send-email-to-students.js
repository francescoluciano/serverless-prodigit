var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });

exports.handler = async function (event) {
    var content;
    var subject;
    var formatted_lecture_start = (new Date(event.email_data.lecture_start));
    var formatted_lecture_end = (new Date(event.email_data.lecture_end));
    if (event.email_data.purpose == "edit_lecture") {
        content = "Si avvisano gli studenti che la lezione di " + event.email_data.exam_name + " tenuta dal prof " + event.email_data.professor + " è stata modificata e terrà luogo nell'edificio " + event.email_data.building + ", nell'aula " + event.email_data.class + " il " + formatted_lecture_start + " e terminerà il " + formatted_lecture_end;
        subject = "[Sapienza] Avviso modifica lezione";
    } else if (event.email_data.purpose == "delete_lecture") {
        content = "Si avvisano gli studenti che la lezione di " + event.email_data.exam_name + " tenuta dal prof " + event.email_data.professor + " in data " + formatted_lecture_start + ", è stata cancellata."
        subject = "[Sapienza] Avviso cancellazione lezione";
    }

    var params = {
        Destination: {
            ToAddresses: event.studenti,
        },
        Message: {
            Body: {
                Text: { Data: content },
            },
            Subject: { Data: subject },
        },

        Source: "comunicazionilezione.sapienza@uniroma1.it",
    };

    return ses.sendEmail(params).promise();
};