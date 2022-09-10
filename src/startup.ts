// Establish error handling before creating the server
process.on('uncaughtException', (err: Error) => {
  console.log('Uncaught exception! Shutting down...');
  console.log(`${err.name}: ${err.message}`);
  process.exit(1);
});
