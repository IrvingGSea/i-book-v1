# Chapter 6: External Interrupts & Input Capture

## Section 1: What Are External Interrupts?

External interrupts allow your microcontroller to **react immediately to changes on specific input pins**, such as when a button is pressed, a sensor detects motion, or a digital signal changes state.

---

### How They Work

External interrupts are triggered by **electrical transitions** on dedicated interrupt pins:

- **Rising edge** → when the signal goes from LOW (0) to HIGH (1)
- **Falling edge** → when the signal goes from HIGH (1) to LOW (0)
- Some systems allow **both edges** to trigger an interrupt

When such a change is detected, the microcontroller **pauses its current task**, runs a specific function called an **Interrupt Service Routine (ISR)**, then **returns to what it was doing** — all within a few cycles.

---

### Hardware Lines: INTx

The PIC24 provides dedicated external interrupt inputs:
- `INT0` is fixed to a specific pin and always uses rising edge detection
- `INT1`, `INT2`, etc. are **configurable**: you can choose rising or falling edge
- Each has its own flag (`IFSx`), enable bit (`IECx`), and priority level (`IPCx`)

---

### Common Use Cases

- Detecting a **button press** (toggle an LED, start/stop a timer)
- Triggering logic when an object **breaks a beam sensor**
- Starting an event when a **signal changes state**
- Reading a **pulse train** from another digital system

>  External interrupts allow your microcontroller to be responsive **without constant polling** — saving power and processing time.

---

In the next section, we’ll show how to configure these interrupts on the PIC24 and respond to real-world input like a button press.

## Section 2: Configuring External Interrupts (INTx)

To use an external interrupt on the PIC24, you'll need to configure three main things:

1. **Edge sensitivity** — rising or falling
2. **Enable the interrupt**
3. **Clear the interrupt flag in your ISR**

---

### 🔹 Basic Setup: INT1

Here’s how to configure **INT1** to trigger on a **falling edge** (e.g. button press):

```c
TRISBbits.TRISB7 = 1;              // Set RB7 as input
INTCON2bits.INT1EP = 1;            // 1 = falling edge, 0 = rising edge

IFS1bits.INT1IF = 0;               // Clear interrupt flag
IEC1bits.INT1IE = 1;               // Enable INT1 interrupt
```

And the corresponding ISR:

```c
void __attribute__((__interrupt__, auto_psv)) _INT1Interrupt(void) {
    IFS1bits.INT1IF = 0;           // Clear the interrupt flag
    LATBbits.LATB0 = 1;           // Toggle LED (for example)
}
```

---

### Register Summary for INT1

| Register               | Purpose                              |
|------------------------|--------------------------------------|
| `INTCON2bits.INT1EP`   | 1 = falling edge, 0 = rising edge    |
| `IEC1bits.INT1IE`      | Enable bit for INT1                  |
| `IFS1bits.INT1IF`      | Interrupt flag for INT1              |
| `IPC5bits.INT1IP`      | Priority level (optional)            |

---

### Example: Toggle LED on Button Press

You can connect a **button** between `RB7` and GND. When pressed, the line goes LOW, triggering the falling edge interrupt. The ISR toggles an LED on `RB0`.

> Remember to include a pull-up resistor (internal or external) to hold `RB7` HIGH when the button is not pressed.

---

### Quick Note: Pull-Up Resistors

When using an external interrupt triggered by a button, the pin needs to have a **known voltage level** when the button is **not pressed**. Otherwise, it may float unpredictably and trigger false interrupts.

A **pull-up resistor** holds the line HIGH by default. When the button is pressed, it pulls the line LOW — creating a clean falling edge.

You can use:
- An **external pull-up resistor** (e.g., 10kΩ to Vdd), or
- Enable the **internal pull-up** (on some PIC24 devices via `CNPUx` register)

> This ensures your interrupt only fires when the button is intentionally pressed.

---

Next, we’ll explore **Input Capture**, a different kind of input interrupt used for measuring timing of digital signals.

## Section 3: What Is Input Capture?

