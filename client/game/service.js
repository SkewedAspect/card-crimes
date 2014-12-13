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
        },
        get currentGame() {
            return this._currentGame;
        },
        set currentGame(val) {
            this._currentGame = val;

            // If we are setting a game object, it's time to do some work to it.
            if(this._currentGame)
            {
                console.log('game state:', this._currentGame.state);
                this._currentGame.submittedResponses = this._currentGame.submittedResponses || [];
                this._currentGame.players = this._currentGame.players || [];
                this._currentGame.spectators = this._currentGame.spectators || [];

                if(!this._currentGame.humanPlayers)
                {
                    Object.defineProperty(this._currentGame, 'humanPlayers', {
                        get: function()
                        {
                            return _.filter(this.players, function(player)
                            {
                                return player.type != 'bot';
                            });
                        }
                    });
                } // end if
            } // end if
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
    }; // end setCurrentGame

    GameService.prototype.hasSubmitted = function(playerID)
    {
        return (this.currentGame && _.find(this.currentGame.submittedResponses, { player: playerID }));
    }; // end hasSubmitted

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
        var self = this;
        return socket.emit('start game')
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    // Now, since we are a player, we must immediately draw cards.
                    self.drawCards(10);
                }
                else
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
                if(!payload.confirm)
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

                    // Merge the payload's game object into our own, to ensure we're up to date.
                    _.merge(self.currentGame, payload.game);

                    if(self.currentGame.state != 'initial')
                    {
                        console.log('getting cards!');

                        // Now, since we are a player, we must immediately draw cards.
                        return self.drawCards(10);
                    } // end if
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
                    // Remove ourselves from either spectators and/or players
                    _.remove(self.currentGame.players, { id: client.id });
                    _.remove(self.currentGame.spectators, { id: client.id });

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

    GameService.prototype.drawCards = function(numCards)
    {
        numCards = numCards || 1;

        var cardPromises = [];
        _.each(_.range(numCards), function()
        {
            cardPromises.push(socket.emit('draw card')
                .then(function(payload)
                {
                    if(payload.confirm)
                    {
                        return payload.card;
                    }
                    else
                    {
                        var error = new Error("Failed to draw card.");
                        error.inner = payload.message;

                        throw error;
                    } // end if
                }));
        });

        return Promise.all(cardPromises)
            .then(function(cards)
            {
                console.log('cards!', cards);
                client.responses = cards;
            });
    }; // end drawCards

    GameService.prototype.submitResponse = function(cards)
    {
        var self = this;
        console.log('submitting cards...');
        socket.emit('submit cards', cards)
            .then(function(payload)
            {
                console.log('response!', payload);
                if(payload.confirm)
                {
                    self.currentGame.submittedResponses[payload.response] = { player: client.id };
                }
                else
                {
                    var error = new Error("Failed to submit cards.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end submitResponse

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    // Players

    GameService.prototype.handlePlayerJoined = function(payload)
    {
        this.currentGame.players.push(payload.player);

        // If we haven't started yet, check to see if we have enough players, and start the game.
        if(this.currentGame.state == 'initial' && this.currentGame.humanPlayers.length >= 2)
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
        console.log('game started!!', client.responses);

        this.currentGame.state = 'started';

        if(!client.responses || client.responses.length == 0)
        {
            console.log('drawing cards');

            // Now, since we are a player, we must immediately draw cards.
            this.drawCards(10);
        } // end if
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
        console.log('response submitted:', payload);
        this.currentGame.submittedResponses[payload.response] = { player: payload.player };
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