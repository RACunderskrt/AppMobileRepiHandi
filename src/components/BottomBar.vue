<!--  Created by DOUHANE Nadim, HUMBERT Thomas, BORRAT Joan, LARGUIER Tom-->
<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Activities" href="/home/activities">
          <ion-icon :icon="checkbox" />
        </ion-tab-button>

        <ion-tab-button tab="calendar" href="/home/home">
          <ion-icon :icon="calendarNumber" />
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/home/profile">
          <ion-icon :icon="person" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
// Import Ionic components and icons
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon } from '@ionic/vue';
import { library, checkbox, calendarNumber, person } from 'ionicons/icons';

// Export default Vue component
export default {
  components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon },
  data() {
    return {
      // Icon definitions for tabs
      checkbox,
      calendarNumber,
      person
    };
  },
};
</script>

<style scoped>
/* Styling for selected tab button */
ion-tab-button {
  --color-selected: #3880ff;
}

/* Styling for tab bar background */
ion-tab-bar {
  --background: #ffffff;
}
</style>
