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

addSlider(overdrive.gain)
addSlider(overdrive.preBand)
addSlider(overdrive.color)
addSlider(overdrive.postCut)

function addSlider(param, step, min, max){
  var container = document.createElement('div')
  container.appendChild(document.createTextNode(param.name))
  var label = document.createTextNode(param.defaultValue)
  var slider = document.createElement('input')
  slider.type = 'range'

  var min = min != null ? min : (param.min || 0)
  var max = max != null ? max : (param.max || 100)

  var range = max - min

  slider.min = min
  slider.max = max
  slider.step = step || (range / 100)

  slider.value = param.defaultValue
  slider.style.width = '300px'


  slider.onchange = function(){
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