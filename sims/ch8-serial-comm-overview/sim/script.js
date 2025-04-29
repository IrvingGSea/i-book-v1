function show(id) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}

function startUART() {
    let c = document.getElementById("uartCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    let pos = 0;
    function animate() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.moveTo(10, 75);
        ctx.lineTo(pos, 75);
        ctx.lineTo(pos + 10, 120);
        ctx.lineTo(pos + 40, 120);
        ctx.lineTo(pos + 50, 30);
        ctx.lineTo(pos + 80, 30);
        ctx.lineTo(pos + 90, 120);
        ctx.lineTo(pos + 120, 120);
        ctx.lineTo(pos + 130, 75);
        ctx.lineTo(c.width, 75);
        ctx.stroke();
        pos += 2;
        if (pos < 250) requestAnimationFrame(animate);
    }
    animate();
}

function startSPI() {
    let c = document.getElementById("spiCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    let clkPos = 0;
    let dataPos = 0;
    function animate() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.moveTo(10, 50);
        ctx.lineTo(30 + clkPos, 20);
        ctx.lineTo(50 + clkPos, 80);
        ctx.strokeStyle = "navy";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 110);
        ctx.lineTo(60 + dataPos, 90);
        ctx.strokeStyle = "green";
        ctx.stroke();
        clkPos += 5;
        dataPos += 5;
        if (clkPos < 400) requestAnimationFrame(animate);
    }
    animate();
}

function startI2C() {
    let c = document.getElementById("i2cCanvas");
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    let clkPos = 0;
    let dataPos = 0;
    function animate() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.moveTo(10, 50);
        ctx.lineTo(30 + clkPos, 20);
        ctx.lineTo(50 + clkPos, 80);
        ctx.strokeStyle = "darkred";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 110);
        ctx.lineTo(40 + dataPos, 110 - (dataPos % 20));
        ctx.strokeStyle = "darkgreen";
        ctx.stroke();
        clkPos += 5;
        dataPos += 5;
        if (clkPos < 400) requestAnimationFrame(animate);
    }
    animate();
}
