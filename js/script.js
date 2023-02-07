// * VARIABLES
// TODO Transfer nodes & move intervals to one object. Create TEXT_ERRORS object

const NODES = {
    dotsCountInp: document.querySelector("#dots-count-inp"),
    xAxisInp: document.querySelector("#x-coordinates-inp"),
    yAxisInp: document.querySelector("#y-coordinates-inp"),
    countApplyBtn: document.querySelector("#count-apply-btn"),
    calcBtn: document.querySelector("#calc-btn"),
    graphOutput: document.querySelector("#line-graph-output"),
    deviationOutput: document.querySelector("#line-deviation-output"),
}

// * Validation interval
const VALID_INT = {
    dotsValue: {
        min: -9999,
        max: 9999,
    },
    dotsCount: {
        min: 2,
        max: 10,
    },
};

const STATE_LIST = {
    error: "_error",
    success: "_success",
}

// * RegEX

// * Регулярка для поиска целых и дробных чисел произвольной длинны больше или меньше 0 (дробные числа только через точку)
let numCheckRegex = /(\d+)(?:[\.]\d+)|(-\d+)(?:[\.]\d+)|(\d+)|(\-\d+)/g;
// * Регулярка для проверки на мусорные символы
let wordCheckRegex = /[A-Z]+|[a-z]+|\!|\@|\#|\$|\%|\^|\:|\*|\(|\)|\&|\?|\=|\_|\||\+|\/|\\/g;

// * FUNCTIONS

function setErrorFor(input, message, { error, success }) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");

    formControl.classList.add(error)
    formControl.classList.remove(success);
    small.textContent = message;
}

function setSuccessFor(input, { error, success }) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");

    formControl.classList.remove(error)
    formControl.classList.add(success);
    small.textContent = "";
}

function clearInputs(inpArr) {
    inpArr.forEach(inpArrItem => {
        inpArrItem.value = "";
    });
}

// * Check some number
function checkInp(inp, { min, max }) {
    let inpValue = +inp.value;
    if (inp.value.includes(".") || inp.value.includes(",")) {
        setErrorFor(inp, "Число повинно бути цілим", STATE_LIST);
    } else if (inpValue == "") {
        setErrorFor(inp, "Поле не може бути пустим", STATE_LIST);
    } else if (inpValue < min) {
        setErrorFor(inp, `Мінімальне значення: ${min}`, STATE_LIST);
    } else if (inpValue > max) {
        setErrorFor(inp, `Максимальне значення: ${max}`, STATE_LIST);
    } else {
        setSuccessFor(inp, STATE_LIST);
    }
}

// * Validate inputs with array values
function validateValueArr(
    inp, countInp, numRegex, wordRegex, { min, max }, { success }
) {
    let inpValue = inp.value;
    let countInpValue = countInp.value;
    let numArr = [];

    if (inpValue == "") {
        setErrorFor(inp, "Поле не може бути пустим", STATE_LIST);

    } else if (!countInp.parentElement.classList.contains(success)) {
        setErrorFor(countInp, "Задайте кількість значень", STATE_LIST);

    } else if (inp.value.includes(",")) {
        setErrorFor(inp, "Дробові значення треба вводити через крапку", STATE_LIST);

    } else if (!wordRegex.test(inpValue)) {
        numArr = inpValue.match(numRegex);
        
        for (let i = 0; i < numArr.length; i++) {
            numArr[i] = +numArr[i];
            if (numArr[i] < min) {
                setErrorFor(inp, `Одне із значень менше мін. допустимого значення ${min}`, STATE_LIST);
                return;
            } else if (numArr[i] > max) {
                setErrorFor(inp, `Одне із значень більше макс. допустимого значення ${max}`, STATE_LIST);
            }
        }
        if (numArr.length == countInpValue) {
            setSuccessFor(inp, STATE_LIST);
            return numArr;
        } else {
            setErrorFor(inp, "Кількість значень не відповідає заданій", STATE_LIST);
        }

    } else {
        setErrorFor(inp, "Введені некоректні значення", STATE_LIST);
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

if (NODES.countApplyBtn) {
    NODES.countApplyBtn.addEventListener("click", function () {
        checkInp(NODES.dotsCountInp, VALID_INT.dotsCount);
    });
}

if (NODES.calcBtn) {
    let resultArr, conditionValue;

    NODES.calcBtn.addEventListener("click", function () {
        resultArr = [0];

        // * Fill the array on full length
        for (let i = 0; i <= calcDeterminant.length; i++) {
            resultArr[i] = calcDeterminant(
                validateValueArr(
                    NODES.xAxisInp,
                    NODES.dotsCountInp,
                    numCheckRegex,
                    wordCheckRegex,
                    VALID_INT.dotsValue,
                    STATE_LIST
                ),
                validateValueArr(
                    NODES.yAxisInp,
                    NODES.dotsCountInp,
                    numCheckRegex,
                    wordCheckRegex,
                    VALID_INT.dotsValue,
                    STATE_LIST
                )
            )[i];
        }
        conditionValue = resultArr[1];

        if (conditionValue > 0) {
            NODES.graphOutput.textContent = `Аппроксимуюча пряма: y = ${resultArr[0]}x + ${resultArr[1]}`;
            NODES.deviationOutput.textContent = `Середнє квадратичне відхилення: ${resultArr[2]}`;
        } else {
            NODES.graphOutput.textContent = `Аппроксимуюча пряма: y = ${resultArr[0]}x - ${Math.abs(resultArr[1])}`;
            NODES.deviationOutput.textContent = `Середнє квадратичне відхилення: ${resultArr[2]}`;
        }
    });
}