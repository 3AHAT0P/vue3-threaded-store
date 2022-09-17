import { customRef } from '@vue/reactivity';

import StoreSharedWorker from './bridge.worker.js?sharedworker';

let _worker;
let _cache = {};

export const initWorker = () => {
  _worker = new StoreSharedWorker();

  _worker.port.onmessage = (e) => {
    const { op, key, value } = e.data;
    console.log('MESSAGE IN UI THREAD', e.data);
    if (op === 'SET') {
      console.log('@@@@@', _cache);
      if (key in _cache) {
        _cache[key].sync(value);
      } else {
        console.log('Do nothing!?');
      }
    }
  };

  _worker.port.start();
};

export const useWorkerRef = (key, value) => {
  if (key in _cache) return _cache[key];

  let refTrigger;
  const ref = customRef((track, trigger) => {
    refTrigger = trigger;
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        _worker.port.postMessage({ op: 'SET', key, value });
        trigger();
      },
    };
  });
  ref.sync = (newValue) => {
    value = newValue;
    refTrigger();
  };

  _cache[key] = ref;
  _worker.port.postMessage({ op: 'GET', key, value });

  return ref;
};

export const useWorkerAction = (key) => {
  return (...args) => {
    _worker.port.postMessage({ op: 'RUN_ACTION', key, args });
  };
};

export const useStore = (storeName) => {
  _worker.port.postMessage({ op: 'GET_STORE_META', key, args });
};
