const kill = require('tree-kill');

function graceful(silence) {
  graceful.start(silence);
  graceful.exist(silence);
  graceful.uncaughtException(silence);
  graceful.unhandledRejection(silence);
}

function log(message) {
  process.stdout.write(`[${process.pid}]: ${message}\n`);
}

function signalHandler(signal) {
  log(`Received signal: ${signal}.`);
  process.exit(128);
}

graceful.start = function(silence) {
  !silence && log('start.');
};

graceful.exist = function(silence) {
  process.on('exit', function(existCode) {
    !silence && log(`Exit with code ${existCode}.`);
    kill(process.pid);
  });

  process.on('SIGINT', signalHandler);

  // for windows signal
  // when type <Ctrl>+<Break>
  process.on('SIGBREAK', signalHandler);
  // when close the terminal
  process.on('SIGHUP', signalHandler);
};

graceful.uncaughtException = function(silence) {
  process.on('uncaughtException', function(err) {
    !silence && console.error('Error caught in uncaughtException event:', err);
  });
};

graceful.unhandledRejection = function(silence) {
  process.on('unhandledRejection', function(reason, p) {
    !silence && console.error('Unhandled Rejection at:', p, 'reason:', reason);
  });
};

module.exports = graceful;
module.exports.default = graceful;
