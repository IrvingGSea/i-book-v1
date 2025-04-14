# Chapter 4: Stack and Subroutine Calls

## Section 1: What is a Stack?

A **stack** is a special kind of data structure that operates on a **Last In, First Out (LIFO)** principle — the last item you place on the stack is the first one to be removed.

### 🔁 Real-World Analogy

Think of a stack of plates in a cafeteria:
- You **push** a clean plate on top of the pile
- You **pop** the top plate off when someone takes one
- You can't grab a plate from the middle — only the top!

This "top-first" behavior is exactly how the stack works in your microcontroller.

---

### 🧱 Why Do We Need a Stack?

Stacks are used any time the program needs to **pause what it's doing**, remember something, and **come back to it later**.

In the PIC24, the stack is used to:
- Store the **return address** when calling a subroutine
- Temporarily hold **register values** during nested function calls
- Save **context** during interrupts

If you didn't have a stack, calling one function from another — or returning from an interrupt — would be extremely difficult (if not impossible) to manage.

---

### 🧭 Key Operations

| Term     | Meaning                                  |
|----------|-------------------------------------------|
| `PUSH`   | Store a value on the top of the stack     |
| `POP`    | Remove the top value from the stack       |
| `CALL`   | Push return address, jump to subroutine   |
| `RETURN` | Pop return address, continue execution    |

These operations are handled automatically during function calls — but you can also perform them manually in assembly.

---

In the next section, we'll explore **how the PIC24 handles subroutine calls using the stack**, and how to trace exactly what happens when a `CALL` and `RETURN` are executed.

## Section 2: The Call Stack in Assembly

Whenever your program executes a **subroutine call**, the processor must remember **where to return** after the subroutine finishes. To do this, it uses the **stack**.

---

### 🔹 What Happens During a `CALL`

When you execute a `CALL` instruction:

```asm
CALL    MyFunction
```

The pic 24 automatically performs the following:
  - Pushes the return address onto the stack.
  - Jumps to the MyFunction label.

Later when the subroutine finishes, a `RETURN` instruction:
  - Pops the return address off the stack
  - Resumes execution from that address
```asm
RETURN
```

### Stack Behavior During Function Calls

Let's walk through a basic example:

```asm
Main:
    CALL    DoSomething
    ; Execution resumes here after RETURN

DoSomething:
    ; Function logic here
    RETURN
```

What the Stack Looks Like:

| Stack Top            | Contents                |
|----------------------|-------------------------|
| ⬆ Growing Downward   |                         |
| Address of `Main+2`  | (Return to next line)   |


### You Don't Have to Push Return Address Yourself
The best part? You don't need to manually push/pop the return address — the CALL and RETURN instructions handle it automatically for you. That’s what makes writing subroutines manageable.

## Section 3: Stack Pointers in the PIC24

In the PIC24 architecture, the **stack is accessed through special-purpose working registers**. Understanding these is key to tracing subroutine behavior and building your own call structures.

---

### 🔹 W15 — The Stack Pointer (SP)

The register `W15` is automatically used by the processor as the **stack pointer**. It always points to the **top of the stack** in memory.

- When you **push** data, it stores the value at `[W15]` and increments (post-increment)
- When you **pop** data, it decrements first and then reads from `[W15]` (pre-decrement)

#### Example: Manual Push/Pop

```asm
MOV     #0x1234, W0
MOV     W0, [W15++]      ; Push W0 onto stack

MOV     [--W15], W1      ; Pop from stack into W1
```
You usually don’t need to manipulate W15 directly unless you're saving/restoring temporary values in custom subroutines.

### 🔹 W14 — The Frame Pointer (Optional)

By convention, `W14` is often used as a **frame pointer**, especially in higher-level language support (like C). It can be useful when:

- Managing **local variables** relative to a base offset  
- Navigating function **call frames** more easily in complex call chains  

> 📝 Note: The frame pointer is **not required** for basic assembly subroutines, but it can help with stack-traceability in deeper projects.

### 📊 Summary of Stack Registers

| Register | Role                  | Usage Example              |
|----------|-----------------------|----------------------------|
| `W15`    | Stack Pointer (SP)    | `MOV W0, [W15++]`          |
| `W14`    | Frame Pointer (FP)    | User-defined (optional)    |

## Section 4: Writing and Tracing a Subroutine

Let’s bring everything together and write a real subroutine that uses the call stack.

We’ll build a function that **doubles a value passed in `W0`**, and returns the result **in `W0`** — a simple example, but one that shows how function calls work under the hood.

---

### 🔹 Step 1: Main Program Calls the Function

```asm
    MOV     #7, W0          ; Load 7 into W0
    CALL    DoubleValue     ; Call subroutine to double W0
    ; W0 now contains 14
```

