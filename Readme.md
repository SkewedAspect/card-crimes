# Card Crimes

* Live Version: [card-crimes.com](http://card-crimes.com)

Card Crimes is an online version of games like Apples to Apples, or Cards Against Humanity. It is designed to be able to
be used from either a mobile device, or a laptop. Our goal is to be the best online version of this type of card party
game.

## Features

### Random AI Player

We support random AI players! This means you can play with 'Rando Cardrissian' to your heart's content. (You can even
name your random AI players, and have more than one!)

### Spectators

We do, in fact, support spectators! Just browse for a game, and instead of clicking 'Join', click 'Spectate'. Playing
with a group of friends at a party, and want to put it on the TV? Spectate mode is perfect for that! Wanna live stream
you games? Use Spectate mode!

### Chromecast support

We **do not** have plans support Chromecast. Why? Because someone beat us to it! Check out
[Cardcast](http://www.cardcastgame.com/). They have an amazing UI, and they deserve your support! Go check them out! Do
it now!

## Android / iOS App

We **do not** have plans for a native app. This is intended to be a web app, only. Currently, we feel that having our
own app could be stepping on the toes of similar applications, and [Cardcast](http://www.cardcastgame.com/)
specifically. That being said, if you would like to add a shortcut, here's instructions for
[Android](https://developer.chrome.com/multidevice/android/installtohomescreen) or
[iOS](http://en.kioskea.net/faq/37255-ios-8-pin-a-website-to-the-home-screen).

### Custom Cards

_All_ of our card decks are provided by [Cardcast](http://www.cardcastgame.com/). If you want to use your own decks,
just make an account over there, and import it into their system.

Keep in mind, the [Cardcast](http://www.cardcastgame.com/) devs have graciously allowed the use of their API. They don't
have to do this. Please, be respectful and give them some love. (I recommend downloading their app, and then paying to
remove the adds.)

### Local Server

Because our client and server are entirely self-contained, you can trivially run a local instance of Card Crimes, just
in case our servers ever get overloaded, or because you might not have internet access. To do so:

1. Install [node.js](http://nodejs.org/).
2. Checkout the source code.
3. From inside the project directory, run `npm install`.
4. Once that finishes, run `npm start`.
5. Go to the url printed out in the console.

That's it!

## Status

Currently, the game it completely playable. We are not very happy with the UI at the moment (it's more a proof of concept than a production ready design), but the core of everything's there. Feel free to check it out at [card-crimes.com](http://card-crimes.com).

## Contributing

We'd love to have more people contribute! Just fork the project and submit a pull request. If you're fixing an issue,
please reference it in the pull request description.
