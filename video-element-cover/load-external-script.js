
function loadExternalScript(url) {
    const script = document.createElement('script'); 
    script.src = url; 
    script.async = true; 
    script.type = 'module';
    document.head.appendChild(script); 
}

loadExternalScript('https://musicode1.github.io/FullyKiosk/video-element-cover/index.js?v=0.1')
