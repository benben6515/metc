import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify } from 'quasar';
import router from './router';
import App from './App.vue';
import { useAuthStore } from './stores/auth';

// Import Quasar styles
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Quasar, {
  plugins: {
    Notify
  }
});

// Initialize auth store after pinia is installed
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');
