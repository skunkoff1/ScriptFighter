// Express pour le serveur Web
const { checkPrime } = require("crypto");
const express = require("express");
// fs pour la manipulation du filesysteme (ici lecture du fichier texte)
const fs = require("fs");
const cors = require('cors');


// Création de mon serveur express
const app = express();

// Je lis mon fichier texte contenant tous les mots français, j'utilise readFileSync avec "latin1" en paramètre car il permet la lecture des accents
const file = fs.readFileSync("./wordlist.txt", "latin1");

// Je split mon tableau avec le caractère de fin de ligne (ici \r\n pour windows, \n pour linux)
const words = file.split("\r\n");
app.use(cors());

// Je créer ma route get /exist
app.get("/exist", (req, res) => {
    //J'envoie 200 quoi qu'il arrive, je pourrais ajouter un check savoir si req.query.word est défini pour afficher un message d'erreur pertinent
    res.status(200).json({        
        exist: words.includes(req.query.word) // Ici, je regarde si req.query.word est inclu dans le tableau contenant la liste de tous les mots, si il est inclu, .includes me retourne true, sinon, il retourne false
    });
});

// J'écoute sur le port 3000 pour mon serveur web
app.listen(3000, () => console.log('Server started: 3000'));

