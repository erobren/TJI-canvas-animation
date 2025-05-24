import { canvas } from "./main";

const maxDotsAllowed = 10;

export class BSPTree {
  constructor(bounds, depth=0) {
    if (!bounds) bounds = {lowerLimitX: -1, maxX: canvas.width, lowerLimitY: -1, maxY: canvas.height}
    this.depth = depth;
    this.bounds = bounds;
    this.dots = null;
  }

  initializeDots(dots=[]) {
    if (dots.length <= maxDotsAllowed) {
      this.dots = dots; 
    } else {
      this.createChildrenAndAdd(dots);
    }
  }

  add(dot) {
    if (this.hasChildren()) {
      this.addToChildren(dot);
    } else if (this.dots.length + 1 <= maxDotsAllowed ) {
      this.dots.push(dot);
    } else {
      this.dots.push(dot);
      this.createChildrenAndAdd(this.dots);
      this.dots = null; 
    }
  }

  hasChildren() {
    throw new Error("Not implemented yet");    
  } 

  addToChildren(dot) {
    throw new Error("Not implemented yet");    
  }

  createChildrenAndAdd(dots) {
    throw new Error("Not implemented yet");    
  }

  collisions(dot, radius, result=[]) {
    throw new Error("Not implemented yet");    
  }

  draw(context) {
    throw new Error("Not implemented yet");    
  }
}

export class HorizontalSplitBSPTree extends BSPTree {
  constructor(bounds, dots, depth) {
    super(bounds, depth)
    this.left = null;
    this.right = null;
    this.initializeDots(dots);
  }

  hasChildren() {
    return this.left && this.right;
  } 

  addToChildren(dot) {
    if (dot.x <= this.left.bounds.maxX) {
      this.left.add(dot);
    } else {
      this.right.add(dot);
    }
  }

  createChildrenAndAdd(dots) {
      const splitX = Math.round((this.bounds.lowerLimitX + this.bounds.maxX) / 2)

      const leftBounds = {};
      Object.assign(leftBounds, this.bounds)
      leftBounds.maxX = splitX;
      this.left = new VerticalSplitBSPTree(leftBounds, dots.filter(dot => dot.x <= splitX), this.depth + 1)

      const rightBounds = {};
      Object.assign(rightBounds, this.bounds)
      rightBounds.lowerLimitX = splitX;
      this.right = new VerticalSplitBSPTree(rightBounds, dots.filter(dot => dot.x > splitX), this.depth + 1)
  }

  collisions(dot, radius, result=[]) {
        // console.log("a")

    if (this.dots) {
      for(let otherDot of this.dots) {
        // console.log("#¤")
        if ((otherDot.id > dot.id) && (otherDot.distanceTo(dot) <= radius)) {
          // console.log("push")
          result.push(otherDot)
        }
      }

    } else {
      const splitX = this.left.bounds.maxX;
      if (dot.x <= splitX + radius) {
        this.left.collisions(dot, radius, result)
      }
      if (dot.x > splitX - radius) {
        this.right.collisions(dot, radius, result)
      }
    }
    return result;
  }

  draw(context) {
    if (!this.dots) {
      context.lineWidth = Math.max(1, (10 - this.depth*4));
      context.strokeStyle = 'blue';

      const pivotX = this.left.bounds.maxX;
      const topBound = this.bounds.lowerLimitY;
      const bottomBound = this.bounds.maxY;
      
      context.beginPath();
      context.moveTo(pivotX, topBound);
      context.lineTo(pivotX, bottomBound);
      context.stroke();

      this.right.draw(context);
      this.left.draw(context);
    }
  }
}

export class VerticalSplitBSPTree extends BSPTree {
  constructor(bounds, dots, depth) {
    super(bounds, depth)
    this.top = null;
    this.bottom = null;
    this.initializeDots(dots);
  }

  hasChildren() {
    return this.top && this.bottom;
  } 

  addToChildren(dot) {
    if (dot.y <= this.top.bounds.maxY) {
      this.top.add(dot);
    } else {
      this.bottom.add(dot);
    }
  }

  createChildrenAndAdd(dots) {
    const splitY = Math.round((this.bounds.lowerLimitY + this.bounds.maxY) / 2)

    const topBounds = {};
    Object.assign(topBounds, this.bounds)
    topBounds.maxY = splitY;
    this.top = new HorizontalSplitBSPTree(topBounds, dots.filter(dot => dot.y <= splitY), this.depth + 1)

    const bottomBounds = {};
    Object.assign(bottomBounds, this.bounds)
    bottomBounds.lowerLimitY = splitY;
    this.bottom = new HorizontalSplitBSPTree(bottomBounds, dots.filter(dot => dot.y > splitY), this.depth + 1)
  }

  collisions(dot, radius, result=[]) {
    if (this.dots) {
      for(let otherDot of this.dots) {
        if ((otherDot.id > dot.id) && (otherDot.distanceTo(dot) <= radius)) {
          result.push(otherDot)
        }
      }
    } else {
      const splitY = this.top.bounds.maxY;
      if (dot.y <= splitY + radius) {
        this.top.collisions(dot, radius, result)
      }
      if (dot.y > splitY - radius) {
        this.bottom.collisions(dot, radius, result)
      }
    }
    return result;
  }

  draw(context) {
    if (!this.dots) {
      context.lineWidth = Math.max(1, (10 - this.depth*4));
      context.strokeStyle = 'blue';

      const pivotY = this.top.bounds.maxY;
      const leftBound = this.bounds.lowerLimitX;
      const rightBound = this.bounds.maxX;
      
      context.beginPath();
      context.moveTo(leftBound, pivotY);
      context.lineTo(rightBound, pivotY);
      context.stroke();

      this.top.draw(context);
      this.bottom.draw(context);
    }
  }
}