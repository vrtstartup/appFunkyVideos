'use strict';

const fs = require('fs');
// var logger = require('../middleware/logger');

module.exports = {
    init: function() {
        // Create the projects directory
        const tree = {
            root: process.env.PROJECT_DIR,
            source: process.env.PROJECT_DIR + '/source',
            hi: process.env.PROJECT_DIR + '/high-res',
            lo: process.env.PROJECT_DIR + '/low-res'
        }

        let tasks = [];

        return new Promise((resolve, reject) => {
            // iterat over path tree
            for (var key in tree) {
                if (tree.hasOwnProperty(key)) {
                    const path = tree[key];
                    tasks.push(this.createDir(path));
                }
            }

            Promise.all(tasks).then(values => {
                resolve(values);
            }, err => {
                reject(err);
            });
        });
    },

    createDir(path) {
        return new Promise(
            function(resolve, reject) {
                if (!fs.existsSync(path)) {
                    fs.mkdir(path, 0o755, function(err, data) {
                        if (err) {
                            // logger.warn("Could't create folder ", path);
                            reject(err);
                        } else {
                            // logger.info("Created folder ", path);
                            resolve(data);
                        }
                    });
                }
            }
        )
    }
}