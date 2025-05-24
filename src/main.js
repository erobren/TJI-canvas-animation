import { Dot } from './Dot';
import './style.css'
import { measureTime, someFrames } from './utility';

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

const context = canvas.getContext("2d");


// const dot = new Dot();
const dots = [...Array(200)].map(() => new Dot());

container.addEventListener("mousedown", (event) => {
  dots.push(new Dot(event.clientX, event.clientY));
}, true);

function clearAndRender() {
  context.fillStyle = "rgba(0, 0, 0, 0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  measureTime("Connecting the dots: ", () => {
    for(let dot of dots) {
      dot.connect(dots);  
    }
  });
    
  measureTime("Draw and accellerate: ", () => {
    for(let dot of dots) {
      dot.draw(context);
      dot.move();
      dot.accellerate();
    }
  });
}

// function renderLoop() {
//   clearAndRender();
//   setTimeout(renderLoop, 0);
// }

export let frameCounter = 1;

async function renderLoop() {
  while(true) {
    if (someFrames()) console.group("Render a frame:")
    clearAndRender();
    await releaseControl();
    if (someFrames()) console.groupEnd()
    frameCounter++;
  }
}

function releaseControl(waitTimeMs=0) {
  return new Promise((resolve) => {
    setTimeout(resolve, waitTimeMs)
  })
}

renderLoop();





