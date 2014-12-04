//----------------------------------------------------------------------------------------------------------------------
// Custom errors
//
// @module error.js
//----------------------------------------------------------------------------------------------------------------------

function NotImplementedError(api)
{
    this.name = "NotImplementedError";
    this.message = api + " not implemented.";
} // end NotImplementedError
InvalidStateError.prototype = new Error();

//----------------------------------------------------------------------------------------------------------------------

function InvalidStateError(state, action)
{
    this.name = "InvalidStateError";
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
InvalidStateError.prototype = new Error();

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    NotImplementedError: NotImplementedError,
    InvalidStateError: InvalidStateError
}; // end exports

//----------------------------------------------------------------------------------------------------------------------