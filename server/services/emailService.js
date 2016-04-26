var nodemailer = require('nodemailer');


module.exports = (function() {
    return {
        sendMail: function(toAddress, subject, message) {
            var mailOptions = {
                from: '"VRT funky videos" <vrtfunkyvideos@gmail.com>',
                to: toAddress,
                subject: subject,
                html: message
            };

            var emailpwd =  process.env.MAIL_PWD;
            var transporter = nodemailer.createTransport('smtps://vrtfunkyvideos%40gmail.com:'+emailpwd+'@smtp.gmail.com');

            console.log('sending email to', toAddress, 'with following subject: ', subject);

            if(!emailpwd){
                console.log('No email password found');
                return;
            }

            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    return console.log(err);
                }
            })
        }
    }
})();