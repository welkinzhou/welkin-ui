import { createApp } from "vue";

import router from "./router";
import App from "./App.vue";
import "./style/index.scss";
import "./style/markdown-style.scss";

const app = createApp(App);

app.use(router);

app.mount("#app");
