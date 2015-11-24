//
// VARIABLES
ui.overlay = {};
ui.overlay.container = $('#overlayContainer');
ui.overlay.overlay_message = $('#overlay_message');
ui.overlay.overlay_instructions = $('#overlay_instructions');
ui.overlay.overlay_playerSelect = $('#overlay_playerSelect');
ui.overlay.alertBox = $('#messageAlert');
ui.overlay.alertBkgd = $('#alertBkgd');
ui.overlay.btn_yes = $('#btn_yes');
ui.overlay.btn_no = $('#btn_no');
ui.deck.actions.container = $('#actionsDeck');
player.actionCardsContainer = $('#currentHand');
player.numActionCardDraw = 5;
player.canDraw = true;
player.turn = 'player one';
player.turnInstructions = ['draw action cards','play action cards',''];
player.currentHand = [];
player.selectedCard = null;
player.selectedUnit;
player.unitMovesLeft;
player.one.ready = false;
player.two.ready = false;
player.selectedUnitCol = null;
player.selectedUnitRow = null;

//
ui.overlay.messageSystem = function(typeOfMessage, message, needYesOrNo, duration, delay, callbackFunction){
  //
  var answer = undefined;
  ui.overlay.alertBkgd.css('display','block');
  ui.overlay.overlay_message.css('display','block');
  // typeOfMessage: 'alert', ...
  switch (typeOfMessage) {
    case 'alert':
    //
    ui.overlay.alertBox.text(message);
    ui.overlay.alertBox.css('display','block');
    // DON'T need YES/NO buttons
    if (needYesOrNo == false) {
      ui.overlay.btn_yes.css('display','none');
      ui.overlay.btn_no.css('display','none');
      closeMessage(duration, delay, callbackFunction);
    } else  { // DO need YES/NO buttons
      ui.overlay.btn_yes.css('display','block');
      ui.overlay.btn_no.css('display','block');
      ui.overlay.btn_yes.click(function(){
        answer = true;
        closeMessage(duration,delay);
        if (callbackFunction != undefined || callbackFunction != null) {
          callbackFunction(answer);
        }
      });
      ui.overlay.btn_no.click(function(){
        answer = false;
        closeMessage(duration,delay);
        if (callbackFunction != undefined || callbackFunction != null) {
          callbackFunction(answer);
        }
      });
    }
      break;
    case '':
    //
      break;
    default:

  }
  // CALLBACK FOR ANSWER

};

function closeOverlay(duration, delay) {
  setTimeout(function(){ui.overlay.container.fadeOut(duration)},delay);
}

function closePlayerSelect(duration, delay) {
  setTimeout(function(){ui.overlay.overlay_playerSelect.fadeOut(duration)},delay);
}

function closeMessage(duration, delay, callbackFunction) {
  setTimeout(function(){
    ui.overlay.overlay_message.fadeOut(duration);
    if (callbackFunction != undefined || callbackFunction != null) {
      callbackFunction('closed');
    }
  },delay);
}

function initPlayerSelect(){
  //
  ui.overlay.btn_playerReady1 = $('#btn_playerReady1');
  ui.overlay.btn_playerReady2 = $('#btn_playerReady2');
  ui.overlay.playerSelect_p1 = $('#playerSelect1');
  ui.overlay.playerSelect_p2 = $('#playerSelect2');
  ui.overlay.btn_play = $('#btn_play');
  //
  ui.overlay.overlay_playerSelect.css('display','block')
  ui.overlay.btn_play.css('display','block');

  selectPlayer();
}

function selectPlayer(playAgainstAI){
      //
      // when user HITS PLAY, if there is 1 player pop up alert to ask if they want to play vs computer.
      // Alert callback to this function with True/False answer "playAgainstAI".
      if (playAgainstAI == true && player.one.ready == true) {
        // NEED TO INITIALIZE COMPUTER SQUAD (AI PLAYER 2)
        closePlayerSelect();
        gameController('players are ready');
      }
      if (playAgainstAI == true && player.two.ready == true){
        // NEED TO INITIALIZE COMPUTER SQUAD (AI PLAYER 1)
        closePlayerSelect();
        gameController('players are ready');
      }
  //
  // PLAYER ONE READY
  ui.overlay.playerSelect_p1.click(function(){
    //
    player.one.ready = true;
    initUnits("player1","squad1");
    ui.overlay.btn_playerReady1.css('background-color','green');

  });
  //
  // PLAYER TWO READY
  ui.overlay.playerSelect_p2.click(function(){
    //
    player.two.ready = true;
    initUnits("player2","squad2");
    ui.overlay.btn_playerReady2.css('background-color','green');
  });
  //
  // Either player hits PLAY
  ui.overlay.btn_play.click(function(){
    //
    if (player.one.ready && player.two.ready){
      // 2 PLAYER GAME
      closePlayerSelect();
      gameController('players are ready');
    } else if (player.one.ready || player.two.ready){
      // 1 PLAYER GAME
      ui.overlay.messageSystem('alert','WAITING FOR THE OTHER PLAYER! DO YOU WANT TO PLAY AGAINST AI?', true, 200, 0, selectPlayer);
    }
  });
}

