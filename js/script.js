// * VARIABLES

const NODES = {

}

let allInp = document.querySelectorAll(".form-controller input");
const coordinatesInp = document.querySelectorAll(".coordinates-inp");
const dotsCountInp = document.querySelector("#dots-count-inp");
const xCoordinateInp = document.querySelector("#x-coordinates-inp");
const yCoordinateInp = document.querySelector("#y-coordinates-inp");

const dotsCountMessage = document.querySelector("#task1-first-message");
const xCoordinatesMessage = document.querySelector("#x-coordinates-message");
const yCoordinatesMessage = document.querySelector("#y-coordinates-message");

const countApplyBtn = document.querySelector("#count-apply-btn");
const calcBtn = document.querySelector("#calc-btn");
const lineGraphOutput = document.querySelector("#line-graph-output");
const lineDeviationOutput = document.querySelector("#line-deviation-output");

// * VALIDATION INTERVALS

const dotsCountInterval = {
    min: 2,
    max: 10,
};

const valueInterval = {
    min: -9999,
    max: 9999,
};

// * RegEX

// * Регулярка для поиска целых и дробных чисел произвольной длинны больше или меньше 0 (дробные числа только через точку)
let numCheckRegex = /(\d+)(?:[\.]\d+)|(-\d+)(?:[\.]\d+)|(\d+)|(\-\d+)/g;
// * Регулярка для проверки на мусорные символы
let wordcheckRegex = /[A-Z]+|[a-z]+|\!|\@|\#|\$|\%|\^|\:|\*|\(|\)|\&|\?|\=|\_|\||\+|\/|\\/g;

// * FUNCTIONS

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");

    formControl.classList.add("_error")
    formControl.classList.remove("_success");
    small.textContent = message;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");

    formControl.classList.remove("_error")
    formControl.classList.add("_success");
    small.textContent = "";
}

function clearInputs(inpArr) {
    inpArr.forEach(inpArrItem => {
        inpArrItem.value = "";
    });
}

// * Check some number
function checkInp(inp, intervalMin, intervalMax) {
    let inpValue = +inp.value;
    if (inp.value.includes(".") || inp.value.includes(",")) {
        setErrorFor(inp, "Число повинно бути цілим");
    } else if (inpValue == "") {
        setErrorFor(inp, "Поле не може бути пустим");
    } else if (inpValue < intervalMin) {
        setErrorFor(inp, `Мінімальне значення: ${intervalMin}`);
    } else if (inpValue > intervalMax) {
        setErrorFor(inp, `Максимальне значення: ${intervalMax}`);
    } else {
        setSuccessFor(inp);
    }
}

// * Validate inputs with array values
function validateValueArr(inp, countInp, intervalMin, intervalMax, numRegex, wordRegex) {
    let inpValue = inp.value;
    let countInpValue = countInp.value;
    let numArr = [];

    if (inpValue == "") {
        setErrorFor(inp, "Поле не може бути пустим");

    } else if (!countInp.parentElement.classList.contains("_success")) {
        setErrorFor(countInp, "Задайте кількість значень");

    } else if (inp.value.includes(",")) {
        setErrorFor(inp, "Дробові значення треба вводити через крапку");

    } else if (!wordRegex.test(inpValue)) {
        numArr = inpValue.match(numRegex);

        for (let i = 0; i < numArr.length; i++) {
            numArr[i] = +numArr[i];
            if (numArr[i] < intervalMin) {
                setErrorFor(inp, `Одне із значень менше мінімального допустимого значення ${intervalMin}`);
                return;
            } else if (numArr[i] > intervalMax) {
                setErrorFor(inp, `Одне із значень більше максимального допустимого значення ${intervalMax}`);
            }
        }
        if (numArr.length == countInpValue) {
            setSuccessFor(inp);
            return numArr;
        } else {
            setErrorFor(inp, "Кількість значень не відповідає заданій");
        }

    } else {
        setErrorFor(inp, "Введені некоректні значення");
    }
}

// * Calc determinant

function calcDeterminant(arrX, arrY) {
    if (typeof arrX === "object" && typeof arrY === "object") {
        let xSum, ySum, xyMultiply, xSquared, aСoef, bСoef, lineDeviation;
        xSum = ySum = xyMultiply = xSquared = aСoef = bСoef = lineDeviation = 0;

        for (let i = 0; i < arrX.length; i++) {
            xSum += arrX[i];
            ySum += arrY[i];
            xyMultiply += (arrX[i] * arrY[i]);
            xSquared += (arrX[i] ** 2);
        }

        aСoef = (arrX.length * xyMultiply - xSum * ySum) / (arrX.length * xSquared - xSum ** 2);
        bСoef = (ySum - aСoef * xSum) / arrX.length;

        for (let i = 0; i < arrX.length; i++) {
            lineDeviation += ((arrY[i] - (aСoef * arrX[i] + bСoef)) ** 2);
        }
        aСoef = +aСoef.toFixed(2);
        bСoef = +bСoef.toFixed(2);
        lineDeviation = +lineDeviation.toFixed(2);

        return [aСoef, bСoef, lineDeviation];
    }
}

// * CALL FUNCTIONS

if (countApplyBtn) {
    countApplyBtn.addEventListener("click", function () {
        checkInp(dotsCountInp, dotsCountInterval.min, dotsCountInterval.max);
    });
}

if (calcBtn) {
    let resultArr, conditionValue;
    
    calcBtn.addEventListener("click", function () {
        resultArr = [];
        
        for (let i = 0; i < calcDeterminant.length; i++) {
            resultArr[i] =  calcDeterminant(
                validateValueArr(xCoordinateInp, dotsCountInp, valueInterval.min, valueInterval.max, numCheckRegex, wordcheckRegex),
                validateValueArr(yCoordinateInp, dotsCountInp, valueInterval.min, valueInterval.max, numCheckRegex, wordcheckRegex)
            )[i];
        }
        conditionValue = resultArr[1];

        if (conditionValue > 0) {
            lineGraphOutput.textContent = `Аппроксимуюча пряма: y = ${resultArr[0]}x + ${resultArr[1]}`;
            lineDeviationOutput.textContent = `Середнє квадратичне відхилення: ${resultArr[2]}`;
        } else {
            lineGraphOutput.textContent = `Аппроксимуюча пряма: y = ${resultArr[0]}x - ${Math.abs(resultArr[1])}`;
            lineDeviationOutput.textContent = `Середнє квадратичне відхилення: ${resultArr[2]}`;
        }
    });
}