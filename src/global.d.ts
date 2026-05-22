export {};

declare global {
  interface Window {
    electronAPI?: {
      controlWindow: (
        action: "minimize" | "maximize" | "unmaximize" | "close",
      ) => void;
      saveGraph?: (content: string) => Promise<{
        success: boolean;
        path?: string;
        error?: string;
        canceled?: boolean;
      }>;
      loadGraph?: () => Promise<{
        success: boolean;
        data?: string;
        error?: string;
        canceled?: boolean;
      }>;
    };
  }
}
