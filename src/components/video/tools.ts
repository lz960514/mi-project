export const formtTime = function (number: number): string {
    number = Math.round(number);
    const min = Math.floor(number / 60);
    const sec = number % 60;
    return setZero(min) + ':' + setZero(sec);
}

function setZero(number: number): string {
    if (number < 10) return '0' + number;
    else return String(number);
}
