# Chapter 3: Stack, Call, and Function Frames

## 🧠 Why This Chapter Matters

This chapter explores how the PIC24 manages **function calls**, **local variables**, and **return addresses** using the **stack**. Understanding this helps you:

- Write assembly functions that interact cleanly with C code  
- Handle recursion, interrupts, and nested function calls  
- Use registers like `W14` (Frame Pointer) and `W15` (Stack Pointer) effectively  

---

## ✅ Section 1: What Is the Stack?

The **stack** is a region of RAM used for storing temporary data during program execution.

- **LIFO (Last In, First Out)** structure  
- Grows **downward** in memory (from high to low addresses)  
- Stores:  
  - Return addresses  
  - Local variables  
  - Saved register values  

---

## 🧰 Section 2: Stack-Related Registers

| Register | Purpose                                 |
|----------|-----------------------------------------|
| `W14`    | Frame Pointer (FP) — base of current stack frame |
| `W15`    | Stack Pointer (SP) — points to the top of the stack |

These registers are automatically used when calling/returning from functions in C, and are **manually used** in assembly when creating stack frames.

---

## 📥 Section 3: Function Calls & the Call Stack

When a function is called:

1. The **return address** is pushed onto the stack  
2. Control jumps to the function  
3. The **callee** function can:  
   - Push `Wn` registers it will use  
   - Allocate space for local variables  
4. When the function finishes, the return address is popped  
5. Execution resumes at the caller  

### Example: `CALL` Instruction

```asm
CALL    myFunction
```

This:
 - Pushes the program counter(return address)
 - Jumps to myFunction

## Section 4: Stack Frame Layout (Manual Setup)

You can manually manage the stack like this: 
; Prologue - setting up the stack frame
PUSH    W0              ; Save register if needed
PUSH    W1
MOV     W15, W14        ; Set Frame Pointer = Stack Pointer
SUB     #4, W15         ; Allocate 4 bytes for local variables

; Function body here...

; Epilogue - cleaning up the stack
```asm
MOV     W14, W15        ; Reset Stack Pointer
POP     W1
POP     W0
RETURN
```

## Section 5: Why It's Important

Without the stack, nested function calls wouldn't work.
Local Variables would overwrite each other.
Interrupt service routins would be unsafe.