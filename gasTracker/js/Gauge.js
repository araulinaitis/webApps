const labelYOFfset = 100; // px
const pointRadius = 8; // px
const defaultOffset = 100; // px

class Gauge {
  constructor() {
    this.points = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
      { x: 50, y: 100 },
    ];
    this.selectedPoint = null;
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
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLines(ctx);
    this.draw0Label(ctx);
    this.draw100Label(ctx);
  }

  drawLines(ctx) {
    ctx.lineWidth = 2;

    // draw 0 line
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.stroke();

    // draw 100 line
    ctx.strokeStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.stroke();

    // draw fill line
    ctx.strokeStyle = '#0000FF';
    ctx.beginPath();
    ctx.moveTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[3].x, this.points[3].y);
    ctx.stroke();

    // draw points
    for (let point of this.points) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  draw0Label(ctx) {}

  draw100Label(ctx) {}

  checkClickedPoint(x, y, shiftWhenDown) {
    for (let idx = 0; idx < this.points.length; ++idx) {
      const point = this.points[idx];
      if (Math.abs(point.x - x) < pointRadius && Math.abs(point.y - y) < pointRadius) {
        this.selectedPoint = point;
        this.shiftWhenDown = shiftWhenDown;
        return true;
      }
    }
    this.selectedPoint = null;
    return false;
  }

  checkMove(dx, dy) {
    if (this.selectedPoint) {
      if (this.shiftWhenDown) {
        for (let point of this.points) {
          point.x += dx;
          point.y += dy;
        }
      } else {
        this.selectedPoint.x += dx;
        this.selectedPoint.y += dy;
      }
      update();
    }
  }

  update() {
    this.calculateAngle();
    this.readDTEInput();
  }

  calculateAngle() {
    const point0 = this.points[0];
    const centerPoint = this.points[1];
    const point100 = this.points[2];
    const currentPoint = this.points[3];

    const v0 = { x: point0.x - centerPoint.x, y: point0.y - centerPoint.y };
    const v0Mag = vectorMagnitude(v0);
    v0.x /= v0Mag;
    v0.y /= v0Mag;

    const v100 = { x: point100.x - centerPoint.x, y: point100.y - centerPoint.y };
    const v100Mag = vectorMagnitude(v100);
    v100.x /= v100Mag;
    v100.y /= v100Mag;

    const vCurrent = { x: currentPoint.x - centerPoint.x, y: currentPoint.y - centerPoint.y };
    const vCurrentMag = vectorMagnitude(vCurrent);
    vCurrent.x /= vCurrentMag;
    vCurrent.y /= vCurrentMag;

    const totalAngle = vectorAngle(v0, v100);
    const thisAngle = vectorAngle(v0, vCurrent);

    this.anglePercent = thisAngle / totalAngle;
  }

  readDTEInput() {
    this.dte = parseInt(this.dteInput.value);
  }
}

function vectorMagnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function vectorDotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function vectorAngle(v1, v2) {
  return Math.acos(vectorDotProduct(v1, v2));
}
