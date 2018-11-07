**To get started on the application:**

1) npm i
2) run: nodemon app 
    on the login directory

To get started on the front end:

1) cd into src (mile-money\login\src)
2) npm i
3) run: npm start

Webpack compiles scss and js. Does not live reload the html. 

To output bundle.css and bundle.js files, run the command 'npm run build' on the directory mile-money\login\src


**Webhooks**

In order to get the webhooks working in a different enviornment, the callback url will need to be replaced. Search for ngrok to find and replace.

In the existing dev environment, the application will work only when ./ngrok http 3000 is run int eh terminal at the login directory.

The ./ngrok file will need to be placed in this directory for both mac and windows.

**Deploying to Heroku / Working in dev environment**

Heroku has all of the environment variables stored within it. The only thing that needs updating for deploying to Heroku is the Strava callback url.

IF in Dev this callback line will be:
callbackURL: `http://127.0.0.1:${PORT_NUMBER_LISTEN}/auth/strava/callback`

If deploying to production then the callback line will be:

callbackURL: `https://milemoney.io/auth/strava/callback`


**Deploy Commands**

login to Heroku on CL: $ heroku login 
(use details from LastPass)

Run the below command. Note that Prod is the active branch:
$ git push heroku Prod:master
