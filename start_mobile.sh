#!/bin/bash

# Exécute la commande "ionic build"
ionic build

# Exécute la commande "npx cap add android"
npx cap add android

# Exécute la commande "npx cap copy"
npx cap copy

# Exécute la commande "npx cap open android"
npx cap open android
