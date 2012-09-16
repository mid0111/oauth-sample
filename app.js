var express = require('express'),
  mongoose = require('mongoose'),
  config = require('config'),
  everyauthWrapper = require('./lib/everyauthWrapper'),
  models = require('./lib/models'),
  conf = config.server,
  db;

// create server object
app = express();

//configure server instance
app.configure(function(){
  app.set('port', conf.port);
  app.set('host', conf.host);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 

  app.set('connstring', 'mongodb://' + conf.database.host + '/' + conf.database.dbname);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false, pretty: false});
  app.use(express.bodyParser());
  app.use(express.cookieParser('secret', 'secret-here'));
  app.use(express.session({secret: 'secret-here'}));
  app.use(express.methodOverride());
  app.use(everyauthWrapper.preEveryauthMiddlewareHack());
  app.use(everyauthWrapper.middleware());
  app.use(everyauthWrapper.postEveryauthMiddlewareHack());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

//configure mongoose models
models.defineModels(mongoose, function() {
  app.User = User = mongoose.model('User');
  app.Project = Project = mongoose.model('Project');
  db = mongoose.connect(app.set('connstring'));
});

// require routes
require('./routes/user');

if (!module.parent) {
  app.listen(app.set('port'));
  console.log("Server listening on port %d", app.set('port'));
}