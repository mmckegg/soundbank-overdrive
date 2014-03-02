var createAudioNode = require('custom-audio-node')
var extendTransform = require('audio-param-transform')

module.exports = Overdrive

function Overdrive(audioContext){

  var input = audioContext.createGain()
  var output = audioContext.createGain()

  var bpWet = audioContext.createGain()
  var bpDry = audioContext.createGain()
  var bandpass = audioContext.createBiquadFilter()
  var waveshaper = audioContext.createWaveShaper()
  var lowpass = audioContext.createBiquadFilter()

  input.connect(bpWet)
  input.connect(bpDry)

  bpWet.connect(bandpass)
  bpDry.connect(waveshaper)
  bandpass.connect(waveshaper)
  waveshaper.connect(lowpass)
  lowpass.connect(output)

  var node = createAudioNode(input, output, {
    preBand: {
      min: 0, max: 1, defaultValue: 0.5,
      targets: [bpWet.gain, invert(bpDry.gain, audioContext)]
    },
    color: {
      min: 20, max: 20000, defaultValue: 800,
      target: bandpass.frequency
    },
    postCut: {
      min: 20, max: 20000, defaultValue: 3000,
      target: lowpass.frequency
    }
  })

  var steps = 22050
  var curve = new Float32Array(steps)
  var deg = Math.PI / 180

  for (var i=0;i<steps;i++) {
    var x = i * 2 / steps - 1
    curve[i] = (3 + 10) * x * 20 * deg / (Math.PI + 10 * Math.abs(x))
  }

  waveshaper.curve = curve

  return node
}

function invert(param, audioContext){
  return extendTransform(param, audioContext).transform(invertTransform)
}

function invertTransform(a, b){
  return 1 - b
}