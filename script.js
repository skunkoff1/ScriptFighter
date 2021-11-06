/*==================================================*/
/* ============== VARIABLES ========================*/
/*==================================================*/

// Flag joueur en cours
let player = 1;

// variables mots joueur
let wordP1Upper;
let wordP2Upper;
let arrayP1 = [];
let arrayP2 = [];
let underscoreP1 = [];
let underscoreP2 = [];
let wordToDisplayP1;
let wordToDisplayP2;
let triesP1 = [];
let triesP2 = [];

// HP joueur
let p2Hp = 10;
let p1Hp = 10;

// Flag on fire
let fireP1 = 0;
let fireP2 = 0;

// Gestion du tour, permet de déterminer le joueur en cours
let turn = 1;

// Gestion guess
let answer;
let verify;
let check = false;

// Gestion cours du jeu
let endingString;
let winnerName;
let inGame = false;
let attack = 0;

// variables son
let punchSound = new Audio('Son/punch.mp3');
let music = new Audio('Son/script_Fighter.mp3');

/*====================== VARIABLES AFFICHAGE MESSAGE JEU ======================*/

// Input menu début de jeu
let p1checked = document.getElementById('p1checked');
let p2checked = document.getElementById('p2checked');
let placeHolderName1 = document.getElementById('player1name');
let placeHolderName2 = document.getElementById('player2name');

// Message erreur menu choix mots joueurs
let err1 = document.getElementById('errAPI1');
let err2 = document.getElementById('errAPI2');
let err3 = document.getElementById('errAPI3');

// gestion message changement de tour
let turnMsg = document.getElementById('turnMsg');
let pTurnName = document.getElementById('pTurnName');

// affichage nom joueur
let slotNameP1 = document.getElementById('nameP1');
let slotNameP2 = document.getElementById('nameP2');

// stockage mot joueur
let wordP1 = document.getElementById('player1word');
let wordP2 = document.getElementById('player2word');

// affichage mot joueur
let blink = document.getElementById('underscoreArrays');
let p1w = document.getElementById('p1Word');
let p2w = document.getElementById('p2Word');

// message de jeu
let message = document.getElementById('message');
let good = document.getElementById('good');
let absentLetter = document.getElementById('absentLetter');
let callLetter = document.getElementById('callLetter');

// Barres de vie joueur
let healthP1 = document.getElementById('bar1');
let slotP1 = document.getElementById('slot1');
let healthP2 = document.getElementById('bar2');
let slotP2 = document.getElementById('slot2');

// guess box
let answerbox = document.getElementById('answerForm');
let guessButton = document.getElementById('answerSubmit');

/*========================= VARIABLES CONTENEUR JEU ==========================*/

let c = document.getElementById('container');
let m = document.getElementById('menu');
let b = document.getElementById('body');
let sceneBaston = document.getElementById('baston');

/*==================== VARIABLES AFFICHAGE ENDING SCREEN  =====================*/

let endingScreen = document.getElementById('endingScreen');
let endingTitle = document.getElementById('endingTitle');
let endingText = document.getElementById('endingText');

/*========================== VARIABLES ANIMATIONS =============================*/

let perso1 = document.getElementById('perso1');
let perso2 = document.getElementById('perso2');
let auraP1 = document.getElementById('aura1');
let auraP2 = document.getElementById('aura2');
let roundP1 = document.getElementById('roundP1');
let roundP2 = document.getElementById('roundP2');

// animation changement de tour
let anim = document.getElementById('animation-container');
let animPlayer = document.getElementById('turnPlayer');

// animation start fight
let fightdiv = document.getElementById('fightmsg');
let fightimg = document.getElementById('fightimg');

/*==============================================================================*/
/*=============================== FONCTIONS ====================================*/
/*==============================================================================*/



/*=========================== FONCTION VERIFICATION DEBUT JEU ===================*/

// Vérification du mot dans l'API
async function validateAPI(word) {
    const res = await fetch("http://cemotexistetil.lyliya.fr:8888/exist?word=" + word); //Notre api=> http://localhost:3000/exist?word=   http://cemotexistetil.lyliya.fr:8888/exist?word=
    const forms = await res.json();
    return forms.exist;
}

