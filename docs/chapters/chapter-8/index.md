# Chapter 8: Communication & Peripherals

## Section 1: Why Communication Matters

Microcontrollers are powerful, but they rarely operate in isolation. Most embedded systems need to **communicate with other devices**, whether it's a:

- Computer (e.g., serial terminal)
- Sensor (e.g., accelerometer, temperature probe)
- Display (e.g., OLED or LCD)
- Another microcontroller or peripheral

To accomplish this, microcontrollers use a variety of **serial communication protocols** that allow them to send and receive data efficiently.

---

### Serial vs Parallel Communication

| Type      | Description                                  | Example Use          |
|-----------|----------------------------------------------|----------------------|
| Parallel  | Multiple bits sent simultaneously (wider)    | Older systems, LCDs  |
| Serial    | Bits sent one at a time over fewer wires     | UART, SPI, I2C       |

> Parallel is faster in theory, but requires many I/O pins and wires. Serial is simpler, more scalable, and dominates in modern designs.

---

### Why We Use UART, SPI, and I2C

These three protocols are the most common in microcontroller systems:

| Protocol | Wires | Use Case                              | Speed         |
|----------|-------|----------------------------------------|---------------|
| UART     | 2     | PC communication, debugging            | Moderate (115200+ bps) |
| SPI      | 4     | High-speed peripherals, sensors        | Fast (MHz+)   |
| I2C      | 2     | Multi-device, low-speed communication  | Moderate (~100k–400kHz) |

Each has tradeoffs — some are better for **speed**, some for **simplicity**, and some for connecting **many devices**.

---

### Tradeoffs & Limitations

| Protocol | Limitations                                                                 |
|----------|------------------------------------------------------------------------------|
| UART     | Only supports **one-to-one** communication, requires matching baud rates    |
| SPI      | Needs **more wires**, no built-in addressing, typically **one master only** |
| I2C      | Slower than SPI, more complex protocol, can suffer from **bus contention**  |

> Choosing the right protocol depends on the number of devices, speed requirements, and system complexity.

---

In the next sections, we'll explore each protocol in detail, how to configure it on the PIC24, and common use cases.

## Section 2: UART (Universal Asynchronous Receiver/Transmitter)

**UART** is a simple serial communication protocol that sends and receives data **asynchronously** — meaning it doesn’t need a shared clock between devices.

Instead, both devices agree on a **baud rate** (bits per second), like `9600`, `38400`, or `115200`, and communicate using two lines:

- **TX (transmit)**
- **RX (receive)**

---

### UART Frame Format

Each UART message is made up of:
- 1 start bit
- 8 data bits (usually)
- Optional parity bit
- 1 stop bit

So sending **1 byte** over UART actually sends **at least 10 bits**.

> Timing is critical — both devices must use the same baud rate to avoid garbled data.

---

### Configuring UART on the PIC24

UART modules are named `U1MODE`, `U1STA`, etc. for **UART1**. You’ll also need to map TX/RX pins using PPS.

Example: Echo received characters using UART1 at 9600 baud.

```c
// Configure pins (TX = RP10, RX = RP8)
__builtin_write_OSCCONL(OSCCON & 0xbf);   // Unlock PPS
RPOR5bits.RP10R = 3;                      // U1TX on RP10
RPINR18bits.U1RXR = 8;                    // U1RX on RP8
__builtin_write_OSCCONL(OSCCON | 0x40);   // Lock PPS

// UART1 Settings
U1MODEbits.BRGH = 0;                      // Standard speed mode
U1BRG = 103;                              // Baud = 9600 (for 16MHz clock)
U1MODEbits.UARTEN = 1;                    // Enable UART
U1STAbits.UTXEN = 1;                      // Enable TX

// Echo loop
while (1) {
    if (U1STAbits.URXDA) {               // Data available?
        char c = U1RXREG;                // Read char
        while (!U1STAbits.TRMT);         // Wait if TX is busy
        U1TXREG = c;                     // Echo back
    }
}
```

---

### Typical Use Cases

- Serial terminals (via USB-to-UART converters)
- Debugging (print variables over UART)
- Interfacing with GPS, Bluetooth, or WiFi modules

> UART is often your **first line of communication and debugging** when bringing up a new project.

---

Up next: we’ll cover **SPI**, a faster protocol with full-duplex communication.

### UART Simulation
To visualize how UART communication transmits data bits with start/stop frames:

👉 [Launch UART Communication Simulation](../../sims/uart-transmission/sim/index.html)

---

### Quiz: UART Communication

Which of the following **must be true** for two devices to successfully communicate over UART?

<div class="upper-alpha" markdown>
1. They must share the same clock signal  
2. They must have the same pin mappings  
3. They must use the same baud rate  
4. They must use a master-slave architecture  
</div>

