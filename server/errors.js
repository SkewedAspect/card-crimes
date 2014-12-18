//----------------------------------------------------------------------------------------------------------------------
// Custom errors
//
// @module error.js
//----------------------------------------------------------------------------------------------------------------------

var util = require('util');

//----------------------------------------------------------------------------------------------------------------------

function NotImplementedError(api)
{
    Error.call(this);
    this.message = api + " not implemented.";
} // end NotImplementedError

util.inherits(NotImplementedError, Error);

//----------------------------------------------------------------------------------------------------------------------

function InvalidStateError(state, action)
{
    Error.call(this);
    this.state = state;
    this.action = action;

    if(action)
    {
        this.message = "Cannot perform '" + action + "' action while in state '" + state + "'.";
    }
    else
    {
        this.message = "Cannot perform action while in state '" + state + "'.";
    } // end if
} // end InvalidStateError

util.inherits(InvalidStateError, Error);

//----------------------------------------------------------------------------------------------------------------------

function AlreadyPlayerError(game)
{
    Error.call(this);
    this.game = game;
    this.message = "Already a player in game '" + this.game.id + "'.";
} // end AlreadyPlayerError

util.inherits(AlreadyPlayerError, Error);

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    NotImplemented: NotImplementedError,
    InvalidState: InvalidStateError,
    AlreadyPlayer: AlreadyPlayerError
}; // end exports

//----------------------------------------------------------------------------------------------------------------------