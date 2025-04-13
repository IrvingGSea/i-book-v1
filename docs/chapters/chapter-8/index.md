# Chapter 8: Analog-to-Digital Conversion (ADC)

## 🎯 What Is ADC?

The **Analog-to-Digital Converter (ADC)** module allows the PIC24 to convert an analog voltage (e.g., from a sensor) into a digital value that your program can work with.

- Analog signals: continuous (e.g., 0–3.3V)  
- Digital output: discrete (e.g., 0–1023 for a 10-bit ADC)  
- Converts voltage into a digital number using successive approximation

---

## 🔍 How ADC Works

1. Select an analog input channel (e.g., AN0, AN1, etc.)
2. Start the conversion
3. Wait for conversion to complete (or use an interrupt)
4. Read the result from the `ADC1BUF` register

---

## ⚙️ Key Registers

| Register           | Description                                 |
|--------------------|---------------------------------------------|
| `AD1CON1`          | Main ADC control (start/stop, conversion type)  
| `AD1CON2`          | Input scan, buffer settings  
| `AD1CON3`          | Sample time, ADC clock  
| `AD1CHS`           | Selects the input channel  
| `ADC1BUF0`         | Holds the result of the latest conversion  
| `IFS0bits.AD1IF`   | ADC interrupt flag  
| `IEC0bits.AD1IE`   | ADC interrupt enable  

---

## ⚡ Example: Read Analog Voltage on AN0

```c
void setupADC() {
    AD1CON1 = 0x00E0;      // Auto-convert after sampling
    AD1CON2 = 0x0000;      // Single channel, single conversion
    AD1CON3 = 0x1F3F;      // Sample time and ADC clock
    AD1CHS = 0x0000;       // Select AN0 for input
    AD1CSSL = 0;           // No scanning
    AD1CON1bits.ADON = 1;  // Turn on ADC
}

uint16_t readADC() {
    AD1CON1bits.SAMP = 1;          // Start sampling
    __delay_us(10);                // Delay for sampling time
    AD1CON1bits.SAMP = 0;          // Start conversion
    while (!AD1CON1bits.DONE);     // Wait for conversion complete
    return ADC1BUF0;               // Return result
}
```

## 🧠 Use Cases

- Read values from analog sensors (e.g., temperature, light, potentiometer)  
- Measure voltages for battery monitoring  
- Sample waveforms or analog signals for processing  
- Use analog inputs as threshold triggers (e.g., above/below reference)

## 🧩 Tips

- Ensure the analog pin is set to **input** (`TRISx = 1`)  
- Disable the digital output on analog pins (`AD1PCFG`) if needed  
- Sampling too quickly can reduce accuracy — tune sample time via `AD1CON3`  
- Use averaging in software to reduce noise in the signal  
- Consider using **interrupts** for more efficient conversions
