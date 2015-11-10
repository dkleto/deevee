DeeVee
==========

[![Build Status](https://travis-ci.org/dkleto/deevee.svg?branch=master)](https://travis-ci.org/dkleto/deevee)

DeeVee is a web-based delta-V calculator for Kerbal Space Program. You can try it out [here](https://dkleto.github.io/deevee/app/).

To put it [simply](https://xkcd.com/1133/): DeeVee is a web page that lets you choose bits from Kerbal Space Program to build a flying space car. Pick the bits that you want to use and it will tell you if you will go to space today.

## Using DeeVee

DeeVee is a pretty simple application. If you're familiar with both Kerbal and the concept of delta-V, you should be able to figure it out. Add parts to a stage and the total mass of your craft will increase. If you add an engine to a stage, you'll notice that the thrust to weight ratio will increase and the impulse will change for that stage. As per the [rocket equation](https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation), a conventional rocket stage has to change in mass to provide any dV, so you'll need to include both an engine and a fuel tank of some sort to see dV increase.

There's also an atmosphere check-box for each stage. Rocket engines differ in efficiency and thrust output depending on the atmosphere that they're operating in. Kerbal accounts for this difference, and the actual output of engines will vary as they move through different atmospheric pressures. DeeVee uses either the maximum (vacuum) or minimum (atmospheric) values for engine output depending on whether the atmosphere option is checked. This allows you to account for atmosphere in the first stage of a rocket, but ignore it for the final orbital stage. This is a bit of a simplification, but it works fine for imaginary rockets.

DeeVee doesn't enforce any rules on how you place your parts, so you can design rockets which would be impossible in the actual game. It also doesn't differentiate between different types of fuel - monopropellant and xenon tanks are both included in the calculations - so there is some potential for strange results if you were to do something like combine an ion drive with an ordinary rocket engine in the same stage. I wouldn't know though - I haven't unlocked the ion drive because my game progress stalled when I stopped playing and started doing math with javascript instead.

## Why not use a KSP plugin?

There are of course a number of KSP plugins you could use ([Kerbal engineer](http://forum.kerbalspaceprogram.com/threads/18230-1-0-4-Kerbal-Engineer-Redux-v1-0-18-0), for example) which would accomplish the same thing in a much more comprehensive way from within KSP itself.

To me, the idea of using a plugin felt a bit like cheating, but I was still getting tired of manually tapping the Tsiolkovksy equation into a scientific calculator. Obviously the solution to this problem was to write my own calculator, because then it wouldn't be cheating, it would be *automating*. I wrote it as a single-page Angular JS application, because I'd been looking for an excuse to mess with Angular for a while.

## Mobile

DeeVee was is designed to be generally responsive-ish and mobile friendly. I've tested it on my increasingly aged and weathered Galaxy S2, and it seemed OK.

## Disclaimer

The terms "Kerbal", "Space", and possibly "Program" belong to other people. I am not in any way associated with KSP or Squad (Beyond having devoted $30 of my money and numerous hours of my finite lifespan to their fantasy astronaut game).
