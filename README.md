oauth-sample
============

This is a sample project of oauth with [everyauth] (https://github.com/bnoguchi/everyauth).

Install
-------

    $ npm install

Configuration
-------------

This project uses [node-config] (https://github.com/lorenwest/node-config).
So, create configuration file.

+ make directory

    $ mkdir config

+ Edit the default configuration file (.js, .json, or .yaml):

    $ touch config/default.json
    $ vi config/default.json
    
    {
      "server" : {
        "host" : "localhost", // server host
        "port" : 9002,        // server port
        "database" : {
          "host" : "localhost",           // mongoose server host
          "dbname" : "everyAuth-sample"   // mongoose database name
        }
      },
      "everyauth" : {
        "facebook" : {
          "appId" : "xxx",
          "appSecret" : "xxx"
        },
        "github" : {
          "appId" : "xxx",
          "appSecret" : "xxx"
        },
        "twitter" : {
          "consumerKey" : "xxx",
          "consumerSecret" : "xxx"
        }
      }
    }

+ Start your application server:

    $ export NODE_ENV=production
    $ node app.js

Test
----

TODO