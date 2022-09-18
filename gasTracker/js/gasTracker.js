let wrapperDiv;
let gauges = [];
let readings = [];

function init() {
  wrapperDiv = document.getElementById('mainDiv');
}

function loadImage(source) {
  const newDiv = document.createElement('div');
  const newCanvas = document.createElement('canvas');
  const dteInput = document.createElement('input');
  const newGauge = new Gauge();
  gauges.push(newGauge);
  dteInput.type = 'number';
  dteInput.onchange = () => update();

  const fileReader = new FileReader();

  fileReader.addEventListener('load', ev => {
    const data = ev.target.result;
    const tempImage = document.createElement('img');
    tempImage.src = data;
    tempImage.onload = () => {
      newCanvas.width = tempImage.width;
      newCanvas.height = tempImage.height;
      newGauge.setCenter(newCanvas.width / 2, newCanvas.height / 2);
      update();
    };
    newCanvas.style.backgroundImage = `url(${data})`;
    newDiv.appendChild(newCanvas);
    newDiv.appendChild(dteInput);
    wrapperDiv.appendChild(newDiv);
    newGauge.setCanvas(newCanvas);
    newGauge.setDTEInput(dteInput);

    newCanvas.addEventListener('mousedown', ev => {
      for (let gauge of gauges) {
        gauge.selectedPoint = null;
      }
      for (let gauge of gauges) {
        if (gauge.checkClickedPoint(ev.offsetX, ev.offsetY, ev.shiftKey)) {
          break;
        }
      }
    });

    newCanvas.addEventListener('mousemove', ev => {
      for (let gauge of gauges) {
        gauge.checkMove(ev.movementX, ev.movementY);
      }
    });

    newCanvas.addEventListener('mouseup', () => {
      for (let gauge of gauges) {
        gauge.selectedPoint = null;
      }
    })

  });

  fileReader.readAsDataURL(source.files[0]);
}

function update() {
  readings = [];

  for (let gauge of gauges) {
    gauge.update();
    readings.push({angle: gauge.anglePercent, dte: gauge.dte});
  }

  console.log(readings);

  draw();
}

function draw() {
  for (let gauge of gauges) {
    gauge.draw();
  }
}

function downloadCSV() {
  let csv = 'Gauge Angle,DTE\n';
  for (let reading of readings) {
    csv += `${reading.angle},${reading.dte}\n`;
  }
  download(csv, 'stats.csv');
}