
const mosiData = document.getElementById('mosi-data');
const misoData = document.getElementById('miso-data');
const sclkState = document.getElementById('sclk-state');

let masterData = '10101100';
let slaveData  = '11010010';
let index = 0;
let interval;

function startTransmission() {
    index = 0;
    mosiData.textContent = '';
    misoData.textContent = '';
    sclkState.textContent = '';
    clearInterval(interval);

    interval = setInterval(() => {
        if (index < masterData.length) {
            mosiData.textContent += masterData[index];
            misoData.textContent += slaveData[index];
            sclkState.textContent += '|';
            index++;
        } else {
            clearInterval(interval);
            sclkState.textContent += ' Done';
        }
    }, 500);
}
