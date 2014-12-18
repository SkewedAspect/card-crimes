// ---------------------------------------------------------------------------------------------------------------------
// GameService
//
// @module game-service.js
// ---------------------------------------------------------------------------------------------------------------------

function GameServiceFactory(Promise, $interval, $location, $rootScope, _, socket, client)
{
    function GameService()
    {
        var self = this;
        this.games = [];
        this.events = [];

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

            // Process any waiting events
            this._processEvents();
        } // end set currentGame
    }; // end prototype

    GameService.prototype._bindEventHandlers = function()
    {
        // Players
        socket.on('player joined', this._buildEventHandler(this.handlePlayerJoined));
        socket.on('player left', this._buildEventHandler(this.handlePlayerLeft));
        socket.on('spectator joined', this._buildEventHandler(this.handleSpectatorJoined));
        socket.on('spectator left', this._buildEventHandler(this.handleSpectatorLeft));

        // Game
        socket.on('game renamed', this._buildEventHandler(this.handleGameRenamed));
        socket.on('game started', this._buildEventHandler(this.handleGameStarted));
        socket.on('game paused', this._buildEventHandler(this.handleGamePaused));
        socket.on('game unpaused', this._buildEventHandler(this.handleGameUnpaused));
        socket.on('game rejoined', this._buildEventHandler(this.handleGameRejoined));

        // Round
        socket.on('next round', this._buildEventHandler(this.handleNextRound));
        socket.on('response submitted', this._buildEventHandler(this.handleResponseSubmitted));
        socket.on('all responses submitted', this._buildEventHandler(this.handleAllResponsesSubmitted));
        socket.on('dismissed response', this._buildEventHandler(this.handleDismissedResponse));
        socket.on('selected response', this._buildEventHandler(this.handleSelectedResponse));
    }; // end _bindEventHandlers

    GameService.prototype._buildEventHandler = function(callback)
    {
        return function()
        {
            if(this.currentGame)
            {
                callback.apply(this, arguments)
            }
            else if(!this.leaving)
            {
                this.events.push({ callback: callback, args: arguments });
            } // end if
        }.bind(this);
    }; // end _buildEventHandler

    GameService.prototype._processEvents = function()
    {
        var self = this;
        _.each(this.events, function(event)
        {
            event.callback.apply(self, event.args);
        });

        // Clear the events
        this.events = [];
    }; // end _processEvents

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
                if(!_.isArray(client.responses))
                {
                    client.responses = [];
                } // end if

                client.responses = client.responses.concat(cards);
            });
    }; // end drawCards

    GameService.prototype.submitResponse = function(cards)
    {
        var self = this;
        console.log('submitting cards...');
        return socket.emit('submit cards', cards)
            .then(function(payload)
            {
                console.log('response!', payload);
                if(payload.confirm)
                {
                    self.currentGame.submittedResponses = payload.responses;
                }
                else
                {
                    var error = new Error("Failed to submit cards.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end submitResponse

    GameService.prototype.dismissResponse = function(responseID)
    {
        console.log('dismissing response...');
        var self = this;
        return socket.emit('dismiss response', responseID)
            .then(function(payload)
            {
                if(payload.confirm)
                {
                    // Remove the submitted response that was dismissed
                    delete self.currentGame.submittedResponses[responseID];
                }
                else
                {
                    var error = new Error("Failed to dismiss card.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end dismissResponse

    GameService.prototype.selectResponse = function(responseID)
    {
        console.log('selecting response...');
        var self = this;
        return socket.emit('select response', responseID)
            .then(function(payload)
            {
                if(!payload.confirm)
                {
                    var error = new Error("Failed to select card.");
                    error.inner = payload.message;

                    throw error;
                } // end if
            });
    }; // end selectResponse

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
        this.currentGame.state = 'started';

        if(!client.responses || client.responses.length == 0)
        {
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
        this.currentGame.state = 'payload.state';
    }; // end handleGameUnpaused

    GameService.prototype.handleGameRejoined = function(payload)
    {
        var self = this;

        // Check for a joinGame promise
        var rejoinPromise = new Promise(function(resolve) { resolve(); });
        if(client.joinGamePromise)
        {
            rejoinPromise = client.joinGamePromise;
        }
        else
        {
            // If we don't already have a joinGamePromise, then we set one.
            client.joinGamePromise = rejoinPromise;
        } // end if

        rejoinPromise.then(function()
        {
            // Joining a game implicitly sets our current game.
            self.setCurrentGame(payload.game.id);

            // Merge the payload's game object into our own, to ensure we're up to date.
            _.merge(self.currentGame, payload.game);

            // Check to see if we need to draw cards
            var cardsPromise = new Promise(function(resolve) { resolve(); });
            if(self.currentGame.state != 'initial' && !(client.responses && client.responses.length > 0))
            {
                // Now, since we are a player, we must immediately draw cards.
                cardsPromise = self.drawCards(10);
            } // end if

            // Once we've drawn cards, if we need to, reload our url.
            cardsPromise
                .then(function()
                {
                    $location.path('/game/' + payload.game.id);
                });
        });
    }; // end handleGameRejoined

    // Round

    GameService.prototype.handleNextRound = function(payload)
    {
        this.currentGame.currentJudge = { id: payload.judge };
        this.currentGame.currentCall = payload.call;
        this.currentGame.state = 'waiting';
    }; // end handleNextRound

    GameService.prototype.handleResponseSubmitted = function(payload)
    {
        this.currentGame.submittedResponses = payload.responses;
    }; // end handleResponseSubmitted

    GameService.prototype.handleAllResponsesSubmitted = function(payload)
    {
        console.log('all responses submitted!!!!');

        this.currentGame.state = 'judging';

        // If we're the judge, then we pay attention to the payload.
        if(client.id == this.currentGame.currentJudge.id)
        {
            this.currentGame.submittedResponses = payload.responses;
        } // end if
    }; // end handleAllResponsesSubmitted

    GameService.prototype.handleDismissedResponse = function(payload)
    {
        _.remove(this.currentGame.submittedResponses, { id: payload.player });
    }; // end handleDismissedResponse

    GameService.prototype.handleSelectedResponse = function(payload)
    {
        console.log('handleSelectedResponse', payload);

        //this.currentGame.state = 'waiting';

        var player = _.find(this.currentGame.players, { id: payload.response.player.id });
        player.score = payload.response.player.score;

        // Fire off an event to tell all players that the round is over
        $rootScope.$broadcast('round over', payload.response);
    }; // end handleSelectedResponse

    return new GameService();
} // end GameServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('GameService', [
    '$q',
    '$interval',
    '$location',
    '$rootScope',
    'lodash',
    'SocketService',
    'ClientService',
    GameServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------