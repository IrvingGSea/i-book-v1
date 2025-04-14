# Chapter 5: Timers and Interrupts

## Section 1: What Are Timers?

Timers are built-in hardware modules that allow the microcontroller to **track the passage of time**. Unlike using `NOP` instructions or software loops for delays, hardware timers are far more **precise, efficient, and interrupt-friendly**.

---

### 🔁 What Timers Actually Do

At their core, timers are just **counters**. They increment on each clock cycle (or prescaled clock cycle), and you can configure:

- When they **start**
- When they **reset**
- What value triggers an **interrupt or event**
- Whether they count **continuously** or **one time**

---

### 🧠 Why Timers Matter

Timers are one of the most essential peripherals for real-world embedded systems. They allow your program to:

- **Delay** an operation for a fixed time
- **Toggle LEDs** at precise intervals (blinking)
- **Measure durations** between events (e.g., how long a button is pressed)
- Generate **PWM (Pulse Width Modulation)**
- Act as the heartbeat of an **RTOS (Real-Time Operating System)**

---

### ⌚ Software Loops vs Hardware Timers

| Method           | Accurate? | Affects CPU? | Good for...                  |
|------------------|-----------|--------------|------------------------------|
| Software Delay   | ❌        | ✅ Yes        | Quick hacks, rough timing    |
| Hardware Timer   | ✅        | ❌ No         | Precise, real-time timing    |

> ✅ Timers are especially powerful when combined with **interrupts**, allowing your code to respond to time events without constantly checking them.

---

In the next section, we’ll explore how to configure and use timers on the PIC24 — including key registers and modes.

## Section 2: Timer Configuration on the PIC24

The PIC24 family includes multiple timers (Timer1, Timer2, etc.) that can be configured using special function registers (SFRs). To make a timer do anything useful, you’ll need to configure:

- The **timer control register** (e.g., `T1CON`)
- The **period register** (`PRx`) — when the timer should reset
- The **timer count register** (`TMRx`) — current value
- Optional: prescaler, interrupt enable, and clock source

---

### 🔹 Basic Timer Setup Steps

Here’s a typical configuration for a simple periodic timer:

```c
T1CON = 0                // Common practice to set everything low before modifying the bits you do care about
T1CONbits.TCKPS = 0b10;     // Prescaler = 1:64
PR1 = 15625;             // Set period register (timer resets at this value)
TMR1 = 0;                // Clear the timer count
T1CONbits.TON = 1;       // Turn on Timer1
```

### 🧠 Key Timer Registers (for TimerX)

| Register             | Description                                  |
|----------------------|----------------------------------------------|
| `T⟨x⟩CON`            | Timer Control Register for TimerX            |
| `PR⟨x⟩`              | Period Register — timer resets at this value |
| `TMR⟨x⟩`             | Timer Count Register (increments over time)  |
| `IFS0bits.T⟨x⟩IF`    | Interrupt Flag — set when timer expires       |
| `IEC0bits.T⟨x⟩IE`    | Interrupt Enable bit                         |

> 🔁 Replace ⟨x⟩ with the timer number: 1, 2, 3, etc.


### 🔧 Prescaler: Controlling Timer Speed

Most timers have a prescaler, which divides the system clock slow down how fast the timer increments. 
For example:


| Prescaler | Description             |
|-----------|-------------------------|
| 1:1       | Fastest (no division)   |
| 1:8       | 8× slower               |
| 1:64      | 64× slower              |
| 1:256     | Slowest — 256× slower   |

Choose a prescaler so your period fits nicely within a 16-bit register (0–65535).

 Tip: If your timer counts too fast, try increasing the prescaler or switching to a 32-bit timer by combining two 16-bit timers (e.g., Timer2 + Timer3).

In the next section, we’ll explore interrupts — and how they make timers even more powerful by allowing your code to respond asynchronously when the timer expires.

## Section 3: Interrupts - Responding to Events

In a real-world embedded system, you often want your code to respond **as soon as something happens** — without constantly checking for it. That’s where **interrupts** come in.

An **interrupt** is a hardware-triggered event that causes the processor to pause what it’s doing and run a **special function** called an **Interrupt Service Routine (ISR)**.

---

### 🔹 Why Use Interrupts?

Without interrupts, you'd need to use **polling** — continuously checking for a condition inside a loop:

```c
while (!timerExpired) {
    // check again and again...
}
```

This wastes CPU cycles. Instead, interrupts allow the microcontroller to do other things and only respond when needed. 

### 🔧 How Interrupts Work in PIC24

When an interrupt occurs (e.g., a timer hits `PRx`):

1. The CPU **pauses the main program**
2. The return address and some key registers are **pushed onto the stack**
3. The **ISR** is executed (defined by you)
4. A `RETFIE` (Return from Interrupt) instruction:
   - Pops saved values from the stack
   - Resumes main code exactly where it left off

#### Example: Timer1 Interrupt Flow

Assuming you've enabled the Timer1 interrupt:

```c
void __attribute__((__interrupt__, auto_psv)) _T1Interrupt(void) {
    IFS0bits.T1IF = 0;  // Clear interrupt flag
    // Handle event (e.g., toggle LED)
}
```

This function runs automatically every time Timer1.
`IFS0bits.T1IF` must be cleared manually at the beginning of the ISR to prevent retriggering 

