Script Fighter : The Word Warrior 

Version Ultimate Final 1.0 november, 15th, 2021
Credits : Original graphism and music  by : Sandy WEBERT
	  Animations and code by : Philippe HEARD and Damien DIDRICH (aka Skunkoff)

This game can be play online (recommended) or locally.

1. HOW TO PLAY WITHOUT AN INTERNET CONNECTION (ADVANCED INFORMATIC OR RECKLESS USER !)

This game use an API online which chek intop a 411000 words in French and ****** words in English on lists, 
it's easier to play online.
But you can play locally by following these instructions :

- You have to install the latest LTS (Long Time Supported) version of nodeJS here -> https://nodejs.org/en/
- Open Powershell or the command line tool of windows and go to the game directory on your device
- Execute this command to install a local server : npm init -y 
- Execute these following commands : npm install express, npm install cors, npm install nodemon, npm install  fs
- Open the file "script.js" and replace line 170 and 171 by the following code :

170 // const res = await fetch("http://cemotexistetil.lyliya.fr:8888/exist?word=" + word); //Notre api=> http://localhost:3000/exist?word=   http://cemotexistetil.lyliya.fr:8888/exist?word=
171 const res = await fetch("http://localhost:3000/exist?word=" + word);

(Original code)
170 const res = await fetch("http://cemotexistetil.lyliya.fr:8888/exist?word=" + word); //Notre api=> http://localhost:3000/exist?word=   http://cemotexistetil.lyliya.fr:8888/exist?word=
171 // const res = await fetch("http://localhost:3000/exist?word=" + word);

- Return to the command console and lauch the local server by using : npm start
If you get the message "Server started: 3000", 
you can lauch the game by executing index.html with your favorite browse ! 

ENJOY !