import './style.css'

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

const context = canvas.getContext("2d");

class Dot {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.xMovement = 1;
    this.yMovement = 1;

    this.size = 10;
  }

  move() {
    this.x += this.xMovement;
    this.y += this.yMovement;
  }

  accellerate() {
    if(this.x > canvas.width || this.x < 0) {
      this.xMovement = -this.xMovement;
    }
    if(this.y > canvas.height || this.y < 0) {
      this.yMovement = -this.yMovement;
    }
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, true);
    context.fillStyle = 'white';
    context.fill();
  }
}

// const dot = new Dot();
const dots = [...Array(50)].map(() => new Dot());

function clearAndRender() {
  context.fillStyle = "rgba(0, 0, 0, 0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  for(let dot of dots) {
    dot.draw(context);
    dot.move();
    dot.accellerate();
  }
}

// function renderLoop() {
//   clearAndRender();
//   setTimeout(renderLoop, 0);
// }

async function renderLoop() {
  while(true) {
    clearAndRender();
    await releaseControl()
  }
}

function releaseControl(waitTimeMs=0) {
  return new Promise((resolve) => {
    setTimeout(resolve, waitTimeMs)
  })
}

renderLoop();





