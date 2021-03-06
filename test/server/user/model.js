'use strict';

require('../../../lib/init_db');
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var user;

describe('User Model', function() {
  before(function(done) {
    this.timeout(5000);
    require('../../../lib/config/dummydata')(function() {
      user = new User({
        provider: 'local',
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password',
        status: '0'
      });
      // Clear users before testing
      User.remove().exec(done);
    });
  });

  afterEach(function(done) {
    User.remove().exec(done);
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    user.authenticate('blah').should.not.be.true;
  });

});
