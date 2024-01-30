<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import BottomBar from './components/BottomBar.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: { IonApp, IonRouterOutlet},
});
</script>
  <style scoped>
  ion-app {
    /* Utilisation de la variable pour le fond */
    background-image: var(--background-image);
    /* Ajustez d'autres propriétés au besoin */
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  
    min-height: 100vh;
  }
  </style>