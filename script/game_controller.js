// (make sure this is the LAST .js file to load)
// VARIABLES
// ...
//
// ............ Game Controller ............
function gameController(state){
  //
  var gameState = state;
  //
  switch (gameState) {
    case 'create board':
    //
    initBoard();
      break;
    case 'board is ready':
    //
    initPlayerSelect();
      break;
    case 'players are ready':
    //
    displayInstructions();
      break;
    case 'one player is ready':
    //
    displayInstructions();
      break;
    case 'instructions have been read':
    //
    deployUnits();
      break;
    case 'units deployed':
    //
    showAndActivateGameUI();
      break;
    case 'select unit for card':
    //
    useCard();
      break;
    case '':
    //
      break;
    //
    default:
    alert('DEFAULT hit in gameController! WTF');
    // gameController();
  }
}
//
//
$(document).ready(function(){

  gameController('create board');

})
//
$( document ).on( "mousemove", function( event ) {
  $( "#log" ).text( "pageX: " + event.pageX + ", pageY: " + event.pageY );
});