async function checkStart() {

    // Reset des messages d'erreur de vérification des mots joueurs
    err1.style.display = "none";
    err2.style.display = "none";
    err3.style.display = "none";

    // Reset des bordures d'erreurs des inputs
    document.getElementById('player1word').className = "";
    document.getElementById('player2word').className = "";

    if ((p1checked.checked) && (p2checked.checked)) {

        // Mise en majuscules des mots joueurs
        wordP1Upper = replace(wordP1.value);
        wordP2Upper = replace(wordP2.value);

        // Appel de l'API qui vérifie si le mot joueur existe
        const validateP1 = await validateAPI(wordP1Upper);
        const validateP2 = await validateAPI(wordP2Upper);

        // si les mots ne sont pas valides
        if (validateP1 == false && validateP2 == false) {
            // Remise a zéro input choix mot joueur
            wordP1.value = "";
            wordP2.value = "";

            // Appel de la bordure d'erreur input
            wordP1.className = "formError";
            wordP2.className = "formError";

            // On décoche les checkbox "ready"
            document.getElementById('p1checked').checked = false;
            document.getElementById('p2checked').checked = false;

            // Affichage message d'erreur
            err3.style.display = "block";
        }
        else if (validateP1 == false) {
            // Remise a zéro input choix mot joueur
            wordP1.value = "";

            // Appel de la bordure d'erreur input
            wordP1.className = "formError";

            // On décoche la checkbox "ready"
            document.getElementById('p1checked').checked = false;

            // Affichage message d'erreur
            err1.style.display = "block";
        }
        else if (validateP2 == false) {
            // Remise a zéro input choix mot joueur
            wordP2.value = "";

            // Appel de la bordure d'erreur input
            wordP2.className = "formError";

            // On décoche la checkbox "ready"
            document.getElementById('p2checked').checked = false;

            // Affichage message d'erreur
            err2.style.display = "block";
        }
        // si tout ok, lancement du jeu
        else {
            launchGame();
        }
    }
}

/*=============================== FONCTION FORMATAGE DES MOTS ======================*/

function replace(word) {

    let regex = /é|è|ê|ë/gi;
    word = word.replace(regex, "e");

    regex = /à|ä|â/gi;
    word = word.replace(regex, "a");

    regex = /ù|û|ü/gi;
    word = word.replace(regex, "u");

    regex = /ï|î/gi;
    word = word.replace(regex, "i");

    word = word.toUpperCase();
    return word;
}

//créé l'équivalent du mot en cachant les lettres avec des underscores
function createUnderscore(arrayP1, arrayP2) {
    for (elmt in arrayP1) {
        underscoreP1[elmt] = "_";
    }
    for (elmt in arrayP2) {
        underscoreP2[elmt] = "_";
    }
}

/*=========================== FONCTION LANCEMENT DEBUT JEU =======================*/

