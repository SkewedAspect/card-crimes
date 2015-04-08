// ---------------------------------------------------------------------------------------------------------------------
// GameFactory
//
// @module gamefactory.js
// ---------------------------------------------------------------------------------------------------------------------

function GameFactory(socketSvc, clientSvc)
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
        // States
        socketSvc.on('paused', this._handleStateChange.bind(this, 'paused'));
        socketSvc.on('new round', this._handleStateChange.bind(this, 'new round'));
        socketSvc.on('waiting', this._handleStateChange.bind(this, 'waiting'));
        socketSvc.on('judging', this._handleStateChange.bind(this, 'judging'));

        socketSvc.on('player joined', this._handlePlayerJoined.bind(this));
    }; // end _bindEventHandlers

    Game.prototype._handleStateChange = function(state)
    {
        console.log('state changed:', state);
        this.gameState.state = state;
    }; // end _handleStateChange

    Game.prototype._handlePlayerJoined = function(session)
    {
        console.log('player joined:', session);
        this.gameState.players[session.client.id] = session;
    }; // end _handlePlayerJoined

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    Game.prototype.isPlayer = function()
    {
        return !!this.gameState.players[clientSvc.id];
    }; // end isPlayer

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
    'ClientService',
    GameFactory
]);

// ---------------------------------------------------------------------------------------------------------------------