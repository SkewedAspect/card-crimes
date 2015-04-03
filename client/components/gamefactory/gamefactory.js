// ---------------------------------------------------------------------------------------------------------------------
// GameFactory
//
// @module gamefactory.js
// ---------------------------------------------------------------------------------------------------------------------

function GameFactory(socketSvc)
{
    function Game(gameState)
    {
        this.gameState = gameState;

        this._bindEventHandlers();
    } // end GameFactory

    Game.prototype = {
        get id(){ return this.gameState.id },
        get name(){ return this.gameState.name },
        get state(){ return this.gameState.state },
        get decks(){ return this.gameState.decks },
        get created(){ return this.gameState.created },
        get players(){ return this.gameState.players },
        get maxPlayers(){ return this.gameState.maxPlayers },
        get submittedResponses(){ return this.gameState.submittedResponses }
    }; // end prototype

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    Game.prototype._bindEventHandlers = function()
    {
        socketSvc.on('player joined', this._handlePlayerJoined.bind(this));
    }; // end _bindEventHandlers

    Game.prototype._handlePlayerJoined = function(session)
    {
        console.log('player joined:', session);
        this.gameState.players[session.client.id] = session;
    }; // end _handle PlayerJoined

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    Game.prototype.hasSubmitted = function(playerID)
    {
        return !!_.find(this.gameState.submittedResponses, { player: playerID });
    }; // end hasSubmitted

    Game.prototype.join = function()
    {
        console.log('joining game!!!');
        socketSvc.emit('join game', this.id);
    }; // end join

    return Game;
} // end GameFactoryFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').factory('GameFactory', [
    'SocketService',
    GameFactory
]);

// ---------------------------------------------------------------------------------------------------------------------