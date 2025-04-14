# Chapter 7: Output Compare & PWM

## Section 1: What Is Output Compare?

The **Output Compare (OCx)** module on the PIC24 allows you to generate a digital output signal based on a **timer match event**.

At a high level, you configure a timer (like `TMR2`), and when the timer reaches a specific value stored in the `OCxR` or `OCxRS` register, the output pin **toggles**, **sets**, **clears**, or **pulses** depending on your chosen mode.

---

### 🧠 What It's Used For

- **Generate precise timing pulses**
- **Toggle an output pin** without software involvement
- **Create PWM signals** by controlling pulse width via timer values

---

### 🔁 How It Works

1. Timer (e.g., `TMR2`) counts up
2. When `TMR2` matches `OCxR`, the output pin changes
3. In PWM mode, this continues as long as the timer runs

This all happens in **hardware**, without using up CPU cycles.

---

### 🧪 Core Registers (Example: OC1)

| Register     | Role                                           |
|--------------|------------------------------------------------|
| `OC1R`       | Compare value — when output changes initially  |
| `OC1RS`      | Secondary compare — used in PWM mode           |
| `OC1CON`     | Control register for mode selection and timer link |
| `OC1IF`      | Interrupt flag (optional use)                  |

> 🔗 Output Compare modules are tightly tied to timers — most often **TMR2 or TMR3** — because these timers are **16-bit**, high-resolution, and designed for timing tasks like PWM generation.  
> Timers like TMR1 are typically reserved for timekeeping or general interrupts, while TMR2/TMR3 are better suited for waveform generation.


---

In the next section, we’ll step back briefly and explain what **Pulse Width Modulation (PWM)** is — since that’s the most popular use case for Output Compare modules.

## Section 2: What Is PWM (Pulse Width Modulation)?

**Pulse Width Modulation (PWM)** is a technique used to **simulate analog control** using a digital signal that rapidly switches between HIGH and LOW.

Instead of sending a constant voltage, PWM sends **pulses** — and by controlling **how long** the signal stays HIGH during each cycle, you can control the **average power delivered**.

---

### 🧠 Key Concepts

- **Period**: The total duration of one complete on/off cycle
- **Duty cycle**: The percentage of the period that the signal is HIGH
  - 100% duty = always ON
  - 0% duty = always OFF
  - 50% duty = ON for half the time, OFF for the other half
- **Frequency**: How many PWM cycles occur per second (Hz)

---

### 🔦 Why It's Useful

PWM allows you to:
- **Dim an LED** by adjusting brightness
- **Control motor speed** or servo position
- **Modulate audio signals**
- Generate analog-like control signals without needing a dedicated Digital-to-Analog Converter (DAC) — the PWM duty cycle controls the average voltage instead.



All of this is done with **just one digital output pin**.

---

### 📉 Example Duty Cycles

| Duty Cycle | Description             |
|------------|-------------------------|
| 0%         | Always OFF              |
| 25%        | Brief ON, mostly OFF    |
| 50%        | Equal ON and OFF        |
| 75%        | Mostly ON               |
| 100%       | Always ON               |

> 🎛️ Adjusting duty cycle lets you control how much "power" a device receives over time.

---

In the next section, we’ll connect this concept to **Output Compare** and show how to generate PWM signals in hardware using the `OCx` module.

## Section 3: Generating PWM with Output Compare

Now that you understand how PWM works, let's generate it in hardware using the **Output Compare (OCx)** module on the PIC24.

The OCx module can be configured to output a **PWM signal** using a timer (typically `TMR2` or `TMR3`) as a time base.

---

### 🔧 Configuration Overview

To generate PWM with `OCx`:

1. Set up a timer (`TMR2` or `TMR3`) with the desired period
2. Set `OCxR` to define when the pulse goes HIGH
3. Set `OCxRS` to define when the pulse goes LOW
4. Configure `OCxCON` to enable PWM mode
5. Map the OCx output to a physical pin (using PPS if required)

---

### 🛠️ Example: 50% Duty Cycle on OC1 using TMR2

```c
//Setting configuration so we don't keep any unwanted specification from prior, good practice
T2CON = 0
OC1CON = 0                 

// Map OC1 output to RP9 (e.g., RB9)
__builtin_write_OSCCONL(OSCCON & 0xbf);   // Unlock PPS
RPOR4bits.RP9R = 18;                      // RP9 = OC1
__builtin_write_OSCCONL(OSCCON | 0x40);   // Lock PPS

// Configure OC1 for PWM
OC1CONbits.OCM = 0b110;           // PWM mode, fault pin disabled
OC1CONbits.OCTSEL = 0;            // Use Timer2
OC1RS = 25000;                    // 50% duty cycle (pulse ends here)
OC1R = 25000;                     // Initial pulse start point
OC1CONbits.ON = 1;                // Enable Output Compare

// Configure Timer2 for PWM period
T2CONbits.TCKPS = 0b010;          // Prescaler 1:64
PR2 = 49999;                      // Sets PWM period
TMR2 = 0;
T2CONbits.TON = 1;                // Start Timer2
```

---

### 📏 Notes on Values

- `PR2` sets the **period** of the PWM
- `OC1RS` sets the **duty cycle** (pulse width)
- A value of `OC1RS = PR2 / 2` gives **50% duty**
- You can change `OC1RS` on the fly to adjust brightness/speed/etc.

> 🧠 Think of the timer as the metronome and OCx as the switch that turns the output pin ON and OFF with precise timing.

