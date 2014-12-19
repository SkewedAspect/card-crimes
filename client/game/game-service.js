// ---------------------------------------------------------------------------------------------------------------------
// GameService
//
// @module game-service.js
// ---------------------------------------------------------------------------------------------------------------------

function GameServiceFactory(Promise, $interval, $rootScope, _, socket, client)
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
        }
    }; // end prototype

    GameService.prototype._bindEventHandlers = function()
    {
        // Players
        socket.on('player joined', client.buildEventHandler(this.handlePlayerJoined));
        socket.on('player left', client.buildEventHandler(this.handlePlayerLeft));
        socket.on('spectator joined', client.buildEventHandler(this.handleSpectatorJoined));
        socket.on('spectator left', client.buildEventHandler(this.handleSpectatorLeft));

        // Game
        socket.on('game renamed', client.buildEventHandler(this.handleGameRenamed));
        socket.on('game started', client.buildEventHandler(this.handleGameStarted));
        socket.on('game paused', client.buildEventHandler(this.handleGamePaused));
        socket.on('game unpaused', client.buildEventHandler(this.handleGameUnpaused));

        // Round
        socket.on('next round', client.buildEventHandler(this.handleNextRound));
        socket.on('response submitted', client.buildEventHandler(this.handleResponseSubmitted));
        socket.on('all responses submitted', client.buildEventHandler(this.handleAllResponsesSubmitted));
        socket.on('dismissed response', client.buildEventHandler(this.handleDismissedResponse));
        socket.on('selected response', client.buildEventHandler(this.handleSelectedResponse));
    }; // end _bindEventHandlers

    // -----------------------------------------------------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------------------------------------------------

    GameService.prototype.setCurrentGame = function(gameID)
    {
        client.game = _.find(this.games, { id: gameID });
    }; // end setCurrentGame

    GameService.prototype.hasSubmitted = function(playerID)
    {
        return (client.game && _.find(client.game.submittedResponses, { player: playerID }));
    }; // end hasSubmitted

    GameService.prototype.listGames = function()
    {
        var self = this;
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('list games')
                    .then(function(payload)
                    {
                        self.games = payload.games;
                        return payload.games;
                    });
            });
    }; // end listGames

    GameService.prototype.createGame = function(name)
    {
        var self = this;
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('new game', name)
                    .then(function(payload)
                    {
                        client.game = payload.game;
                        self.games.push(client.game);
                    });
            });
    }; // end createGame

    GameService.prototype.addDeck = function(deck)
    {
        var self = this;
        client.game.decks = client.game.decks || {};
        client.game.decks[deck.code] = deck;

        return client.initializedPromise
            .then(function()
            {
                return socket.emit('add deck', deck.code)
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            if(client.game.decks[deck.code])
                            {
                                client.game.decks[deck.code] = payload.deck;
                            } // end if
                        }
                        else
                        {
                            var error = new Error("Failed to add deck.");
                            error.inner = payload.message;

                            console.error('Failed to add deck:', error);

                            throw error;
                        } // end if
                    });
            });
    }; // end addDeck

    GameService.prototype.removeDeck = function(deck)
    {
        delete client.game.decks[deck.code];

        return client.initializedPromise
            .then(function()
            {
                return socket.emit('remove deck', deck.code)
                    .then(function(payload)
                    {
                        if(!payload.confirm)
                        {
                            var error = new Error("Failed to remove deck.");
                            error.inner = payload.message;

                            console.error('Failed to remove deck:', error);

                            throw error;
                        } // end if
                    });
            });
    }; // end addDeck

    GameService.prototype.startGame = function()
    {
        var self = this;
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('start game')
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            // Make sure our client has an empty hand
                            client.responses = [];

                            // Now, since we are a player, we must immediately draw cards.
                            self.drawCards(10);
                        }
                        else
                        {
                            var error = new Error("Failed to start game.");
                            error.inner = payload.message;

                            console.error("Failed to start game:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end startGame

    GameService.prototype.addBot = function(name)
    {
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('add bot', name)
                    .then(function(payload)
                    {
                        if(!payload.confirm)
                        {
                            var error = new Error("Failed to add bot.");
                            error.inner = payload.message;

                            console.error("Failed to add bot:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end addBot

    GameService.prototype.removeBot = function(id)
    {
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('remove bot', id)
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            _.remove(client.game.players, { id: id });
                        }
                        else
                        {
                            var error = new Error("Failed to remove bot.");
                            error.inner = payload.message;

                            console.error("Failed to remove bot:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end removeBot

    GameService.prototype.joinGame = function(isPlayer, gameID)
    {
        if(arguments.length == 1)
        {
            gameID = isPlayer;
            isPlayer = false;
        } // end if

        var self = this;
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('join game', isPlayer, gameID)
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            // Joining a game implicitly sets our current game.
                            self.setCurrentGame(gameID);

                            // Merge the payload's game object into our own, to ensure we're up to date.
                            _.merge(client.game, payload.game);

                            if(client.game.state != 'initial')
                            {
                                // Now, since we are a player, we must immediately draw cards.
                                return self.drawCards(10);
                            } // end if
                        }
                        else
                        {
                            if(payload.reason == 'already-player')
                            {
                                console.warn('Already player...');
                            }
                            else
                            {
                                var error = new Error("Failed to join game.");
                                error.inner = payload.message;

                                console.error("Failed to join game:", error);

                                throw error;
                            } // end if
                        } // end if
                    });
            });
    }; // end joinGame

    GameService.prototype.leaveGame = function(gameID)
    {
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('leave game', gameID)
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            // Remove ourselves from either spectators and/or players
                            _.remove(client.game.players, { id: client.id });
                            _.remove(client.game.spectators, { id: client.id });

                            // Joining a game implicitly clears our current game.
                            client.game = undefined;
                        }
                        else
                        {
                            var error = new Error("Failed to leave game.");
                            error.inner = payload.message;

                            console.error("Failed to leave game:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end leaveGame

    GameService.prototype.drawCards = function(numCards)
    {
        numCards = numCards || 1;

        return client.initializedPromise
            .then(function()
            {
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

                                console.error("Failed to draw card:", error);

                                throw error;
                            } // end if
                        }));
                });

                return cardPromises;
            })
            .then(function(cardPromises)
            {
                return Promise.all(cardPromises)
                    .then(function(cards)
                    {
                        if(!_.isArray(client.responses))
                        {
                            client.responses = [];
                        } // end if

                        client.responses = client.responses.concat(cards);
                    });
            });
    }; // end drawCards

    GameService.prototype.submitResponse = function(cards)
    {
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('submit cards', cards)
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            client.game.submittedResponses = payload.responses;
                        }
                        else
                        {
                            var error = new Error("Failed to submit cards.");
                            error.inner = payload.message;

                            console.error("Failed to submit cards:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end submitResponse

    GameService.prototype.dismissResponse = function(responseID)
    {
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('dismiss response', responseID)
                    .then(function(payload)
                    {
                        if(payload.confirm)
                        {
                            // Remove the submitted response that was dismissed
                            delete client.game.submittedResponses[responseID];
                        }
                        else
                        {
                            var error = new Error("Failed to dismiss card.");
                            error.inner = payload.message;

                            console.error("Failed to dismiss card:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end dismissResponse

    GameService.prototype.selectResponse = function(responseID)
    {
        return client.initializedPromise
            .then(function()
            {
                return socket.emit('select response', responseID)
                    .then(function(payload)
                    {
                        if(!payload.confirm)
                        {
                            var error = new Error("Failed to select card.");
                            error.inner = payload.message;

                            console.error("Failed to select card:", error);

                            throw error;
                        } // end if
                    });
            });
    }; // end selectResponse

    // -----------------------------------------------------------------------------------------------------------------
    // Event Handlers
    // -----------------------------------------------------------------------------------------------------------------

    // Players

    GameService.prototype.handlePlayerJoined = function(payload)
    {
        client.game.players.push(payload.player);
    }; // end handlePlayerJoined

    GameService.prototype.handlePlayerLeft = function(payload)
    {
        _.remove(client.game.players, { id: payload.player });
    }; // end handlePlayerLeft

    GameService.prototype.handleSpectatorJoined = function(payload)
    {
        client.game.spectators.push(payload.spectator);
    }; // end handleSpectatorJoined

    GameService.prototype.handleSpectatorLeft = function(payload)
    {
        _.remove(client.game.spectators, { id: payload.spectator });
    }; // end handleSpectatorLeft

    // Game

    GameService.prototype.handleGameRenamed = function(payload)
    {
        client.game.name = payload.name;
    }; // end handleGameRenamed

    GameService.prototype.handleGameStarted = function()
    {
        client.game.state = 'started';

        if(!client.responses || client.responses.length == 0)
        {
            // Now, since we are a player, we must immediately draw cards.
            this.drawCards(10);
        } // end if
    }; // end handleGameStarted

    GameService.prototype.handleGamePaused = function()
    {
        console.log('game paused!!');
        client.game.state = 'paused';
    }; // end handleGamePaused

    GameService.prototype.handleGameUnpaused = function(payload)
    {
        console.log('game unpaused!!');
        client.game.state = 'payload.state';
    }; // end handleGameUnpaused

    // Round

    GameService.prototype.handleNextRound = function(payload)
    {
        client.game.currentJudge = { id: payload.judge };
        client.game.currentCall = payload.call;
        client.game.state = 'waiting';
        client.game.submittedResponses = [];
    }; // end handleNextRound

    GameService.prototype.handleResponseSubmitted = function(payload)
    {
        client.game.submittedResponses = payload.responses;
    }; // end handleResponseSubmitted

    GameService.prototype.handleAllResponsesSubmitted = function(payload)
    {
        console.log('all responses submitted!!!!');

        client.game.state = 'judging';

        // If we're the judge, then we pay attention to the payload.
        if(client.id == client.game.currentJudge.id)
        {
            client.game.submittedResponses = payload.responses;
        } // end if
    }; // end handleAllResponsesSubmitted

    GameService.prototype.handleDismissedResponse = function(payload)
    {
        _.remove(client.game.submittedResponses, { id: payload.player });
    }; // end handleDismissedResponse

    GameService.prototype.handleSelectedResponse = function(payload)
    {
        var player = _.find(client.game.players, { id: payload.response.player.id });
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
    '$rootScope',
    'lodash',
    'SocketService',
    'ClientService',
    GameServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------