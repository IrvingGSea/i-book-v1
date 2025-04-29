# Chapter 3: Branching & Loops in Assembly

## Section 1: Controlling the Flow of Execution

Until now, we’ve written assembly code that executes **linearly** — one instruction after another from top to bottom. But real programs rarely follow a straight path. They make **decisions**, **repeat tasks**, and **jump** between sections of code.

To do this in assembly, we use:

- **Branching** to jump to different parts of the code
- **Conditional instructions** to decide *when* to branch
- **Loops** to repeat actions until a condition is met

Just like in higher-level languages (`if`, `while`, `for`), branching and looping let us create flexible, reactive, and dynamic programs — but we build them manually in assembly using a combination of **labels**, **comparison instructions**, and **branch instructions**.

### Real-World Example: Polling a Button

Let’s say you want your microcontroller to **wait until a button is pressed**, and then turn on an LED. That requires:

- Repeatedly checking a pin (a loop)
- Branching based on whether the pin is high or low (a decision)

In assembly, that logic would look like:

```asm
CheckButton:
    MOV     PORTB, W0         ; Load PORTB into W0
    AND     W0, #0x0001, W0   ; Mask all but bit 0 (RB0)
    CP      W0, #0            ; Is RB0 low?
    BEQ     CheckButton       ; If yes, button not pressed → loop back

    BSET    LATB, #1          ; Set RB1 (turn on LED)

```
This example shows both a **loop**(keep checking) and a **branch**(skip ahead once the button is pressed)

> **Avoid using `INC LATB` or `ADD LATB, #value`**

These instructions modify the **entire 16-bit latch**, which can unintentionally affect multiple output pins. For example:

- If only RB1 should be set, `INC` might toggle RB0 or clear RB1 depending on the current value.
- Using arithmetic operations doesn’t preserve the state of other bits.

## Section 2: Unconditional Branching

In assembly, **unconditional branching** allows you to jump to another part of your program without checking any condition. It’s like saying, “Go here, no matter what.”

This is useful for:

- Skipping over code
- Repeating a block (with labels)
- Structuring loops
- Returning to a main loop after an operation

---

### 🔹 `BRA` — Branch Always

The `BRA` instruction causes the program to **jump to a label**. Execution continues from that label as if the code above it didn’t exist.

```asm
BRA     MainLoop 
```
BRA uses relative addressing (i.e. jump a certain number of instruction forward/backward). 
A tip for BRA is to use it for most control flow and loops.

### 🔹 `Call` and `Return` (Preview)

You can also branch to a subroutine using `Call`, which saves the current program counter(PC) onto the stack. When the subroutine is done, it uses RETURN to jump back.

```asm
CALL    DelayLoop    ; Jump to subroutine
RETURN               ; Return from it
```

We'll cover the stack and subroutines more deeply in **Chapter 4**, so for now just think of `CALL` as a way to jump to a reusable block of code and RETURN as a way to come back. 

### Summary

| Instruction | Purpose                                 |
|-------------|------------------------------------------|
| `BRA`       | Unconditional branch (relative)          |
| `CALL`      | Branch to subroutine (saves return address on stack) |
| `RETURN`    | Return from subroutine (restores execution flow)     |

## Section 3: Conditional Branching

Sometimes, you want to branch **only if a condition is true** — like jumping to a section of code *only if two values match*, or *only if a counter hasn’t hit zero yet*.

To do that, PIC24 uses a two-step process:
1. Compare values using the `CP` (Compare) instruction
2. Use a conditional branch like `BNE` or `BEQ` based on the result

---

### 🔹 Step 1: Compare with `CP`

The `CP` instruction **compares two values** by internally performing a subtraction (without storing the result). It sets **status flags** (Zero, Negative, Overflow, etc.) based on the result.

```asm
CP      W0, W1     ; Compare W0 to W1
```
After this, the processor knows whether `W0 == W1`, `W0 < W1`, or `W0 > W1`

### 🔹 Step 2: Branch Based on Flags

Once `CP` sets the condition flags, you can use one of several conditional branch instructions:

| Instruction | Meaning                     | Condition Tested   |
|-------------|------------------------------|---------------------|
| `BEQ`       | Branch if equal              | Z = 1 (Zero flag)   |
| `BNE`       | Branch if not equal          | Z = 0               |
| `BLT`       | Branch if less than (signed) | N ≠ V               |
| `BGE`       | Branch if greater/equal      | N = V               |
| `BRA`       | Branch always (no condition) | —                   |


```asm
CP      W0, #10      ; Compare W0 to literal 10
BEQ     MatchLabel   ; If W0 == 10, jump to MatchLabel
    ; This code runs if W0 ≠ 10

MatchLabel:
    ; This code runs only if W0 == 10
```
### What Are Condition Flags?

When the PIC24 performs a compare, it updates specific bits in the **Status Register (SR)**:

- **Z (Zero)**: Set if the result is zero (values matched)  
- **N (Negative)**: Set if result was negative  
- **C (Carry)** and **V (Overflow)**: Used in signed/unsigned comparisons  

These flags are **not written directly by your code** — they’re set automatically by instructions like `CP`, `SUB`, or `ADD`.

## Section 4: Loops in Assembly