function launchGame() {

    // fonction lancement musique
    if (typeof music.loop == 'boolean') {
        music.loop = true;
    }
    else {
        music.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    music.play();

    // Affichage du conteneur de jeu, on cache le menu
    b.className = "gameStyle";
    m.style.display = "none";
    c.style.display = "block";
    sceneBaston.style.display = "flex";

    nameP2 = document.getElementById('player2name').value;
    nameP1 = document.getElementById('player1name').value;

    // Appel de l'animation de remplissage des barres de vies
    healthP1.className = "fillHealth";
    healthP2.className = "fillHealth";

    // Appel de l'animation de start fight
    fightdiv.className = "animfightdiv";
    fightimg.style.display = "block";
    fightimg.className = "animfightimg";

    // Reset de la variable on fire
    fireP1 = 0;
    fireP2 = 0;

    // Création tableaux de vérification des mots
    arrayP1 = wordP1Upper.split('');
    arrayP2 = wordP2Upper.split('');

    createUnderscore(arrayP1, arrayP2);
    displayWord(1);

    slotNameP1.innerHTML = nameP1;
    slotNameP2.innerHTML = nameP2;

    // Reset des animations 
    animPlayer.style.display = "none";
    auraP1.style.display = "none";
    auraP2.style.display = "none";

    inGame = true;

    // Focus sur la guess box
    document.getElementById('playerAnswer').focus();
}

/*====================== FONCTION APPELE LORS DU GUESS JOUEUR ==========================*/

function play() {


    // Appel des fonctions choississant aléatoirement un message
    getForgetMessage();
    getGoodMessage();
    getWrongMessage();

    // Reset des animations et des variables utiles au check
    anim.className = "";
    fightdiv.className = "";
    fightimg.style.display = "none";
    fightimg.className = "";
    check = false;
    attack = 0;

    // Récupération du guess joueur et mise en majuscule
    answer = document.getElementById('playerAnswer').value;
    answer = replace(answer);

    // Vérification longueur guess et appel fonction en conséquence
    if (answer.length == 1) {
        checkLetter(answer, player);
    }
    else if (answer.length == 0) {
        sameTurn();
    }
    else {
        checkWord(answer, player);
    }
    if (inGame && attack == 1) {
        guessButton.disabled = true;
        setTimeout(nextTurn, 5000);
    }
    else if (inGame && attack == 0) {
        guessButton.disabled = true;
        setTimeout(nextTurn, 2000);
    }
    else if (inGame && attack == 2) {
        guessButton.disabled = true;
        setTimeout(nextTurn, 3000);
    }

    turnPlayer.style.display = "none";
}

/*=================== FONCTION VERIFICATION GUESS JOUEUR ==================*/

function sameTurn() {
    console.log('wesh');
}

function checkLetter(letter, player) {

    if (player == 1) {

        if (triesP1.indexOf(letter) === -1) {
            triesP1.push(letter);
        }
        else {
            check = true;
            message.className = "animMessage";
            message.style.display = "block";
            callLetter.style.display = "block";
            c.className = "shake";
            fireP1 = 0;
            attack = 1;
            playerDamage(player);
        }
        if (check == false) {
            let match = 0;
            for (i in arrayP2) {

                if (arrayP2[i] == letter) {
                    underscoreP2[i] = letter;
                    match++;
                }
            }
            if (match == 0) {
                message.className = "animMessage";
                message.style.display = "block";
                absentLetter.style.display = "block";
                c.className = "shake";
                fireP1 = 0;
                attack = 1;
                playerDamage(player);
            } else {
                message.className = "animMessage";
                message.style.display = "block";
                good.style.display = "block";
                displayWord(player);
                fireP1++;
                blink.className = "blink";
            }
        }

        underToString(underscoreP2);

        if (verify === wordP2Upper) {
            setTimeout(victory(player), 2000);
        }

    } else if (player == 2) {

        if (triesP2.indexOf(letter) === -1) {
            triesP2.push(letter);
        }
        else {
            check = true;
            message.className = "animMessage";
            message.style.display = "block";
            callLetter.style.display = "block";
            fireP2 = 0;
            attack = 1;
            playerDamage(player);
            c.className = "shake";
        }
        if (check == false) {
            let match = 0;
            for (i in arrayP1) {

                if (arrayP1[i] == letter) {
                    underscoreP1[i] = letter;
                    match++;
                }
            }
            if (match == 0) {
                message.className = "animMessage";
                message.style.display = "block";
                absentLetter.style.display = "block";
                playerDamage(player);
                fireP2 = 0;
                attack = 1;
                c.className = "shake";
            } else {
                message.className = "animMessage";
                message.style.display = "block";
                good.style.display = "block";
                displayWord(player);
                fireP2++;
                blink.className = "blink";
            }
        }

        underToString(underscoreP1);

        if (verify === wordP1Upper) {
            setTimeout(victory(player), 2000);
        }
    }

    // Gestion du mode ON FIRE
    if (fireP1 >= 3) {
        auraP1.style.display = "block";
    }
    else {
        auraP1.style.display = "none";
    }
    if (fireP1 == 3 && player == 1) {
        good.innerHTML = nameP1 + " is on fire";
    }

    if (fireP2 >= 3) {
        auraP2.style.display = "block";
    }
    else {
        auraP2.style.display = "none";
    }
    if (fireP2 == 3 && player == 2) {
        good.innerHTML = nameP2 + " is on fire";
    }
}

//check de l'équivalence mot lorsque le joueur entre plus d'une lettre
function checkWord(word, player) {
    if (player == 1) {
        if (word == wordP2Upper) {
            p2w.innerHTML = wordP2Upper;
            blink.className = "blink";
            setTimeout(victory(player), 2000);
        } else {
            console.log("Mauvaise réponse");
            playerDamage(player);
            c.className = "shake";
            fireP1 = 0;
        }
    } else if (player == 2) {
        if (word == wordP1Upper) {
            p1w.innerHTML = wordP1Upper;
            blink.className = "blink";
            setTimeout(victory(player), 2000);
        } else {
            console.log("Mauvaise réponse");
            playerDamage(player);
            c.className = "shake";
            fireP2 = 0;
        }
    }
}

/*====================== FONCTION AFFICHAGE MOT JOUEUR ===========================*/

//affiche le tableau d'underscore sous forme de chaine de caractère
function underToString(underscore) {
    verify = underscore.toString();
    let regex = /[,]/gi;
    verify = verify.replace(regex, "");
    return verify;
}

//fonction qui affiche le mot du joueur ennemi avec ses underscores
function displayWord(player) {
    if (player == 1) {
        display = underscoreP2.toString();
        let regex = /[,]/gi;
        display = display.replace(regex, "");
        p2w.innerHTML = display;
        p2w.style.display = "block";
        p1w.style.display = "none";
    } else if (player == 2) {
        display = underscoreP1.toString();
        let regex = /[,]/gi;
        display = display.replace(regex, "");
        p1w.innerHTML = display;
        p1w.style.display = "block";
        p2w.style.display = "none";
    }
}

/*============================== FONCTION GESTION DEGATS ===============================*/

//calcul des dégats joueur et check si ils tombent a zéro
function playerDamage(player) {
    if (player == 1) {
        if (fireP2 >= 3) {
            laserAttackP2();
            p1Hp -= 2;
            attack = 2;
            setTimeout(() => {
                healthP1.style.width = p1Hp * 2.9 + "%";
            }, 2900);
        }
        else {
            blinkDashAttack(perso2);
            p1Hp -= 1;
            setTimeout(() => {
                healthP1.style.width = p1Hp * 2.9 + "%";
            }, 2900);
        }
    } else if (player == 2) {

        if (fireP1 >= 3) {
            laserAttackP1();
            p2Hp -= 2;
            attack = 2;
            setTimeout(() => {
                healthP2.style.width = p2Hp * 2.9 + "%";
            }, 2900);
        }
        else {
            blinkDashAttack(perso1);
            p2Hp -= 1;
            setTimeout(() => {
                healthP2.style.width = p2Hp * 2.9 + "%";
            }, 2900);
        }
    }
    checkHealth();
}
function checkHealth() {
    if (p1Hp <= 0) {
        if (fireP2 >= 3) {
            setTimeout("victory(2)", 3000);
        }
        else {
            setTimeout("victory(2)", 5000);
        }
    }
    else if (p2Hp <= 0) {
        if (fireP1 >= 3) {
            setTimeout("victory(1)", 3000);
        }
        else {
            setTimeout("victory(1)", 5000);
        }
    }
}


/*====================== FONCTION LANCEMENT PROCHAIN TOUR =====================================*/

//préparation du tour du joueur suivant
function nextTurn() {
    if (player == 1) {

        // Gestion de la position de la guess box
        answerbox.style.flexDirection = "row-reverse";
        answerbox.style.marginLeft = 65 + "%";

        // Permutation mot joueur
        p1w.style.display = "block";
        p2w.style.display = "none";
        displayWord(2);

        // Permutation nom joueur
        slotNameP1.className = "";
        slotNameP2.className = "lightname";
        pTurnName.innerHTML = nameP2;

    } else if (player == 2) {

        // Gestion de la position de la guess box
        answerbox.style.flexDirection = "row";
        answerbox.style.marginLeft = 5 + "%";

        // Permutation mot joueur
        p1w.style.display = "none";
        p2w.style.display = "block";
        displayWord(1);

        // Permutation nom joueur
        slotNameP1.className = "lightname";
        slotNameP2.className = "";
        pTurnName.innerHTML = nameP1;
    }

    // Appel de la fonction choississant aléatoirement un message pour le changement de tour
    getTurnMessage();

    // Appel de l'animation de changement de tour
    turnPlayer.style.display = "block";
    anim.className = "anim";

    // Reset des autres animations de jeu
    c.className = "";
    message.className = "";
    message.style.display = "none";
    good.style.display = "none";
    absentLetter.style.display = "none";
    callLetter.style.display = "none";
    blink.className = "";

    // Reset de la guess box
    document.getElementById('playerAnswer').value = "";

    // Gestion du tour suivant
    turn++;
    if (turn % 2 == 0) {
        player = 2;
    } else {
        player = 1;
    }

    setTimeout(() => {
        guessButton.disabled = false;
    }, 1000);

    // Remise en focus de la guess box
    document.getElementById('playerAnswer').focus();
}


/*============================ FONCTION ENDING SCREEN CONDITION DE VICTOIRE=================*/

//fonction de passage de l'écran jeu à l'écran de fin
function victory(player) {
    inGame = false;
    if (player == 1) {
        if (p2Hp != 0) {
            endingString = nameP1 + " a devine le mot de " + nameP2 + " !";
        } else {
            endingString = nameP2 + " a succombe à ses blessures, <br>" + nameP1 + " gagne !";
        }
        winnerName = nameP1;
    } else if (player == 2) {
        if (p1Hp != 0) {
            endingString = nameP2 + " a devine le mot de " + nameP1 + " !";
        } else {
            endingString = nameP1 + " a succombe à ses blessures, <br>" + nameP2 + " gagne !";
        }
        winnerName = nameP2;
    } else {
        console.log("ERREUR variable player invalide dans fonction victory")
    }
    endingTitle.innerHTML = "Victoire de " + winnerName + " !";
    endingText.innerHTML = endingString;
    c.style.display = "none";
    endingScreen.style.display = "flex";
}

/*================================ FONCTION RESTART GAME ========================================*/

//bouton restart qui réinitialise les variables de jeu mais conserve les joueurs
function restart() {

    // Affcihage du menu
    m.style.display = "block";
    b.className = "menuStyle";
    endingScreen.style.display = "none";

    // Reset des variables de jeu
    triesP1 = [];
    triesP2 = [];
    underscoreP1 = [];
    underscoreP2 = [];
    arrayP1 = [];
    arrayP2 = [];
    p1Hp = 10;
    p2Hp = 10;

    // Reset des barres de vie
    healthP1.style.width = p1Hp * 2.9 + "%";
    healthP2.style.width = p2Hp * 2.9 + "%";

    // Reset de la guess box et du choix mots joueurs dans le menu 
    document.getElementById('playerAnswer').value = "";
    document.getElementById('player1word').value = "";
    document.getElementById('player2word').value = "";

    // Reset des animations
    c.className = "";
    message.className = "";
    message.style.display = "none";
    healthP1.className = "";
    healthP2.className = "";
    callLetter.style.display = "none";
    sceneBaston.style.display = "none";
}

/*======================== FONCTION DESACTIVATION DE LA TOUCHE ENTREE =========================*/

window.onload = function () {
    var champs = document.getElementsByTagName('input');
    for (var i = 0; i < champs.length; i++) {
        if (champs[i].type == 'text') {
            champs[i].onkeydown = disableEnterKey;
        }
    }
}

//désactive la touche entrée afin d'éviter les rafraichissement de la page via formulaire
function disableEnterKey(event) {
    var event = event || window.event;
    if (event.keyCode == 13) {
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.returnValue = false;
            event.cancelBubble = true;
        }
    }
}

