// * VARIABLES

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

const TEXT_ERRORS = {
    intNum: "Число повинно бути цілим",
    emptyInp: "Поле не може бути пустим",
    minValue: `Мінімальне значення: ${VALID_INT.dotsValue.min}`,
    maxValue: `Максимальне значення: ${VALID_INT.dotsValue.max}`,
    emptyDotsCount: "Задайте кількість значень",
    fractValue: "Дробові значення треба вводити через крапку",
    invalidCount: "Кількість значень не відповідає заданій",
    invalidValues: "Введені некоректні значення",
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

// * Check some number
function checkInp(
    inp,
    { min, max },
    { intNum, emptyInp, minValue, maxValue }
) {
    let inpValue = +inp.value;

    if (inp.value.includes(".") || inp.value.includes(",")) setErrorFor(inp, intNum, STATE_LIST);
    else if (inpValue == "") setErrorFor(inp, emptyInp, STATE_LIST);
    else if (inpValue < min) setErrorFor(inp, minValue, STATE_LIST);
    else if (inpValue > max) setErrorFor(inp, maxValue, STATE_LIST);
    else setSuccessFor(inp, STATE_LIST);
}

// * Validate inputs with array values
function validateValueArr(
    inp, countInp, numRegex, wordRegex,
    { min, max },
    { emptyInp, minValue, maxValue, emptyDotsCount, fractValue, invalidCount, invalidValues },
    { success }
) {
    let inpValue = inp.value;
    let countInpValue = countInp.value;
    let numArr = [];

    if (inpValue == "") {
        setErrorFor(inp, emptyInp, STATE_LIST);

    } else if (!countInp.parentElement.classList.contains(success)) {
        setErrorFor(countInp, emptyDotsCount, STATE_LIST);

    } else if (inp.value.includes(",")) {
        setErrorFor(inp, fractValue, STATE_LIST);

    } else if (!wordRegex.test(inpValue)) {
        numArr = inpValue.match(numRegex);

        for (let i = 0; i < numArr.length; i++) {
            numArr[i] = +numArr[i];
            if (+numArr[i] < min) {
                setErrorFor(inp, minValue, STATE_LIST);
                return;
            } else if (+numArr[i] > max) {
                setErrorFor(inp, maxValue, STATE_LIST);
                return;
            }
        }
        if (numArr.length == countInpValue) {
            setSuccessFor(inp, STATE_LIST);
            return numArr;
        } else {
            setErrorFor(inp, invalidCount, STATE_LIST);
        }

    } else {
        setErrorFor(inp, invalidValues, STATE_LIST);
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
        checkInp(NODES.dotsCountInp, VALID_INT.dotsCount, TEXT_ERRORS);
    });
}

if (NODES.calcBtn) {
    let resultArr, conditionValue;

    NODES.calcBtn.addEventListener("click", function () {
        resultArr = [0];

        // * Fill the array on full length
        for (let i = 0; i <= calcDeterminant.length; i++) {
            let xAxisTemp = validateValueArr(
                NODES.xAxisInp,
                NODES.dotsCountInp,
                numCheckRegex,
                wordCheckRegex,
                VALID_INT.dotsValue,
                TEXT_ERRORS,
                STATE_LIST
            );
            let yAxisTemp = validateValueArr(
                NODES.yAxisInp,
                NODES.dotsCountInp,
                numCheckRegex,
                wordCheckRegex,
                VALID_INT.dotsValue,
                TEXT_ERRORS,
                STATE_LIST
            );
            if (
                NODES.dotsCountInp.parentElement.classList.contains(STATE_LIST.success) &&
                NODES.xAxisInp.parentElement.classList.contains(STATE_LIST.success) &&
                NODES.yAxisInp.parentElement.classList.contains(STATE_LIST.success)
            ) {
                resultArr[i] = calcDeterminant(xAxisTemp, yAxisTemp)[i];

                conditionValue = resultArr[1];
                if (conditionValue > 0) {
                    NODES.graphOutput.textContent = `Аппроксимуюча пряма: y = ${resultArr[0]}x + ${resultArr[1]}`;
                    NODES.deviationOutput.textContent = `Середнє квадратичне відхилення: ${resultArr[2]}`;
                } else {
                    NODES.graphOutput.textContent = `Аппроксимуюча пряма: y = ${resultArr[0]}x - ${Math.abs(resultArr[1])}`;
                    NODES.deviationOutput.textContent = `Середнє квадратичне відхилення: ${resultArr[2]}`;
                }
            }
        }
    });
}