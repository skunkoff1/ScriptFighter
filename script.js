/*==================================================*/
/* ============== VARIABLES ========================*/
/*==================================================*/

// Flag joueur en cours
let player = 1;

// Flag choix du stage
let stage = 1;
let lightning;

// variables mots joueur
let wordP1Upper;
let wordP2Upper;
let arrayP1 = [];
let arrayP2 = [];
let underscoreP1 = [];
let underscoreP2 = [];
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
let verify;

// Gestion cours du jeu
let inGame = false;
let attack = 0;

// Objet audio
let music;
let menuMusic = new Audio('Son/Titlescreen_Music.mp3');
let menuLaunched = false;
let musicAllowed = true;

/*====================== VARIABLES AFFICHAGE MESSAGE JEU ======================*/

// affichage mot joueur
let blink = document.getElementById('underscoreArrays');
let p1w = document.getElementById('p1Word');
let p2w = document.getElementById('p2Word');

// message de jeu
let message = document.getElementById('message');
let good = document.getElementById('good');
let absentLetter = document.getElementById('absentLetter');
let callLetter = document.getElementById('callLetter');

// guess box
let answerbox = document.getElementById('answerForm');
let playerAnswer = document.getElementById('playerAnswer');

/*========================== VARIABLES ANIMATIONS =============================*/

let perso1 = document.getElementById('perso1');
let perso2 = document.getElementById('perso2');
let auraP1 = document.getElementById('aura1');
let auraP2 = document.getElementById('aura2');
let laserP1 = document.getElementById('laserP1');
let laserP2 = document.getElementById('laserP2');

/*==============================================================================*/
/*=============================== FONCTIONS ====================================*/
/*==============================================================================*/

// Fonction du bouton music ON / OFF
function musicAllow() {
    let musicButton = document.getElementById('musicButton');
    if (musicAllowed) {
        menuMusic.pause();
        musicAllowed = false;
        menuLaunched = false;
        musicButton.src = "Images/musicOFF.png"
    }
    else {
        musicAllowed = true;
        musicButton.src = "Images/musicON.png";
        pressStart();
    }
}

