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

function saveDrawing() {
  const blank = document.createElement('canvas');
  blank.width = canvas.width;
  blank.height = canvas.height;

  if (canvas.toDataURL() == blank.toDataURL()) return

  const savedDrawings = document.querySelector('.drawings')
  const noDrawings = document.querySelector('.no-drawings')
  
  canvas.toBlob(blob => {
    let newImg = document.createElement('img')
    url = URL.createObjectURL(blob)
    
    newImg.onload = () => {
      URL.revokeObjectURL(url)
    }

    newImg.src = url

    const drawingFrame = document.createElement('div')
    drawingFrame.setAttribute('class', 'drawing-frame')

    drawingFrame.appendChild(newImg)
    const downloadButton = createDownloadButton(blob)
    const div = document.createElement('div')
    div.setAttribute('class', 'drawing')

    div.appendChild(drawingFrame)
    div.appendChild(downloadButton)

    noDrawings.classList.add('hidden')
    savedDrawings.appendChild(div)
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