Loops are a fundamental programming structure that let you repeat code **until a condition is met**. In high-level languages, we use constructs like `for` or `while`. In assembly, we build loops manually using:

- A **label** to mark the start of the loop
- A **comparison (`CP`)**
- A **conditional branch (`BNE`, `BEQ`, etc.)**

---

### 🔹 Counting Down Example

This loop counts from 3 down to 0 and stops when the counter reaches zero:

```asm
    MOV     #3, W0         ; Initialize counter to 3

LoopStart:
    ; [Insert code you want to repeat here]

    DEC     W0, W0         ; Decrement counter
    CP      W0, #0         ; Is counter zero?
    BNE     LoopStart      ; If not, repeat loop
```
This loop executes 3 times with W0 values: 2, 1, 0

### 🔹 Counting Up Example

If you want to count up instead:

```asm
    MOV     #0, W0         ; Start at 0

LoopStart:
    ; [Repeat logic here]

    INC     W0, W0         ; Increment counter
    CP      W0, #4         ; Stop when W0 reaches 4
    BNE     LoopStart
```

This runs the loop while W0 = 0,1,2,3 - a total of 4 iterations.

### 🔹 Why Assembly Loops Require Manual Control

Unlike C or Python, assembly doesn’t have `while`, `for`, or `do...while` built in. But using just a few instructions, you can build any loop structure:

| High-Level Idea         | Assembly Equivalent                        |
|--------------------------|--------------------------------------------|
| `while (x != 0)`         | label + `CP` + `BNE`                        |
| `for (i = 0; i < 4; i++)`| `MOV` + label + `INC` + `CP` + `BNE`       |
| Infinite loop            | label + `BRA label`                        |




### Looping Summary: 
 - Loops require a counter, a label, a comparison, and a branch.
 - `BNE` is commonly used to repeat while not equal to a target.
 - You can loop upward, downward, or infinitely depending on the logic.
 - Assembly loops give you full control, but also require more careful setup.

## Section 5: Labeling and Structure Tips

In assembly programming, **labels** are used to name a location in code that you can jump to using `BRA`, `CALL`, or conditional branches.

They’re the foundation for loops, subroutines, and organizing non-linear control flow.

---

### 🔹 Defining and Using Labels

A label is a name followed by a colon `:`. It marks a position in your program.

```asm
Start:
    MOV     #3, W0
    BRA     Start         ; Jumps back to Start
```
You can branch to a label anywhere in your program - forward or backward.

### Good Labeling Habits

To keep your code readable and maintainable, follow these practices: 

- **Use descriptive names**  
  → e.g., `LoopStart`, `CheckDone`, `RetryLimit` — avoid generic labels like `L1`, `L2`

- **Align labels to the left margin**  
  → Makes them easy to see when scanning your code

- **Indent instructions beneath labels**  
  → Improves visual clarity and shows structure

- **Choose a consistent style**  
  → Capitalized (`WAIT_LOOP:`) or camelCase (`waitLoop:`), just keep it uniform

- **Use `NOP` for debugging or timing padding**  
  → Safe spot for breakpoints or delay without affecting program logic

### Using `NOP` for Debugging

The `NOP` instruction ("No Operation) does nothing - it simply consumes a clock cycle.

It's useful for: 

 - Setting breakpoints during debugging
 - Adding timing delays (in loops)
 - Temporarily padding out code to preserve layout

```asm
NOP     ; Do nothing - can be a good place to break in debugger
```

### Why Structure Matters

Assembly doesn’t give you much abstraction — so clarity is your responsibility. Clean labels, indentation, and comments go a long way in making your code understandable — especially when debugging or returning to it later.

---

### Interactive Simulation

Want to see how loop control flows behave step by step?

👉 [Try the Loop Flow Visualizer MicroSim](../../sims/ch3-branch-loop-sim/sim/index.html)

This simulation lets you follow `DEC`, `CP`, and `BNE` instructions visually — with live register tracking, branching highlights, and total loop iteration count!


## Test Your Understanding

Let’s check your grasp of conditional branching and loops with a quick question.

### Quiz: How Many Times Does the Loop Run?

```asm
MOV     #4, W0
Loop:
    DEC     W0, W0
    CP      W0, #0
    BNE     Loop
``` 
<div class="upper-alpha" markdown>
1. 3  
2. 4  
3. 5  
4. Infinite loop  
</div>

??? question "Show Answer"
    The correct answer is **B (4)**.

    The loop runs as W0 takes the values: 3, 2, 1, 0 — which is **4 total iterations**. After the final decrement to 0, `BNE` no longer branches.

### Prompt Practice

Can you write a loop that **counts from 0 to 3**, storing each value to memory?

Try to solve it yourself before expanding the answer below!

??? example "Click to show solution"
    ```asm
    MOV     #0, W0           ; Initialize counter to 0
    MOV     #addr, W1        ; Assume W1 holds base address of memory

Loop:
    MOV     W0, [W1]         ; Store current value at [W1]
    INC     W0, W0
    ADD     #2, W1, W1       ; Move to next memory location (word = 2 bytes)
    CP      W0, #4
    BNE     Loop             ; Repeat until W0 == 4
    ```

    This loop stores the values 0, 1, 2, 3 into consecutive memory locations.
