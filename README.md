football-sim
============

Fun, Simple, Football Game using HTML5 + JS +j Query, with Jasmine (BDD) unit tests/specs.

[Play the game live here](http://htmlpreview.github.com/?https://github.com/bmantoni/football-sim/blob/master/game.html)

[View the Jasmine test Resuls here](http://htmlpreview.github.com/?https://github.com/bmantoni/football-sim/blob/master/test/SpecRunner.html)

Main game logic and types encapsulated in in the `Football` *namespace*, see the `GameEngine`.
UI logic contained in a separate file, using the *module pattern*.

For now things are simple, just click Play repeatedly.  The game never ends!
The ball icon shows where on the field the ball is, the colored bars the yardage gained/lost on each play.
