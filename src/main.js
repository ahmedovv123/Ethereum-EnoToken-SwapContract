import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css'
import * as serviceWorker from './serviceWorker'

createApp(App).use(store).mount("#app");

serviceWorker.unregister()
