# Chapter 7: Output Compare

## 🎯 What Is Output Compare?

The **Output Compare (OC)** module is used to generate timed digital outputs on a pin. It’s most commonly used for:

- Generating **PWM (Pulse Width Modulation)** signals  
- Producing precise **single-shot pulses**  
- Creating **timed toggles** for waveform generation  

It works alongside a timer (like TMR2 or TMR3) to compare the timer’s value against programmed thresholds.

---

## 🧰 Key Registers

| Register        | Description                            |
|-----------------|----------------------------------------|
| `OCxCON1`       | Main control register for OC module  
| `OCxCON2`       | Sync options, advanced features  
| `OCxR`          | Compare register (start of pulse)  
| `OCxRS`         | Secondary register (end of pulse)  
| `TMRy`          | Timer driving the output compare  

---

## ⚡ How PWM Works with Output Compare

PWM signals switch between high and low at regular intervals:

- The **duty cycle** (how long the signal is high) is controlled by `OCxRS`
- The **period** is defined by the timer (typically via `PR2`)
- OC pins can be routed using the **Peripheral Pin Select (PPS)** system

---

## ⚙️ Example: Generate 1 kHz PWM on OC1

```c
void setupOC1_PWM() {
    // Configure Timer2 for 1 kHz (assuming 8 MHz clock, prescaler 1:64)
    T2CON = 0x8030;      // Enable TMR2, prescaler 1:64
    PR2 = 1249;          // Period = (8MHz / 64 / 1kHz) - 1

    OC1CON1 = 0x0006;    // OC1 in edge-aligned PWM mode
    OC1R = 0;            // Initial duty cycle = 0
    OC1RS = 625;         // 50% duty cycle (625 out of 1250)

    // Route OC1 to pin using PPS (example: RP3)
    RPOR1bits.RP3R = 18; // RP3 = OC1

    OC1CON1bits.OCM = 0b110; // Enable OC1 in PWM mode
} // This sets up a clean 1kHz PWM output with a 50% duty cycle
```
## 🧠 Use Cases

- Dim LEDs with PWM  
- Control motor speed (DC or servo motors)  
- Generate audio tones  
- Create square waves or timing pulses  
- Trigger external circuitry at precise intervals  

## 🧩 Tips

- OC modules require a running timer (e.g., TMR2 or TMR3)  
- `OCxRS` defines the **on-time**, `PRx` defines the total **period**  
- Always route the OC output to a pin via **Peripheral Pin Select (PPS)**  
- Use `OCxCON1bits.OCM` to select the mode (PWM, single compare, etc.)  
