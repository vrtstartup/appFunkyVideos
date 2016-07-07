var firebase = require("firebase");

module.exports = (function firebaseService() {
    return {
        initFirebase: function() {
            console.log('initiating firebase');
            //handle firebase login (with ENV variables)
            // var fb_project = process.env.FB_PROJECT;
            // var fb_clientEmail = process.env.FB_EMAIL;
            // var fb_key = process.env.FB_KEY;


            var fbCreds = {
                "type": "service_account",
                "project_id": "project-1407104807720831955",
                "private_key_id": "2fb5a6f02f63eb33789743a30e945f181558f5b6",
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDdDp7Lj8zQYxLj\nyK3V2g7+lNtqFlAqrfU+cZTqIdqUdrvdMMU/LHjNw9ip+wsY6ORzhVcudpPSMbkO\nAMS8lmLqiLMhc+0Bdw3NwJ/X7JoYrDHRWfIbguVVpKN/sQaI47JEyElFpu/RDisi\n8rwCMVGy3gTxJh5I56vcHAhEJ0H2HDCeTY8ht4QFzCul0/J61Z+SkUpmHPvTfMaz\nl9fsP385GgHZPw6JpF8cXpW7Pbf1q788QGZ79xqvb/bEd1R4b4/1v8mODjcaWHTl\nBbzzNDx2q85miDjcq/g6AA2cRcBLXGzXoqAVAV8bq36VRuRvGZSfYa/5z3Pod5gW\ng9ff0naNAgMBAAECggEBANC6j2Jy49gY1KtUwB/fiK0Gba/cZdIG9D0EDrKNSNFK\n09Tlyjn+igrw1FKcgzwAHEagL1PmD2o4HR6Fxz6zWa9PaKU7yxzJB7WyHrxJ4q9N\nWLTvE1a64EVf8ioOQ7daGOgtnlIwcN2bXUvgm3oOi7AzR8NUVOBOMM7jgUKpNvVk\no1Ql7ONHqTLd/mQK1vhLfFfMp0d/IuE43EhjayTERzuv74UI28/I/Q2n1arlIdCf\n9q570eku3Hb8nlg39FCJbV7eTJBjy6WonQ2kR3eKbSnIcLcgx9X91tSfdC47687P\nWTzsVjZfWdtXAcKUn0t9oPUBXsIu/LxoZ3C9x3JUS1kCgYEA9nPji8EEQG5sieLC\ne2r762zQkaGp8KHeCs1RQLdMxXyc215jzI5d0kx4SRoRdS2FDtuTnzq/deS78jdU\nwk5gEHCD7kd4pN0iKk41DfPfx98ICouB1oS5bs5L2tuS2chD9bu3YgryajEZb9df\nIkdiXnuknCLrAuvIhkJs4v8athMCgYEA5Z7hHmMBoa/qwlPa1lJnLuiyPPUbH+jz\nxjY38qxM3mOwglcLvSBUp0cBdw3+uiYs9qDzu6A7CZWBog5v2rtbppJVJuU/6Y4N\n7cOg/zzQI0KJc8iNNc+J1iqrqiUml8zgaxPrfn9kIngS7ydz5pewinrvV4VjWXvQ\nhXNDtXVmNN8CgYEAjCG48G3/jOM8s+pLywE53NMyhJv3lOt05Y948+NFs8T3K4Sw\nGk+Y6Uqx2l8ILiiDz77qYU92LgKxGzh66UDHPpG7cnERGCzkkEmHwTc5ttwKJnTM\njr1I8sg6OWdASLSmb8McspKm49qnLAC6BzOvqymCn4T7O931VuHOKAQFnCECgYAk\nI/SUvsqD81dEzMP11bRt2qwrEfz58cVkniYCKQJUQmaGrUKousz4IyHk5iwAin+r\nNbwG/Pot0P09T35lc/XB6uhCHfUIQpaIpLDTW3P7CL7vnVI0dPzh24d3WS+Q1us/\njzwSheRx1GpOf+wrEBb2RNEk+lafv/AbAQBYMCktCwKBgHoNDCBteFVrNycbK6rI\nuoyAdzXpbISBUz0VRiSD1qCH2N4lGXr24bRF+3dR+ecj/FON+e4Hb9StDoqnTKYa\n07ngV3w9tcQUBWye5DliHJRnqYDaAWwbLpC1Y1Vw8ouBIfZihHCN+pLoI4kEar46\n+NkpWpGSHnvNUS6eYagYzFE3\n-----END PRIVATE KEY-----\n",
                "client_email": "node-server@project-1407104807720831955.iam.gserviceaccount.com",
                "client_id": "118216425657548492084",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://accounts.google.com/o/oauth2/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/node-server%40project-1407104807720831955.iam.gserviceaccount.com"
            }

            // if (!fb_project || !fb_clientEmail || !fb_key) {
            //     console.log('COULDN\'T FIND FIREBASE PROJECT / EMAIL / KEY');
            //     return;
            // }
            var fb_url = 'https://vrtnieuwshub.firebaseio.com';

            // firebase.initializeApp({
            //     serviceAccount: {
            //         projectId: fb_project,
            //         clientEmail: fb_clientEmail,
            //         privateKey: fb_key
            //     },
            //     // databaseAuthVariableOverride: {
            //     //     uid: "node-server"
            //     // },
            //     databaseURL: fb_url
            // });

            firebase.initializeApp({
                serviceAccount: {
                    projectId: fbCreds.project_id,
                    clientEmail: fbCreds.client_email,
                    privateKey: fbCreds.private_key
                },
                // databaseAuthVariableOverride: {
                //     uid: "node-server"
                // },
                databaseURL: fb_url
            });


            // return firebase;
        },

        getRef: function() {
            var db = firebase.database().ref('users/1/email');

            console.log('seriously service');

            db.on("value", function(snapshot) {

                console.log('give me something', snapshot.val());
            }, function(errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
            return db;
        }
    };
})();
