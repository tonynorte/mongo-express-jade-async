#Mongo (REST)

##Introduction

This is a basic project where it's easy understand how connect and import a basic db in mongodb with node.js, it contain the basic operations (update, create, delete and read).

##Instructions

Using the command promt and introduce this command: "npm install" to install all dependencies in the package.json, then use this path once you have installed the mongodb use this command to import the data in "testData.json" (the paths depends where you have your project):

  mongoimport --db bands --collection favorites --drop --file C:\mongoData\testData.json

finally give "npm start" to start the app