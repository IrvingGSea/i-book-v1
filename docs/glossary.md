# Glossary

This glossary defines key terms used throughout the textbook.  
You can link to any term using standard Markdown linking.

---

#### ADC (Analog-to-Digital Converter)  
A module that converts real-world analog voltages into digital values that a microcontroller can process.

#### ACK / NACK  
Signals used in I2C communication. ACK (Acknowledge) confirms successful data receipt; NACK (Not Acknowledge) denies it.

#### Addressing Mode  
A method of specifying how and where to access data in assembly instructions (e.g., immediate, direct, indirect).

#### Assembly Language  
A low-level programming language that provides direct control of the hardware using symbolic instructions.

#### Baud Rate  
The number of bits transmitted per second in a serial communication protocol such as UART.

#### BNE (Branch if Not Equal)  
A conditional branch instruction that causes program flow to jump if the zero flag is **not** set.

#### BRA (Branch Always)  
An unconditional branch instruction used to jump to a labeled section of code.

#### Call Stack  
A memory structure that stores return addresses and local variables when subroutines are called.

#### CALL  
An instruction used to invoke a subroutine or function.

#### Compare (CP)  
An instruction that subtracts one value from another and sets flags based on the result — used before conditional branches.

#### DAC (Digital-to-Analog Converter)  
A peripheral that converts digital values into analog voltage. (Mentioned as a conceptual opposite to ADC.)

#### Debouncing  
The process of filtering out signal noise or bouncing, especially for buttons or mechanical switches.

#### DEC / INC  
Decrement or Increment – arithmetic instructions used to subtract or add 1 to a register.

#### Flag (Condition Code)  
A single-bit status indicator (e.g., Z for zero, C for carry, N for negative) used for conditional branching in assembly.

#### Firmware  
The permanent software programmed into the microcontroller's Flash memory.

#### Frame Pointer (W14)  
A register that helps reference variables in stack frames during function calls.

#### GOTO  
An instruction that jumps to a specific labeled location in code.

#### Immediate Value  
A constant literal used directly in an instruction, usually prefixed with `#` (e.g., `#10`).

#### Interrupt  
A signal that temporarily halts the normal program flow to run a special function called an Interrupt Service Routine (ISR).

#### ISR (Interrupt Service Routine)  
A function that runs automatically in response to an interrupt and returns control to the main program afterward.

#### I2C (Inter-Integrated Circuit)  
A two-wire serial communication protocol supporting multiple devices using addressing and shared lines.

#### Microcontroller  
A compact integrated circuit that includes a CPU, memory, and peripherals for real-time control of embedded systems.

#### MPLAB X IDE  
Microchip’s official development environment for programming PIC microcontrollers.

#### NOP  
An instruction that does nothing for one instruction cycle. Useful for breakpoints and timing.

#### Operand  
A value or register used in an assembly instruction (e.g., source or destination in a `MOV` instruction).

#### Opcode  
The operation code in assembly language that tells the processor what action to perform (e.g., `MOV`, `ADD`).

#### Output Compare  
A peripheral that compares a timer value to a preset and triggers an event — often used for PWM generation.

#### PIC24FJ64GA002  
The 16-bit microcontroller used in this textbook, produced by Microchip, featuring timers, ADCs, UART, and more.

#### Polling  
A method where the CPU continuously checks a condition (e.g., a flag or register), instead of responding to interrupts.

#### PPS (Peripheral Pin Select)  
A Microchip feature that allows flexible assignment of internal peripheral inputs/outputs to physical pins.

#### Prescaler  
A divider that reduces the clock frequency input to a timer, allowing for longer timing intervals.

#### PRx (Period Register)  
Register used to define the match/reset value of a timer, controlling when it overflows or triggers an interrupt.

#### Prompt  
A short, scenario-based coding challenge intended to help students apply concepts through practice.

#### PWM (Pulse-Width Modulation)  
A method for simulating analog output using digital pulses of variable duty cycle — used in motor control, dimming, etc.

#### Register (W0–W15)  
A small, fast-access memory location in the CPU used to hold data during computation.

#### RET  
An instruction that returns from a subroutine by restoring the last return address from the stack.

#### Stack  
A last-in, first-out (LIFO) memory structure used for storing return addresses and function call data.

#### Stack Pointer (W15)  
A special-purpose register that always points to the top of the call stack.

#### Subroutine  
A reusable block of code (a function) that can be called from multiple places in the program.

#### Timer  
A peripheral that counts clock cycles and can generate interrupts when it matches a preset value.

#### UART (Universal Asynchronous Receiver/Transmitter)  
A hardware module for asynchronous serial communication using TX/RX lines.

#### Watchdog Timer (WDT)  
A system-reset timer that triggers a reset if the program stops running or hangs unexpectedly.

#### Working Register  
One of 16 fast-access registers (`W0`–`W15`) used for computation, memory access, and control flow.

#### XOR  
A bitwise logic operation that outputs true when inputs differ — often used for toggling values.
