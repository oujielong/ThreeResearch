function callbackParams(func, otherParams) {
    return function (event) {
        func(Object.assign({ event }, otherParams));
    };
}
export { callbackParams };