??? question "Show Answer"
    The correct answer is **C**.

    UART is asynchronous — there is **no shared clock**.  
    However, both devices must be configured to use the **same baud rate**, or else the timing will be mismatched and the data will be corrupted.

---

### Prompt Practice

Write code to configure **UART1** to transmit the string `"Hello"` continuously at **115200 baud**, using TX on **RP9**.

??? example "Click to show solution"
    ```c
    // PPS Mapping for UART1 TX
    __builtin_write_OSCCONL(OSCCON & 0xbf);   // Unlock PPS
    RPOR4bits.RP9R = 3;                       // U1TX on RP9
    __builtin_write_OSCCONL(OSCCON | 0x40);   // Lock PPS

    // UART1 Settings
    U1MODEbits.BRGH = 0;                      // Standard speed
    U1BRG = 8;                                // 115200 baud @ 16MHz
    U1MODEbits.UARTEN = 1;                    // Enable UART
    U1STAbits.UTXEN = 1;                      // Enable TX

    // Transmit "Hello" forever
    while (1) {
        const char *msg = "Hello\r\n";
        for (int i = 0; msg[i] != '\0'; i++) {
            while (!U1STAbits.TRMT);          // Wait if TX is busy
            U1TXREG = msg[i];
        }
        __delay_ms(1000);                     // Delay 1s between messages
    }
    ```

## Section 3: SPI (Serial Peripheral Interface)

**SPI** is a high-speed, full-duplex communication protocol designed for fast data exchange between a **master** and one or more **slaves**.

Unlike UART, SPI uses a **shared clock line**, which enables tight synchronization between devices.

---

### SPI Signals

| Line | Name  | Direction (Master → Slave) |
|------|-------|-----------------------------|
| SCK  | Clock | ⬅ Master provides clock     |
| MOSI | Data  | ⬅ Master Out, Slave In      |
| MISO | Data  | ⬅ Master In, Slave Out      |
| SS   | Select| ⬅ Active LOW (one per slave) |

> SPI is faster than UART or I2C and supports **streaming data in both directions at once**.

---

### How SPI Works

- The **master** controls the clock (SCK)
- Data is shifted out **bit by bit** on MOSI/MISO
- The **slave select (SS)** line tells which device is active
- Most devices use **8-bit or 16-bit transfers**

---

### Configuring SPI on PIC24 (as Master)

```c
// Set up SPI1 in Master mode (8-bit, clock = Fosc/16)
SPI1CON = 0;
SPI1CON1bits.MSTEN = 1;        // Master mode
SPI1CON1bits.MODE16 = 0;       // 8-bit mode
SPI1CON1bits.CKE = 1;          // Clock edge
SPI1CON1bits.SMP = 0;          // Input sampled in middle
SPI1CON1bits.SPRE = 0b110;     // Secondary prescaler 2:1
SPI1CON1bits.PPRE = 0b10;      // Primary prescaler 4:1
SPI1STATbits.SPIEN = 1;        // Enable SPI

// Transmit one byte (0xAA)
SPI1BUF = 0xAA;
while (!SPI1STATbits.SPIRBF);  // Wait until received
uint8_t received = SPI1BUF;    // Read incoming byte
```

---

### Use Cases

- SD cards, flash memory
- OLED displays
- High-speed sensors (accelerometers, gyros)
- DACs or other peripherals needing fast streaming

---

> SPI is great for **speed** and **low-latency**, but requires more pins and doesn’t support automatic addressing like I2C.

Next up: we’ll cover **I2C**, ideal for connecting many devices with fewer wires.

### 🔁 SPI Simulation
See how the master-slave architecture of SPI works with SCLK, MOSI, and MISO lines:

👉 [Launch SPI Communication Simulation](../../sims/spi-communication/sim/index.html)

---

### Quiz: SPI Basics

Which of the following is **NOT true** about the SPI protocol?

<div class="upper-alpha" markdown>
1. It uses a clock signal shared by the master  
2. It can transfer and receive data simultaneously  
3. It requires only one wire for communication  
4. It allows for fast data exchange with peripherals  
</div>

??? question "Show Answer"
    The correct answer is **C**.

    SPI uses **at least 4 wires**: SCK, MOSI, MISO, and SS.  
    While it's fast and full-duplex, it’s **not a single-wire protocol** like some asynchronous options.

---

### Prompt Practice

Write code to configure **SPI1** on the PIC24 to operate in **8-bit master mode**, then send the value `0x55` and store the received byte.

