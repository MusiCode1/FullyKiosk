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

[
  'makeGoodSound',
  'playEndLevelAnimation'
]

// דוגמאות שימוש:
console.log(findAllFunctionPaths('makeGoodSound'));
// צפוי להחזיר משהו כמו: ['document.querySelector', 'querySelector']

// דוגמה עם אלמנט מותאם אישית:
const customElement = document.createElement('div');
customElement.myCustomFunction = function () { };
document.body.appendChild(customElement);

console.log(findAllFunctionPaths('myCustomFunction'));
// צפוי להחזיר משהו כמו: ['document.documentElement.children[1].children[0].myCustomFunction']

// בדיקה לפונקציה שלא קיימת:
console.log(findAllFunctionPaths('nonExistentFunction')); // צפוי להחזיר: []














function createProxyForObject(obj, targetFuncName) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === 'function') {
                return function (...args) {
                    if (prop === targetFuncName) {
                        console.log(`${targetFuncName} נקראה עם הארגומנטים:`, args);
                        // כאן תוכל להוסיף את הקוד שלך
                        // לדוגמה:
                        // myCustomCode();
                    }
                    return value.apply(this, args);
                };
            }
            return value;
        }
    });
}

// דוגמה לשימוש:
window.game = createProxyForObject(window.game, 'playEndLevelAnimation');
























function interceptAnyFunction(funcName, callback) {
    function recursiveIntercept(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (prop === funcName && typeof obj[prop] === 'function') {
                    const original = obj[prop];
                    obj[prop] = function (...args) {
                        callback.apply(this, args);
                        return original.apply(this, args);
                    };
                    console.log(`הפונקציה ${funcName} נתפסה בהצלחה`);
                } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                    recursiveIntercept(obj[prop]);
                }
            }
        }
    }

    recursiveIntercept(window);
}

// שימוש:
interceptAnyFunction('playEndLevelAnimation', function () {
    console.log('playEndLevelAnimation הופעלה!');
    // כאן תוכל להוסיף את הקוד שלך
    // לדוגמה:
    // myCustomCode();
    


fetch("http://homeassistant.local:8123/api/services/light/toggle", {
    "method": "POST",
    "headers": {
      "user-agent": "vscode-restclient",
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwYzI3NGNlNGFjYzQ0Y2FkYmZmNTQxMDI0YTM2NzFlNiIsImlhdCI6MTcyNjY5Mjg2NywiZXhwIjoyMDQyMDUyODY3fQ.adXcvsNEPoRWORrVuopW-wcHXn-vzyP8yOuo95jEDRc",
      "content-type": "application/json"
    },
    "body": {
      "entity_id": "light.room_light"
    }
  })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
});



(function name() {
    document.querySelector('.yy-button').remove();
})()














function safeInterceptFunction(funcName, callback) {
    const MAX_DEPTH = 10; // הגבלת עומק החיפוש
    const visited = new WeakSet(); // מניעת לולאות אינסופיות
  
    function recursiveIntercept(obj, depth = 0) {
      if (depth > MAX_DEPTH || visited.has(obj) || typeof obj !== 'object' || obj === null) {
        return;
      }
  
      visited.add(obj);
  
      for (let prop in obj) {
        try {
          if (obj.hasOwnProperty(prop)) {
            if (prop === funcName && typeof obj[prop] === 'function') {
              const original = obj[prop];
              obj[prop] = function(...args) {
                callback.apply(this, args);
                return original.apply(this, args);
              };
              console.log(`הפונקציה ${funcName} נתפסה בהצלחה`);
            } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
              recursiveIntercept(obj[prop], depth + 1);
            }
          }
        } catch (error) {
          // התעלם משגיאות גישה למאפיינים
        }
      }
    }
  
    recursiveIntercept(window);
  }
  
  // הוספת מאזין לשינויים ב-DOM
  const observer = new MutationObserver(() => {
    safeInterceptFunction('playEndLevelAnimation', function() {
      console.log('playEndLevelAnimation הופעלה!');
      // כאן תוכל להוסיף את הקוד שלך
    });
  });
  
  // התחלת המעקב אחרי שינויים ב-DOM
  observer.observe(document.body, { childList: true, subtree: true });
  
  // הרצה ראשונית
  safeInterceptFunction('playEndLevelAnimation', function() {
    console.log('playEndLevelAnimation הופעלה!');
    // כאן תוכל להוסיף את הקוד שלך
  });