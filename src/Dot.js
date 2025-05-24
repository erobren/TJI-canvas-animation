let nextId = 1;

const maximumLineDistance = 100;

export class Dot {
  constructor(x, y) {
    this.id = nextId++;

    this.x = typeof(x) === "undefined" ? (Math.random() * canvas.width) : x;
    this.y = typeof(y) === "undefined" ? (Math.random() * canvas.height) : y;

    this.xMovement = ((Math.random() * 2) - 1) * 0.3;
    this.yMovement = ((Math.random() * 2) - 1) * 0.3;

    this.size = 10;

    this.connections = null;
  }

  connect(dots) {
    this.connections = dots.filter(dot => this.id < dot.id && this.distanceTo(dot) <= maximumLineDistance)
  }

  distanceTo(otherDot) {
    const dx = this.x - otherDot.x;
    const dy = this.y - otherDot.y;
    return Math.sqrt(dx*dx + dy*dy);
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
    const size = Math.min(10, Math.max(2, this.connections.length*2))
    context.beginPath();
    context.arc(this.x, this.y, size, 0, 2 * Math.PI, true);
    context.fillStyle = 'white';
    context.fill();

    this.connections.forEach((otherDot) => {
      const distance = this.distanceTo(otherDot);
      let strength = Math.max(0, maximumLineDistance - distance)/maximumLineDistance;
      // strength = Math.round(strength * 100) / 100
      const color = `rgba(255, 255, 255, ${strength})`
      context.beginPath();
      context.lineWidth = Math.ceil(10 * strength);
      context.strokeStyle = color;
      context.moveTo(this.x, this.y);
      if ((this.id + otherDot.id) % 2 === 0) {
        context.lineTo(this.x, otherDot.y);
      } else {
        context.lineTo(otherDot.x, this.y);
      }
      context.lineTo(otherDot.x, otherDot.y);
      context.stroke();
    })    
  }
}
