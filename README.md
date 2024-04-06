Quick guide to run server:
1. Install node.js 18 version.
2. Install this repository
3. Open project in Visual studio code or Webstorm.
4. Open terminal. Binds: Visual studio - CTRL + `; Webstorm - CTRL + F12
5. Write ```npm install``` in console
6. Write ```node compiled/server.js```

Quick guilde to run master server in localhost:
1. Install node.js 18 version.
2. Install https://github.com/Askile/nostarve-master repository
3. Open project in Visual studio code or Webstorm.
4. Open terminal. Binds: Visual studio - CTRL + `; Webstorm - CTRL + F12
5. Write ```npm install``` in console
6. Write ```node app.js```

Quick guide to run in production mode:
1. Install Filezilla and Termius.
3. Buy domain.
4. Buy 2x servers (choose linux ubuntu 20+ version as OS).
5. Connect servers to cloudflare.
6. Change config in JSON folder. Set production to true. Put ur domain and subdomain.
5. Open Filezilla and Termius.
6. (Filezilla) Connect to server with SFTP protocol.
7. (Filezilla) Create folder.
8. (Filezilla) Send all files to folder.
9. (Termius) Join to host.
10. (Termius) Install nodejs to host:
- ```curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh``` 
 - ```sudo bash /tmp/nodesource_setup.sh```
 - ```sudo apt install nodejs```
11. (Termius) Install screen to host:
 - ```sudo apt update```
 - ```sudo apt install screen```
12. (Termius) Start screen session:
 - ```screen``` (Note: if u rejoin to host u need write "screen -r" to return session)
13. (Termius) Press escape.
14. (Termius) Start server:
 - ```node compiled/server.js```
15.  Follow the steps from 6 to 14 with another host.
16.  (Termius) Start master:
 - ```node app.js```
17. Play.