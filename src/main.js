import Vue from "vue";
import App from "./App.vue";
import zds from "@zoov/design-system";

import * as components from "@zoov/design-system/src/components";

Vue.use(zds, { components });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
