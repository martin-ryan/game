//
// VARIABLES
//
// SQUADS
game.squad1 = {};
game.squad2 = {};
//
// SQUAD 1
game.squad1.unit1 = {};
game.squad1.unit2 = {};
game.squad1.unit3 = {};
game.squad1.unit4 = {};
//
// SQUAD 2
game.squad2.unit1 = {};
game.squad2.unit2 = {};
game.squad2.unit3 = {};
game.squad2.unit4 = {};
//
// ............ Tile Constructor ............
function unit(squad, unit, name, src, playerNum){
  //
  // VARIABLES
  var self = this;
  this.squad = squad;
  this.unit = unit;
  this.playerNum = playerNum;
  this.name = name;
  this.src = src;
  this.container = null;
  this.tag = null;
  this.col = null;
  this.row = null;
  this.statsContainer = null;
  this.statsArr = [];
  //
  // METHODS
  this.initialize = function(col, row){
    this.col = col;
    this.row = row;
    this.statsContainer = $('<div>');
    this.statsContainer.prop('class', 'stats');
    this.statsContainer.text(this.statsArr);
    this.container = $('<div>');
    this.container.prop('id', this.name);
    this.container.prop("class","unit");
    this.tag = $('<img>');
    this.tag.prop('src', this.src);
    this.container.append(this.tag);
    this.container.append(this.statsContainer);
    game.board.container.append(this.container);

    //place/deploy in initial position
    var newCol = game.tile._width * col;
    var newRow = game.tile._height * row + game.tile.initOffset;
    //
    self.container.css('left', newCol);
    self.container.css('top', newRow);
    self.container.css('position', 'absolute');
  };
  //
  this.moveTo = function(newCol, newRow){
    //
    self.container.css('left', newCol);
    self.container.css('top', newRow);
    self.container.css('position', 'absolute');
  }
  this.makeSelectableForAction = function(slot){
    // At this point I have the card selected and unit selected.
    //
    $("#" + this.name).click(function(){
      player.selectedUnit = self;
      self.hasAction(slot);
    });
  }
  this.hasAction = function(slot){
    // set 'action available' text display to selected card
    player.currentHand.splice(slot, 1);
    $('#currentHand .actionCard:eq(' + slot + ')').css("display","none");
    switch (player.selectedCard){
      case "move":
      //
      player.unitMovesLeft = 5;
      $("#selectedActionDisplay p").text(this.name + " move 6 spaces.");
      initMoveUnitButtons();
        break;
      case "attack":
      //
      attackEnemyUnit();
      $("#selectedActionDisplay p").text(this.name + " attack enemy unit!");
        break;
      case "stun":
      //
      throwStun();
      $("#selectedActionDisplay p").text(this.name + " throw Stun Grenade!");
        break;
      case "smoke":
      //
      throwSmoke();
      $("#selectedActionDisplay p").text(this.name + " throw Smoke Grenade!");
        break;
    }
    $("#currentHand .actionCard").off();
  };
}
//
function deployUnits(deployComplete){
// display units to deploy : quantity, name, color
// display valid placement locations
// change color of tile once unit is placed
// for now AUTO DEPLOY and POST MESSAGE
  if (deployComplete == 'closed') {
    gameController('units deployed');
    return
  }
  // might want to add a time delay if the units are deployed before message opens
  autoPlaceUnits("squad1");
  autoPlaceUnits("squad2");
  ui.overlay.messageSystem('alert', 'AUTO DEPLOYING UNITS AND SHUFFLING DECK', false, 200, 1300, deployUnits);
  //gameController('units deployed');
}
//
function initUnits(playerNum, squad){
  //
  switch (squad) {
    case "squad1":
    //
    game.squad1.unit1 = new unit("squad1", "unit1", 'squad1NameOne','img/tileBlue_p1.png', playerNum);
    game.squad1.unit2 = new unit("squad1", "unit2", 'squad1NameTwo','img/tileYellow_p1.png', playerNum);
    game.squad1.unit3 = new unit("squad1", "unit3", 'squad1NameThree','img/tileRed_p1.png', playerNum);
    game.squad1.unit4 = new unit("squad1", "unit4", 'squad1NameFour','img/tileGreen_p1.png', playerNum);
      break;
    case "squad2":
    //
    game.squad2.unit1 = new unit("squad2", "unit1", 'squad2NameOne','img/tileBlue_p2.png', playerNum);
    game.squad2.unit2 = new unit("squad2", "unit2", 'squad2NameTwo','img/tileYellow_p2.png', playerNum);
    game.squad2.unit3 = new unit("squad2", "unit3", 'squad2NameThree','img/tileRed_p2.png', playerNum);
    game.squad2.unit4 = new unit("squad2", "unit4", 'squad2NameFour','img/tileGreen_p2.png', playerNum);
      break;
  }
}

function autoPlaceUnits(squad){
  //
  switch (squad) {
    case "squad1":
    //
    game.squad1.unit1.initialize(1,4);
    game.squad1.unit2.initialize(2,3);
    game.squad1.unit3.initialize(3,2);
    game.squad1.unit4.initialize(4,1);
      break;
    case "squad2":
    //
    game.squad2.unit1.initialize(10,10);
    game.squad2.unit2.initialize(11,9);
    game.squad2.unit3.initialize(12,8);
    game.squad2.unit4.initialize(13,7);
      break;
  }
  // gameController('units deployed');
}

function makeUnitsSelectable(slot){
  game.squad1.unit1.makeSelectableForAction(slot);
  game.squad1.unit2.makeSelectableForAction(slot);
  game.squad1.unit3.makeSelectableForAction(slot);
  game.squad1.unit4.makeSelectableForAction(slot);
}

function unitsTurnOffClick(){
  console.log("turn off unit clicks");
  $("#squad1NameOne").unbind("click");
  $("#squad1NameTwo").unbind("click");
  $("#squad1NameThree").unbind("click");
  $("#squad1NameFour").unbind("click");
}
