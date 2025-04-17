# Chapter 2: Assembly & Addressing Modes

## Section 1: Why Learn Assembly?

Modern embedded systems are often programmed in high-level languages like C, but understanding **assembly language** is crucial for writing efficient, low-level code and truly mastering how a microcontroller works.

Assembly gives you:

- **Complete control** over the CPU, memory, and peripheral access
- **Performance optimizations** that compilers can't always guarantee
- A deep understanding of what C code is actually doing "under the hood"
- The ability to debug complex timing or hardware interaction issues

Most high-level code on microcontrollers is eventually compiled into assembly — learning how to **read and write it directly** unlocks a new level of skill and insight.

---

### PIC24 Assembly Basics

The PIC24 family uses a RISC (Reduced Instruction Set Computing) assembly language with a **16-bit word size**. Each instruction typically executes in one cycle (excluding branching or memory fetches).

In this chapter, we’ll explore:
- The basic syntax of PIC24 assembly
- How data is moved between memory and registers
- The different **addressing modes** (immediate, direct, indirect)
- How to perform arithmetic and logical operations

## Section 2: Basic Instruction Structure & Syntax

Assembly instructions for the PIC24 follow a clear, consistent pattern:

```asm
OPCODE  OPERAND1, OPERAND2
```

Where:

- **OPCODE**: The operation to perform (e.g., `MOV`, `ADD`, `SUB`)
- **OPERAND1**: The **source** (where the data comes from)
- **OPERAND2**: The **destination** (where the result is stored)

---

### Example: Moving Data

```asm
MOV     W1, W0      ; Copy contents of W1 into W0
MOV     #10, W2     ; Load the literal value 10 into W2
```

- In `MOV W1, W0`, the value in `W1` is **copied into** `W0`
- In `MOV #10, W2`, the literal value 10 is **loaded into** `W2`

---

### Commenting Your Code

Use **semicolons** (`;`) to add inline comments:

```asm
CLR     W3          ; Clear register W3
ADD     W1, W2      ; Add W1 to W2 (result stored in W2)
```

> In PIC24 assembly, instructions often **modify the second operand** — the destination — directly.

## Section 3: Working Registers (W0–W15)

The PIC24 has **16 general-purpose working registers**, labeled `W0` through `W15`.

These are used in most instructions for arithmetic, logic, data movement, and memory access.

---

### What Are Working Registers?

Working registers are **fast-access memory locations** inside the CPU. They're used to:

- Perform calculations (`ADD`, `SUB`, `MUL`)
- Pass function arguments
- Store temporary values
- Hold addresses for memory access

---

### Common Usage

| Register | Role                  | Notes                                |
|----------|------------------------|----------------------------------------|
| W0–W13   | General-purpose         | Can be used freely                    |
| W14      | Frame Pointer (FP)      | Often used for accessing stack frames |
| W15      | Stack Pointer (SP)      | Always points to the top of the stack |

---

> Unlike high-level variables, working registers are **not named** — you must track their purpose as you code.

---

### Example

```asm
MOV     #42, W1       ; Load literal 42 into W1
MOV     #8,  W2       ; Load literal 8 into W2
ADD     W1, W2        ; W2 = W1 + W2 → result in W2
```

W1 and W2 now contain temporary values and the result of an operation — all without using main memory.



## Section 4: Addressing Modes in PIC24

Addressing modes define **how operands are accessed** in an instruction. PIC24 supports multiple flexible modes that give you precise control over data retrieval.

---

### 1. Immediate Addressing

Use a **literal constant** directly in the instruction.

```asm
MOV     #25, W0      ; Load the value 25 into W0
```

> `#25` is a literal constant. Useful for setting values or initializing registers.

---

### 2. Register Direct

Use the value stored in a working register.

```asm
MOV     W1, W2       ; Copy contents of W1 into W2
```

> Fastest mode — all operations using `Wn` fall under this category.

---

### 3. Register Indirect

Treat the contents of a register as a **pointer** to a memory address.

```asm
MOV     [W5], W0     ; Move value from memory pointed to by W5 into W0
```

> W5 holds the **address**, not the value. This accesses memory indirectly.

---

### 4. Indirect with Post-Increment

Automatically increments the pointer **after** the access.

