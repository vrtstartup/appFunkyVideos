var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://vrtfunkyvideos%40gmail.com:js**36hdf_ksd232YY_++sndbGGk5527^@smtp.gmail.com');

module.exports = (function() {
    return {
        sendMail: function(toAddress, subject, message) {
            var mailOptions = {
                from: '"VRT funky videos" <vrtfunkyvideos@gmail.com>',
                to: toAddress,
                subject: subject,
                html: message
            }

            console.log('sending email to', toAddress, 'with following subject:', subject);

            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    return console.log(error);
                }
            })
        }
    }
})();