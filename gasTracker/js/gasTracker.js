let wrapperDiv;
let gauges = [];

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

  const fileReader = new FileReader();

  fileReader.addEventListener('load', ev => {
    const data = ev.target.result;
    const tempImage = document.createElement('img');
    tempImage.src = data;
    tempImage.onload = () => {
      newCanvas.width = tempImage.width;
      newCanvas.height = tempImage.height;
      newGauge.setCenter(newCanvas.width / 2, newCanvas.height / 2);
      draw();
    };
    newCanvas.style.backgroundImage = `url(${data})`;
    newDiv.appendChild(newCanvas);
    wrapperDiv.appendChild(newDiv);
    newGauge.setCanvas(newCanvas);
    newGauge.setDTEInput(dteInput);

  });

  fileReader.readAsDataURL(source.files[0]);
}

function draw() {
  for (let gauge of gauges) {
    gauge.draw();
  }
}