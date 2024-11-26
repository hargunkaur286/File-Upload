import { createApp } from "vue";
import App from "./App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './index.css';

const app = createApp(App);

app.use(Toast, {
    position: 'bottom-right',
    timeout: 3000, // Toast will disappear after 3 seconds
});

app.mount("#app");