// Fonction de lancement de la musique menu
function pressStart() {
    if (musicAllowed) {
        if (menuLaunched == false) {
            menuMusic.volume = 0.1;
            if (typeof menuMusic.loop == 'boolean') {
                menuMusic.loop = true;
            }
            else {
                menuMusic.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            menuMusic.play();
            menuLaunched = true;
        }
    }
}

/*=========================== FONCTION VERIFICATION DEBUT JEU ===================*/

// Vérification du mot dans l'API
async function validateAPI(word) {
    const res = await fetch("https://cemotexistetil.lyliya.fr/exist?word=" + word); //Notre api=> http://localhost:3000/exist?word=   https://cemotexistetil.lyliya.fr/exist?word=
    //const res = await fetch("http://localhost:3000/exist?word=" + word); 
    const forms = await res.json();
    return forms.exist;
}

async function checkStart() {

    // Variables 
    // stockage mot joueur
    let wordP1 = document.getElementById('player1word');
    let wordP2 = document.getElementById('player2word');
    // gestion messages erreurs
    let err1 = document.getElementById('errAPI1');
    let err2 = document.getElementById('errAPI2');
    let err3 = document.getElementById('errAPI3');
    //checkbox
    let p1checked = document.getElementById('p1checked');
    let p2checked = document.getElementById('p2checked');

    // Reset des messages d'erreur de v�rification des mots joueurs   
    err1.style.display = "none";
    err2.style.display = "none";
    err3.style.display = "none";

    // Reset des bordures d'erreurs des inputs
    document.getElementById('player1word').className = "";
    document.getElementById('player2word').className = "";
    if ((wordP1.value.length > 0) && (wordP2.value.length > 0)) {
        if ((p1checked.checked) && (p2checked.checked)) {

            // Mise en majuscules des mots joueurs
            wordP1Upper = replace(wordP1.value);
            wordP2Upper = replace(wordP2.value);

            // Appel de l'API qui v�rifie si le mot joueur existe
            const validateP1 = await validateAPI(wordP1Upper);
            const validateP2 = await validateAPI(wordP2Upper);

            // si les mots ne sont pas valides
            if (validateP1 == false && validateP2 == false) {
                // Remise a z�ro input choix mot joueur
                wordP1.value = "";
                wordP2.value = "";

                // Appel de la bordure d'erreur input
                wordP1.className = "formError";
                wordP2.className = "formError";

                // On d�coche les checkbox "ready"
                document.getElementById('p1checked').checked = false;
                document.getElementById('p2checked').checked = false;

                // Affichage message d'erreur
                err3.style.display = "block";
            }
            else if (validateP1 == false) {
                // Remise a z�ro input choix mot joueur
                wordP1.value = "";

                // Appel de la bordure d'erreur input
                wordP1.className = "formError";

                // On d�coche la checkbox "ready"
                document.getElementById('p1checked').checked = false;

                // Affichage message d'erreur
                err1.style.display = "block";
            }
            else if (validateP2 == false) {
                // Remise a z�ro input choix mot joueur
                wordP2.value = "";

                // Appel de la bordure d'erreur input
                wordP2.className = "formError";

                // On d�coche la checkbox "ready"
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
    if (wordP1.value.length < 1) {
        wordP1.className = "formError";
    }
    if (wordP2.value.length < 1) {
        wordP2.className = "formError";
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

    // Affichage du conteneur de jeu, on cache le menu
    let menu = document.getElementById('menu');
    let body = document.getElementById('body');
    let container = document.getElementById('container');
    let sceneBaston = document.getElementById('baston');
    menu.style.display = "none";
    body.className = "gameStyle";
    container.style.display = "block";
    sceneBaston.style.display = "flex";

    // Récupération nom joueur
    nameP2 = document.getElementById('player2name').value;
    nameP1 = document.getElementById('player1name').value;

    // Affichage nom joueur
    let slotNameP1 = document.getElementById('nameP1');
    let slotNameP2 = document.getElementById('nameP2');
    slotNameP1.innerHTML = nameP1;
    slotNameP2.innerHTML = nameP2;

    // Appel de l'animation de remplissage des barres de vies
    let healthP1 = document.getElementById('bar1');
    let healthP2 = document.getElementById('bar2');
    healthP1.className = "fillHealth";
    healthP2.className = "fillHealth";

    // Appel de l'animation de start fight
    let fightdiv = document.getElementById('fightmsg');
    let fightimg = document.getElementById('fightimg');
    fightdiv.className = "animfightdiv";
    fightimg.style.display = "block";
    fightimg.className = "animfightimg";

    // Création tableaux de vérification des mots
    arrayP1 = wordP1Upper.split('');
    arrayP2 = wordP2Upper.split('');
    createUnderscore(arrayP1, arrayP2);

    // Affichage mot joueur 1
    displayWord(1);

    // Flag "en cours de jeu"
    inGame = true;

    // Focus sur la guess box
    playerAnswer.focus();

    // Fonction changement de stage en fonction des minutes / ou de l'heure de la journée
    checkHours();

    // fonction lancement musique
    menuLaunched = false;
    menuMusic.pause();
    menuMusic.currentTime = 0;
    music.volume = 0.1;
    if (musicAllowed) {
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
    }
}

// fonction pour afficher le stage et sa musique en fonction de l'heure / ou des minutes
function checkHours() {

    let body = document.getElementById('body');
    let nameColorP1 = document.getElementById('nameP1');
    let nameColorP2 = document.getElementById('nameP2');

    date = new Date();

    // Fonction changeant de stage toutes les minutes
    minute = date.getMinutes();
    if (minute % 2 == 0) {
        music = new Audio('Son/script_Fighter.mp3');
        body.style.backgroundImage = "url('Images/backgroundSandy.gif')";
        stage = 1;
        nameColorP1.style.color = "white";
        nameColorP2.style.color = "white";
        nameColorP1.className = "lightname";
        blink.style.color = "white";
        lightning = "blink1";
    }
    else {
        music = new Audio('Son/Stage_2.mp3');
        body.style.backgroundImage = "url('Images/STAGE2.gif')";
        stage = 2;
        nameColorP1.style.color = "rgb(217, 255, 0)";
        nameColorP2.style.color = "rgb(96, 173, 148)";
        nameColorP1.className = "lightname2";
        blink.style.color = "rgb(217, 255, 0)";
        lightning = "blink2";
    }
    /*
    // Fonction changeant de stage en fonction de l'heure de la journée
    
    hour = date.getHours();
    if ((hour >= 9) && (hour <= 18)) {
        music = new Audio('Son/script_Fighter.mp3');
        body.style.backgroundImage = "url('Images/backgroundSandy.png')";
        stage = 1;
        nameColorP1.style.color = "white";
        nameColorP2.style.color = "white";
        nameColorP1.className = "lightname";
        blink.style.color = "white";
        lightning = "blink1";
    }
    else {
        music = new Audio('Son/Stage_2.mp3');
        body.style.backgroundImage = "url('Images/STAGE2.gif')";
        stage = 2;
        nameColorP1.style.color = "rgb(96, 173, 148)";
        nameColorP2.style.color = "rgb(96, 173, 148)";
        nameColorP1.className = "lightname2";
        blink.style.color = "rgb(217, 255, 0)";
        lightning = "blink2";
    }*/
}

/*====================== FONCTION APPELE LORS DU GUESS JOUEUR ==========================*/

// Fonction qui relie l'input au click du bouton
playerAnswer.addEventListener("keyup", function (event) {

    let guessButton = document.getElementById('answerSubmit');
    // 13 est le code de la touche entrée
    if (event.key === 'Enter') {
        // Cancel l'action par défaut si besoin
        event.preventDefault();
        // déclencher le clic du bouton guess
        guessButton.click();
    }
});

function play() {

    // Appel des fonctions choississant aléatoirement un message
    getForgetMessage();
    getGoodMessage();
    getWrongMessage();

    // Reset des animations et des variables utiles au check
    let fightdiv = document.getElementById('fightmsg');
    let fightimg = document.getElementById('fightimg');
    let anim = document.getElementById('animation-container');
    fightdiv.className = "";
    fightimg.style.display = "none";
    fightimg.className = "";
    anim.className = "";

    // Récupération du guess joueur et mise en majuscule    
    let answer = replace(playerAnswer.value);

    // Vérification longueur guess et appel fonction en conséquence
    if (answer.length == 0) {
        document.getElementById('playerAnswer').className = "errorEntry";
        setTimeout(() => {
            document.getElementById('playerAnswer').className = "";
        }, 1200);
    }
    else if (answer.length == 1) {
        checkLetter(answer, player);
    }
    else {
        checkWord(answer, player);
    }
}

// Lance le prochain tour et ajuste les timeout en fonction des animations 
function launchNextTurn() {

    let guessButton = document.getElementById('answerSubmit');

    if (inGame && attack == 1) {
        guessButton.disabled = true;
        setTimeout(nextTurn, 3200);
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

function checkLetter(letter, player) {

    let mess;
    let ending = false;
    // GESTION JOUEUR 1
    if (player == 1) {
        // Si la lettre n'a pas encore été tentée
        if (triesP1.indexOf(letter) === -1) {
            triesP1.push(letter);
            // On check si elle est dans le mot
            let match = 0;
            for (i in arrayP2) {

                if (arrayP2[i] == letter) {
                    underscoreP2[i] = letter;
                    match++;
                }
            }
            // Si lettre non présente dans le mot
            if (match == 0) {
                mess = "absent";
                displayMessage(mess);
                fireP1 = 0;
                attack = 1;
                playerDamage(player);

                // Si lettre présente dans le mot    
            } else {

                // Mise a jour de l'underscore pour l'afffichage en jeu et la vérification
                underToString(underscoreP2);

                // Si mot est complet
                if (verify === wordP2Upper) {
                    ending = true;
                    setTimeout(() => {
                        finishHim(1);
                    }, 1500);
                }
                // Si mot incomplet
                else if (fireP1 != 3) {
                    celebration(perso1);
                }
                mess = "good";
                displayWord(player);
                fireP1++;
                if (ending == false) {
                    displayMessage(mess);
                }
            }
        }
        // Si la lettre a déjà été tentée
        else {
            mess = "call";
            displayMessage(mess);
            fireP1 = 0;
            attack = 1;
            playerDamage(player);
        }

        // GESTION JOUEUR 2
    } else if (player == 2) {
        // Si la lettre n'a pas encore été tentée
        if (triesP2.indexOf(letter) === -1) {
            triesP2.push(letter);
            // On check si elle est dans le mot
            let match = 0;
            for (i in arrayP1) {

                if (arrayP1[i] == letter) {
                    underscoreP1[i] = letter;
                    match++;
                }
            }
            // Si lettre non présente pas dans le mot
            if (match == 0) {
                mess = "absent";
                displayMessage(mess);
                playerDamage(player);
                fireP2 = 0;
                attack = 1;

                // Si lettre présente dans le mot    
            } else {

                // Mise a jour de l'underscore pour l'affichage en jeu
                underToString(underscoreP1);

                // Si mot complet
                if (verify === wordP1Upper) {
                    ending = true; absentLetter
                    setTimeout(() => {
                        finishHim(2);
                    }, 1500);
                }
                // Si mot incomplet
                else if (fireP2 != 3) {
                    celebration(perso2);
                }
                mess = "good";
                displayWord(player);
                fireP2++;

                if (ending == false) {
                    displayMessage(mess);
                }
            }
        }
        // Si la lettre a déjà été tentée
        else {
            mess = "call";
            displayMessage(mess);
            fireP2 = 0;
            attack = 1;
            playerDamage(player);
        }
    }

    // Gestion du mode ON FIRE
    if (fireP1 < 3) {
        setTimeout(() => {
            auraP1.style.display = "none";
        }, 1650);
    }
    if (fireP1 == 3 && player == 1) {
        good.className = "onFire";
        good.innerHTML = nameP1 + " is on fire";
        animSSJP1();
    }

    if (fireP2 < 3) {
        setTimeout(() => {
            auraP2.style.display = "none";
        }, 1650);
    }
    if (fireP2 == 3 && player == 2) {
        good.className = "onFire";
        good.innerHTML = nameP2 + " is on fire";
        animSSJP2();
    }

    if (ending == false) {
        launchNextTurn();
    }
}

//check de l'équivalence mot lorsque le joueur entre plus d'une lettre
function checkWord(word, player) {

    let container = document.getElementById('container');
    // Gestion Joueur 1
    if (player == 1) {
        if (word == wordP2Upper) {
            p2w.innerHTML = wordP2Upper;
            blink.className = lightning;
            answerbox.style.display = "none";
            setTimeout(() => {
                finishHim(1);
            }, 1500);
        } else {
            mess = "absent";
            displayMessage(mess);
            playerDamage(player);
            container.className = "shake";
            fireP1 = 0;
            launchNextTurn();
        }
        // Gestion joueur 2
    } else if (player == 2) {
        if (word == wordP1Upper) {
            p1w.innerHTML = wordP1Upper;
            answerbox.style.display = "none";
            blink.className = lightning;
            setTimeout(() => {
                finishHim(2);
            }, 1500);
        } else {
            mess = "absent";
            displayMessage(mess);
            playerDamage(player);
            container.className = "shake";
            fireP2 = 0;
            launchNextTurn();
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

//fonction qui affiche le mot du joueur adverse avec ses underscores
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
function displayDamage(player) {
    // Gestion joueur 2
    if (player == 2) {
        let healthP2 = document.getElementById('bar2');
        if (attack == 1) {
            blinkDashAttack(perso1);
            setTimeout(() => {
                healthP2.style.width = p2Hp * 2.9 + "%";
            }, 1590);
        } else if (attack == 2) {
            laserAttackP1();
            setTimeout(() => {
                healthP2.style.width = p2Hp * 2.9 + "%";
            }, 2900);
        }
        else if (attack == 3) {
            answerbox.style.display = "none";
            setTimeout(() => {
                finishHim(1);
            }, 2500)
            healthP2.style.width = p2Hp * 2.9 + "%";
        }
    }
    // Gestion joueur 1
    else if (player == 1) {
        let healthP1 = document.getElementById('bar1');
        if (attack == 1) {
            blinkDashAttack(perso2);
            setTimeout(() => {
                healthP1.style.width = p1Hp * 2.9 + "%";
            }, 1590);
        } else if (attack == 2) {
            laserAttackP2();
            setTimeout(() => {
                healthP1.style.width = p1Hp * 2.9 + "%";
            }, 2900);
        }
        else if (attack == 3) {
            answerbox.style.display = "none";
            setTimeout(() => {
                finishHim(2);
            }, 2500)
            healthP1.style.width = p2Hp * 2.9 + "%";
        }
    }

}

//calcul des dégats joueur et appel du check pour vérifier nombre de points de vie restants
function playerDamage(player) {
    if (player == 1) {
        if (fireP2 >= 3) {
            p1Hp -= 2;
            attack = 2;
        }
        else {
            p1Hp -= 1;
            attack = 1;
        }
    } else if (player == 2) {

        if (fireP1 >= 3) {
            p2Hp -= 2;
            attack = 2;
        }
        else {
            p2Hp -= 1;
            attack = 1;
        }
    }
    checkHealth();
}

// Vérifie le nombre de points de vie restants
function checkHealth() {
    if (p1Hp <= 0 || p2Hp <= 0) {
        attack = 3;
        displayDamage(player)
    }
    else {
        displayDamage(player);
    }
}


/*====================== FONCTION LANCEMENT PROCHAIN TOUR =====================================*/

//préparation du tour du joueur suivant
function nextTurn() {

    let pTurnName = document.getElementById('pTurnName');
    let guessButton = document.getElementById('answerSubmit');
    let anim = document.getElementById('animation-container');
    // Permutation nom joueur    
    let nameColorP1 = document.getElementById('nameP1');
    let nameColorP2 = document.getElementById('nameP2');

    if (player == 1) {

        // Gestion de la position de la guess box
        answerbox.style.flexDirection = "row-reverse";
        answerbox.style.marginLeft = 65 + "%";

        // Permutation mot joueur
        if (attack == 3) {
            blink.style.display = "none";
            p2w.style.display = "none";
            p1w.style.display = "none";
        } else {
            p1w.style.display = "block";
            p2w.style.display = "none";
            displayWord(2);
        }

        nameColorP1.className = "";
        if (stage == 1) {
            nameColorP2.className = "lightname";
        }
        else {
            nameColorP2.className = "lightname2";
            nameColorP2.style.color = "rgb(217, 255, 0)";
            nameColorP1.style.color = "rgb(96, 173, 148)";
        }

        pTurnName.innerHTML = nameP2;

    } else if (player == 2) {

        // Gestion de la position de la guess box
        answerbox.style.flexDirection = "row";
        answerbox.style.marginLeft = 5 + "%";

        // Permutation mot joueur
        if (attack == 3) {
            blink.style.display = "none";
            p2w.style.display = "none";
            p1w.style.display = "none";
        } else {
            p1w.style.display = "none";
            p2w.style.display = "block";
            displayWord(1);
        }

        nameColorP2.className = "";
        if (stage == 1) {
            nameColorP1.className = "lightname";
        }
        else {
            nameColorP1.className = "lightname2";
            nameColorP1.style.color = "rgb(217, 255, 0)";
            nameColorP2.style.color = "rgb(96, 173, 148)";
        }
        pTurnName.innerHTML = nameP1;
    }

    // Appel de la fonction choississant aléatoirement un message pour le changement de tour
    getTurnMessage();

    // Appel de l'animation de changement de tour
    turnPlayer.style.display = "block";
    anim.className = "anim";

    // Reset des autres animations de jeu
    message.className = "";
    message.style.display = "none";
    good.className = "";
    good.style.display = "none";
    absentLetter.style.display = "none";
    callLetter.style.display = "none";
    blink.className = "";

    // Reset de la guess box
    playerAnswer.value = "";

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
    playerAnswer.focus();
}

/*============================ FONCTION ENDING SCREEN ET CONDITION DE VICTOIRE=================*/

// Fonction qui lance le finish
function finishHim(player) {

    let finish = document.getElementById('finishDiv');
    finish.style.display = "block";
    setTimeout(() => {
        finish.style.display = "none";
    }, 850);

    if (player == 1) {
        setTimeout(() => {
            laserfinishP1();
        }, 700);

    }
    else {
        setTimeout(() => {
            laserfinishP2();
        }, 700);
    }
}

//fonction de passage de l'écran jeu à l'écran de fin
function victory(player) {

    let wordsUsed = "<br/>Le mot de " + nameP1 + " etait : " + wordP1Upper + "<br/>Le mot de " + nameP2 + " etait : " + wordP2Upper;
    let endingString;
    let winnerName;
    let endingTitle = document.getElementById('endingTitle');
    let endingText = document.getElementById('endingText');
    let endingScreen = document.getElementById('endingScreen');

    inGame = false;
    if (player == 1) {
        if (p2Hp > 0) {
            endingString = nameP1 + " a devine le mot de " + nameP2 + " !" + wordsUsed;
        } else {
            endingString = nameP2 + " a succombe a ses blessures, <br>" + nameP1 + " gagne !" + wordsUsed;
        }
        winnerName = nameP1;
    } else if (player == 2) {
        if (p1Hp > 0) {
            endingString = nameP2 + " a devine le mot de " + nameP1 + " !" + wordsUsed;
        } else {
            endingString = nameP1 + " a succombe a ses blessures, <br>" + nameP2 + " gagne !" + wordsUsed;
        }
        winnerName = nameP2;
    } else {
        console.log("ERREUR variable player invalide dans fonction victory")
    }

    endingTitle.innerHTML = "Victoire de " + winnerName + " !";
    endingText.innerHTML = endingString;
    endingScreen.style.display = "flex";
}

/*================================ FONCTION RESTART GAME ========================================*/

//bouton restart qui réinitialise les variables de jeu mais conserve les joueurs
function restart() {

    // Affchaage du menu
    let body = document.getElementById('body');
    let menu = document.getElementById('menu');
    let endingScreen = document.getElementById('endingScreen');
    body.style.backgroundImage = "url('Images/bbackgroundSandyMenu.png')";
    body.className = "menuStyle";
    menu.style.display = "block";
    endingScreen.style.display = "none";

    // Reset de la guess box et du choix mots joueurs dans le menu 
    answerbox.style.flexDirection = "row";
    answerbox.style.marginLeft = 5 + "%";
    playerAnswer.value = "";
    answerbox.style.display = "flex";
    document.getElementById('player1word').value = "";
    document.getElementById('player2word').value = "";

    // Reset des animations
    let container = document.getElementById('container');
    container.className = "";

    let sceneBaston = document.getElementById('baston')
    sceneBaston.style.display = "none";

    let whiteScreen = document.getElementById('altback');
    whiteScreen.style.display = "none";
    whiteScreen.style.opacity = 0;

    let healthP1 = document.getElementById('bar1');
    let healthP2 = document.getElementById('bar2');
    healthP1.className = "";
    healthP2.className = "";

    let vsimg = document.getElementById('vs-img');
    let koimg = document.getElementById('ko-img');
    vsimg.style.display = "block";
    koimg.src = "Images/VS_KO.gif";
    koimg.style.opacity = 1;
    koimg.style.display = "none";
    koimg.style.heigt = "112px";
    koimg.style.width = "148px";
    koimg.style.top = "2%";
    koimg.style.left = "45.2%";

    let animPlayer = document.getElementById('turnPlayer');
    animPlayer.style.display = "block";

    let anim = document.getElementById('animation-container');
    anim.style.display = "block";

    message.className = "";
    message.style.display = "none";
    callLetter.style.display = "none";
    perso1.style.display = "block";
    perso2.style.display = "block";
    auraP1.style.display = "none";
    auraP2.style.display = "none";
    perso1.src = "images/Spriteperso1.gif";
    perso2.src = "images/Spriteperso2.gif";

    // Reset des variables de jeu
    triesP1 = [];
    triesP2 = [];
    underscoreP1 = [];
    underscoreP2 = [];
    arrayP1 = [];
    arrayP2 = [];
    p1Hp = 10;
    p2Hp = 10;
    fireP1 = 0;
    fireP2 = 0;
    turn = 1;
    player = 1;
    stage = 1;

    // Reset des barres de vie
    healthP1.style.width = p1Hp * 2.9 + "%";
    healthP2.style.width = p2Hp * 2.9 + "%";

    //Gestion musique
    music.pause();
    music.currentTime = 0;
    pressStart();

}

/*============================ FONCTION CHOIX ALEATOIRE MESSAGE DE JEU ===========================*/

function displayMessage(mess) {

    let container = document.getElementById('container');
    message.className = "animMessage";
    message.style.display = "block";

    if (mess == "good") {
        good.style.display = "block";
        blink.className = lightning;
    }
    else if (mess == "absent") {
        absentLetter.style.display = "block";
        container.className = "shake";
    }
    else if (mess == "call") {
        callLetter.style.display = "block";
        container.className = "shake";
    }
}

function getWrongMessage() {
    var arrayWrong = [
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
    ];
    absentLetter.innerHTML = arrayWrong[Math.floor(Math.random() * arrayWrong.length)];
}

function getGoodMessage() {
    var arrayGood = [
        "Bravo !",
        "Excellent !",
        "Impressionnant !",
        "Quel crack !",
        "Quel joueur !",
        "Mais que fait la police ?",
        "Mais qui peut le stopper !"
    ];
    good.innerHTML = arrayGood[Math.floor(Math.random() * arrayGood.length)];
}

function getTurnMessage() {
    var arrayTurn = [
        "C'est ton tour !",
        "A toi de jouer !",
        "Entre en scene !",
        "Montre lui qui est le patron !",
        "cachez vous, il arrive !"
    ];
    let turnMsg = document.getElementById('turnMsg');
    turnMsg.innerHTML = arrayTurn[Math.floor(Math.random() * arrayTurn.length)];
}

function getForgetMessage() {
    var arrayForget = [
        "T'as pas de memoire ou bien ?",
        "Deja tente !",
        "un debut d'Alzheimer ?",
        "Bah alors on oublie vite ?",
        "Memoire pleine ?",
        "Cette lettre semble familiere...",
        "Une fois suffit !"
    ];
    callLetter.innerHTML = arrayForget[Math.floor(Math.random() * arrayForget.length)];
}

/*====================== FONCTION ANIMATION JEU ========================*/

function celebration(perso) {
    var stringPerso;
    if (perso == perso1) {
        stringPerso = "perso1";
    }
    else if (perso == perso2) {
        stringPerso = "perso2";
    }
    perso.src = "Images/victory" + stringPerso + ".png";
    setTimeout(() => {
        perso.src = "Images/celebration" + stringPerso + ".png";
    }, 400);
    setTimeout(() => {
        perso.src = "Images/victory" + stringPerso + ".png";
    }, 1800);
    setTimeout(() => {
        perso.src = "Images/Sprite" + stringPerso + ".gif";
    }, 2000);
}

function animSSJP1() {

    let auraP1sup = document.getElementById('aura1sup');
    perso1.src = "Images/Attackperso1_0.png";

    let bottomPerso = 35;
    let bottomAura = 15;
    let bottomAuraSup = 9;
    let opacityAuraSup = 1;
    let widthAura = 220;
    let widthLeft = 9;

    setTimeout(() => {
        perso1.src = "Images/victoryperso1.png";
    }, 300);

    for (let time = 300; time < 800; time += 15) {
        setTimeout(() => {
            perso1.style.bottom = bottomPerso + "%";
            auraP1.style.bottom = bottomAura + "%";
            auraP1sup.style.bottom = bottomAuraSup + "%";
            bottomPerso += 2.5;
            bottomAura += 2.5;
            bottomAuraSup += 1.5;
        }, time);
    }

    setTimeout(() => {
        auraP1.style.display = "block";
        auraP1sup.style.display = "block";
    }, 800);

    for (let time = 800; time < 1200; time += 15) {
        setTimeout(() => {
            auraP1sup.style.width = widthAura + "px";
            auraP1sup.style.left = widthLeft + "%";
            auraP1sup.style.bottom = bottomAuraSup + "%";
            auraP1sup.style.opacity = opacityAuraSup;
            opacityAuraSup -= 0.1;
            bottomAuraSup -= 10;
            widthLeft -= 2.88;
            widthAura += 128;
        }, time);
    }

    for (let time = 1200; time < 1700; time += 15) {
        setTimeout(() => {
            perso1.style.bottom = bottomPerso + "%";
            auraP1.style.bottom = bottomAura + "%";
            bottomPerso -= 2.5;
            bottomAura -= 2.5;
        }, time);
    }

    setTimeout(() => {
        perso1.src = "Images/Attackperso1_1.png";
    }, 1500);

    setTimeout(() => {
        perso1.src = "Images/Attackperso1_2.png";
    }, 1900);

    setTimeout(() => {
        perso1.src = "Images/Spriteperso1.gif";
        auraP1sup.style.display = "none";
    }, 2100);
}

function animSSJP2() {

    let auraP2sup = document.getElementById('aura2sup');
    perso2.src = "Images/victoryperso2.png";

    let bottomPerso = 35;
    let bottomAura = 28;
    let bottomAuraSup = 9;
    let opacityAuraSup = 1;
    let widthAura = 220;
    let widthRight = 9;

    setTimeout(() => {
        perso2.src = "Images/celebrationperso2.png";
    }, 300);

    for (let time = 300; time < 800; time += 15) {
        setTimeout(() => {
            perso2.style.bottom = bottomPerso + "%";
            auraP2.style.bottom = bottomAura + "%";
            auraP2sup.style.bottom = bottomAuraSup + "%";
            bottomPerso += 2.5;
            bottomAura += 2.5
            bottomAuraSup += 1.5;
        }, time);
    }

    setTimeout(() => {
        auraP2.style.display = "block";
        auraP2sup.style.display = "block";
    }, 800);

    for (let time = 800; time < 1200; time += 15) {
        setTimeout(() => {
            auraP2sup.style.width = widthAura + "px";
            auraP2sup.style.right = widthRight + "%";
            auraP2sup.style.bottom = bottomAuraSup + "%";
            auraP2sup.style.opacity = opacityAuraSup;
            opacityAuraSup -= 0.1;
            bottomAuraSup -= 10;
            widthRight -= 2.88;
            widthAura += 128;
        }, time);
    }

    for (let time = 1200; time < 1700; time += 15) {
        setTimeout(() => {
            perso2.style.bottom = bottomPerso + "%";
            auraP2.style.bottom = bottomAura + "%";
            bottomPerso -= 2.5;
            bottomAura -= 2.5;
        }, time);
    }

    setTimeout(() => {
        perso2.src = "Images/Attackperso2_1.png";
    }, 1500);

    setTimeout(() => {
        perso2.src = "Images/Spriteperso2.gif";
        auraP2sup.style.display = "none";
    }, 2100);
}


/*===================== FONCTIONS ANIMATION ATTAQUE =========================*/

function blinkDashAttack(perso) {

    let punchSound = new Audio('Son/SFX_Punch.mp3');
    punchSound.volume = 0.2;
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
    }, 390);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_2.png";
    }, 780);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_3.png";
    }, 1500);
    setTimeout(() => {
        punchSound.play();
    }, 1590);
    setTimeout(() => {
        persoOpp.className = "animDamage" + stringOpp;
    }, 1740);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_2.png";
    }, 2250);
    setTimeout(() => {
        perso.src = "Images/Attack" + stringPerso + "_0.png";
    }, 2580);
    setTimeout(() => {
        perso.src = "Images/Sprite" + stringPerso + ".gif";
    }, 3000);
    setTimeout(() => {
        perso.className = "";
    }, 3000);
    setTimeout(() => {
        persoOpp.className = "";
    }, 3000);
}

function laserAttackP1() {

    let laserSound = new Audio('Son/SFX_laserTest.mp3');
    laserSound.volume = 0.2;
    perso1.src = "Images/Attackperso1_0.png";

    setTimeout(() => {
        perso1.src = "Images/Attackperso1_1.png";
    }, 400);
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_2.png";
    }, 550);
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_3.png";
        laserP1.style.display = "block";
        laserP1.style.height = 1 + "%";
        laserSound.play();
    }, 700);

    let height = 1;
    let width = 3;
    let blinky = 1;
    let margin = 3;

    for (let time = 700; time < 1270; time += 15) {
        setTimeout(() => {
            laserP1.style.width = width + "%";
            laserP1.style.height = height + "%";
            width += 2.4;
            height += 1.5;
            blinky++;
            margin -= 0.12;
            if (blinky % 5 == 0) {
                laserP1.style.display = "none";
                laserP1.style.marginTop = margin + "%";
            }
            if (blinky % 5 == 1) {
                laserP1.style.display = "block";
            }
        }, time)
    }

    for (let time = 1900; time < 2800; time += 15) {
        setTimeout(() => {
            laserP1.style.height = height + "%";
            height -= 1.5;
            blinky++;
            margin += 0.1;
            if (blinky % 5 == 0) {
                laserP1.style.display = "none";
                if (time < 2500) {
                    laserP1.style.marginTop = margin + "%";
                }
            }
            if (blinky % 5 == 1) {
                laserP1.style.display = "block";
            }
        }, time)
    }

    setTimeout(() => {
        laserP1.style.display = "none";
        perso1.src = "Images/Attackperso1_0.png";
    }, 2800);
    setTimeout(() => {
        perso1.src = "Images/Spriteperso1.gif";
        perso2.className = "";
    }, 3100);
    setTimeout(() => {
        perso2.className = "laserDamageP2";
    }, 1120);
}