While external interrupts help detect **when** an event occurs, **input capture** helps you measure **how long** something took or **when exactly** it happened — with precision.

Input capture is used to **record the exact timer value** at the moment an external signal changes. This allows you to measure things like:

- The time between two button presses
- The frequency of a square wave
- The pulse width of a PWM signal

---

### Why Use Input Capture?

Input capture modules are tightly linked to timers. They **"capture" the current timer count** and store it in a buffer the moment a specified edge occurs.

This enables **precise time stamping** without needing to poll the input manually.

---

### Key Use Cases

- **Pulse width measurement** (how long a signal stayed high or low)
- **Frequency detection** (time between rising edges)
- **Reaction timing** (time between stimulus and response)
- Detecting **variable pulse signals** like servo control or ultrasonic sensors

---

### Input Capture vs External Interrupts

| Feature              | External Interrupt | Input Capture          |
|----------------------|--------------------|------------------------|
| Purpose              | Trigger code       | Record time of event   |
| Edge Response        | ISR runs on edge   | Timer value recorded   |
| Useful For           | Logic control      | Precision timing       |
| CPU Involvement      | Immediate ISR      | Minimal — buffered     |

> Use **input capture** when you're more interested in **when** something happened than **what** should happen immediately.

---

In the next section, we’ll walk through how to configure and use input capture modules on the PIC24.

## Section 4: Setting Up Input Capture (ICx)

To use Input Capture on the PIC24, you'll configure one of the ICx modules (e.g., IC1, IC2) to **record the timer value** when a digital signal changes on a designated pin.

The capture value is automatically placed into a buffer, which you can read later in software or inside an ISR.

---

### 🔹 Basic Configuration Steps

1. Configure the **pin as an input**
2. Select the **timer source** (usually TMR2 or TMR3)
3. Set the **edge mode** (rising, falling, or every edge)
4. Enable **interrupts** (optional, but common)
5. Read the **captured value** from the ICx buffer

---

### Code Example: Measure Time Between Pulses

```c
// Setup for IC1 using Timer2
IC1CON = 0
T2CON = 0                         //Set the configuration to 0 as good practice
TRISBbits.TRISB2 = 1;             // Set RB2 (IC1 input) as input

T2CONbits.TCKPS = 2;              // Prescaler 1:64
TMR2 = 0;
PR2 = 0xFFFF;
T2CONbits.TON = 1;                // Turn on Timer2

IC1CONbits.ICM = 1;               // Capture on every rising edge
IC1CONbits.ICTMR = 1;            // Use Timer2 as time base
IC1CONbits.ICI = 0;              // Interrupt on every capture
IC1CONbits.ON = 1;               // Enable Input Capture

IFS0bits.IC1IF = 0;              // Clear interrupt flag
IEC0bits.IC1IE = 1;              // Enable interrupt

// ISR to read captured time
void __attribute__((__interrupt__, auto_psv)) _IC1Interrupt(void) {
    IFS0bits.IC1IF = 0;          // Clear interrupt flag
    uint16_t time = IC1BUF;      // Read captured timer value
}
```

---

### Edge Detection Options

| Mode Value | Trigger Condition      |
|------------|------------------------|
| 1          | Every rising edge      |
| 2          | Every falling edge     |
| 3          | Every edge (rising + falling) |
| 0          | Module disabled        |

Set using: `ICxCONbits.ICM = value;`

> You can change the capture mode on the fly if you want to capture both rising and falling edges in sequence.

---

### 🎯 Interactive Input Capture Simulation

To deepen your understanding of how **Input Capture** modules operate, interact with the simulation below.  
Experiment with different pulse durations and observe how timer values are recorded at the rising edge of a signal.

- Press **Start Pulse** to simulate a rising edge event.
- Adjust the **Pulse Duration** using the slider before starting the pulse.
- Watch how the **captured timer value** changes based on pulse width!

👉 [Launch the Input Capture Simulation](../../sims/ic_sim/sim/ic-sim.html)


---
In the next section, we’ll summarize the difference between external interrupts and input capture, and wrap up with tips and use cases.

## Section 5: Summary and Best Practices

