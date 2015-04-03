var autoplay = null;

function Autoplay() {
    return {
    	// Attributes
    	lastGameState: null,
    	movementsCounter: 0,
        rescueMoves: 0,
    	movements: {
    		UP: 38,
    		DOWN: 40,
    		LEFT: 37,
    		RIGHT: 39,
            STOP: null
    	},
        // Methods
    	isEqualState: function(gameState1, gameState2) {
    		if(gameState1 == null || gameState2 == null) return false;
    		var cells1 = gameState1.grid.cells;
    		var cells2 = gameState2.grid.cells;
    		for(var i=0; i<4; i++) {
    			for(var j=0; j<4; j++) {
    				if(cells1[i][j] != null && cells2[i][j] != null) {
    					if(cells1[i][j].value != cells2[i][j].value) 
    						return false;
    				} else if((cells1[i][j] == null && cells2[i][j] != null) || (cells1[i][j] != null && cells2[i][j] == null)) {
    					return false;
    				}
    			}
    		}
    		return true;
    	},
        selectMovement: function() {
            // Actual game state
        	var gameState = $.parseJSON(localStorage.gameState);

            // Rescue move
            if(this.isEqualState(this.lastGameState, gameState)) {
                this.rescueMoves++;
                if(this.rescueMoves > 4) return this.movements.STOP;
                return this.movements.UP;
            }
            this.rescueMoves = 0;

            // Safe moves
        	var vertical = 3, horizontal = 3;
        	var verticalTest = 2, horizontalTest = 2;
            while(true) {
                var lastColumn = gameState.grid.cells[horizontal];
                if(lastColumn[0]==null && lastColumn[1]==null && lastColumn[2]==null && lastColumn[3]==null) {
                    return this.movements.RIGHT;
                } else if(lastColumn[3]==null) {
                    return this.movements.DOWN;
                } else {
                    var downIndex = 3, upIndex = 2;
                    while(downIndex>0 && upIndex>=0) {
                        if(lastColumn[upIndex] == null) {
                            upIndex--;
                        } else if(lastColumn[downIndex].value == lastColumn[upIndex].value) {
                            return this.movements.DOWN;
                        } else {
                            downIndex = upIndex;
                            upIndex--;
                        }
                    }
                    return this.movements.RIGHT;
                }

            }
        },
        triggerKeyevent: function(keyCode) {
            var eventObject = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
            if(eventObject.initEvent) eventObject.initEvent('keydown', true, true); // for createEvent method
            eventObject.keyCode = keyCode;
            eventObject.which = keyCode;
            document.body.dispatchEvent ? document.body.dispatchEvent(eventObject) : document.body.fireEvent('onkeydown', eventObject); // for old browsers
        },
        run: function() {
        	console.log('Cantidad de movimientos: ' + this.movementsCounter++);
            var movement = this.selectMovement();
            if(movement == this.movements.STOP) return;
            this.lastGameState = $.parseJSON(localStorage.gameState);
            this.triggerKeyevent(movement);
            setTimeout(function() { autoplay.run(); }, 200);
        }
    }
}

$(document).ready(function() {

	$('.autoplay-button').click(function() {
		if(autoplay == null) autoplay = new Autoplay();
		autoplay.run();
	});

});