function laserAttackP2() {

    let laserSound = new Audio('Son/SFX_laserTest.mp3');
    laserSound.volume = 0.2;
    perso2.src = "Images/Attackperso2_0.png";

    setTimeout(() => {
        perso2.src = "Images/Attackperso2_1.png";
    }, 400);

    setTimeout(() => {
        perso2.src = "Images/Attackperso2_3.png";
        laserP2.style.display = "block";
        laserP2.style.height = 1 + "%";
        laserSound.play();
    }, 700);

    let height = 1;
    let width = 3;
    let blinky = 1;
    let margin = 3;

    for (let time = 700; time < 1270; time += 15) {
        setTimeout(() => {
            laserP2.style.width = width + "%";
            laserP2.style.height = height + "%";
            width += 2.4;
            height += 1.5;
            blinky++;
            margin -= 0.098;
            if (blinky % 5 == 0) {
                laserP2.style.display = "none";
                laserP2.style.marginTop = margin + "%";
            }
            if (blinky % 5 == 1) {
                laserP2.style.display = "block";
            }
        }, time)
    }

    for (let time = 1900; time < 2800; time += 15) {
        setTimeout(() => {
            laserP2.style.height = height + "%";
            height -= 1.5;
            blinky++;
            margin += 0.09;
            if (blinky % 5 == 0) {
                laserP1.style.display = "none";
                if (time < 2500) {
                    laserP2.style.marginTop = margin + "%";
                }
            }
            if (blinky % 5 == 1) {
                laserP2.style.display = "block";
            }
        }, time)
    }

    setTimeout(() => {
        laserP2.style.display = "none";
    }, 2800);
    setTimeout(() => {
        perso2.src = "Images/Spriteperso2.gif";
    }, 3100);
    setTimeout(() => {
        perso1.className = "laserDamageP1";
        perso1.className = "";
    }, 1120);
}

