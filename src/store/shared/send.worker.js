export const sendToPort = (port, message) => {
  port.postMessage(message);
};

export const sendToPorts = (portList, message) => {
  console.log('sendToPorts', portList);
  for (const port of portList) {
    port.postMessage(message);
  }
};

export const sendToPortsExceptCurrent = (portList, currentPort, message) => {
  for (const port of portList) {
    if (currentPort == null || port !== currentPort) port.postMessage(message);
  }
};
