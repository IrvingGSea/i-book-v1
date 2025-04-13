# Chapter 6: Input Capture

## 🎯 What Is Input Capture?

Input Capture allows the PIC24 to **record the exact time a digital signal changes**, such as rising or falling edges on an input pin. It’s useful for:

- Measuring **pulse width**  
- Determining **frequency**  
- Capturing **timestamped events** (e.g., RPM sensors, echo returns)

---

## ⏱️ How It Works

1. A timer (e.g., TMR2) is running in the background  
2. When a signal edge is detected, the **current timer value** is saved in a capture register  
3. An interrupt can be triggered to notify the CPU  
4. The program can read the captured time

---

## 🧰 Key Registers

| Register          | Description                              |
|-------------------|------------------------------------------|
| `ICxBUF`          | Capture buffer — holds captured timer value  
| `ICxCON1`         | Control register for Input Capture  
| `ICxCON2`         | Advanced features (chaining, sync)  
| `IFSx`, `IECx`    | Interrupt flag and enable bits for Input Capture  
| `TMRy`            | Timer used as the timebase (usually TMR2 or TMR3)

---

## ⚙️ Example: Measure Pulse Width with Input Capture 1

Let’s say we want to measure the time between two rising edges of a signal.

### Configuration:

```c
void setupInputCapture1() {
    T2CON = 0x8000;      // Enable Timer2, no prescale
    IC1CON1 = 0x0003;    // Capture every rising edge
    IC1CON2 = 0x0000;    // Use Timer2 as timebase
    IFS0bits.IC1IF = 0;  // Clear interrupt flag
    IEC0bits.IC1IE = 1;  // Enable IC1 interrupt
}
```

## Interrupt Service Routine
```c
uint16_t lastCapture = 0;
uint16_t pulseWidth = 0;

void __attribute__((interrupt, no_auto_psv)) _IC1Interrupt(void) {
    IFS0bits.IC1IF = 0;                  // Clear flag
    uint16_t current = IC1BUF;           // Read captured value
    pulseWidth = current - lastCapture;  // Compute pulse width
    lastCapture = current;               // Store for next edge
}
```

## 🧠 Use Cases for Input Capture

- Measure the frequency of an external waveform  
- Detect the width of ultrasonic echo pulses  
- Determine RPM from motor encoders  
- Track signal timing in communication protocols  


## 🧩 Tips

- Make sure the timer used is running!  
- Avoid overflow — use a large enough timer or handle wraparound  
- Debounce noisy signals to avoid false captures  
- Use **capture every edge**, **every 2nd edge**, or **rising/falling** as needed via `ICxCON1` settings  
