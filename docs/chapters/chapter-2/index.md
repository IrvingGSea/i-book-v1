# Chapter 2: Assembly & Addressing Modes

## Why Learn Assembly?

Modern embedded systems are often programmed in high-level languages like C, but understanding **assembly language** is crucial for writing efficient, low-level code and truly mastering how a microcontroller works.

Assembly gives you:

- 🔍 **Complete control** over the CPU, memory, and peripheral access
- ⚡ **Performance optimizations** that compilers can't always guarantee
- 🧠 A deep understanding of what C code is actually doing "under the hood"
- 🛠️ The ability to debug complex timing or hardware interaction issues

Most high-level code on microcontrollers is eventually compiled into assembly — learning how to **read and write it directly** unlocks a new level of skill and insight.

---

### PIC24 Assembly Basics

The PIC24 family uses a RISC (Reduced Instruction Set Computing) assembly language with a **16-bit word size**. Each instruction typically executes in one cycle (excluding branching or memory fetches).

In this chapter, we’ll explore:
- The basic syntax of PIC24 assembly
- How data is moved between memory and registers
- The different **addressing modes** (immediate, direct, indirect)
- How to perform arithmetic and logical operations

## Basic Instruction Structure & Syntax

Each PIC24 assembly instruction follows a simple, consistent structure:

```asm
OPCODE  OPERAND1, OPERAND2
```
Where:
- OPCODE is the operation to perform (e.g. MOV, ADD, SUB, etc.)
- OPERAND1 is the source operand (what's being used for the operation)
- OPERAND2 is the destination operand (where the result is stored)

Example: Moving Data Between Registers
```asm
    MOV     W1, W0      ; Copy contents of W1 into W0
    MOV     #10, W2     ; Load the literal value 10 into W2
```

In the previous example: 
- MOV W1, W0 takes the contents of W1 and stores it in W0
- MOVE #10, W2 loads the immdeiate value 10 into W2

Use semicolons (;) for comments in the PIC24 assembly:
```asm
    CLR     W3          ; Clear W3 (set to zero)
    ADD     W1, W2      ; Add W1 to W2 (result stored in W2)
```

### Working Registers (W0–W15)

PIC24 has 16 general-purpose working registers used for arithmetic, data movement, memory access, and stack operations.

| Register | Purpose                        | Notes                             |
|----------|--------------------------------|-----------------------------------|
| W0–W13   | General-purpose registers      | Used for operations, temporary storage |
| W14      | Frame Pointer (FP)             | Typically points to current stack frame |
| W15      | Stack Pointer (SP)             | Automatically updated on function calls |


### Common PIC24 Assembly Instructions

| Instruction | Description |
|-------------|-------------|
| `MOV`       | Move data between registers or from an immediate value |
| `ADD`       | Add two registers or a register and a literal |
| `SUB`       | Subtract one register from another |
| `CLR`       | Clear a register (set it to 0) |
| `INC` / `DEC` | Increment / Decrement a register |
| `CP`        | Compare two values (affects flags; used with branches) |


## Addressing Modes in PIC24

Addressing modes define how data is accessed in an instruction. The PIC24 supports several flexible addressing modes, giving you control over where data comes from and how it's used.

Here are the most common addressing modes:

---

### 1. Immediate Addressing

Loads a constant (literal) value directly into a register.

```asm
MOV     #25, W0     ; #25 is a literal constant.
                    ; Common for setting values or initializing data.
```

### 2. Register Direct 

Uses a working register directly as the source or desination.

```asm
MOV     W1, W2      ; Copy contents of W1 into W2.
                    ; Fastest and simplest form.
                    ; All operations using Wn (W0–W15) fall under this mode.
```


### 3. Register Indirect

Uses a register as a pointer to data in memory

```asm
MOV     [W5], W0    ; Move value from address pointed to by W5 into W0.
                    ; W5 contains the address, not the value itself.
```

### 4. Indirect with Post-Increment

Automatically increments the pointer after the operation

```asm
MOV     [W6++], W1  ; Move from memory pointed to by W6 into W1.
                    ; Then W6 = W6 + 2.
                    ; Useful for reading data from arrays (word-aligned).
```


### 5. Indirect with Pre-Increment

Decrements the pointer before accessing the memory

```asm
MOV     [--W6], W1  ; W6 = W6 - 2, then move from new address into W1.
                    ; Useful when reading a stack or traversing backward.
```


### 6. Literal+Wn

Adds a literal offset to a base register

```asm
MOV     [W8 + 4], W0   ; Move from address (W8 + 4) into W0.
                       ; Often used for structure fields or array access.
                       ; Literal must be word-aligned (multiple of 2).
```

## Chapter Summary

In this chapter, we explored the fundamentals of PIC24 assembly language and how to work directly with the CPU's registers and memory.

### What You Learned:
- The basic **syntax** of PIC24 assembly instructions
- The role of **working registers** (`W0–W15`)
- How to use the **MOV**, `ADD`, `SUB`, and `CLR` instructions
- The key **addressing modes**:
  - Immediate
  - Register direct
  - Indirect with pre/post increment
  - Literal offset + register

### Why It Matters:
- Assembly gives you **precise control** over hardware
- It's the foundation for understanding how **C code interacts with hardware**
- You’ll need these concepts when working with the **stack**, **interrupts**, and **I/O peripherals**

---

## Up Next: Stack, Call, and Function Frames

In Chapter 3, we'll explore:
- How the PIC24 manages **function calls**
- The use of `W14` as the **frame pointer**
- How the **stack** works for passing data and preserving state

You'll learn to set up and tear down stack frames manually — a crucial skill for writing low-level code that’s reliable and efficient.