??? example "Click to show solution"
    ```c
    // SPI1 Master Mode Setup
    SPI1CON1bits.MSTEN = 1;        // Master mode
    SPI1CON1bits.MODE16 = 0;       // 8-bit mode
    SPI1CON1bits.CKE = 1;          // Data changes on active-to-idle clock edge
    SPI1CON1bits.SMP = 0;          // Input sampled in middle of data output
    SPI1CON1bits.SPRE = 0b110;     // Secondary prescaler 2:1
    SPI1CON1bits.PPRE = 0b10;      // Primary prescaler 4:1
    SPI1STATbits.SPIEN = 1;        // Enable SPI

    // Transmit 0x55 and receive byte
    SPI1BUF = 0x55;
    while (!SPI1STATbits.SPIRBF);  // Wait for transmission complete
    uint8_t received = SPI1BUF;    // Read received byte
    ```
## Section 4: I2C (Inter-Integrated Circuit)

**I2C** is a synchronous, serial protocol designed for **communication between multiple devices** using just **two wires**:

- **SCL**: Clock line
- **SDA**: Data line

One device acts as the **master** (controls the clock), while others act as **slaves**.

---

### I2C Addressing

Each slave on the bus has a **7-bit or 10-bit address**. The master begins communication by sending:

- A **START condition**
- The **address** of the device it wants to talk to
- A **Read/Write bit**
- A slave responds with an **ACK** or **NACK**

---

### Typical Use Cases

- Reading data from sensors (temp, accelerometer, etc.)
- Communicating with I2C memory (EEPROMs)
- Interfacing with real-time clocks or displays

> I2C is slower than SPI but allows many devices to share just **two pins**, saving valuable I/O space.

---

### I2C Example: Reading a Byte from a Slave (Pseudo-code)

```c
I2C1CON = 0;
I2C1CONbits.SEN = 1;               // START condition
while (I2C1CONbits.SEN);           // Wait for START complete

I2C1TRN = 0b10100000;              // Send slave address (write mode)
while (I2C1STATbits.TBF);          // Wait until byte sent

// Wait for ACK from slave
while (I2C1STATbits.ACKSTAT);      // 0 = ACK, 1 = NACK

I2C1TRN = 0x00;                    // Send register address to read
while (I2C1STATbits.TBF);

// Restart condition to switch to read mode
I2C1CONbits.RSEN = 1;
while (I2C1CONbits.RSEN);

I2C1TRN = 0b10100001;              // Send slave address (read mode)
while (I2C1STATbits.TBF);

// Wait for ACK, then enable receive
while (I2C1STATbits.ACKSTAT);
I2C1CONbits.RCEN = 1;              // Enable receive mode

while (!I2C1STATbits.RBF);         // Wait for byte
uint8_t value = I2C1RCV;           // Read received byte

I2C1CONbits.PEN = 1;               // STOP condition
while (I2C1CONbits.PEN);
```

---

### Notes

- I2C requires **pull-up resistors** on both SDA and SCL lines
- Only **one master** should control the bus at a time
- Communication is slower (~100–400kHz typically), but very space-efficient

---

Next, we’ll look at how to read **real-world analog signals** using the **ADC module**.

### 🔄 I2C Simulation
Understand I2C with clock-synchronized data transfers and start/stop conditions:

👉 [Launch I2C Communication Simulation](../../sims/i2c-communication/sim/index.html)

### Quiz: I2C Communication

Why does I2C require pull-up resistors on the SDA and SCL lines?

<div class="upper-alpha" markdown>
1. To limit power draw from slaves  
2. To allow multiple masters to drive the bus simultaneously  
3. To ensure the lines return to HIGH when not actively driven  
4. To increase the data rate of communication  
</div>

??? question "Show Answer"
    The correct answer is **C**.

    I2C uses **open-drain outputs**, meaning devices can pull the line LOW but not drive it HIGH.  
    **Pull-up resistors** ensure the lines default to HIGH when not being pulled down — allowing multiple devices to safely share the bus.

---

### Prompt Practice

Write code to initiate an I2C transmission to a device with address `0x68`, send a register address `0x1C`, then restart and request a single byte of data from it.

??? example "Click to show solution"
    ```c
    // START condition
    I2C1CONbits.SEN = 1;
    while (I2C1CONbits.SEN);

    // Send slave address (write)
    I2C1TRN = 0xD0;                    // 0x68 << 1 | 0 (write)
    while (I2C1STATbits.TBF);
    while (I2C1STATbits.ACKSTAT);     // Wait for ACK

    // Send register address (0x1C)
    I2C1TRN = 0x1C;
    while (I2C1STATbits.TBF);

    // RESTART condition
    I2C1CONbits.RSEN = 1;
    while (I2C1CONbits.RSEN);

    // Send slave address (read)
    I2C1TRN = 0xD1;                    // 0x68 << 1 | 1 (read)
    while (I2C1STATbits.TBF);
    while (I2C1STATbits.ACKSTAT);

    // Enable receive mode
    I2C1CONbits.RCEN = 1;
    while (!I2C1STATbits.RBF);        // Wait for byte

    uint8_t result = I2C1RCV;         // Read data

    // STOP condition
    I2C1CONbits.PEN = 1;
    while (I2C1CONbits.PEN);
    ```