```asm
MOV     [W6++], W1   ; W1 = *W6, then W6 = W6 + 2
```

> Ideal for traversing arrays. Increments by 2 bytes (since PIC24 uses 16-bit words).

---

### 5. Indirect with Pre-Decrement

Decrements the pointer **before** the access.

```asm
MOV     [--W6], W1   ; W6 = W6 - 2, then move from new address into W1
```

> Common when accessing stack values in reverse order.

---

### 6. Literal Offset + Register (Indexed)

Adds a literal offset to a base register.

```asm
MOV     [W8 + 4], W0   ; Move from address (W8 + 4) into W0
```

> Useful for arrays and structs.  
> Offset must be word-aligned (multiple of 2).

---

> Understanding addressing modes is essential for writing flexible and efficient assembly code.

## Section 5: Writing Clean, Readable Assembly

Writing assembly that works is good. Writing assembly that others (and future you) can understand? Even better.

Here are a few **best practices** for clean and maintainable PIC24 assembly:

---

### Use Labels Effectively

Labels are like **named bookmarks** in your code. They make loops and branches much easier to follow.

```asm
Loop:
    DEC     W0, W0
    CP      W0, #0
    BNE     Loop     ; Branch if W0 ≠ 0
```

> Always place labels on their own line for clarity.

---

### Comment Generously

Every line of code should **communicate intent**, not just function.

```asm
MOV     #10, W1      ; Load loop count
MOV     #0,  W2      ; Clear sum accumulator
```

> Write your comments for beginners — not just experts.

---

### Align Instructions

Neatly aligned code is **easier to scan** and debug.

```asm
MOV     #3,  W0
ADD     W1,  W0
CP      W0,  #5
```

> Consistent spacing makes your code look professional and polished.

---

### Use `NOP` for Debugging

```asm
NOP                 ; No operation – useful for breakpoints
```

> NOPs help pause execution at specific lines during simulation or hardware debugging.

---

Clean code isn’t about cleverness — it’s about clarity. Good formatting makes bugs easier to catch and logic easier to follow.


## Section 6: Summary and Instruction Cheat Sheet

By now, you’ve seen how assembly gives you **precise, low-level control** over your microcontroller.

---

### Key Takeaways

- PIC24 instructions follow the format: `OPCODE OPERAND1, OPERAND2`
- `W0–W15` are working registers used for calculations and memory access
- Addressing modes allow you to work with constants, registers, and memory
- Good formatting and comments make your code readable and debuggable

---

### Common PIC24 Assembly Instructions

| Instruction | Description                             |
|-------------|-----------------------------------------|
| `MOV`       | Move data between registers or from a literal |
| `ADD`       | Add two values                          |
| `SUB`       | Subtract one value from another         |
| `CLR`       | Clear a register (set to 0)             |
| `INC`/`DEC` | Increment or decrement a register       |
| `CP`        | Compare values (used with conditional branches) |

---

### Working Register Reference

| Register | Purpose                    |
|----------|----------------------------|
| `W0–W13` | General-purpose registers   |
| `W14`    | Frame pointer (optional)    |
| `W15`    | Stack pointer (must not modify manually) |

> Understanding these fundamentals will help you as we begin writing actual control logic, loops, and subroutines in the next chapter.

### Quiz: Assembly Fundamentals

What does the following instruction do?

```asm
MOV     W2, W1
```

<div class="upper-alpha" markdown>
1. W2 becomes equal to W1  
2. W1 becomes equal to W2  
3. W2 and W1 are cleared  
4. Nothing happens  
</div>

??? question "Show Answer"
    The correct answer is **B**.

    `MOV W2, W1` takes the contents of `W2` and copies them into `W1`.  
    The original value in `W1` is overwritten.

---

### Prompt Practice

Write a short assembly routine that:
- Loads the values 5 and 10 into two registers
- Adds them together
- Stores the result in a third register

Try to write it yourself first, then reveal the answer below.

??? example "Click to show solution"
    ```asm
    MOV     #5,  W0      ; Load 5 into W0
    MOV     #10, W1      ; Load 10 into W1
    ADD     W0,  W1      ; W1 = W0 + W1 → result in W1
    MOV     W1,  W2      ; Copy result into W2
    ```
