var Overdrive = require('./index')

var audioContext = new AudioContext()

audioContext.sampleCache = {}
loadSample('/samples/duh.wav', function(err, buffer){
  audioContext.sampleCache['duh.wav'] = buffer
})

var overdrive = Overdrive(audioContext)
overdrive.connect(audioContext.destination)

var player = null

addButton('play sound (loop)', function(){
  player = audioContext.createBufferSource()
  player.buffer = audioContext.sampleCache['duh.wav']
  player.loop = true
  player.connect(overdrive)
  player.start()
})

addButton('stop sound', function(){
  if (player){
    player.stop()
    player = null
  }
})

addSlider('gain', overdrive.gain, 0.1, 0, 100)
addSlider('preBand', overdrive.preBand, 0.01, 0, 1)
addSlider('color', overdrive.color)
addSlider('postCut', overdrive.postCut)

function addSlider(name, param, step, min, max){
  var container = document.createElement('div')
  container.appendChild(document.createTextNode(name))
  var label = document.createTextNode(param.value)
  var slider = document.createElement('input')
  slider.type = 'range'

  var min = min != null ? min : (param.minValue || 0)
  var max = max != null ? max : (param.maxValue || 100)

  var range = max - min

  slider.min = min
  slider.max = max
  slider.step = step || (range / 100)

  slider.value = param.value
  slider.style.width = '300px'


  slider.oninput = function(){
    label.data = this.value
    param.value = parseFloat(this.value)
  }
  container.appendChild(slider)
  container.appendChild(label)
  document.body.appendChild(container)
}

function addButton(name, down, up){
  var button = document.createElement('button')
  button.onmousedown = down
  button.onmouseup = up
  button.textContent = name
  document.body.appendChild(button)
}

function loadSample(url, cb){
  requestArrayBuffer(url, function(err, data){  if(err)return cb&&cb(err)
    audioContext.decodeAudioData(data, function(buffer){
      cb(null, buffer)
    }, function(err){
      cb(err)
    })
  })
}

function requestArrayBuffer(url, cb){
  var request = new window.XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    cb(null, request.response)
  }
  request.onerror = cb
  request.send();
}