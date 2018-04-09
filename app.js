const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const canvasBox = document.querySelector('.canvas-box')
const cs = getComputedStyle(canvasBox)

const canvasWidth = parseInt(cs.getPropertyValue('width'), 10)
const canvasHeight = parseInt(cs.getPropertyValue('height'), 10)

canvas.width = canvasWidth
canvas.height = canvasHeight

ctx.strokeStyle = `hsl(0, 100%, 50%)`
ctx.lineWidth = 5
ctx.lineJoin = 'round'
ctx.lineCap = 'round'

let rainbow = true
let isDrawing = false
let lastX;
let lastY;
let hue = 0
let direction = true


function setLineWidth(val) {
  document.querySelector('#stroke').value = val
  ctx.lineWidth = val
}

function setColor(color) {
  ctx.strokeStyle = `${color}`
  rainbow = false
}

function setRainbowColor() {
  rainbow = true
  hue = 0
}

function draw(e) {
  if (!isDrawing) return
  
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke()
  
  lastX = e.offsetX
  lastY = e.offsetY
  
  if (rainbow) {
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`

    hue++

    if (hue >= 360) {
      hue = 0
    }
  }
}


function drawMobile(e) {
  if (!isDrawing) return
  
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(e.touches[0].pageX, e.touches[0].pageY)
  ctx.stroke()
  
  lastX = e.touches[0].pageX
  lastY = e.touches[0].pageY
  
  if (rainbow) {
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`

    hue++

    if (hue >= 360) {
      hue = 0
    }
  }
}

function saveDrawing() {
  const blank = document.createElement('canvas');
  blank.width = canvas.width;
  blank.height = canvas.height;

  if (canvas.toDataURL() == blank.toDataURL()) return

  const drawings = document.querySelector('.drawings')
  const drawingsWrapper = document.querySelector('.saved-drawings')
  const noDrawings = document.querySelector('.no-drawings')
  
  canvas.toBlob(blob => {
    let newImg = document.createElement('img')
    url = URL.createObjectURL(blob)
    
    newImg.onload = () => {
      URL.revokeObjectURL(url)
    }

    newImg.src = url

    const drawingFrame = document.createElement('div')

    drawingFrame.setAttribute('class', 'drawing-frame fadein')

    drawingFrame.appendChild(newImg)
    const downloadButton = createDownloadButton(blob)
    const div = document.createElement('div')
    div.setAttribute('class', 'drawing fadein')

    div.appendChild(drawingFrame)
    div.appendChild(downloadButton)

    // drawings.appendChild(div)
    const test = document.querySelectorAll('.drawing');
    for (var i = 0; i < test.length; i++) {
      test[i].classList.add('fadeout')
      test[i].classList.remove('fadein')
  }
    drawings.insertBefore(div, drawings.firstChild);
    drawingsWrapper.classList.remove('hidden')
  })
}

function createDownloadButton(blob) {
  const a = document.createElement('a')
        a.innerText = 'Download'
        a.className = 'download-drawing'
        a.setAttribute('role', 'button')
        a.download = 'drawing-' + blob.size + '.png'
        a.href = window.URL.createObjectURL(blob)
  
  return a
}

function clearDrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true
  
  lastX = e.offsetX
  lastY = e.offsetY
})
canvas.addEventListener('mouseup', () => isDrawing = false)
canvas.addEventListener('mouseout', () => isDrawing = false)
canvas.addEventListener('touchmove', drawMobile)
canvas.addEventListener('touchstart', (e) => {
  isDrawing = true
  lastX = e.touches[0].pageX
  lastY = e.touches[0].pageY
})
canvas.addEventListener('touchend', () => isDrawing = false)
canvas.addEventListener('touchcancel', () => isDrawing = false)

// var tuio =
// { cursors:[] ,_data:{} , _touchstart: function(touch){this._create_event('touchstart',touch,{});},_touchmove:function(touch){this._create_event('touchmove',touch,{});},_touchend:function(touch){this._create_event('touchend',touch,{});},_create_event:function(name,touch,attrs){var evt=document.createEvent('CustomEvent');evt.initEvent(name,true,true);evt.touches=this.cursors;evt.targetTouches=this._get_target_touches(touch.target);evt.changedTouches=[touch];for(var attr in attrs){if(attrs.hasOwnProperty(attr)){evt[attr]=attrs[attr];}}
// if(touch.target){touch.target.dispatchEvent(evt);}else{document.dispatchEvent(evt);}},_get_target_touches:function(element){var targetTouches=[];for(var i=0;i<this.cursors.length;i++){var touch=this.cursors[i];if(touch.target==element){targetTouches.push(touch);}}
// return targetTouches;},callback:function(type,sid,fid,x,y,angle){var data;if(type!==3){data=this._data[sid];}else{data={sid:sid,fid:fid};this._data[sid]=data;}
// data.identifier=sid;data.pageX=window.innerWidth*x;data.pageY=window.innerHeight*y;data.target=document.elementFromPoint(data.pageX,data.pageY);switch(type){case 3:this.cursors.push(data);this._touchstart(data);break;case 4:this._touchmove(data);break;case 5:this.cursors.splice(this.cursors.indexOf(data),1);this._touchend(data);break;default:break;}
// if(type===5){delete this._data[sid];}}};function tuio_callback(type,sid,fid,x,y,angle){tuio.callback(type,sid,fid,x,y,angle);}