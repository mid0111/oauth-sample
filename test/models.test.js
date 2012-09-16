var should = require('should'),
    mongoose = require('mongoose'),
    models = require('../models'),
    User,
    Project;

models.defineModels(mongoose, function() {
  User = mongoose.model('User');
  Project = mongoose.model('Project');
});

describe('UserModel', function() {
  describe('インスタンス生成', function() {
  it('指定した属性でインスタンスが作成されること', function() {
    var user = new User();
    // user.name.should.be.empty;
    // user.project.should.be.empty;
  });

    it('nameのみを指定し、指定した属性でインスタンスが生成されること', function() {
      var user = new User({ name : 'tajima' });
      user.name.should.be.equal('tajima');
      // user.project.should.be.empty;
    });

    it('nameとprojectを指定し、指定した属性でインスタンが生成されること', function() {
      var project = new Project({
        name : 'hoge',
        url  : 'http://piyo.com'
      });
      var user = new User({ name : 'tajima', project : project });
      user.name.should.be.equal('tajima');
      user.project.should.have.length(1);
      user.project[0].name.should.be.equal('hoge');
      user.project[0].url.should.be.equal('http://piyo.com');
    });

    it('nameと複数projectを指定し、指定した属性でインスタンが生成されること', function() {
      var projects = new Array();
      for(var i = 0 ; i < 3 ; i ++) {
        projects.push(new Project({
          name : 'hoge' + i,
          url  : 'http://piyo.com'
        }));
      }
      var user = new User({ name : 'tajima', project : projects });
      user.name.should.be.equal('tajima');
      user.project.should.have.length(3);
      for(var i = 0 ; i < 3 ; i ++) {
        user.project[i].name.should.be.equal('hoge' + i);
        user.project[i].url.should.be.equal('http://piyo.com');
      }
    });
  });
});
