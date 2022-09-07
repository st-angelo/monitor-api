// organize-imports-ignore
/* These two scripts need to be imported before app, to load the environment configs
and establish some error handling */
import './utils/config.js';
import './startup.js';
import app from './app.js';

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection! Shutting down...');
  console.log(`${err.name}: ${err.message}`);
  server.close(() => process.exit(1));
});
