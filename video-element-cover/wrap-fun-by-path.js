
// פונקציה לפיצול נתיב למערך חלקים
function splitPath(path) {
    return path.split(/[\.\[\]]+/).filter(Boolean);
}

// פונקציה לאיתור ההקשר (context) של הנתיב עד לרמה האחרונה
function getContextAndName(pathParts) {
    let context = window;
    for (let i = 0; i < pathParts.length - 1; i++) {
        context = context[isNaN(pathParts[i]) ? pathParts[i] : Number(pathParts[i])];
    }
    const funcName = pathParts[pathParts.length - 1];
    return { context, funcName };
}

// פונקציה שעוטפת את הפונקציה המקורית בפונקציה חדשה עם קוד לפני ואחרי
function wrapFunction(context, funcName, fnCallbackBefore, fnCallbackAfter) {
    const originalFunction = context[funcName];

    context[funcName] = function (...args) {
        if (fnCallbackBefore) fnCallbackBefore();
        const result = originalFunction.apply(this, args);
        if (fnCallbackAfter) fnCallbackAfter();

        return result;
    };
}

export function wrapFunctionByPath(path, fnCallbackBefore = null, fnCallbackAfter = null) {

    const pathParts = splitPath(path);
    const { context, funcName } = getContextAndName(pathParts);
    wrapFunction(context, funcName, fnCallbackBefore, fnCallbackAfter);
}
