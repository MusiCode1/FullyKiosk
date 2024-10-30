
const videoDisplayTimeInMS = (10 * 1000);

const videoURL = 'http://localhost/sdcard/video.mp4';

// פונקציה להזרקת ה-HTML לדף
function injectVideoHTML() {

    // יצירת אלמנט div חדש עבור המודאל
    const modal = document.createElement('div');
    modal.className = 'modal';

    // יצירת אלמנט div חדש עבור המיכל של הווידאו
    const mainContainer = document.createElement('div');
    mainContainer.className = 'main-container';

    // יצירת אלמנט card חדש
    const card = document.createElement('div');
    card.className = 'card';

    // הוספת כותרת
    const title = document.createElement('h1');
    title.innerText = 'עכשיו מגיע לישי פרס: סרטון!';

    // יצירת אלמנט ווידאו
    const video = document.createElement('video');
    const source = document.createElement('source');
    source.src = videoURL;
    source.type = 'video/mp4';

    // הוספת המקורות לווידאו
    video.appendChild(source);
    video.innerHTML += 'הדפדפן שלך אינו תומך בתגית הווידאו.';

    // הוספת אלמנטים ל-card
    card.appendChild(title);
    card.appendChild(video);

    // הוספת ה-card ל-mainContainer
    mainContainer.appendChild(card);
    modal.appendChild(mainContainer); // הוספת mainContainer למודאל

    const css = document.createElement('style');
    css.innerText = `
        body,
        html {
            margin: 0;
            padding: 0;
            height: 100%;
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8); /* רקע שקוף כהה */
            /*display: flex;*/
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000; /* מעל כל דבר אחר */
        }

        .modal.show {
            display: flex;
        }

        .main-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card {
            background-color: rgb(243, 255, 135);
            padding: 20px;
            border-radius: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: auto; /* גובה אוטומטי */
            box-sizing: border-box;
        }

        h1 {
            margin-top: 5px;
        }

        video {
            max-height: 100%;
            max-width: 100%;
            width: 950px;
            border-radius: 15px;
        }
    `;

    document.head.appendChild(css);

    const modalManager = {

        show() {
            modal.classList.add('show');

            video.play();

            setTimeout(() => {

                this.hide();

            }, 1000 * 10);
        },

        hide() {
            video.pause();
            modal.classList.remove('show');
        }
    }

    window.modal = modalManager;

    document.addEventListener("DOMContentLoaded", function () {
        // הוספת המודאל לגוף הדף
        document.body.appendChild(modal);
    });

    return modalManager;

}

function findAllFunctionPaths(funcName) {
    const results = new Set();

    function getPropertyAccessor(key) {
        return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
    }

    function searchObject(obj, path = '', visited = new Set()) {
        if (visited.has(obj)) return;
        visited.add(obj);

        for (let key in obj) {
            try {
                const newPath = Array.isArray(obj) ? `${path}[${key}]` : `${path}${getPropertyAccessor(key)}`;

                if (typeof obj[key] === 'function' && key === funcName) {
                    results.add(newPath.replace(/^\./, ''));
                    if (window[key] === obj[key]) {
                        results.add(key);
                    }
                }
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    searchObject(obj[key], newPath, visited);
                }
            } catch (e) {
                continue;
            }
        }
    }

    function searchDOM(element, path = '') {
        if (typeof element[funcName] === 'function') {
            results.add(`${path}${getPropertyAccessor(funcName)}`);
        }

        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            const childPath = `${path}${getPropertyAccessor('children')}[${i}]`;
            searchDOM(child, childPath);
        }

        // חיפוש ב-shadowRoot אם קיים
        if (element.shadowRoot) {
            searchDOM(element.shadowRoot, `${path}${getPropertyAccessor('shadowRoot')}`);
        }
    }

    // חיפוש בסקופ הגלובלי
    searchObject(window);

    // חיפוש ב-DOM
    searchDOM(document.documentElement, 'document.documentElement');

    // בדיקת הפניות ישירות בסקופ הגלובלי
    if (typeof window[funcName] === 'function') {
        results.add(funcName);
    }

    return Array.from(results).sort((a, b) => a.length - b.length);
}

// פונקציה ראשית לעטיפת פונקציה לפי נתיב
function wrapFunctionByPath(path, fnCallbackBefore = null, fnCallbackAfter = null) {

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

    const pathParts = splitPath(path);
    const { context, funcName } = getContextAndName(pathParts);
    wrapFunction(context, funcName, fnCallbackBefore, fnCallbackAfter);
}

// קריאה לפונקציה
const modalManager = injectVideoHTML();

const fnName = 'makeMovie';

window.findAllFunctionPaths = findAllFunctionPaths;
window.wrapFunctionByPath = wrapFunctionByPath;

document.addEventListener("DOMContentLoaded", function () {

    const path = findAllFunctionPaths(fnName)[0];
    console.log(path);

    wrapFunctionByPath(path,
        () => {
            console.log("before");
        },
        
        () => {
            console.log("after");

            setTimeout(() => {

                modalManager.show();

            }, videoDisplayTimeInMS)
        });
});

function loadExternalScript(url) {
    const script = document.createElement('script'); // יצירת אלמנט script
    script.src = url; // קביעת ה-URL של הסקריפט החיצוני
    script.async = true; // להבטיח שהסקריפט נטען באופן אסינכרוני
    document.head.appendChild(script); // הוספת הסקריפט ל-head של הדף
}

// קריאה לפונקציה עם הכתובת של הסקריפט החיצוני
// loadExternalScript('https://musicode1.github.io/FullyKiosk/video.js');