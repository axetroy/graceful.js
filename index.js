function graceful() {
  graceful().start();
  graceful().exist();
}

function log(message) {
  process.stdout.write(`[${process.pid}]: ${message}\n`);
}

graceful.start = function() {
  log('start.');
};

graceful.exist = function() {
  process.on('exit', function(existCode) {
    log(`Exit with code ${existCode}.`);
  });

  process.on('SIGINT', s => {
    log(`Received SIGINT ${s}.`);
    process.exit(128);
  });

  // windows-graceful-stop
  process.on('message', function(msg) {
    if (msg === 'shutdown') {
      log(`Received message ${msg}.`);
      process.exit(129);
    }
  });
};

module.export = graceful;
module.export.default = graceful;
