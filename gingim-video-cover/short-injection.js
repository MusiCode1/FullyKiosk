
(function loadExternalScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.type = 'module';
    document.head.appendChild(script);
})('https://musicode1.github.io/FullyKiosk/gingim-video-cover/index.js');

function a(){
    javascript: fetch('https://musicode1.github.io/FullyKiosk/gingim-video-cover/short-injection.js')
    .then(res=>res.text())
    .then(code=>eval(code));
}