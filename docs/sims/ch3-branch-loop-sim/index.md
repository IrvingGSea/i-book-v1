# Chapter 3 MicroSim: Loop Flow Visualizer

This MicroSim lets you **visually trace** the behavior of a loop written in PIC24 assembly using instructions like `DEC`, `CP`, and `BNE`.

You’ll see:

- Each instruction executed **step-by-step**
- Branches (`BNE`) visually jumping back to labeled code
- Final **program continuation** indicated with `; ... more code`
- Live W0 value and total loop iterations

👉 [Launch the Branching and Loop Simulator](./sim/index.html)

---

## Code Simulated:

```asm
MOV #5, W0      ; Load 5 into W0
LOOP:
DEC W0          ; Decrement W0
CP W0, #0       ; Compare to 0
BNE LOOP        ; If W0 != 0, loop back
; ... more code
```