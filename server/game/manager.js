//----------------------------------------------------------------------------------------------------------------------
// The manager for all game instances.
//
// @module manager.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

var Game = require('./game');
var errors = require('../errors');

//----------------------------------------------------------------------------------------------------------------------

// The list of games
var games = {};

// Tracking of our paused timeouts
var timeouts = {};

//----------------------------------------------------------------------------------------------------------------------
// Internal API
//----------------------------------------------------------------------------------------------------------------------

function deleteGame(gameID)
{
    //TODO: Need to make sure that game objects get correctly cleaned up, and we don't leak them.
    delete games[gameID];
} // end deleteGame

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Lists the current games.
 *
 * @returns {Promise} Returns a promise resolved to a list of the current games.
 */
function listGames()
{
    return Promise.resolve(_.values(games));
} // end listGames

/**
 * Creates a new game.
 *
 * @param {string} name - The name of the game (for display purposes only.)
 * @param {PlayerClient} creator - The client that created this game.
 * @returns {Promise} Returns a promise resolved with an instance of the new game.
 */
function newGame(name, creator)
{
    var game = new Game(name, creator);
    games[game.id] = game;

    return Promise.resolve(game);
} // end newGame

/**
 * Adds the player to a specific game. Handles the case where the player was already a spectator, but has decided to
 * join the game.
 *
 * @param {string} gameID - The ID of the game the player is joining.
 * @param {PlayerClient} player - The player joining the game.
 * @returns {Promise} Returns a Promise resolved to the game joined.
 */
function joinGame(gameID, player)
{
    var game = games[gameID];
    if(game)
    {
        var spectatorPromise = Promise.resolve();

        // Check to make sure that our player isn't already a spectator of the game. If it is, then we need to leave as
        // a spectator, and re-join as a player.
        if(_.find(game.spectators, { id: player.id }))
        {
            spectatorPromise = this.spectatorLeaveGame(game.id, player);
        } // end if

        return spectatorPromise
            .then(function()
            {
                return game.join(player)
                    .then(function()
                    {
                        // Check to see if we've got a dead game timeout running that we can clear
                        if((gameID in timeouts) && game.enoughPlayers)
                        {
                            clearTimeout(timeouts[gameID]);
                        } // end if

                        // Return the game object
                        return game;
                    });
            });
    }
    else
    {
        return Promise.reject(new Error("Game '" + gameID + "' not found."));
    } // end if
} // end joinGame

/**
 * Removes the player from a specific game. Attempts to detect if it's a spectator or a player.
 *
 * @param {string} gameID - The ID of the game the player is leaving.
 * @param {PlayerClient} player - The player leaving the game.
 * @returns {Promise} Returns a Promise that is resolved if the player left the game successfully.
 */
function leaveGame(gameID, player)
{
    var game = games[gameID];

    if(game)
    {
        // Check to see if we're a spectator, and if so, leave the spectators list.
        if(_.find(game.spectators, { id: player.id }))
        {
            return game.spectatorLeave(player);
        }
        else
        {
            // Assume we're a player attempting to leave.
            return game.leave(player)
                .then(function()
                {
                    if(game.humanPlayers.length == 0)
                    {
                        deleteGame(gameID);
                    }
                    else if(game.state == 'paused')
                    {
                        timeouts[gameID] = setTimeout(function()
                        {
                            // Being paranoid, and checking that we're still in the correct state
                            if(game.state == 'paused')
                            {
                                deleteGame(gameID);
                            } // end if
                        }, 43200000);
                    } // end if
                });
        } // end if
    }
    else
    {
        return Promise.reject(new Error("Game '" + gameID + "' not found."));
    } // end if
} // end leaveGame

/**
 * Adds the spectator to a specific game.
 *
 * @param {string} gameID - The ID of the game the spectator is joining.
 * @param {PlayerClient} spectator - The spectator joining the game.
 * @returns {Promise} Returns a Promise resolved to the game joined.
 */
function spectatorJoinGame(gameID, spectator)
{
    var game = games[gameID];
    if(game)
    {
        return game.spectatorJoin(spectator)
            .then(function()
            {
                // Return the game object
                return game;
            });
    }
    else
    {
        return Promise.reject(new Error("Game '" + gameID + "' not found."));
    } // end if
} // end spectatorJoinGame

/**
 * Removes the spectator from a specific game.
 *
 * @param {string} gameID - The ID of the game the spectator is leaving.
 * @param {PlayerClient} spectator - The spectator leaving the game.
 * @returns {Promise} Returns a Promise that is resolved if the spectator left the game successfully.
 */
function spectatorLeaveGame(gameID, spectator)
{
    if(gameID in games)
    {
        return games[gameID].spectatorLeave(spectator);
    }
    else
    {
        return Promise.reject(new Error("Game '" + gameID + "' not found."));
    } // end if
} // end spectatorLeaveGame

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    listGames: listGames,
    newGame: newGame,
    joinGame: joinGame,
    leaveGame: leaveGame,
    spectatorJoinGame: spectatorJoinGame,
    spectatorLeaveGame: spectatorLeaveGame
}; // end exports

//----------------------------------------------------------------------------------------------------------------------