When `CALL DoubleValue` is executed, the processor:
 - Pushes the return address onto the stack
 - Jumps to the label `DoubleValue`

### 🔹 Step 2: Define the Subroutine

```asm
DoubleValue:
    ADD     W0, W0, W0      ; Double the value in W0
    RETURN                  ; Return to the line after the CALL
```
When `RETURN` executes:
 - The processor pops the return address from the stack
 - Execution resumes immediately after the `CALL`

### 🧪 What the Stack Looks Like

Before `CALL DoubleValue`, the stack might look like this:

| Stack Top            | Contents                      |
|----------------------|-------------------------------|
| ⬆ Growing Downward   |                               |
| Address after CALL   | Return address → resume here  |

After `RETURN`, the address is popped off and the stack returns to its previous state.

### ✅ Notes

- The value is passed in `W0`, and the result is returned in `W0`. This is a **common calling convention** for small assembly routines.  
- For more complex functions, you may also use `W1`, `W2`, or the stack itself to pass/return data.

## Section 5: Visualizing the Stack

Understanding how the stack grows and shrinks is essential for mastering subroutine calls and returns. Even though the processor handles most of the mechanics automatically, being able to **mentally trace** stack behavior will help you debug and write more reliable code.

---

### 🔹 How the Stack Grows

The PIC24 stack grows **downward** in memory — that means each time something is pushed, the stack pointer (`W15`) points to a **lower address**.

Every time you `CALL` a function:

- The **return address** is pushed onto the stack
- Any manually saved data (like temporary registers) can also be pushed

When you `RETURN`:

- The return address is **popped**, and execution resumes where it left off
- If you saved anything manually, you must also restore it before returning

---

### 🧭 Example: Two Nested Calls

```asm
Main:
    CALL    A

A:
    CALL    B
    RETURN

B:
    RETURN
```

#### Stack Behavior:

1. `CALL A` → pushes return address for `Main`
2. Inside `A`, `CALL B` → pushes return address for `A`
3. `RETURN` from `B` → pops to `A`
4. `RETURN` from `A` → pops to `Main`

## Section 6: Summary and Best Practices

Now that you’ve seen how the stack works and how subroutines are built in PIC24 assembly, here’s what you should remember going forward:

---

### 🧠 Key Takeaways

- The **stack** stores return addresses (and optionally local data) when calling subroutines.
- `CALL` and `RETURN` handle **stack push/pop automatically** for return addresses.
- `W15` is the **stack pointer (SP)** — it tracks the top of the stack and grows downward.
- `W14` is commonly used as a **frame pointer (FP)** — useful for structured call frames or C-style stack frames.
- You can manually push/pop data using `[W15++]` and `[--W15]`.

---

### ✅ Best Practices for Subroutines

- ✔️ Use **`W0`** to pass parameters and return values in small subroutines.
- ✔️ Use **`CALL`/`RETURN`** for clean function separation.
- ✔️ If you manually push registers (e.g. `W1`, `W2`), **always restore them** before returning.
- ❌ Avoid modifying `W15` directly — use auto-increment/decrement instead.
- ✔️ Keep subroutines small and modular when possible.
- ✔️ Comment your subroutine entry and exit points — especially when multiple calls are nested.

---

In the next chapter, we’ll expand your control over time with **hardware timers** and learn how to build precise time-based behavior in your programs using **interrupts**.

## 🧠 Quiz: Stack and Subroutines

What happens to the stack when the following code is executed?

```asm
    CALL    Func1
    ; do something
    CALL    Func2
    ; done

Func1:
    RETURN

Func2:
    RETURN

<div class="upper-alpha" markdown>
1. The stack is unchanged — calls don’t affect it  
2. Two values are pushed to the stack and never removed  
3. One return address is pushed and overwritten  
4. Two return addresses are pushed, then popped in reverse order  
</div>

??? question "Show Answer"
    The correct answer is **D**.

    When `CALL Func1` is executed, the return address is pushed onto the stack.  
    After `Func1` returns, the address is popped.  
    The same happens with `Func2`.

    So, two return addresses are pushed and popped in reverse order — **just like a stack (LIFO)**.

## ✍️ Prompt Practice

Write a subroutine called `AddTen` that takes a number in `W0`, adds 10 to it, and returns the result (also in `W0`).  
Your main program should call `AddTen` with an initial value of `5`, and store the result in `W1`.

Try writing it yourself before checking the solution!

??? example "Click to show solution"
    ```asm
    ; Main Program
    MOV     #5, W0           ; Load value into W0
    CALL    AddTen           ; Call subroutine
    MOV     W0, W1           ; Store result in W1

    ; Subroutine
AddTen:
    ADD     W0, #10, W0      ; Add 10 to the value in W0
    RETURN
    ```
