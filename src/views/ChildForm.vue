<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Formulaire de l'enfant</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Formulaire de l'enfant</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <div id="container">
          <form @submit.prevent="submitChildForm">
            <ion-item>
              <ion-label position="floating">Nom</ion-label>
              <ion-input v-model="childName" required></ion-input>
            </ion-item>
  
            <ion-item>
              <ion-label position="floating">Prénom</ion-label>
              <ion-input v-model="childFirstName" required></ion-input>
            </ion-item>
  
            <ion-item>
              <ion-label position="floating">Date de naissance</ion-label>
              <ion-input v-model="childBirthdate" type="date" required @ionInput="ageCalulator"></ion-input>
              <ion-text slot="end" color="danger" v-show="!birthdateIsValid">
              Date invalide
            </ion-text>
            </ion-item>
  
            <ion-item>
              <ion-label position="floating">Description</ion-label>
              <ion-textarea v-model="childDescription"></ion-textarea>
            </ion-item>
  
            <ion-item>
              <ion-label>Propreté</ion-label>
              <ion-toggle v-model="childCleanliness"></ion-toggle>
            </ion-item>
  
            <ion-item>
              <ion-label>Mobilité</ion-label>
              <ion-toggle v-model="childMobility"></ion-toggle>
            </ion-item>
  
            <ion-item>
              <ion-label>Communication</ion-label>
              <ion-toggle v-model="childCommunication"></ion-toggle>
            </ion-item>
  
            <ion-item>
              <ion-label>Vision</ion-label>
              <ion-toggle v-model="childVision"></ion-toggle>
            </ion-item>
  
            <ion-button expand="full" type="submit">Soumettre</ion-button>
          </form>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToggle, IonInput, IonButton } from '@ionic/vue';
  import { ref } from 'vue';
  
  const childName = ref('');
  const childFirstName = ref('');
  const childBirthdate = ref('');
  const childDescription = ref('');
  const childCleanliness = ref(false);
  const childMobility = ref(false);
  const childCommunication = ref(false);
  const childVision = ref(false);

  const birthdateIsValid = ref(true);
  
  const submitChildForm = () => {
    if(birthdateIsValid.value) {
      console.log("main page");
    }else {
      console.log("erreur");
    }
  };

  const ageCalulator = () => {
  const today = new Date();
  const birthDate = new Date(childBirthdate.value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 0) {
    birthdateIsValid.value = false;
  } else {
    birthdateIsValid.value = true;
  }
}
  </script>
  
  <style scoped>
  #container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  
  #container strong {
    font-size: 20px;
    line-height: 26px;
  }
  
  #container p {
    font-size: 16px;
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
  }
  
  #container a {
    text-decoration: none;
  }
  </style>
  