/*============================ FONCTION CHOIX ALEATOIRE MESSAGE DE JEU ===========================*/

function getWrongMessage() {
    var arrayWrong = new Array(
        "Faux !",
        "Rate !",
        "A cote de la plaque !",
        "Manque !",
        "Eh non, c'est faux",
        "Quelle erreur !",
        "Pas de chance !",
        "C'est terrible...",
        "Aie aie aie...",
        "Ca doit piquer !",
    );
    absentLetter.innerHTML = arrayWrong[Math.floor(Math.random() * arrayWrong.length)];
}

function getGoodMessage() {
    var arrayGood = new Array(
        "Bravo !",
        "Excellent !",
        "Impressionnant !",
        "Quel crack !",
        "Quel joueur !",
        "Mais que fait la police ?",
        "Mais qui peut le stopper !"
    );
    good.innerHTML = arrayGood[Math.floor(Math.random() * arrayGood.length)];
}

function getTurnMessage() {
    var arrayTurn = new Array(
        "C'est ton tour !",
        "A toi de jouer !",
        "Entre en scene !",
        "Montre lui qui est le patron !",
        "cachez vous, il arrive !"
    );
    turnMsg.innerHTML = arrayTurn[Math.floor(Math.random() * arrayTurn.length)];
}

function getForgetMessage() {
    var arrayForget = new Array(
        "T'as pas de memoire ou bien ?",
        "Deja tente !",
        "un debut d'Alzheimer ?",
        "Bah alors on oublie vite ?",
        "Memoire pleine ?",
        "Cette lettre semble familiere...",
        "Une fois suffit !"
    );
    callLetter.innerHTML = arrayForget[Math.floor(Math.random() * arrayForget.length)];
}

