var xdescribe = function() {

};

// Remove the "x" here to run the tests
xdescribe('Enemy Model', function() {
  var enemy, 
      player;

  // Create player object before each test
  beforeEach(function() {
    enemy = new Enemy();
    //player = new Player();
  });

  it('should create a new enemy instance', function(){
    expect(enemy).to.be.an('object');
  });

  it('should increment enemy counter', function(){
    expect(game.enemyCounter).to.equal(2);
  })

  it('should initialize enemy properties with default values', function(){
    expect(enemy).to.have.property('size');
    expect(enemy).to.have.property('xCoord');
    expect(enemy).to.have.property('yCoord');
    expect(enemy).to.have.property('zCoord');
  });

  // TODO - how is movement handled? Does everything on the far end plane move towards the player? 
  it('should move towards the player', function() {

  });

  // TODO
  it('should be able to collide with the player', function() {
    // if enemy.coordinates w/in range of player.coordinates --> collision
  });

  // TODO
  it('should terminate if it crosses the plane without colliding with the player', function() {
    // if enemy.zCoord === player.zCoord --> expect(enemy).to.not.equal('object')
  });

  // TODO
  it('should spawn more frequently the longer the player lives', function() {
    // can we test this
  });
});
