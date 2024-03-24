import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";
import vue3GoogleLogin from "vue3-google-login";
import VueCookies from "vue-cookies";

import App from "./App.vue";
import router from "./router";

import AnimatedNumber from "vue-3-animated-number";

import "./scss/styles.scss";

import { Modal, Collapse } from "bootstrap";

const app = createApp(App);

axios.defaults.withCredentials = false;
axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE, OPTIONS";

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});
app.use(VueCookies, { expires: "3d" });
app.use(AnimatedNumber);

app.mount("#app");
