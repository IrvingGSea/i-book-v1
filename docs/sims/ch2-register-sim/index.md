# Chapter 2 MicroSim: Register Instruction Simulator (v2)

This interactive simulation lets you practice **basic PIC24 assembly** operations by manipulating working registers (`W0`–`W5`) in real time.

You can perform:

- Moving values between registers or from literals
- Adding and subtracting using either 2 operands or 3 operands
- Clearing registers

👉 [Launch the Register Instruction Simulator](./sim/index.html)

---

### Supported Instructions:

| Instruction | Meaning |
|:------------|:--------|
| `MOV #literal, Wn` | Move immediate value into register |
| `MOV Wm, Wn` | Copy value from one register to another |
| `ADD Wm, Wn` | Add Wm to Wn, store in Wn |
| `ADD #literal, Wn` | Add literal to Wn |
| `ADD Wm, Wn, Wd` | Add Wm + Wn, store result in Wd |
| `SUB Wm, Wn` | Subtract Wm from Wn, store in Wn |
| `SUB Wm, Wn, Wd` | Subtract Wm from Wn, store in Wd |
| `CLR Wn` | Clear (zero out) Wn |

---

### Example Instructions:

```asm

MOV     #10, W0       ; Load literal 10 into W0
MOV     W0, W1        ; Copy W0 into W1
ADD     W1, W2        ; Add W1 into W2
ADD     W0, W1, W3    ; W3 = W0 + W1
SUB     W1, W2        ; Subtract W1 from W2 (W2 = W2 - W1)
SUB     W1, W2, W4    ; W4 = W2 - W1
CLR     W3            ; Clear W3

```