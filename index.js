function graceful() {
  graceful.start();
  graceful.exist();
}

function log(message) {
  process.stdout.write(`[${process.pid}]: ${message}\n`);
}

function signalHandler(signal) {
  log(`Received signal: ${signal}.`);
  process.exit(128);
}

graceful.start = function() {
  log('start.');
};

graceful.exist = function() {
  process.on('exit', function(existCode) {
    log(`Exit with code ${existCode}.`);
  });

  process.on('SIGINT', signalHandler);

  // for windows signal
  // when type <Ctrl>+<Break>
  process.on('SIGBREAK', signalHandler);
  // when close the terminal
  process.on('SIGHUP', signalHandler);
};

module.exports = graceful;
module.exports.default = graceful;
