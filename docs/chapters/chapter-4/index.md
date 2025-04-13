# Chapter 4: Timers and Interrupts

## ⏱️ What Are Timers?

Timers are hardware modules in the PIC24 used for precise time measurement and periodic events. They’re essential for:

- Creating delays
- Measuring time between events
- Triggering code execution at regular intervals

### Key Features:
- Independent of CPU instructions
- Can be configured with different **prescalers** for flexible timing
- Often used to trigger **interrupts**

---

## ⏳ Types of Timers in PIC24FJ64GA002

| Timer | Width | Notes                        |
|-------|-------|------------------------------|
| TMR1  | 16-bit| Can generate interrupts       |
| TMR2  | 16-bit| Often used with Output Compare |
| TMR3  | 16-bit| Can combine with TMR2 (32-bit mode) |
| TMR4/5| 16-bit| Used for PWM or advanced timing |

Each timer can be configured using special function registers (SFRs), such as:

- `T1CON` – Timer1 Control Register  
- `PR1` – Period register (defines when an interrupt should fire)  
- `TMR1` – Current timer value  

---

## ⚙️ Timer Setup Example (Timer1)

```c
void setupTimer1() {
    T1CON = 0x8030;   // Enable Timer1, prescaler 1:256
    PR1 = 15625;      // Period register for 0.5s delay (assuming 8MHz clock)
    TMR1 = 0;         // Reset timer
    IEC0bits.T1IE = 1; // Enable Timer1 interrupt
    IFS0bits.T1IF = 0; // Clear interrupt flag
}

## What Are Interrupts?
Interrupts are special mechanisms that let the microcontroller respond to events(like a timer expiring or a ping changing) asynchronously - without constantly checking for them in code.

### Common Interrupt Sources includes: 
 - Timers
 - External pins(buttons)
 - Communication(UART, SPI, I2C)
 - ADC conversions

## 🧠 How Interrupts Work

1. An interrupt **event** occurs (e.g., Timer1 hits PR1)  
2. The CPU **pauses** normal execution  
3. Jumps to a special function: the **Interrupt Service Routine (ISR)**  
4. After ISR finishes, **execution resumes** where it left off


### Example: Timer1 Interrupt Handler 
```c
void __attribute__((interrupt, no_auto_psv)) _T1Interrupt(void) {
    IFS0bits.T1IF = 0;  // Clear interrupt flag
    LATBbits.LATB0 = 1; // Toggle LED on RB0
}
```

## 🧩 Notes on Interrupts

- Always **clear the interrupt flag** first inside the ISR!  
- Use the correct **ISR name** (e.g., `_T1Interrupt` for Timer1)  
- Keep ISRs **short and fast**  
- Use `__attribute__((interrupt))` to declare an ISR in C


### Summary 
Timers allow precise time-based operations
Interrupts let you react to events without polling
Together, they enable efficient embedded systems