var everyauth = require('everyauth'),
    config = require('config'),
    conf = config.everyauth;

//
// because the messeage "everyauth is not defined" thrown in views 
// when use "everyauth", hack the following by extracting the 
// following code from everyauth.middleware function:
//
exports.preEveryauthMiddlewareHack = function preEveryauthMiddlewareHack() {
    return function (req, res, next) {
      var sess = req.session
        , auth = sess.auth
        , ea = { loggedIn: !!(auth && auth.loggedIn) };

      // Copy the session.auth properties over
      for (var k in auth) {
        ea[k] = auth[k];
      }

      if (everyauth.enabled.password) {
        // Add in access to loginFormFieldName() + passwordFormFieldName()
        ea.password || (ea.password = {});
        ea.password.loginFormFieldName = everyauth.password.loginFormFieldName();
        ea.password.passwordFormFieldName = everyauth.password.passwordFormFieldName();
      }

      res.locals.everyauth = ea;

      next();
    };
};

exports.postEveryauthMiddlewareHack = function postEveryauthMiddlewareHack() {
  var userAlias = everyauth.expressHelperUserAlias || 'user';
  return function( req, res, next) {
    res.locals.everyauth.user = req.user;
    res.locals[userAlias] = req.user;
    next();
  };
};

//
// configure everyauth
//
everyauth.everymodule
  .handleLogout(function(req, res) {
    delete req.session.userId;
    req.logout();
    this.redirect(res, this.logoutRedirectPath());
  })
  .moduleErrback(function(err) {
    console.log(err);
  });

everyauth.facebook
  .appId(conf.facebook.appId)
  .appSecret(conf.facebook.appSecret)
  .findOrCreateUser(
    function (session, accessToken, accessTokExtra, userMetadata) {
      var promise = this.Promise();
      User.findOne({ userId: userMetadata.id }, function(err, user) {
        if(err) {
          promise.fail(err);
        }
        if(user) {
          user.lastlogin = new Date();
        } else {
          user = new User();
          user.name = userMetadata.name;
          user.email = userMetadata.email;
          user.userId = 'facebook' + userMetadata.id;
        }
        user.save(function(err) {
          if(err) {
            console.log(err);
            promise.fail(err);
          }
        });
        session.userId = user.userId;
        promise.fulfill(user.userId);
      });
      return promise;
    })
  .redirectPath('/');

everyauth.github
  .appId(conf.github.appId)
  .appSecret(conf.github.appSecret)
  .findOrCreateUser(
    function (session, accessToken, accessTokExtra, userMetadata) {
      var promise = this.Promise();
      User.findOne({ userId: userMetadata.id }, function(err, user) {
        if(err) {
          promise.fail(err);
        }
        if(user) {
          user.lastlogin = new Date();
        } else {
          user = new User();
          user.name = userMetadata.login;
          user.email = userMetadata.email;
          user.userId = 'github' + userMetadata.id;
        }
        user.save(function(err) {
          if(err) {
            console.log(err);
            promise.fail(err);
          }
        });
        session.userId = user.userId;
        promise.fulfill(user.userId);
      });
      return promise;
    })
  .redirectPath('/');

everyauth.twitter
  .consumerKey(conf.twitter.consumerKey)
  .consumerSecret(conf.twitter.consumerSecret)
  .findOrCreateUser(
    function (session, accessToken, accessTokExtra, userMetadata) {
      var promise = this.Promise();
      User.findOne({ userId: userMetadata.id }, function(err, user) {
        if(err) {
          promise.fail(err);
        }
        if(user) {
          user.lastlogin = new Date();
        } else {
          user = new User();
          user.name = userMetadata.name;
          user.email = userMetadata.email;
          user.userId = 'twitter' + userMetadata.id;
        }
        user.save(function(err) {
          if(err) {
            console.log(err);
            promise.fail(err);
          }
        });
        session.userId = user.userId;
        promise.fulfill(user.userId);
      });
      return promise;
    })
  .redirectPath('/');
exports.middleware = everyauth.middleware;