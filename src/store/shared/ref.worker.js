import { sendToPorts, sendToPortsExceptCurrent } from './send.worker.js';

export const ref = (key, initialValue) => {
  let _value = initialValue;
  return {
    get value() {
      return _value;
    },
    set value(newValue) {
      _value = newValue;
      sendToPorts(globalThis.portList, { op: 'SET', key, value: _value });
    },
    sync(newValue, currentPort) {
      _value = newValue;
      sendToPortsExceptCurrent(globalThis.portList, currentPort, {
        op: 'SET',
        key,
        value: _value,
      });
    },
  };
};
