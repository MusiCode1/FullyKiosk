
export function loadExternalScript(url) {
    const script = document.createElement('script'); 
    script.src = url; 
    script.async = true; 
    document.head.appendChild(script); 
}


