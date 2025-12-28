const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const velocityInput = document.getElementById("velocity");
const angleInput = document.getElementById("angle");
const gravityInput = document.getElementById("gravity");

let timer = null;
let scale = 5;

function updateDisplays() {
    document.getElementById("show-velocity").innerText = velocityInput.value + " m/s";
    document.getElementById("show-angle").innerText = angleInput.value + "°";
    document.getElementById("show-gravity").innerText = gravityInput.value;
    drawBackground();
}

velocityInput.oninput = updateDisplays;
angleInput.oninput = updateDisplays;
gravityInput.oninput = updateDisplays;

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 20);
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(20, canvas.height - 20, 5, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
}

function startSimulation() {
    let v0 = parseFloat(velocityInput.value);
    let angleDeg = parseFloat(angleInput.value);
    let g = parseFloat(gravityInput.value);
    let angleRad = angleDeg * (Math.PI / 180);

    let vx = v0 * Math.cos(angleRad);
    let vy = v0 * Math.sin(angleRad);

    let totalTime = (2 * vy) / g;
    let maxHeight = (vy * vy) / (2 * g);
    let maxRange = vx * totalTime;

    document.getElementById("res-height").innerText = maxHeight.toFixed(2) + " m";
    document.getElementById("res-range").innerText = maxRange.toFixed(2) + " m";
    document.getElementById("res-time").innerText = totalTime.toFixed(2) + " s";

    let btn = document.getElementById("btn-launch");
    btn.disabled = true;
    btn.innerText = "Simulating...";

    let startTime = Date.now();
    scale = 700 / (maxRange + 10);
    if (scale > 10) scale = 10;

    if (timer) clearInterval(timer);

    timer = setInterval(function () {
        let timePassed = (Date.now() - startTime) / 1000;
        let t = timePassed * 2;

        if (t > totalTime) {
            t = totalTime;
            clearInterval(timer);
            btn.disabled = false;
            btn.innerText = "Launch Ball";
        }

        let x = vx * t;
        let y = (vy * t) - (0.5 * g * t * t);

        drawFrame(x, y);
    }, 20);
}

function drawFrame(x, y) {
    drawBackground();
    let pixelX = 20 + (x * scale);
    let pixelY = (canvas.height - 20) - (y * scale);

    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
}

drawBackground();
updateDisplays();