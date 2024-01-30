<template>
  <ion-page >
    <ion-header>
      <ion-toolbar>
        <ion-title>Mon Compte</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
          <img alt="photo de profile" src="../../public/img/user.png" class="photo"/>
      <ion-card-header>
        <ion-card-title>{{ user.lastname }} {{ user.firstname }}</ion-card-title>
        <ion-card-subtitle>Date de naissance : {{ formatFrenchDate(user.birthdate) }}</ion-card-subtitle>
      </ion-card-header>
      <div class="btnLine">
        <ion-button  color="danger" class="logout" @click="logout"><ion-icon :icon="logout"/></ion-button>
        <ion-button class="modifier_compte" @click="modifAcc()"><ion-icon :icon="create"/></ion-button>
      </div>
      
      
        </ion-card>
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>Mon Compte</ion-label>
        </ion-list-header>
        <ion-item v-for="d in data" :key="index">
          <ion-avatar slot="start">
            <ion-img :src="`../../public/img/personne.png`"></ion-img>
          </ion-avatar>
          <ion-label>
            <h2>{{ d.firstname }} {{ d.lastname }}</h2>
            
          </ion-label>
          <ion-button class="modifier-bouton" @click="formPAC(d)"><ion-icon :icon="create"></ion-icon></ion-button>
          <ion-button class="supprimer-bouton" @click="selectData(d)"><ion-icon :icon="delete"></ion-icon></ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <div class="ajouter-button-container">
        <ion-button class="ajouter-button" @click="formPAC({id:-99})"><ion-icon :icon="addcircle"></ion-icon></ion-button>
      </div>
    </ion-footer>
  </ion-page>
</template>


<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton , IonIcon, IonAlert, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import {create, createOutline, addCircle, closeCircleOutline, logOutOutline} from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'

export default defineComponent({
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonAlert, alertController },
  beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
        
    },
  data() {
    return {
      data: [],
      create: createOutline,
      addcircle:addCircle  ,
      delete: closeCircleOutline,
      logout: logOutOutline,
      toDelete:this.data,
      user: this.$store.getters.user,
      alertButtons: [ //Buttons of the validation modal
      {
        text: 'Annuler',
        handler: () => {
        }
      },
      {
        text: 'Valider',
        handler: () => {
          console.log(this.toDelete);
          // Call the API to delete the PAC
          this.supprimerPAC(this.toDelete); // Assuming you want to delete the currently selected PAC
        }
      }
    ],
    };
  },
  beforeUpdate() { //Refresh data before loading the page
    this.refreshData();
    this.refreshDataUser();
  },
  mounted(){
        this.refreshData();
        this.refreshDataUser();
  },
  methods: {
    async selectData(data){
      this.toDelete=data;
      
      const alert = await alertController.create({ //Validation modal
      header:'Supprimer cette personne à charge ?',
      buttons: this.alertButtons,
    });
      if (alert) {
        (await alert).present();
      }
    },
    async supprimerPAC(data) {
        // Si l'utilisateur confirme, procéder à la suppression
        const response = await fetch(`https://sae-repihandi-api.onrender.com/pac/${data.id}`, { //Fetch data by using pac's id
          method: 'DELETE',
          headers: {
                    'Content-Type': 'application/json'
                },
        });

        if (response.ok) {
          // Mettre à jour les données après la suppression
          this.refreshData();
        } else {
          // Gérer les erreurs si nécessaire
          console.error('Erreur lors de la suppression');
        }
    },

    formPAC(data) {
      this.$router.push({
        name: 'FormPAC', //use name for router push
        query: { data : JSON.stringify(data) }
      })
    },
    async refreshData(){ //Refresh data of PAC
      let response = await fetch('https://sae-repihandi-api.onrender.com/pac/user/'+ this.$store.getters.user.id); //Fetch data by using user id to get all of his PAC
      response = await response.json();
      this.data = response;
      console.log(this.data)
      this.user.birthdate = this.user.birthdate.replaceAll('-','/')
      this.user.birthdate = this.user.birthdate.substring(0, 10)
    },
    async refreshDataUser(){ //Refresh data of user instead of PAC in RefreshData function
      let response = await fetch('https://sae-repihandi-api.onrender.com/user/'+ this.$store.getters.user.mail); //Fetch data by using user's email
      response = await response.json();
      this.user = response;
    },
    async modifAcc() { //Send user on modifAcc page and refresh user data
      this.$router.push({
        name: 'ModifAcc',
      })
      this.refreshDataUser();
    },
    formatFrenchDate(dateString: string): string {
      // Create a Date object from the date string
      const date = new Date(dateString);

      // Formatting options for the date in French
      const options = { year: 'numeric', month: 'long', day: 'numeric' };

      // Format the date using Intl.DateTimeFormat
      return new Intl.DateTimeFormat('fr-FR', options).format(date);
    },

    logout(){ //Log out the user by clearing the store
      this.$store.commit('addUser',{})
      localStorage.setItem('store', JSON.stringify({}));
      console.log(this.$store.user)
      this.$router.push({
        name: 'Login',
      })
    }
  },
});
</script>

<style scoped>

.page {
  background-image: url('../../public/img/background.png');
  background-size: cover;
}

ion-content {
    --background: none;
}
ion-avatar {
  --border-radius: 50%;
}

ion-card-content{
  display: flex;
  justify-content: end;
}
ion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.7);
}

ion-label {
  flex: 1;
  margin-left: 10px;
}

.photo{
  width: 196px;
  height: 196px;
  border-radius: 50%;
  margin-left: 25%;
  margin-right: auto;  
}
.centre{
  margin-left: auto;
  margin-right: auto;
}
.ajouter-button-container {
  display: flex;
  justify-content: center;

}

ion-button {
  --background: #007bff;
  --color: #fff;
  background-color:none;
}

.ajouter-button {
  width: 200px;
  
}

ion-button[aria-label="Modifier"] {
  --background: #28a745;
  --color: #fff;
}

.modifier-bouton{
  margin-right: 5px;
}
.modifier_compte{
  display: inline-block;
  margin-left: auto;
  margin-right: 5px;
  
  width:50px;
}

.logout{
  display:inline-block;
  margin-left: 5px;
  margin-right: auto;
  width:50px;
}

.btnLine{
  display: grid;
  grid-template-columns: auto auto;
}

</style>
