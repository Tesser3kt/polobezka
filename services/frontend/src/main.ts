import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";
import vue3GoogleLogin from "vue3-google-login";

import App from "./App.vue";
import router from "./router";

import AnimatedNumber from "vue-3-animated-number";

import "./scss/styles.scss";

import { Modal } from "bootstrap";

const app = createApp(App);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000/";

app.use(createPinia());
app.use(router);
app.use(vue3GoogleLogin, {
  clientId: "YOUR_GOOGLE_CLIENT_ID",
});
app.use(AnimatedNumber);

app.mount("#app");