function displayInstructions(){
  ui.overlay.overlay_instructions.css('display','block');
  ui.overlay.overlay_instructions.click(function(){
    ui.overlay.overlay_instructions.fadeOut("slow", function(){
      gameController('instructions have been read');
    });
  })
}

function showAndActivateGameUI(){
  $('.actionCard').css('display','block');
  $(".moveButton").css("display","block");
  ui.deck.actions.container.click(function(){
    drawActionCards(player.numActionCardDraw);
    $("#selectedActionDisplay p").text("Play a card.");
  });
}

function drawActionCards(num){
  // default num is 5
  if (player.canDraw == true){
    var deck = game.deck.actions;
    //
    if (0 == deck.length){
      creatActionsDeck();
    }
    //
    for (var i = 0; i < num; i++){
      moveCardFromDeckToHand(i);
    }
    player.canDraw = false;
  }
}

function moveCardFromDeckToHand(slot){
  var deck = game.deck.actions;
  var card = $('#actionsDeck div').filter(':last');
  // card.css('position','fixed');
  player.currentHand.push(deck.pop());
  // card.css('display','inline-block');
  card.appendTo(player.actionCardsContainer);
  $('#currentHand .actionCard').css('display','inline-block');
  $('#currentHand .actionCard').css('position','static');
  $('#currentHand .actionCard').css('color','white');
  $('#currentHand .actionCard:eq(' + slot + ')').click(function(){
    selectCard(slot);
  });
}

function selectCard(slot) {
  console.log("card selected in slot " + slot);
  $('#currentHand .actionCard').css('background-color','grey');
  $('#currentHand .actionCard:eq(' + slot + ')').css('background-color','red');

  player.selectedCard = player.currentHand[slot];
  makeUnitsSelectable(slot);
  $("#selectedActionDisplay p").text("Select unit to use: " + player.selectedCard);
}

function initMoveUnitButtons(){
  $("#moveRight").click(function(){
    if (player.unitMovesLeft == 0) {
      $("#moveRight").off();
      unitsTurnOffClick();
      nextCard();
    } else {
      thisUnit = $("#" + player.selectedUnit.name);
      thisUnit_left = thisUnit.position().left;
      thisUnit_top = thisUnit.position().top;
      thisUnit.css("left", thisUnit_left + 26.828);
      thisUnit.css("top", thisUnit_top  - 13.419);
      decMovesLeft();
      }
    });
  $("#moveLeft").click(function(){
    if (player.unitMovesLeft == 0) {
      $("#moveLeft").off();
      unitsTurnOffClick();
      nextCard();
    } else {
      thisUnit = $("#" + player.selectedUnit.name);
      thisUnit_left = thisUnit.position().left;
      thisUnit_top = thisUnit.position().top;
      thisUnit.css("left", thisUnit_left - 26.828);
      thisUnit.css("top", thisUnit_top  + 13.419);
      decMovesLeft();
    }
  });
  $("#moveUp").click(function(){
    if (player.unitMovesLeft == 0) {
      $("#moveUp").off();
      unitsTurnOffClick();
      nextCard();
    } else {
      thisUnit = $("#" + player.selectedUnit.name);
      thisUnit_left = thisUnit.position().left;
      thisUnit_top = thisUnit.position().top;
      thisUnit.css("left", thisUnit_left - 26.828);
      thisUnit.css("top", thisUnit_top  - 13.419);
      decMovesLeft();
    }
  });
  $("#moveDown").click(function(){
    if (player.unitMovesLeft == 0) {
      $("#moveDown").off();
      unitsTurnOffClick();
      nextCard();
    } else {
      thisUnit = $("#" + player.selectedUnit.name);
      thisUnit_left = thisUnit.position().left;
      thisUnit_top = thisUnit.position().top;
      thisUnit.css("left", thisUnit_left + 26.828);
      thisUnit.css("top", thisUnit_top  + 13.419);
      decMovesLeft();
    }
  });
}

function decMovesLeft(){
  $("#selectedActionDisplay p").text(player.selectedUnit.name + " Move " + player.unitMovesLeft + " spaces.");
  player.unitMovesLeft -= 1;
}

function nextCard(){
  $("#selectedActionDisplay p").text("Select a card.");
  $('#currentHand .actionCard:eq(0)').click(function(){
    selectCard(0);
  });
  $('#currentHand .actionCard:eq(1)').click(function(){
    selectCard(1);
  });
  $('#currentHand .actionCard:eq(2)').click(function(){
    selectCard(2);
  });
  $('#currentHand .actionCard:eq(3)').click(function(){
    selectCard(3);
  });
  // for some reason the below loop doesn't work...:(
  // for (var slot = 0; slot < player.currentHand.length; slot++) {
  //   $('#currentHand .actionCard:eq(' + slot + ')').click(function(){
  //     console.log(slot);
  //     selectCard(slot);
  //   });
  // }
}

function attackEnemyUnit(){
  console.log("attack");
}

function throwSmoke(){
  console.log("throw smoke");

}

function throwStun(){
  console.log("throw stun");

}