/************* FONCTIONS ANIMATION ATTAQUE *****************/

function blinkDashAttack(perso) {
    var stringPerso;
    var persoOpp;
    var stringOpp;
    if (perso == perso1) {
        stringPerso = "perso1";
        persoOpp = perso2;
        stringOpp = "P2";
    }
    else if (perso == perso2) {
        stringPerso = "perso2";
        persoOpp = perso1;
        stringOpp = "P1";
    }
    perso.className = "attack2" + stringPerso;
    perso.src = "Images/Attack" + stringPerso + "_0.png";
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_1.png";
    }, 650);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_2.png";
    }, 1300);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_3.png";
        punchSound.play();
    }, 2500);
    setTimeout(() => {
        persoOpp.className = "animDamage" + stringOpp;
    }, 2900);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_2.png";
    }, 3750);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_0.png";
    }, 4300);
    setTimeout(() => {
        perso.src = "Images/Sprite" + stringPerso + ".gif";
    }, 5000);
    setTimeout(() => {
        perso.className = "";
    }, 5000);
    setTimeout(() => {
        persoOpp.className = "";
    }, 5000);
}

function laserAttackP1() {
    perso1.src = "Images/Attackperso1_0.png";
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_1.png";
    }, 400);
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_2.png";
    }, 550);
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_3.png";
        roundP1.style.display = "block";
        roundP1.style.height = 1 + "%";
    }, 700);

    let height = 1;
    let width = 3;
    let blinky = 1;
    let margin=3;

    for (let time = 700; time<1270; time+=15) {
        setTimeout(() => {
            roundP1.style.width = width + "%";
            roundP1.style.height = height + "%";
            width+=2.4;
            height+=1.5;
            blinky++; 
            margin-=0.098;           
            if(blinky % 5 == 0) {
                roundP1.style.display = "none";
                roundP1.style.marginTop = margin + "%";
            }        
            if(blinky % 5 == 1) {
                roundP1.style.display = "block";
            }
        }, time)
    }
    for (let time = 1900; time<2800; time+=15) {
        setTimeout(()=>{            
            roundP1.style.height = height + "%";            
            height-=1.5;
            blinky++;
            margin+=0.09;            
            if(blinky % 5 == 0) {    
                roundP1.style.display = "none"; 
                if(time<2500) { 
                    roundP1.style.marginTop = margin + "%";
                }
            }        
            if(blinky % 5 == 1) {
                roundP1.style.display = "block";
            }            
        },time)
    }
    setTimeout(() => {
        roundP1.style.display = "none";
        perso1.src = "Images/Attackperso1_0.png";
    }, 2800);
    setTimeout(() => {
        perso1.src = "Images/Spriteperso1.gif";
    }, 3100);
    setTimeout(() => {
        perso2.className = "laserDamageP2";
    }, 1120);
    setTimeout(() => {
        perso2.className = "";
    }, 3100);
}

