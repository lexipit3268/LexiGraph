import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './routers';
import { handleError } from './utils/errorHandler.ts';

if (import.meta.env.DEV) {
  const script = document.createElement('script');
  // script.src = 'http://localhost:8098';
  document.head.appendChild(script);
}

const app = createApp(App);
const pinia = createPinia();
app.config.errorHandler = err => {
  const errorString = err instanceof Error ? err.toString() : String(err);
  const errorStack = err instanceof Error ? err.stack || '' : '';
  if (
    errorStack.includes('getLineNum') ||
    (errorString.includes('Invalid array length') && errorStack.includes('Proxy.qxe'))
  ) {
    return;
  }
  console.error('Lỗi VueJS', err);
  handleError(err);
};
app.use(router);
app.use(ElementPlus);
app.use(pinia);
window.addEventListener('unhandledrejection', event => {
  handleError(event.reason);
});
app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
});
