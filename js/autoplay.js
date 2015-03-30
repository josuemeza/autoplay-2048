var autoplay = null;

function Autoplay() {
    return {
    	// Attributes
    	lastGameState: null,
    	movementsCounter: 0,
    	movements: {
    		UP: 38,
    		DOWN: 40,
    		LEFT: 37,
    		RIGHT: 39
    	},
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
    	// Methods
        selectMovement: function() {
        	var gameState = $.parseJSON(localStorage.gameState);
        	var vertical = 3, horizontal = 3;
        	var verticalTest = 2, horizontalTest = 2;
        	while(true) {
        		// Set pivot
    			var downCell = gameState.grid.cells[horizontal][vertical];
    			var downValue = downCell != null ? downCell.value : null;
    			if(downCell == null) {
    				vertical--;
    				if(vertical > 1) {
    					verticalTest = vertical - 1;
    					continue;
    				}
    				return this.movements.RIGHT;
    			} else {
    				// Down cell was defined. Search up cell.
    				var upCell = gameState.grid.cells[horizontal][verticalTest];
    				var upValue = upCell != null ? upCell.value : null;
    				if(upCell == null) {
    					verticalTest--;
    					if(verticalTest >= 0) continue;
    					return this.movements.RIGHT;
    				}
    				// Up cell was defined. Test in vertical for down movements
    				if(upValue == downValue) return this.movements.DOWN;
    				else return this.movements.RIGHT;
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
        	console.log(this.movementsCounter++);
    		var movement = this.selectMovement();
    		this.triggerKeyevent(movement);
    		var gameState = $.parseJSON(localStorage.gameState);
    		if(this.isEqualState(this.lastGameState, gameState)) return;
    		console.log('son distintos');
    		this.lastGameState = gameState;
    		setTimeout(function() { autoplay.run(); }, 500);
        }
    }
}

$(document).ready(function() {

	$('.autoplay-button').click(function() {
		autoplay = new Autoplay();
		autoplay.run();
	});

});