function laserAttackP2() {
    perso2.src = "Images/Attackperso2_0.png";
    setTimeout(() => {
        perso2.src = "Images/Attackperso2_1.png";
    }, 400);
    setTimeout(() => {
        perso2.src = "Images/Attackperso2_2.png";
    }, 550);
    setTimeout(() => {
        perso2.src = "Images/Attackperso2_3.png";
        roundP2.style.display = "block";
        roundP2.style.height = 1 + "%";
    }, 700);

    let height = 1;
    let width = 3;
    let blinky = 1;
    let margin=3;

    for (let time = 700; time<1270; time+=15) {
        setTimeout(() => {
            roundP2.style.width = width + "%";
            roundP2.style.height = height + "%";
            width+=2.4;
            height+=1.5;
            blinky++; 
            margin-=0.098;           
            if(blinky % 5 == 0) {
                roundP2.style.display = "none";
                roundP2.style.marginTop = margin + "%";
            }        
            if(blinky % 5 == 1) {
                roundP2.style.display = "block";
            }
        }, time)
    }
    for (let time = 1900; time<2800; time+=15) {
        setTimeout(()=>{            
            roundP2.style.height = height + "%";            
            height-=1.5;
            blinky++;
            margin+=0.09;            
            if(blinky % 5 == 0) {    
                roundP1.style.display = "none"; 
                if(time<2500) { 
                    roundP2.style.marginTop = margin + "%";
                }
            }        
            if(blinky % 5 == 1) {
                roundP2.style.display = "block";
            }            
        },time)
    }
    setTimeout(() => {
        roundP2.style.display = "none";
        perso2.src = "Images/Attackperso2_0.png";
    }, 2800);
    setTimeout(() => {
        perso2.src = "Images/Spriteperso2.gif";
    }, 3100);
    setTimeout(() => {
        perso1.className = "laserDamageP1";
    }, 1120);
    setTimeout(() => {
        perso1.className = "";
    }, 3100);
}

