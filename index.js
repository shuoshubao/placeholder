var fs = require('fs')
const Koa = require('koa');
const { createCanvas, loadImage } = require('canvas')


const produceImage = ({text = 'hello', width = 100, height = 100, color = '#000', bgColor = '#fff'}) => new Promise((resolve, reject) => {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.font = '30px Impact'
    ctx.fillText(text, 0, 10)

    var out = fs.createWriteStream(__dirname + '/text.png')
    var stream = canvas.pngStream()

    stream.on('data', function(chunk){
      out.write(chunk);
    });

    stream.on('end', function(){
      console.log('The PNG stream 结束');
      var input = fs.createReadStream(__dirname + '/text.png')
      resolve(input)
    });

    out.on('finish', function(){
      console.log('The PNG file was created.');
    });
})




const app = new Koa();

app.use(async ctx => {
    ctx.type = 'png'
    // ctx.body = 'Hello World';
    ctx.body = await produceImage({})
});

app.listen(3001);
