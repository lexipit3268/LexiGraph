import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './routers';

if (import.meta.env.DEV) {
  const script = document.createElement('script');
  // script.src = 'http://localhost:8098';
  document.head.appendChild(script);
}

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
});
