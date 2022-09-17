import { sendToPort } from './send.worker.js';
import { ref } from './ref.worker.js';

import {
  count,
  incrementAction,
  incrementLaterAction,
} from '../modules/counter.js';

const cache = {
  'counter::count': count,
};

const registeredRefs = {
  'counter::count': count,
};

const registeredActions = {
  incrementAction,
  incrementLaterAction,
};

globalThis.portList = new Set();

globalThis.onconnect = ({ ports }) => {
  const [port] = ports;

  globalThis.portList.add(port);

  port.addEventListener('message', (e) => {
    const { op, key, value, args } = e.data;
    console.log('MESSAGE IN WORKER', e.data);

    if (op === 'GET') {
      if (!(key in cache)) cache[key] = ref(key, value);

      sendToPort(port, { op: 'SET', key, value: cache[key].value });
    } else if (op === 'SET') {
      if (!(key in cache)) cache[key] = ref(key, value);
      else cache[key].sync(value, port);
    } else if (op === 'RUN_ACTION') {
      if (key in registeredActions) registeredActions[key](...args);
    }
  });

  port.start();
};
