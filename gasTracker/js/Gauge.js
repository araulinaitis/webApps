const labelYOFfset = 100; // px
const pointRadius = 8; // px
const defaultOffset = 100; // px

class Gauge {
  constructor() {
    this.points = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
      { x: 50, y: 100},
    ];
  }

  setCenter(x, y) {
    this.points[1].x = x;
    this.points[1].y = y;
    this.points[0].x = x - defaultOffset;
    this.points[0].y = y + defaultOffset;
    this.points[2].x = x + defaultOffset;
    this.points[2].y = y + defaultOffset;
    this.points[3].x = x;
    this.points[3].y = y + defaultOffset;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setDTEInput(input) {
    this.dteInput = input;
  }

  draw() {
    const ctx = this.canvas.getContext('2d');
    this.drawLines(ctx);
    this.draw0Label(ctx);
    this.draw100Label(ctx);
  }

  drawLines(ctx) {
    ctx.lineWidth = 2;

    // draw 0 line
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.stroke();

    // draw 100 line
    ctx.strokeStyle = "#00FF00";
    ctx.beginPath();
    ctx.moveTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.stroke();

    // draw fill line
    ctx.strokeStyle = "#0000FF";
    ctx.beginPath();
    ctx.moveTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[3].x, this.points[3].y);
    ctx.stroke();

    // draw points
    for(let point of this.points) {
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    
  }

  draw0Label(ctx) {

  }

  draw100Label(ctx) {

  }

  checkClickedPoint(x, y) { 

  }
}