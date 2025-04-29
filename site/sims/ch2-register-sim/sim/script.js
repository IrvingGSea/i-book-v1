const registers = {
    W0: 0, W1: 0, W2: 0, W3: 0, W4: 0, W5: 0
};

function updateDisplay() {
    const display = Object.entries(registers)
        .map(([reg, val]) => `${reg} = ${val}`).join('\n');
    document.getElementById('registers').textContent = display;
}

function logToConsole(message) {
    document.getElementById('console').textContent = message;
}

function executeInstruction() {
    const input = document.getElementById("instructionInput").value.trim().toUpperCase();
    const tokens = input.replace(/,/g, '').split(/\s+/);
    const [opcode, op1, op2, op3] = tokens;

    if (!opcode) return logToConsole("No instruction entered.");

    try {
        switch (opcode) {
            case "MOV":
                if (op1.startsWith('#')) {
                    const value = parseInt(op1.substring(1));
                    if (!(op2 in registers)) throw "Invalid destination register";
                    registers[op2] = value;
                } else if (op1 in registers && op2 in registers) {
                    registers[op2] = registers[op1];
                } else {
                    throw "Invalid operands for MOV";
                }
                break;

            case "ADD":
                if (tokens.length === 3) {
                    if (op1.startsWith('#')) {
                        const val = parseInt(op1.slice(1));
                        if (!(op2 in registers)) throw "Invalid register for ADD";
                        registers[op2] += val;
                    } else if (op1 in registers && op2 in registers) {
                        registers[op2] += registers[op1];
                    } else {
                        throw "Invalid operands for ADD";
                    }
                } else if (tokens.length === 4) {
                    if (op1 in registers && op2 in registers && op3 in registers) {
                        registers[op3] = registers[op1] + registers[op2];
                    } else if (op1.startsWith('#') && op2 in registers && op3 in registers) {
                        const val = parseInt(op1.slice(1));
                        registers[op3] = val + registers[op2];
                    } else {
                        throw "Invalid operands for 3-operand ADD";
                    }
                }
                break;

            case "SUB":
                if (tokens.length === 3) {
                    if (op1 in registers && op2 in registers) {
                        registers[op2] -= registers[op1];
                    } else {
                        throw "Invalid operands for SUB";
                    }
                } else if (tokens.length === 4) {
                    if (op1 in registers && op2 in registers && op3 in registers) {
                        registers[op3] = registers[op2] - registers[op1];
                    } else {
                        throw "Invalid operands for 3-operand SUB";
                    }
                }
                break;

            case "CLR":
                if (op1 in registers) {
                    registers[op1] = 0;
                } else {
                    throw "Invalid register for CLR";
                }
                break;

            default:
                throw "Unknown instruction";
        }

        updateDisplay();
        logToConsole("Executed: " + input);
    } catch (err) {
        logToConsole("Error: " + err);
    }
}

window.onload = updateDisplay;