### 📦 Interrupt Stack Behavior

| Action           | What Happens                               |
|------------------|--------------------------------------------|
| Interrupt occurs | Return address + status pushed to stack    |
| ISR runs         | Executes your code                         |
| RETFIE           | Pops return data and resumes main program  |

This is very similar to a `CALL`, but initiated by the hardware rather than code. 

## Section 4: Blinking an LED with a Timer Interrupt

Let’s build one of the most classic embedded applications: **blinking an LED** at regular intervals using a **hardware timer and interrupt**.

---

### 🔹 Goal

- Use **Timer1** to generate an interrupt every 500 ms
- Each time the interrupt occurs, toggle an LED connected to **PORTB, bit 0**

---

### 🛠️ Configuration: Timer + Interrupt + GPIO

Here’s a complete example:

```c
// Setup in main()
TRISBbits.TRISB0 = 0;         // Set RB0 as output
LATBbits.LATB0 = 0;           // Initialize LED OFF

T1CONbits.TCKPS = 3;          // Prescaler 1:256
PR1 = 31250;                  // 500ms interval with Fcy = 16MHz
TMR1 = 0;

IFS0bits.T1IF = 0;            // Clear interrupt flag
IEC0bits.T1IE = 1;            // Enable Timer1 interrupt
T1CONbits.TON = 1;            // Turn on Timer1

// Interrupt Service Routine
void __attribute__((__interrupt__, auto_psv)) _T1Interrupt(void) {
    LATBbits.LATB0 ^= 1;      // Toggle LED
    IFS0bits.T1IF = 0;        // Clear interrupt flag
}
```
### 🧠 Why This Works

- The timer counts up to `PR1` and triggers an interrupt  
- The ISR toggles the LED and resets the flag  
- The processor **automatically returns** to your main loop without losing track

> ✅ You don’t need to manually check the timer — the interrupt does the work!

### ⌛ Timing Notes

This example assumes:
- **Fcy = 16 MHz** (i.e., 8 MHz instruction cycle)
- Prescaler = 1:256
- PR1 = 31250 → 500 ms

If your clock speed is different, you'll need to recalculate `PR1`.

## Section 5: Summary and Best Practices

Timers and interrupts are two of the most powerful features of any microcontroller — and they often work best **together**.

---

### 🧠 Key Takeaways

- A **timer** is a hardware counter that increments with time
- Use `PRx` to define the period, and `TMRx` to track the current count
- Prescalers help slow the timer down to match your time intervals
- When a timer reaches its period, it can **trigger an interrupt**
- The interrupt service routine (**ISR**) runs automatically, handles the task, and returns
- Interrupts use the **stack** to preserve your program state

---

### ✅ Best Practices

- ✔️ **Always clear the interrupt flag** (`IFSx`) inside your ISR
- ✔️ Keep ISRs **short and efficient** — don’t do too much inside
- ✔️ Use **prescalers** to avoid overflow and fit time into a 16-bit period
- ✔️ For more timing flexibility, consider **32-bit timers** (pairing TMR2 + TMR3)
- ❌ Avoid polling timers unless your task is very short or must be ultra-deterministic
- ❌ Never use `delay()` loops when timers can do the job more cleanly

---

Next, we’ll take what we’ve learned about interrupts and apply it to external inputs — so your microcontroller can respond to real-world events like **button presses or signal edges** in **Chapter 6: External Interrupts & Input Capture**.

## 🧠 Quiz: Timers and Interrupts

What happens when the timer reaches the value in `PR1` and interrupts are enabled?

```c
T1CONbits.TON = 1;
PR1 = 31250;
IEC0bits.T1IE = 1;
```

<div class="upper-alpha" markdown>
1. The timer stops and resets to 0  
2. The CPU halts until the flag is cleared  
3. An interrupt is triggered and the ISR runs  
4. The timer overflows and restarts silently  
</div>

??? question "Show Answer"
    The correct answer is **C**.

    Once the timer reaches `PR1`, it resets to 0 and triggers an interrupt — **only if interrupts are enabled**.  
    This causes the processor to run the ISR (Interrupt Service Routine) associated with that timer.  
    After the ISR completes and the flag is cleared, the main program resumes.

## ✍️ Prompt Practice

Write code that configures **Timer1** to generate an interrupt every **250 milliseconds**, assuming a system clock (Fcy) of 16 MHz.  
In the ISR, toggle an LED connected to **PORTB bit 2**.

??? example "Click to show solution"
    ```c
    // Main setup
    TRISBbits.TRISB2 = 0;           // RB2 as output
    LATBbits.LATB2 = 0;             // Start with LED OFF

    T1CONbits.TCKPS = 3;            // Prescaler 1:256
    PR1 = 15625;                    // 250ms at Fcy = 16MHz
    TMR1 = 0;

    IFS0bits.T1IF = 0;              // Clear interrupt flag
    IEC0bits.T1IE = 1;              // Enable Timer1 interrupt
    T1CONbits.TON = 1;              // Turn on Timer1

    // ISR
    void __attribute__((__interrupt__, auto_psv)) _T1Interrupt(void) {
        LATBbits.LATB2 ^= 1;        // Toggle LED
        IFS0bits.T1IF = 0;          // Clear interrupt flag
    }
    ```
