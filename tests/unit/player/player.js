var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var xdescribe = function() {

};

// Remove the "x" here to run the tests
xdescribe('Player Model', function() {
  // Create player object before each test
  beforeEach(function() {
    var player = new PlayerCharacter();
  });
  // Check for a level up method
  it('should be able to level up', function() {
    expect(player.levelUp).to.be.a('function');
  });
  // TODO
  it('should have a size', function() {
    var size = player.size;
    expect(size).to.exist;
    expect(size).to.be.a('object');
  });
  // TODO
  it('should be able to increase in size', function() {

  });
  // TODO
  it('should be able to decrease in size', function() {

  });
  // TODO
  it('should have a way to move', function() {
    expect(player.move).to.be.a('function');
  });
  // TODO
  it('should be able to move horizontally', function() {

  });
  // TODO
  it('should be able to move vertically', function() {

  });
  // TODO
  it('should be able to die', function() {
    var state = player.state;
    expect(state).to.equal('lost');
  });
  // TODO
  it('should have a score', function() {
    var score = player.score;
    expect(score).to.exist;
    expect(score).to.be.a('number');
  });
});
