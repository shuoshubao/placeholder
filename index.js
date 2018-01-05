const fs = require('fs')
const url = require('url')
const qs = require('qs')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { createCanvas, loadImage } = require('canvas')

const produceImage = ({text = '', width = 500, height = 300, color = '#fff', bgColor = '#1f8dd6'}) => new Promise((resolve, reject) => {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.font = '40px Impact'
    ctx.textAlign = 'left'
    // ctx.textBaseline = 'top'

    const {width: textWidth} = ctx.measureText(text)

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = color
    ctx.fillText(text, (width - textWidth) / 2, height / 2)

    var out = fs.createWriteStream(__dirname + '/text.png')
    var stream = canvas.pngStream()

    stream.on('data', function(chunk){
      out.write(chunk)
    })

    stream.on('end', function(){
      var input = fs.createReadStream(__dirname + '/text.png')
      resolve(input)
    })

    out.on('finish', function(){
      console.log('The PNG file was created.')
    })
})




const app = new Koa()

app.use(bodyParser())

app.use(async ctx => {
    ctx.type = 'png'
    ctx.body = await produceImage(qs.parse(url.parse(ctx.request.url).query))
})

app.listen(3001)
