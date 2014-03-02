soundbank-overdrive
===

A simple audio distortion effect based on wave shaping with automatable filter and gain controls.

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

var overdrive = Overdrive(audioContext)
overdrive.connect(audioContext.destination)

overdrive.gain.value = 20
overdrive.preBand.value = 5000
overdrive.postCut.value = 600

