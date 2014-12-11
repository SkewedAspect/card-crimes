// ---------------------------------------------------------------------------------------------------------------------
// GameService
//
// @module game.js
// ---------------------------------------------------------------------------------------------------------------------

function GameServiceFactory($interval, _, socket, client)
{
    function GameService()
    {
        var self = this;
        this.games = [];

        // Get an initial list of games
        this.listGames();

        // Schedule a games list refresh ever two minutes
        $interval(function()
        {
            self.listGames();
        }, 120000);

        // Bind events
        this._bindEventHandlers();
    } // end GameService

    // -----------------------------------------------------------------------------------------------------------------

    GameService.prototype = {
        get recentGames()
        {
            return _.first(_.sortBy(this.games, 'created').reverse(), 5);
        }
    }; // end prototype

    GameService.prototype._bindEventHandlers = function()
    {
        // Players
        socket.on('player joined', this.handlePlayerJoined.bind(this));
        socket.on('player left', this.handlePlayerLeft.bind(this));
        socket.on('spectator joined', this.handleSpectatorJoined.bind(this));
        socket.on('spectator left', this.handleSpectatorLeft.bind(this));

        // Game
        socket.on('game renamed', this.handleGameRenamed.bind(this));
        socket.on('game started', this.handleGameStarted.bind(this));
        socket.on('game paused', this.handleGamePaused.bind(this));
        socket.on('game unpaused', this.handleGameUnpaused.bind(this));

        // Round
        socket.on('next round', this.handleNextRound.bind(this));
        socket.on('response submitted', this.handleResponseSubmitted.bind(this));
        socket.on('all responses submitted', this.handleAllResponsesSubmitted.bind(this));
        socket.on('dismissed response', this.handleDismissedResponse.bind(this));
        socket.on('selected response', this.handleSelectedResponse.bind(this));
    }; // end _bindEventHandlers

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    GameService.prototype.setCurrentGame = function(gameID)
    {
        this.currentGame = _.find(this.games, { id: gameID });
        console.log('game state:', this.currentGame.state);
    }; // end setCurrentGame

    GameService.prototype.listGames = function()
    {
        var self = this;
        return socket.emit('list games')
            .then(function(payload)
            {
                self.games = payload.games;
                return payload.games;
            });
    }; // end listGames

    GameService.prototype.createGame = function(name)
    {
        var self = this;
        return socket.emit('new game', name)
            .then(function(payload)
            {
                self.currentGame = payload.game;
                self.games.push(self.currentGame);
            });
    }; // end createGame

    GameService.prototype.addDeck = function(deck)
    {
        var self = this;
        this.currentGame.decks = this.currentGame.decks || {};
        this.currentGame.decks[deck.code] = deck;

        return socket.emit('add deck', deck.code)
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    if(self.currentGame.decks[deck.code])
                    {
                        self.currentGame.decks[deck.code] = payload.deck;
                    } // end if
                }
                else
                {
                    var error = new Error("Failed to add deck.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end addDeck

    GameService.prototype.removeDeck = function(deck)
    {
        delete this.currentGame.decks[deck.code];

        return socket.emit('remove deck', deck.code)
            .then(function(payload)
            {
                if(!payload.confirm)
                {
                    var error = new Error("Failed to remove deck.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end addDeck

    GameService.prototype.startGame = function()
    {
        return socket.emit('start game')
            .then(function(payload)
            {
                if(!payload.confirm)
                {
                    console.error('Failed to start game:', payload.message);

                    var error = new Error("Failed to start game.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end startGame

    GameService.prototype.addBot = function(name)
    {
        var self = this;
        return socket.emit('add bot', name)
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    self.currentGame.players.push(payload.bot);
                }
                else
                {
                    var error = new Error("Failed to remove bot.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end addBot

    GameService.prototype.removeBot = function(id)
    {
        var self = this;
        return socket.emit('remove bot', id)
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    _.remove(self.currentGame.players, { id: id });
                }
                else
                {
                    var error = new Error("Failed to remove bot.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end removeBot

    GameService.prototype.joinGame = function(isPlayer, gameID)
    {
        var self = this;

        if(arguments.length == 1)
        {
            gameID = isPlayer;
            isPlayer = false;
        } // end if

        return socket.emit('join game', isPlayer, gameID)
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    // Joining a game implicitly sets our current game.
                    self.setCurrentGame(gameID);

                    // Figure out which list of players to modify
                    var players;
                    if(isPlayer)
                    {
                        if(!self.currentGame.players)
                        {
                            self.currentGame.players = [];
                        } // end if

                        players = self.currentGame.players;
                    }
                    else
                    {
                        if(!self.currentGame.spectators)
                        {
                            self.currentGame.spectators = [];
                        } // end if

                        players = self.currentGame.spectators;
                    } // end if


                    client.initializedPromise
                        .then(function()
                        {
                            console.log('before:', self.currentGame.players, self.currentGame.spectators);

                            // Add our client to the game's players
                            players.push({ id: client.id, name: client.name });

                            console.log('after:', self.currentGame.players, self.currentGame.spectators);
                        });
                }
                else
                {
                    var error = new Error("Failed to join game.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end joinGame

    GameService.prototype.leaveGame = function(gameID)
    {
        var self = this;

        return socket.emit('leave game', gameID)
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    console.log('before:', self.currentGame.players, self.currentGame.spectators);

                    // Remove ourselves from either spectators and/or players
                    _.remove(self.currentGame.players, { id: client.id });
                    _.remove(self.currentGame.spectators, { id: client.id });

                    console.log('after:', self.currentGame.players, self.currentGame.spectators);

                    // Joining a game implicitly clears our current game.
                    self.currentGame = undefined;
                }
                else
                {
                    var error = new Error("Failed to leave game.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end leaveGame

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    // Players

    GameService.prototype.handlePlayerJoined = function(payload)
    {
        this.currentGame.players.push(payload.player);

        // If we haven't started yet, check to see if we have enough players, and start the game.
        if(this.currentGame.state == 'initial' && this.currentGame.players.length >= 2)
        {
            console.log('attempting to start the game!');
            this.startGame();
        } // end if
    }; // end handlePlayerJoined

    GameService.prototype.handlePlayerLeft = function(payload)
    {
        _.remove(this.currentGame.players, { id: payload.player });
    }; // end handlePlayerLeft

    GameService.prototype.handleSpectatorJoined = function(payload)
    {
        this.currentGame.spectators.push(payload.spectator);
    }; // end handleSpectatorJoined

    GameService.prototype.handleSpectatorLeft = function(payload)
    {
        _.remove(this.currentGame.spectators, { id: payload.spectator });
    }; // end handleSpectatorLeft

    // Game

    GameService.prototype.handleGameRenamed = function(payload)
    {
        this.currentGame.name = payload.name;
    }; // end handleGameRenamed

    GameService.prototype.handleGameStarted = function()
    {
        console.log('game started!!');
        this.currentGame.state = 'started';
    }; // end handleGameStarted

    GameService.prototype.handleGamePaused = function()
    {
        console.log('game paused!!');
        this.currentGame.state = 'paused';
    }; // end handleGamePaused

    GameService.prototype.handleGameUnpaused = function(payload)
    {
        console.log('game unpaused!!');
        this.currentGame.state = payload.state;
    }; // end handleGameUnpaused

    // Round

    GameService.prototype.handleNextRound = function(payload)
    {
        this.currentGame.judge = payload.judge;
        this.currentGame.currentCall = payload.call;
        this.currentGame.state = 'waiting';
        console.log('game state:', 'waiting');
    }; // end handleNextRound

    GameService.prototype.handleResponseSubmitted = function(payload)
    {
        this.currentGame.submittedResponses = this.currentGame.submittedResponses || [];
        this.currentGame.submittedResponses.push(payload.player);
    }; // end handleResponseSubmitted

    GameService.prototype.handleAllResponsesSubmitted = function()
    {
        this.currentGame.state = 'judging';
        console.log('game state:', 'judging');
    }; // end handleAllResponsesSubmitted

    GameService.prototype.handleDismissedResponse = function(payload)
    {
        _.remove(this.currentGame.submittedResponses, { id: payload.player });
    }; // end handleDismissedResponse

    GameService.prototype.handleSelectedResponse = function(payload)
    {
        console.log('handleSelectedResponse', payload);
    }; // end handleSelectedResponse

    return new GameService();
} // end GameServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('GameService', [
    '$interval',
    'lodash',
    'SocketService',
    'ClientService',
    GameServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------