---

Next, we’ll compare this **hardware PWM** with the software-based version — and show why hardware is often the better choice.

## Section 4: Software vs Hardware PWM

There are two ways to generate a PWM signal on a microcontroller:

1. **Software PWM** — manually toggle a pin inside a loop
2. **Hardware PWM** — use the Output Compare (OCx) module linked to a timer

Let’s compare the two approaches:

---

### 🖥️ Software PWM

In software PWM, you write code like this:

```c
while (1) {
    LATBbits.LATB1 = 1;      // Set HIGH
    delay_us(500);           // ON time
    LATBbits.LATB1 = 0;      // Set LOW
    delay_us(500);           // OFF time
}
```

This works, but it:
- Uses the **CPU 100% of the time**
- Is affected by **interrupts or timing jitter**
- Doesn’t scale well (you can’t drive many PWM channels at once)

---

### ⚙️ Hardware PWM (with Output Compare)

In hardware PWM, once you configure the `OCx` module, the PWM output runs **automatically** in the background.

Benefits:
- 🔄 **Doesn't use CPU cycles**
- 🔍 **Precise timing** tied to hardware clock
- 💡 **Reliable frequency and duty cycle**
- 📈 **Scales well** (multiple OCx channels)

> 🧠 Hardware PWM is like a **metronome**: once set, it keeps time perfectly — while your code is free to focus on other tasks.

---

Unless you need something very custom, **hardware PWM is always the better choice** when available.

---

### ⚖️ Comparison Table

| Feature                | Software PWM               | Hardware PWM (OCx)         |
|------------------------|----------------------------|-----------------------------|
| CPU Usage             | High (manual toggling)     | Minimal (runs independently) |
| Timing Accuracy       | Affected by code & delays  | Very accurate (timer-based) |
| Interrupt Sensitivity | High                       | Low                         |
| Scalability           | Poor (one pin at a time)   | Excellent (multiple OCx modules) |
| Power Efficiency      | Low                        | High                        |

> ✅ Use **hardware PWM** whenever precise, low-overhead control is needed.

Next, we’ll wrap up with common applications and best practices.

## Section 5: Summary and Use Cases

The **Output Compare (OCx)** module is one of the most powerful peripherals on the PIC24 — especially when used to generate **PWM signals**.

Paired with a timer, it allows you to produce high-precision digital waveforms that simulate analog control — **without using CPU time**.

---

### 🔁 Key Takeaways

- **Output Compare** compares a timer value to a register (`OCxR`/`OCxRS`) and toggles an output accordingly.
- **PWM** (Pulse Width Modulation) controls average power by varying ON/OFF times.
- Hardware PWM is far superior to software-based PWM in timing accuracy, scalability, and CPU usage.
- You can remap OCx to various output pins using **Peripheral Pin Select (PPS)**.

---

### 💡 Real-World Applications

| Application        | How PWM Helps                           |
|--------------------|------------------------------------------|
| LED Dimming        | Adjust brightness by changing duty cycle |
| Servo Control      | Send precise pulse widths (1–2 ms range) |
| Motor Speed Control| Modulate voltage applied to motor coils  |
| Audio Generation   | Output tones or waveforms digitally      |
| Power Regulation   | Smooth delivery of variable DC voltage   |

> 🔧 PWM is everywhere — from drone motors to smart lightbulbs.

---

Next up, we’ll explore **communication and peripheral modules**, including UART, SPI, I2C, and ADCs!

### 🧠 Quiz: Understanding PWM Behavior

What happens if the value in `OC1RS` is set equal to `PR2` when generating PWM using Timer2?

```c
PR2 = 40000;
OC1RS = 40000;
```

<div class="upper-alpha" markdown>
1. The PWM signal will always be HIGH  
2. The PWM signal will be 50% duty cycle  
3. The PWM signal will always be LOW  
4. The PWM signal will toggle randomly  
</div>

??? question "Show Answer"
    The correct answer is **A**.

    If `OC1RS` equals `PR2`, the pulse stays HIGH for the full duration of the PWM period — resulting in **100% duty cycle**.  
    The output never drops LOW during the cycle.

---

### ✍️ Prompt Practice

Write code to configure **OC1** to generate a **75% duty cycle PWM signal** on pin **RP9**, using **Timer2** and a **period of 20 ms** (standard servo PWM timing).  
Assume a system clock of **16 MHz**.

??? example "Click to show solution"
    ```c
    // Configure Timer2 for 20 ms period
    T2CONbits.TCKPS = 3;              // Prescaler 1:256
    PR2 = 1250;                       // 20 ms at 16 MHz / 256

    TMR2 = 0;
    T2CONbits.TON = 1;                // Start Timer2

    // Map OC1 output to RP9 (RB9)
    __builtin_write_OSCCONL(OSCCON & 0xbf);   // Unlock PPS
    RPOR4bits.RP9R = 18;                      // RP9 = OC1
    __builtin_write_OSCCONL(OSCCON | 0x40);   // Lock PPS

    // Configure OC1 for PWM mode
    OC1CONbits.OCM = 0b110;           // PWM mode, no fault pin
    OC1CONbits.OCTSEL = 0;            // Use Timer2

    OC1RS = 937;                      // 75% duty cycle (0.75 × 1250)
    OC1R = 937;                       // Initial compare value
    OC1CONbits.ON = 1;                // Enable Output Compare
    ```
