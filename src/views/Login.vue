<template>
    <ion-page class="main_page">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>RépiHandi</ion-title><!-- a faire -->
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">RépiHandi</ion-title><!-- a faire -->
                </ion-toolbar>
            </ion-header>

            <div id="container">
                <h1>Connexion</h1>
                <form @submit.prevent="login">
                    <ion-item>
                        <ion-label position="floating" class="label_perso">Adresse e-mail</ion-label>
                        <ion-input v-model="email" type="email" required></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating" class="label_perso">Mot de passe</ion-label>
                        <ion-input v-model="password" type="password" required></ion-input>
                    </ion-item>

                    <ion-button expand="full" type="submit">Continuer</ion-button>
                </form>

                <p class="ion-text-center">
                    <router-link to="/">Mot de passe oublié ?</router-link> | <!-- a faire -->
                    <router-link to="/register">Créer un compte</router-link>
                </p>
            </div>
        </ion-content>
    </ion-page>
</template>
  
<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonAlert, alertController } from '@ionic/vue';
import { ref } from 'vue';
import Base64 from 'crypto-js/enc-base64';
import SHA256 from "crypto-js/sha256";
import { useStore } from 'vuex'

export default {
    name:"Login",
    beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
    },
    data(){
        return{
            email: "",
            password: "",
            alertButtons: [{   text: 'Valider', handler: () => {}  }],//Buttons of the validation modal
        }
    },
    components:{
        IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonAlert, alertController
    },
    methods: {
        /**
         * Attempts to log in a user by sending a request to the server for authentication.
         * 
         */
        async login(){
            let newObj = {
                mail: this.email,
                password: Base64.stringify(SHA256(this.password))
            };
            let response = await fetch('https://sae-repihandi-api.onrender.com/user/check', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(newObj)
                                        })
            response = await response.json()
            console.log(response)

            if(response.length !== 0 && response.connect ){
				this.$store.commit('addUser', response.object)
                console.log(this.$store.getters.user.firstname," is logged")
				this.$router.replace({ path: '/home/home' })
			}
            else{
                console.log("login ou mot de passe incorrect");
                this.selectData();
            }
        },

        async selectData(){
            const alert = await alertController.create({ //Validation modal
            header:'Login ou mot de passe incorrect',
            buttons: this.alertButtons,
            });
            if (alert) {
                (await alert).present();
            }
        }
    },
}
</script>
  
<style scoped>
.main_page {
    background: url('../../public/img/background.png') no-repeat center center fixed;
    background-size: cover;
}


/* css de base à refaire en fonction du design de l'application */
ion-page {
    height: 100%;
}

ion-content {
    --background: none;
}

ion-toolbar {
    --background: #88B2E3;
}

ion-item {
    --background: #f8f8f8; /* Couleur de fond de l'item */
    --border-radius: 10px; /* Bordure de l'item */
    --border-color: #007bff; /* Couleur de la bordure de l'item */
    --padding-start: 10px; /* Espacement à gauche de l'item */
    --padding-end: 10px; /* Espacement à droite de l'item */
    --padding-top: 10px; /* Espacement en haut de l'item */
    --padding-bottom: 10px; /* Espacement en bas de l'item */
    margin-left: 10px; /* Espacement à gauche de l'item */
    margin-right: 10px; /* Espacement à droite de l'item */
    margin-top: 10px; /* Espacement en haut de l'item */
    margin-bottom: 10px; /* Espacement en bas de l'item */
}

ion-title {
    color: white; /* Couleur du texte du titre */
}


ion-button {
    --background: #007bff; /* Couleur de fond du bouton */
    color: white; /* Couleur du texte du bouton */
    margin-top: 10px; /* Espacement entre le bouton et les éléments précédents */
    --padding-start: 10px; /* Espacement à gauche du bouton */
    --padding-end: 10px; /* Espacement à droite du bouton */
    --padding-top: 10px; /* Espacement en haut du bouton */
    --padding-bottom: 10px; /* Espacement en bas du bouton */
    --border-radius: 100px; /* Bordure du bouton */
    --border-color : #007bff;
    margin-bottom: 10px; /* Espacement entre le bouton et les éléments suivants */
    margin-left: 10px; /* Espacement à gauche du bouton */
    margin-right: 10px; /* Espacement à droite du bouton */
    
}

ion-button:hover {
    --background: #0056b3; /* Couleur de fond du bouton au survol */
}

.label_perso {
    color: #007bff
}
h1 {
    color: white;
    text-align: center;
    margin-bottom: 20px;
}
ion-title {
    color: white;
    text-align: center;
    font-size: 25px;
}
.ion-text-center {
    text-align: center;
    color: white;
}
ion-input {
  --background: trasparent;
  color: black;
}

</style>

  