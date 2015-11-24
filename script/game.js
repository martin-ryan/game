//
// VARIABLES

//
// VARIABLES
// notes: hypotenus distance is 29.963px (isometric) which is 53.656px y and 13.4px x
game.tile.moveDist_x = 53.656;
game.tile.moveDist_y = 26.837;
game.tile.initOffset = game.tile.moveDist_y / 2;
game.wrapper = null;
game.tile._width = null;
game.tile._height = null;
game.board._width = 1153.6;
game.board._height = 577;

//
// ............ Create Board ............
function initBoard(){
  //
  game.wrapper = $('#gameWrapper');
  game.board.container = $('<div>');
  game.board.container.prop('id','board');
  var gridSepsHorizontal = 21.5;
  var gridSepsVertical = 21.5;
  game.tile._width = game.board._width / gridSepsHorizontal;
  game.tile._height = game.board._height / gridSepsVertical;

  // set board background
  boardBkgdSrc = 'img/board.png';

  // put board together
  game.board.container.css('background-image', 'url(' + boardBkgdSrc + ')');
  game.wrapper.prepend(game.board.container);

  //
  // create Actions deck
  createActionsDeck();
  //
  // next step
  gameController('board is ready');

}
//
// create Actions deck
function createActionsDeck(){
  game.deck.actions = [];
  game.deck.cards_attack = 20;
  game.deck.cards_move = 20;
  game.deck.cards_stun = 8;
  game.deck.cards_smoke = 8;
  for (var i = 0; i < game.deck.cards_attack; i++){
    game.deck.actions.push('attack');
  };
  for (var i = 0; i < game.deck.cards_move; i++){
    game.deck.actions.push('move')
  };
  for (var i = 0; i < game.deck.cards_stun; i++){
    game.deck.actions.push('stun');
  };
  for (var i = 0; i < game.deck.cards_smoke; i++){
    game.deck.actions.push('smoke');
  };
  shuffleActionsDeck();
}

function shuffleActionsDeck(){
  var deck = game.deck.actions;
  var shuffles = 4;
  for (var i = 0; i < (deck.length * shuffles); i++){
    if (deck[i] != null){
      var random = parseInt(Math.random() * deck.length);
      var temp_random = deck[random];
      var temp_i = deck[i];
      deck[i] = temp_random;
      deck[random] = temp_i;
    }
  }
  renderActionsDeck();
}

function renderActionsDeck(){
  var deck = game.deck.actions;
  ui.deck.actions.cards = [];
  //
  for (var i = 0; i < deck.length; i++){
    var cardContainer = $('<div>');
    ui.deck.actions.cards[i] = cardContainer;
    ui.deck.actions.cards[i].prop('id','card' + i);
    ui.deck.actions.cards[i].prop('class','actionCard');
    ui.deck.actions.cards[i].text(deck[i]);
    ui.deck.actions.container.append(ui.deck.actions.cards[i]);
  }
}
