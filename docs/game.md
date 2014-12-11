# The Game

The game is relatively simple, but we need to outline the rules and how the `Game` object is supposed to interact with
the clients. (This could be represented as a state machine, however most state machine libraries add significant code
complexity.)

## Definitions

* **Call** - What CAH normally calls a 'black card'.
* **Response** - What CAH normally calls a 'white card'.

## Game States

### Initial

* Name: `'initial'`

When the game is initially created, it starts in the `'initial'` state. While in this state, the creator may add or
remove decks, name/rename the game, add/remove random players, or start the game. Other players may join, or leave.

Once the game is started, we go to `'new round'`.

### New Round

* Name: `'new round'`

When we enter this state, a judge is selected (next in player order), and a _call_ is drawn.

The game now transitions to the `'waiting'` state.

### Waiting for Responses

* Name: `'waiting'`

The game waits until either all players have left the game, or all players have  submitted responses. If a players
leaves at this point, their response(if any) is removed, and a check to see if we have  the current number of responses
submitted. (The same check is done as players submit responses.)

If there are the required number of responses, we move to the `'judging'` phase.

### Judging Responses

* Name: `'judging'`

The game waits until a response is chosen. During this time the judge can either dismiss a response they don't like, or
select the winning response.

Once a winning response has been selected, a point is assigned to that player, and we go to the `'new round'` state.

### Game Paused

* Name: `'paused'`

During any state except `'initial'`, if we don't have at least 3 players (random players included), the game transitions
to the `'paused'` state. This doesn't mean the game is over, simply that there aren't enough people to play. Once
enough people join, the game will transition back to the `'new round'` state.

If the game is in the paused state for 12 hours, or all non random players disconnect, all players are removed, and the
game is deleted.

## Game events

These are the messages that are sent to the clients, and in what state they are sent.

### `player joined`

#### Payload:

```javascript
{
    player: { ... } // Serialized `Client` object.
}
```

This is sent whenever a player joins the game.

### `player left`

#### Payload:

```javascript
{
    player: "..." // Client ID of the player who left.
}
```

This is sent whenever a player leaves the game.

### `spectator joined`

#### Payload:

```javascript
{
    spectator: { ... } // Serialized `Client` object.
}
```

This is sent whenever a spectator joins the game.

### `spectator left`

#### Payload:

```javascript
{
    spectator: "..." // Client ID of the spectator who left.
}
```

This is sent whenever a spectator leaves the game.

### `game renamed`

#### Payload:

```javascript
{
    name: "..." // The new name of the game.
}
```

Fired whenever the name of the game is changed.

### `game started`

#### Payload:

No payload.

Fired when the game starts.

### `next round`

#### Payload:

```javascript
{
    judge: "...",   // The Client ID of the player who is now the new judge.
    call: {...}     // The serialized Card object representing the current call.
}
```

This is fired whenever the next round has started. It contains who the next judge is, as well as what the current call
is.

### `response submitted`

#### Payload:

```javascript
{
    player: "..."   // The Client ID of the player who just submitted a response.
}
```

This is fired when a player submits a response.

### `all responses submitted`

#### Payload:

No payload.

This indicates that all outstanding responses are in, and the judging will begin.

### `dismissed response`

#### Payload:

```javascript
{
    response: "...",    // The ID of the response that has been dismissed.
    player: "..."       // The Client ID of the player whose response has been dismissed.
}
```

This event is fired when the judge dismisses a card. This does not inherently select a card, but rather indicated that
the judge no longer wants to consider this card.

### `selected response`

#### Payload:

```javascript
{
    response: "...",    // The ID of the response that has been selected.
    player: "..."       // The Client ID of the player whose response has been selected.
}
```

This event is fired when the judge selects a card. The player gets a point, and a new round is started.

### `game paused`

#### Payload:

No payload.

Indicates that the game has been paused.

### `game unpaused`

#### Payload:

```javascript
    state: "..."    // The state we resume in.
```

Indicates that the game is no longer paused.
