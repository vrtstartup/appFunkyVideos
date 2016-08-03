var winston = require('winston');
var fs = require('fs');
// check if directory exist
// if (!fs.existsSync('logs/')) {
//     fs.mkdirSync('logs/'); // create new directory
// }

// Set up logger
var customColors = {
  trace: 'white',
  debug: 'green',
  info: 'green',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red'
};

var logger = new(winston.Logger)({
  colors: customColors,
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    crit: 4,
    fatal: 5
  },
  transports: [
        new(winston.transports.Console)({
            name: 'consoleLogger',
            level: 'fatal',
            colorize: true,
            timestamp: true
        }),
        new(winston.transports.File)({
            name: 'fileLogger',
            level: 'fatal',
            filename: 'server/logs/winston.log',
            maxsize: 104857600 // 100 mb
        })
  ]
});

winston.addColors(customColors);

// Extend logger object to properly log 'Error' types
var origLog = logger.log;

logger.log = function (level, msg) {
  if (msg instanceof Error) {
    var args = Array.prototype.slice.call(arguments);
    args[1] = msg.stack;
    origLog.apply(logger, args);
  } else {
    origLog.apply(logger, arguments);
  }
};



module.exports = logger;