function laserfinishP1() {

    let container = document.getElementById('container');
    let body = document.getElementById('body');
    let whiteScreen = document.getElementById('altback');
    let vsimg = document.getElementById('vs-img');
    let koimg = document.getElementById('ko-img');
    let anim = document.getElementById('animation-container');
    whiteScreen.style.display = "block";
    anim.style.display = "none";
    let laserSound = new Audio('Son/SFX_laser.mp3');
    laserSound.volume = 0.2;

    // ANIMATION DU KO

    let koTop = 2;
    let koLeft = 45.2;
    let koHeight = 112;
    let koWidth = 148;
    let koOpacity = 1;

    setTimeout(() => {
        vsimg.style.display = "none";
        koimg.style.display = "block";
    }, 1500);

    for (let time = 1500; time <= 2500; time += 15) {
        setTimeout(() => {
            koimg.style.top = koTop + "%";
            koimg.style.left = koLeft + "%";
            koimg.style.height = koHeight + "px";
            koimg.style.width = koWidth + "px";
            koTop += 0.2;
            koLeft -= 0.05;
            koHeight += 3;
            koWidth += 2.24;
        }, time);
    }

    setTimeout(() => {
        koimg.src = "Images/VS_KOframe4.png";
    }, 2400);

    for (let time = 3000; time <= 4000; time += 15) {
        setTimeout(() => {
            koimg.style.opacity = koOpacity;
            koimg.style.top = koTop + "%";
            koimg.style.height = koHeight + "px";
            koimg.style.width = koWidth + "px";
            koimg.style.left = koLeft + "%";
            koTop -= 4.5;
            koLeft -= 3.2;
            koHeight += 180;
            koWidth += 120;
            koOpacity -= 0.05;
        }, time);
    }

    setTimeout(() => {
        container.style.display = "none";
    }, 4000)

    // ANIMATION LASER ET WHITESCREEN
    perso1.src = "Images/Attackperso1_0.png";
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_1.png";
    }, 400);
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_2.png";
    }, 550);
    setTimeout(() => {
        perso1.src = "Images/Attackperso1_3.png";
        laserP1.style.display = "block";
        laserP1.style.height = 1 + "%";
        laserSound.play();
        container.className = "finalShake";
    }, 700);

    let height = 1;
    let width = 3;
    let blinky = 1;
    let margin = 3;
    let left = 23;
    let opacity = 0;

    for (let time = 700; time < 1270; time += 15) {
        setTimeout(() => {
            laserP1.style.width = width + "%";
            laserP1.style.height = height + "%";
            width += 4;
            height += 8;
            blinky++;
            margin -= 0.6;
            if (blinky % 4 == 0) {
                laserP1.style.display = "none";
                laserP1.style.marginTop = margin + "%";
            }
            if (blinky % 4 == 1) {
                laserP1.style.display = "block";
            }
        }, time)
    }

    for (let time = 1300; time < 3000; time += 15) {
        setTimeout(() => {
            whiteScreen.style.opacity = opacity;
            opacity += 0.01;
            blinky++;
            if (blinky % 4 == 0) {
                laserP1.style.display = "none";
            }
            if (blinky % 4 == 1) {
                laserP1.style.display = "block";
            }
        }, time)
    }

    setTimeout(() => {
        //       body.style.backgroundImage = "url('Images/altback.png')";
    }, 3000);

    for (let time = 4000; time < 4900; time += 15) {
        setTimeout(() => {
            laserP1.style.left = left + "%";
            whiteScreen.style.opacity = opacity;
            opacity -= 0.05;
            left += 2;
            blinky++;
            if (blinky % 4 == 0) {
                laserP1.style.display = "none";
            }
            if (blinky % 4 == 1) {
                laserP1.style.display = "block";
            }
            if (time >= 4000) {
                victory(1);
            }
        }, time)
    }
    setTimeout(() => {
        laserP1.style.display = "none";
        perso1.src = "Images/victoryperso1.png";
    }, 4900);
    setTimeout(() => {
        perso1.src = "Images/celebrationperso1.png";
    }, 5000);
    setTimeout(() => {
        perso2.className = "laserDamageP2";
    }, 1120);
    setTimeout(() => {
        perso2.style.display = "none";
    }, 2220);
    setTimeout(() => {
        perso2.className = "";
        laserP1.style.left = 23 + "%";
        whiteScreen.style.display = "none";
        auraP2.style.display = "none";
    }, 5000);
}

