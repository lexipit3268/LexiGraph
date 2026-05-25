export {};

declare global {
  interface Window {
    electronAPI?: {
      controlWindow: (action: 'minimize' | 'maximize' | 'unmaximize' | 'close') => void;
      onStatusChange: (callback: (isMaximized: boolean) => void) => void;
      getInitialStatus: () => Promise<boolean>;
      saveGraph?: (
        content: string
      ) => Promise<{ success: boolean; path?: string; error?: string; canceled?: boolean }>;
      loadGraph?: () => Promise<{
        success: boolean;
        data?: string;
        error?: string;
        canceled?: boolean;
      }>;
    };

    ipcRenderer?: {
      on: (channel: string, listener: (...args: any[]) => void) => void;
      off: (channel: string, ...omit: any[]) => void;
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}
