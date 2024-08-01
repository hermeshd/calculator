//Operation variables
let firstNumber = 0;
let secondNumber = 0;
let operator = '';
let result = 0;

function add(a, b) {

    return a + b;

}

function subtract(a, b) {

    return a - b;

}


function multiply(a, b) {

    return a * b;

}


function divide(a, b) {

    if (b === 0) {
        prompt("Are you stupid? You can't divide by zero!");
    } else {
        return a / b;
    }

}


function negative(a) {

    return a * -1;

}


function operate(operator, a, b) {

    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        case '%':
            return negative(a);
    }

}

//DOM variables
const outputPrevious = document.querySelector('.previous-operand');
const outputCurrent = document.querySelector('.current-operand');
const numbers = document.querySelectorAll('.keypad button[data-number]');
const operations = document.querySelectorAll('.keypad button[data-operation]');
const equals = document.querySelector('.keypad button[data-equals]');
const allClear = document.querySelector('.keypad button[data-all-clear]');
const deleteKey = document.querySelector('.keypad button[data-delete]');
const negativeKey = document.querySelector('.keypad button[data-negative]');

//Display each number when clicked
numbers.forEach(number => {
    number.addEventListener('click', () => {
        if (outputCurrent.innerText === '0') {
            outputCurrent.innerText = number.innerText
        } else if (outputPrevious.innerText.slice(-1) === '=') {
            outputCurrent.innerText = number.innerText
            outputPrevious.innerText = ''
        } else {
            outputCurrent.innerText += number.innerText
        }
    })
})

//Delete last input
deleteKey.addEventListener('click', () => {
    outputCurrent.innerText = outputCurrent.innerText.slice(0, -1)

    if (outputCurrent.innerText === '') {
        outputCurrent.innerText = '0'
    }

})

//Clear all
allClear.addEventListener('click', () => {
    outputCurrent.innerText = '0';
    outputPrevious.innerText = '';
})

//Equals
equals.addEventListener('click', () => {
    if (outputCurrent.innerText !== '' && outputPrevious.innerText !== '' && outputPrevious.innerText.slice(-1) !== '=') {
        firstNumber = Number(outputPrevious.innerText.slice(0, -1));
        secondNumber = Number(outputCurrent.innerText);
        result = operate(operator, firstNumber, secondNumber);
        if (!isNaN(parseFloat(result)) && isFinite(result)) {
            outputPrevious.innerText = `${firstNumber} ${operator} ${secondNumber} =`;
            outputCurrent.innerText = result;
        } else {
            outputCurrent.innerText = "Error";
        }

    }
})

//Negative
negativeKey.addEventListener('click', () => {
    if (outputPrevious.innerText.slice(-1) !== '=' && outputCurrent.innerText !== '') {
        outputCurrent.innerText = negative(Number(outputCurrent.innerText))
    }
})


const operatorsTextArr = ['+', '-', '*', '/', '%'];
const numbersTextArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

operations.forEach(operation => {
    operation.addEventListener('click', () => {
        if (outputCurrent.innerText !== '' && outputPrevious.innerText === '') {
            firstNumber = Number(outputCurrent.innerText);
            outputPrevious.innerText = ` ${firstNumber} ${operation.innerText}`;
            outputCurrent.innerText = '';
        } else if (outputCurrent.innerText !== '' && outputPrevious.innerText.slice(-1) === '=') {
            outputPrevious.innerText = `${outputCurrent.innerText} ${operation.innerText}`
            outputCurrent.innerText = '';
        } else {
            if (outputPrevious.innerText !== '' && operatorsTextArr.includes(outputPrevious.innerText.slice(-1))) {
                if (outputCurrent.innerText !== '') {
                    operator = outputPrevious.innerText.slice(-1);
                    firstNumber = Number(outputPrevious.innerText.slice(0, -1));
                    secondNumber = Number(outputCurrent.innerText);
                    result = operate(operator, firstNumber, secondNumber);
                    outputPrevious.innerText = `${result} ${operation.innerText}`;
                    outputCurrent.innerText = '';
                } else {
                    let temp = outputPrevious.innerText.split(' ');
                    temp[temp.length - 1] = operation.innerText;
                    outputPrevious.innerText = temp.join(' ');
                }
            }
        }

        operator = operation.innerText
    })
})


//Limitations

//Character input limit
outputCurrent.addEventListener('DOMSubtreeModified', () => {
    if (outputCurrent.innerText.length > 17) {
        outputCurrent.innerText = outputCurrent.innerText.slice(0, 17);
    }
})


//Character result limit
function formatResult(result, maxLength = 17) {
    let strResult = result.toString();
    if (strResult.length > maxLength) {
        if (strResult.includes('e')) {
            // Handle exponential numbers
            let [base, exponent] = strResult.split('e');
            base = base.slice(0, maxLength - exponent.length - 2);
            strResult = `${base}e${exponent}`;
        } else if (strResult.includes('.')) {
            // Handle decimal numbers
            let [integer, decimal] = strResult.split('.');
            let integerLength = integer.length;
            let decimalLength = maxLength - integerLength - 1;
            if (decimalLength > 0) {
                decimal = decimal.slice(0, decimalLength);
                strResult = `${integer}.${decimal}`;
            } else {
                strResult = integer.slice(0, maxLength);
            }
        } else {
            // Handle very large numbers
            strResult = strResult.slice(0, maxLength);
        }
    }
    return strResult;
}

//More than one decimal point
outputCurrent.addEventListener('DOMSubtreeModified', () => {
    numbers.forEach(number => {
        if (outputCurrent.innerText.includes('.') && number.innerText === '.') {
            number.disabled = true
        } else {
            number.disabled = false
        }
    })
})


