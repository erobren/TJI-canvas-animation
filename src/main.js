import { HorizontalSplitBSPTree } from './BSPTree';
import { Dot } from './Dot';
import './style.css'
import { measureTime, measureTimeAsync, someFrames } from './utility';

const container = document.getElementById("container");
export const canvas = document.getElementById("canvas");
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

const context = canvas.getContext("2d");

const numberOfDots = 300;
// const dot = new Dot();
const dots = [...Array(numberOfDots)].map(() => new Dot());

container.addEventListener("mousedown", (event) => {
  dots.push(new Dot(event.clientX, event.clientY));
}, true);

function clearAndRender() {
  context.fillStyle = "rgba(0, 0, 0, 0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  let bspTree; 

  measureTime("Build BSP and connect dots using it: ", () => {
    bspTree = new HorizontalSplitBSPTree();
    for(let dot of dots) {
      bspTree.add(dot);
    }
    for(let dot of dots) {
      dot.connectUsingBSP(bspTree);  
    }
  });

  measureTime("Connecting the dots just looping through arrays: ", () => {
    for(let dot of dots) {
      dot.connectUsingList(dots);   
    }
  });

  bspTree.draw(context);

  measureTime("Draw all dots: ", () => {
    for(let dot of dots) {
      dot.draw(context);
    }
  });  
  
  measureTime("Move and accellerate: ", () => {
    for(let dot of dots) {
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
    await measureTimeAsync("Release control:", async () => {
      await releaseControl();
    })
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





