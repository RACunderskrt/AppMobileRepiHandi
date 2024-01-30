<template>
  <ion-page class="main_page">
    <ion-header>
      <ion-toolbar>
        <ion-title>RépiHandi</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Modifier son compte</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <h1>Modifier son compte</h1>
        <form @submit.prevent="register">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position="floating" class="label_perso">Prénom</ion-label>
                  <ion-input v-model="firstName" required></ion-input>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-item>
                  <ion-label position="floating" class="label_perso">Nom</ion-label>
                  <ion-input v-model="lastName" required></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>


          <ion-item>
            <ion-label position="floating" class="label_perso">Adresse e-mail</ion-label>
            <ion-input v-model="email" type="email" required @ionInput="validateEmail"></ion-input>
          </ion-item>
          <ion-text slot="end" color="danger" v-show="!emailIsValid" class="error-message" >
            Adresse e-mail invalide
          </ion-text>



          <ion-item>
            <ion-label position="stacked" class="label_perso">Date de naissance</ion-label>
            <ion-input v-model="birthdate" type="date" required @ionInput="ageCalulator"></ion-input>
          </ion-item>

          <ion-text slot="end" color="danger" v-show="!birthdateIsValid" class="error-message">
            Date invalide
          </ion-text>
          <ion-text slot="end" color="danger" v-show="!ageIsValid" class="error-message">
            Vous devez avoir plus de 16 ans
          </ion-text>

          <ion-item>
            <ion-label position="floating" class="label_perso">Téléphone</ion-label>
            <ion-input v-model="phone" type="tel"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating" class="label_perso">Adresse</ion-label>
            <ion-input v-model="address"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating" class="label_perso">Code postal</ion-label>
            <ion-input v-model="postalCode" type="number"></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-button expand="full" type="submit" >Valider</ion-button>
            <ion-button expand="full" @click="cancel">Annuler</ion-button>
          </ion-item>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar, IonItem, IonInput, IonButton, IonToggle } from '@ionic/vue';
import { ref } from 'vue';
import Base64 from 'crypto-js/enc-base64';
import SHA256 from "crypto-js/sha256";
import { useStore } from 'vuex'

export default {
    name:"Login",
    mounted() {
        this.loadData();
    },
    beforeCreate() {
        // Get our store
        const store = useStore()
        // use store.commit to run any mutation. Below we are running the loadStore mutation
        store.commit('loadStore');
    },
    data(){
        return{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          birthdate: '',
          phone: '',
          address: '',
          postalCode:'',
          hasChildren: false,
          secondPassword: '',

          emailIsValid: true,
          birthdateIsValid: true,
          ageIsValid: true,
          passwordIsValid: true,
          samePassword: true,

          accData: [],
        }
    },
    components:{
      IonContent, IonHeader, IonPage, IonToolbar, IonItem, IonInput, IonButton, IonToggle
    },
    methods: {
      sendPostRequest(url, obj){
        const handleFormData = async () => {
          const sent = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
          })

          try {
            const response = await sent.json()
            console.log(response)
          } catch (error) {
            console.log(error)
          }
        };
        handleFormData()
      },

      validatePassword(){ //Check if the password is correct
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:/%@$!%*?&])[A-Za-z\d.,:/%@$!%*?&]{8,}$/;
        if (this.password) {
          this.passwordIsValid = this.password.match(passwordPattern) !== null;
        } else {
          this.passwordIsValid = false;
        }
      },

      validateEmail(){//Check if the email is correct
        const emailPattern = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (this.email) {
          this.emailIsValid = this.email.match(emailPattern) !== null;
        } else {
          this.emailIsValid = false;
        }
      },

      comparePassword(){//Compare if password and verification password are the same
        if (this.password !== this.secondPassword) {
          this.samePassword = false;
        } else {
          this.samePassword = true;
        }
      },

      ageCalulator(){//Calculate the age with birthdate and check the validation of the age
        const today = new Date();
        const birthDate = new Date(this.birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 0) {
          this.birthdateIsValid = false;
          this.ageIsValid = true;
        } else {
          this.birthdateIsValid = true;
          if (age < 16) {
            this.ageIsValid = false;
          } else {
            this.ageIsValid = true;
          }
        }
      },

      register(){//Register user's data in the store
        if (this.emailIsValid && this.birthdateIsValid && this.ageIsValid) {
          let newObj = {
            id: this.$store.getters.user.id,
            lastname: this.lastName,
            firstname: this.firstName,
            mail: this.email,
            password: this.accData.password,
            birthdate: this.birthdate,
            phone: this.phone,
            address: this.address,
            postalcode: this.postalCode,
          };
          this.sendPostRequest('https://sae-repihandi-api.onrender.com/user', newObj)
          //ajouter l'user à la session
          if(this.email != this.$store.getters.user.mail){//If user changed his email, send him to login page
            this.$router.replace({ path: '/login' })//User have to log in again because we fetch data with user's email
          }
          else
            this.$router.replace({ path: '/home/profile' })//If not, the user stay in profile page
        } else {
          console.log("erreur");
        }
      },

      async loadData(){ //pre-write user's data
        let response = await fetch('https://sae-repihandi-api.onrender.com/user/'+ this.$store.getters.user.mail)
        response = await response.json()
        this.accData=response
        console.log(response)
        console.log(this.accData)
        this.firstName = this.accData.firstname;
        this.lastName = this.accData.lastname;
        this.email = this.accData.mail;
        this.birthdate = this.accData.birthdate;
        this.phone = this.accData.phone;
        this.address = this.accData.address;
        this.postalCode = this.accData.postalcode;
        this.hasChildren = this.accData.hasChildren;
  
      },

      cancel(){
          this.$router.back();
      },
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

.error-message {
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 10px;
}

ion-input {
  --background: trasparent;
  color: black;
}

</style>