function laserfinishP2() {

    let container = document.getElementById('container');
    let body = document.getElementById('body');
    let whiteScreen = document.getElementById('altback');
    let vsimg = document.getElementById('vs-img');
    let koimg = document.getElementById('ko-img');
    let anim = document.getElementById('animation-container');
    whiteScreen.style.display = "block";
    anim.style.display = "none";
    let laserSound = new Audio('Son/SFX_laser.mp3');
    laserSound.volume = 0.2;

    // ANIMATION DU KO

    let koTop = 2;
    let koLeft = 45.2;
    let koHeight = 112;
    let koWidth = 148;
    let koOpacity = 1;

    setTimeout(() => {
        vsimg.style.display = "none";
        koimg.style.display = "block";

    }, 1500);
    for (let time = 1500; time <= 2500; time += 15) {
        setTimeout(() => {
            koimg.style.top = koTop + "%";
            koimg.style.left = koLeft + "%";
            koimg.style.height = koHeight + "px";
            koimg.style.width = koWidth + "px";
            koTop += 0.2;
            koLeft -= 0.05;
            koHeight += 3;
            koWidth += 2.24;
        }, time);
    }

    setTimeout(() => {
        koimg.src = "Images/VS_KOframe4.png";
    }, 2400);

    for (let time = 3000; time <= 4000; time += 15) {
        setTimeout(() => {
            koimg.style.opacity = koOpacity;
            koimg.style.top = koTop + "%";
            koimg.style.height = koHeight + "px";
            koimg.style.width = koWidth + "px";
            koimg.style.left = koLeft + "%";
            koTop -= 4.5;
            koLeft -= 3.2;
            koHeight += 180;
            koWidth += 120;
            koOpacity -= 0.05;
        }, time);
    }

    setTimeout(() => {
        container.style.display = "none";
    }, 4000);

    // ANIMATION LASER ET WHITESCREEN
    perso2.src = "Images/Attackperso2_1.png";
    setTimeout(() => {
        perso2.src = "Images/Attackperso2_2.png";
    }, 550);
    setTimeout(() => {
        perso2.src = "Images/Attackperso2_3.png";
        laserP2.style.display = "block";
        laserP2.style.height = 1 + "%";
        laserSound.play();
        container.className = "finalShake";
    }, 700);

    let height = 1;
    let width = 3;
    let blinky = 1;
    let margin = 3;
    let right = 25;
    let opacity = 0;

    for (let time = 700; time < 1270; time += 15) {
        setTimeout(() => {
            laserP2.style.width = width + "%";
            laserP2.style.height = height + "%";
            width += 4;
            height += 8;
            blinky++;
            margin -= 0.6;
            if (blinky % 4 == 0) {
                laserP2.style.display = "none";
                laserP2.style.marginTop = margin + "%";
            }
            if (blinky % 4 == 1) {
                laserP2.style.display = "block";
            }
        }, time)
    }

    for (let time = 1300; time < 3000; time += 15) {
        setTimeout(() => {
            whiteScreen.style.opacity = opacity;
            opacity += 0.01;
            blinky++;
            if (blinky % 4 == 0) {
                laserP2.style.display = "none";
            }
            if (blinky % 4 == 1) {
                laserP2.style.display = "block";
            }
        }, time)
    }

    setTimeout(() => {
        //        body.style.backgroundImage = "url('Images/altback.png')";
    }, 3000);

    for (let time = 4000; time < 4900; time += 15) {
        setTimeout(() => {
            laserP2.style.right = right + "%";
            whiteScreen.style.opacity = opacity;
            opacity -= 0.05;
            right += 2;
            blinky++;
            if (blinky % 4 == 0) {
                laserP2.style.display = "none";
            }
            if (blinky % 4 == 1) {
                laserP2.style.display = "block";
            }
            if (time >= 4000) {
                koimg.style.display = "none";
                victory(2);
            }
        }, time)
    }
    setTimeout(() => {
        laserP2.style.display = "none";
        perso2.src = "Images//victoryperso2.png";
    }, 4900);
    setTimeout(() => {
        perso2.src = "Images/celebrationperso2.png";
    }, 5000);
    setTimeout(() => {
        perso1.className = "laserDamageP1";
    }, 1120);
    setTimeout(() => {
        perso1.style.display = "none";
    }, 2220);
    setTimeout(() => {
        perso1.className = "";
        laserP2.style.right = 23 + "%";
        whiteScreen.style.display = "none";
        auraP1.style.display = "none";
    }, 5000);
}
