module.exports = Overdrive

function Overdrive(audioContext){

  var node = audioContext.createGain()
  var voltage = flatten(node)

  node.output = audioContext.createGain()

  var bpWet = audioContext.createGain()
  bpWet.gain.value = 0

  var bpDry = audioContext.createGain()
  bpDry.gain.value = 1

  var bandpass = audioContext.createBiquadFilter()
  bandpass.frequency.value = 800

  var waveshaper = audioContext.createWaveShaper()
  var lowpass = audioContext.createBiquadFilter()
  lowpass.frequency.value = 3000

  var preBandVoltage = scale(voltage)
  preBandVoltage.gain.value = 0.5
  preBandVoltage.connect(bpWet.gain)

  var inverted = audioContext.createGain()
  inverted.gain.value = -1
  preBandVoltage.connect(inverted)
  inverted.connect(bpDry.gain)

  node.connect(bpWet)
  node.connect(bpDry)

  bpWet.connect(bandpass)
  bpDry.connect(waveshaper)
  bandpass.connect(waveshaper)
  waveshaper.connect(lowpass)
  lowpass.connect(node.output)

  node.preBand = preBandVoltage.gain
  node.color = bandpass.frequency
  node.postCut = lowpass.frequency
  // node.gain is already there :)

  node.connect = connect
  node.disconnect = disconnect

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

var flat = new Float32Array([1,1])
function flatten(node){
  var shaper = node.context.createWaveShaper()
  shaper.curve = flat
  node.connect(shaper)
  return shaper
}

function scale(node){
  var gain = node.context.createGain()
  node.connect(gain)
  return gain
}

function connect(){
  this.output.connect.apply(this.output, arguments)
}

function disconnect(){
  this.output.disconnect.apply(this.output, arguments)
}