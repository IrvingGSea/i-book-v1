
function updatePin() {
    const tris = document.getElementById("tris").checked;
    const ad1pcfg = document.getElementById("ad1pcfg").checked;
    const lat = document.getElementById("lat").checked;
    const pin = document.getElementById("pinStatus");
    const desc = document.getElementById("pinDesc");

    if (tris) {
        pin.style.backgroundColor = "gray";
        desc.innerText = "TRIS = 1 (input): Output disabled";
        pin.innerText = "?";
    } else if (!ad1pcfg) {
        pin.style.backgroundColor = "gray";
        desc.innerText = "AD1PCFG = 0 (analog): Digital output disabled";
        pin.innerText = "?";
    } else {
        pin.style.backgroundColor = lat ? "green" : "red";
        desc.innerText = "Output = " + (lat ? "High (LAT = 1)" : "Low (LAT = 0)");
        pin.innerText = lat ? "1" : "0";
    }
}

document.getElementById("tris").addEventListener("change", updatePin);
document.getElementById("ad1pcfg").addEventListener("change", updatePin);
document.getElementById("lat").addEventListener("change", updatePin);

updatePin();
