import { createServer } from 'http';
import { getAppSettings } from './app-settings';
import { routeRequest } from './routes';

async function start() {
  const settings = await getAppSettings();
  createServer((req, res) => routeRequest(settings, req, res))
    .listen(process.env.PORT)
    .on('listening', () => {
      console.log('Started.');
    });
}

start();
