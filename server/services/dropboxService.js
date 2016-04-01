var Dropbox = require('dropbox');

module.exports = (function dropboxService() {
    return {
        getDropboxClient: function() {
            //handle dropbox login (with ENV variables)
            var db_key = process.env.DB_KEY;
            var db_secret = process.env.DB_SECRET;
            var db_token = process.env.DB_TOKEN;

            if(!db_key || !db_secret || !db_token) {
                console.log('COULDN\'T FIND DROPBOX KEY / SECRET / TOKEN FOUND');
                return;
            }

            var client = new Dropbox.Client({
                key: db_key,
                secret: db_secret,
                token: db_token,
                sandbox: false
            });

            return client;
        }
    };
})();