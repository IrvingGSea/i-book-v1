# Chapter 5: External Interrupts

## 📟 What Are External Interrupts?

External interrupts allow the microcontroller to **respond immediately to changes on input pins** — such as buttons, sensors, or other devices triggering a logic change.

They are incredibly useful for handling **real-time user input** or reacting to asynchronous events.

---

## 📌 Key Pins and Registers

PIC24 devices support multiple external interrupts using special pins:

| Interrupt | Pin         | Description                    |
|-----------|-------------|--------------------------------|
| INT0      | Usually RB7 | Edge-triggered, non-maskable   |
| INT1      | Configurable| Edge-triggered, maskable       |
| INT2      | Configurable| Edge-triggered, maskable       |

### Important Registers:

| Register / Bit       | Purpose                                   |
|----------------------|-------------------------------------------|
| `INTxIF` (IFSx)      | Interrupt Flag — set when the event occurs |
| `INTxIE` (IECx)      | Interrupt Enable — must be set to 1       |
| `INTxEP`             | Edge polarity (1 = falling, 0 = rising)   |
| `RPINR0`, `RPINR1`, …| Remappable pins for INT1, INT2 (if supported) |

---

## 🧠 Edge-Triggered Behavior

You can configure external interrupts to trigger on:

- **Rising edge**: logic level 0 → 1 (e.g., button press)
- **Falling edge**: logic level 1 → 0 (e.g., button release)

This is controlled by the `INTxEP` bit.

---

## ⚡ Example: INT0 Button Interrupt

```c
void __attribute__((interrupt, no_auto_psv)) _INT0Interrupt(void) {
    IFS0bits.INT0IF = 0;     // Clear interrupt flag
    LATBbits.LATB0 = 1;     // Toggle an LED
}
```

## Setup Code:

```c
TRISBbits.TRISB7 = 1;     // Set RB7 (INT0) as input
INTCON2bits.INT0EP = 1;   // Trigger on falling edge
IFS0bits.INT0IF = 0;      // Clear flag
IEC0bits.INT0IE = 1;      // Enable INT0 interrupt
```

## 🧩 Best Practices

- Always **clear the interrupt flag** (`INTxIF`) at the start or end of the ISR  
- Use **pull-up/down resistors** to prevent floating inputs  
- Debounce mechanical inputs (like buttons) in software or hardware  
- Keep the ISR **short and efficient**

## 🧠 Use Cases

- Button presses  
- Motion detectors  
- Limit switches in robotics  
- External sensor signals