## Section 5: ADC (Analog-to-Digital Converter)

**Analog-to-Digital Conversion (ADC)** lets your microcontroller read **real-world analog signals** — like voltage, temperature, or light level — and convert them into **digital values** it can process.

---

### What Does the ADC Do?

An ADC samples an input voltage (e.g., 0–3.3V) and converts it into a digital number based on:

- **Resolution** (typically 10 bits on PIC24 → values from 0 to 1023)
- **Reference Voltage** (`VREF+` and `VREF-`)
- **Sampling time** (how long it takes to stabilize before conversion)

> For example, if `VREF+ = 3.3V`, then a reading of 512 ≈ 1.65V.

---

### Configuring ADC on PIC24

Let’s read analog voltage on **AN0 (RB0)** using the 10-bit ADC module.

```c
// Configure RB0/AN0 as analog input
AD1PCFGbits.PCFG0 = 0;          // Set AN0 as analog
TRISBbits.TRISB0 = 1;           // Set RB0 as input

// ADC Configuration
AD1CON = 0;
AD1CON1bits.FORM = 0;           // Integer output
AD1CON1bits.SSRC = 7;           // Auto-convert
AD1CON1bits.ASAM = 1;           // Auto-sample

AD1CON2 = 0;                    // Use MUXA, Vref+ = AVdd, Vref- = AVss
AD1CON3bits.ADCS = 2;           // ADC clock = Tcy × (ADCS + 1)
AD1CHSbits.CH0SA = 0;           // Select AN0

AD1CON1bits.ADON = 1;           // Turn on ADC

// Read a value
__delay_ms(1);                  // Allow ADC to stabilize
while (!AD1CON1bits.DONE);      // Wait for conversion
uint16_t result = ADC1BUF0;     // Read the result
```

---

### Example Conversions (10-bit ADC)

| Input Voltage | ADC Value |
|---------------|------------|
| 0.0 V         | 0          |
| 1.65 V        | 512        |
| 3.3 V         | 1023       |

> ADC values are linear — you can scale them to voltage using:  
> `V = (ADC / 1023.0) × VREF`

---

To better understand how an **Analog-to-Digital Converter (ADC)** samples continuous signals, use the interactive simulation below.  

👉 [Launch the Analog to Digital Simulation](../../sims/acd-sim/sim/adc-sim.html)

Adjust the sampling rate and resolution to see how these parameters affect the digital representation of a smooth analog waveform.


---

Next up: a quick summary of all communication modules and where they’re most useful!

## Section 6: Summary and Use Cases

Here's a quick recap of the communication and peripheral modules covered:

| Module | Use Case                            | Pros                              | Tradeoffs                         |
|--------|-------------------------------------|-----------------------------------|-----------------------------------|
| UART   | PC comms, debugging                 | Simple, widely supported          | One-to-one only, no addressing    |
| SPI    | Sensors, memory, displays           | Fast, full-duplex                 | Needs 4 wires, no native addressing |
| I2C    | Multiple devices, clocks, EEPROMs   | Two wires, device addressing      | Slower, requires pull-ups         |
| ADC    | Sensors, analog input               | Converts real-world signals       | Needs stable voltage, limited speed |

> Choose the right tool for the job — and test with real hardware whenever possible!

---

### Quiz: Understanding ADC

You’re using a 10-bit ADC with a reference voltage of 3.3V.  
What voltage does a digital reading of `682` most closely represent?

<div class="upper-alpha" markdown>
1. 1.1 V  
2. 2.2 V  
3. 3.0 V  
4. 3.3 V  
</div>

??? question "Show Answer"
    The correct answer is **B (2.2 V)**.

    Use the conversion formula:  
    `V = (ADC / 1023) × VREF`  
    → `(682 / 1023) × 3.3V ≈ 2.2V`

---

### Prompt Practice

Write code to configure the ADC to read from **AN2 (RB2)** and store the result in a variable.

??? example "Click to show solution"
    ```c
    // Configure AN2/RB2 as analog input
    AD1PCFGbits.PCFG2 = 0;           // AN2 = analog
    TRISBbits.TRISB2 = 1;            // RB2 as input

    // Basic ADC config
    AD1CON1bits.FORM = 0;            // Integer format
    AD1CON1bits.SSRC = 7;            // Auto-convert
    AD1CON1bits.ASAM = 1;            // Auto-sample

    AD1CON2 = 0;
    AD1CON3bits.ADCS = 2;
    AD1CHSbits.CH0SA = 2;            // Use AN2

    AD1CON1bits.ADON = 1;            // Enable ADC

    // Read the ADC value
    __delay_ms(1);
    while (!AD1CON1bits.DONE);
    uint16_t adcValue = ADC1BUF0;
    ```

---



That’s the end of Chapter 8! 

