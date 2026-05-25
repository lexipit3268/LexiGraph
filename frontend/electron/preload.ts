import { ipcRenderer, contextBridge } from 'electron';

const api = {
  controlWindow: (action: string) => ipcRenderer.send('window-control', action),
  onStatusChange: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on('window-status-changed', (_event, isMaximized) => callback(isMaximized));
  },
  getInitialStatus: () => ipcRenderer.invoke('get-window-status')
};

const ipcRendererApi = {
  on: (channel: string, listener: (...args: any[]) => void) =>
    ipcRenderer.on(channel, (event, ...args) => listener(event, ...args)),
  off: (channel: string, listener?: (...args: any[]) => void) =>
    ipcRenderer.off(channel, listener as any),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', api);
  contextBridge.exposeInMainWorld('ipcRenderer', ipcRendererApi);
} else {
  // @ts-ignore
  window.electronAPI = api;
  // @ts-ignore
  window.ipcRenderer = ipcRendererApi;
}
