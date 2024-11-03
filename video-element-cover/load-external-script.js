
function InjectCodeIntoIframe(){

    const scriptURL = 'https://musicode1.github.io/FullyKiosk/video-element-cover/index.js?v=0.1';

    let funStr = loadExternalScript.toString();
    funStr += "\n\n";
    funStr += `loadExternalScript('${scriptURL}')\n`;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    try {
                        const iframeDoc = node.contentDocument || node.contentWindow.document;
                        const script = iframeDoc.createElement('script');
                        script.textContent = funStr;
                        iframeDoc.head.appendChild(script);
                    } catch (e) {
                        console.error('Cannot access iframe due to cross-origin restrictions', e);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
}

function loadExternalScript(url) {
    const script = document.createElement('script'); 
    script.src = url; 
    script.async = true; 
    script.type = 'module';
    document.head.appendChild(script); 
}

export {
    InjectCodeIntoIframe,
    loadExternalScript
}

// loadExternalScript(`https://musicode1.github.io/FullyKiosk/video-element-cover/index.js?v=${v}`)
