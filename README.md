soundbank-overdrive
===

A simple audio distortion effect based on wave shaping with automatable filter and gain controls.

Based on Nick Thompson's [Overdrive](https://github.com/nick-thompson/wa-overdrive), but modified to allow direct [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam) manipulation allowing easy automation and modulation.

## Install

```bash
$ npm install soundbank-overdrive
```

## API

```js
var Overdrive = require('soundbank-overdrive')
```

### Overdrive(audioContext)

Create a [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) processor instance.

### node.gain ([AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam))

This goes up to 11 (and beyond)!

### node.preBand (AudioParam)

Wet/dry amount of preband filtering.

### node.color (AudioParam)

Preband filter frequency cutoff.

### postCut (AudioParam)

Post filter frequency cutoff

## Example

```
var Overdrive = require('soundbank-overdrive')

var audioContext = new AudioContext()

var overdrive = Overdrive(audioContext)
overdrive.connect(audioContext.destination)

overdrive.gain.value = 20
overdrive.preBand.value = 5000
overdrive.postCut.value = 600

var player = audioContext.createBufferSource()
player.buffer = audioContext.sampleCache['duh.wav']
player.connect(overdrive)
player.start()
```