External interrupts and input capture give your microcontroller the ability to **react to real-world events** and **measure their timing precisely** — both essential tools in embedded systems.

---

### Key Takeaways

- **External Interrupts (INTx):**
  - Trigger an **ISR** when a pin changes (rising/falling edge)
  - Great for reacting to **button presses** or **logic events**
  - Must **clear the interrupt flag** inside the ISR

- **Input Capture (ICx):**
  - Records the **timer value** when a pin changes
  - Perfect for measuring **pulse width**, **frequency**, or **time between events**
  - Doesn’t require logic inside the ISR (just read `ICxBUF`)

- Both can be configured for **rising, falling, or both** edges

---

### Best Practices

- ✔️ Use **pull-up or pull-down resistors** to ensure clean digital signals
- ✔️ **Debounce buttons** (in software or hardware) to avoid multiple triggers
- ✔️ Clear flags inside the ISR: `IFSxbits.INTxIF` or `ICxIF`
- ✔️ Use **input capture** when timing is more important than triggering behavior
- ❌ Don’t read `ICxBUF` unless `ICxIF` is set — you could get junk data

---
---

### Note: Peripheral Pin Mapping (PPS)

On PIC24 devices with remappable pins, you must use **Peripheral Pin Select (PPS)** to assign Input Capture (ICx), Output Compare (OCx), UART, and other modules to specific physical pins.

For example, to map **IC1 to RP7 (e.g., RB7)**:

```c
__builtin_write_OSCCONL(OSCCON & 0xbf);   // Unlock PPS
RPINR7bits.IC1R = 7;                      // IC1 input = RP7
__builtin_write_OSCCONL(OSCCON | 0x40);   // Lock PPS
```

> Skipping this step may cause ICx or OCx modules to appear non-functional.

Always refer to your microcontroller’s **datasheet or family reference manual** to find valid RPx mappings for your device.

Next, we’ll explore **how to generate waveforms and control power** using output compare and PWM in Chapter 7!

### Quiz: External Interrupts & Input Capture

What does the input capture module do when it detects a rising edge on its input pin?

```c
IC1CONbits.ICM = 1;   // Capture on rising edge
```

<div class="upper-alpha" markdown>
1. Immediately jumps to an interrupt  
2. Saves the value of PRx  
3. Saves the value of TMRx into IC1BUF  
4. Resets the timer to zero  
</div>

??? question "Show Answer"
    The correct answer is **C**.

    The input capture module stores the **current value of the timer** (usually TMR2 or TMR3) into `IC1BUF` when the rising edge occurs.  
    This lets you determine exactly **when** the signal changed — great for measuring duration, frequency, or spacing between pulses.

---

### Prompt Practice

Write code that configures **Input Capture 1 (IC1)** to capture the time of every **falling edge** on pin **RP7**, using **Timer2** as the time base.  
Assume you’ve already configured `TMR2` with an appropriate prescaler.

??? example "Click to show solution"
    ```c
    // Set up pin mapping: IC1 on RP7 (RB7)
    __builtin_write_OSCCONL(OSCCON & 0xbf);   // Unlock PPS
    RPINR7bits.IC1R = 7;                      // Map IC1 input to RP7
    __builtin_write_OSCCONL(OSCCON | 0x40);   // Lock PPS

    // Configure IC1
    TRISBbits.TRISB7 = 1;           // RB7 as input
    IC1CONbits.ICTMR = 1;           // Use Timer2 as time base
    IC1CONbits.ICM = 2;             // Capture on falling edge
    IC1CONbits.ICI = 0;             // Interrupt on every event
    IC1CONbits.ON = 1;              // Turn on IC1

    IFS0bits.IC1IF = 0;             // Clear interrupt flag
    IEC0bits.IC1IE = 1;             // Enable interrupt

    // IC1 ISR
    void __attribute__((__interrupt__, auto_psv)) _IC1Interrupt(void) {
        uint16_t timeStamp = IC1BUF;   // Read captured time
        IFS0bits.IC1IF = 0;            // Clear flag
    }
    ```

