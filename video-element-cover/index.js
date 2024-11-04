
import { wrapFunctionByPath } from "./wrap-fun-by-path.js";
import { searchFunInGlobal } from "./search-fun-in-global.js";
import { createVideoHTML } from "./video-element.js";
import { gameConfigs as gameConfigsFromFile } from "./game-configs.js";
import { InjectCodeIntoIframe } from "./load-external-script.js";


// @ts-ignore
const videoDisplayTimeInMS = window.videoLength || 40 * 1000;
// @ts-ignore
const videoURL = window.videoURL || 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const gameConfigs = window.gameConfigs || gameConfigsFromFile;

// const fnName = 'onSoundFinnished' | 'makeMovie';

// const videoURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
// 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
// 'http://localhost/sdcard/video.mp4'

function loadElements() {

    const { modal, modalManager } = createVideoHTML(videoURL);

    console.log(document.readyState);

    document.body.appendChild(modal);
    console.log('The elements have been loaded successfully!');

    return { modalManager, modal };
}

function searchGame(path) {

    return gameConfigs.find((v) => path.includes(v.path))
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function loadAndSetVideoElement() {

    if (document.readyState !== 'complete') {

        await new Promise(resolve => window.onload = resolve)
    }

    const gameConfig = searchGame(window.location.pathname);

    if (!gameConfig) return;

    const { modalManager, modal } = loadElements();

    window.modalManager = modalManager;
    window.video = modal.querySelector('video');

    const fnPath = searchFunInGlobal(gameConfig.functionName)?.[0];

    if (!fnPath) throw new Error("No wrapping function found.");

    console.log('Function search successfully completed!');

    wrapFunctionByPath(fnPath, null, async () => {

        console.log('Video playback begins...');


        await sleep(gameConfig.delay);

        modalManager.show();

        await sleep(videoDisplayTimeInMS + gameConfig.delay);

        modalManager.hide();
    })

}

function main() {

    console.log(`The script runs under the address ${window.location.href}`);

    if (window.self !== window.top) {
        console.log("The page is inside an iframe.");
        loadAndSetVideoElement();

    } else {
        console.log("The page is not inside an iframe.");

        if (window.location.href.includes('new_game')) {
            loadAndSetVideoElement();
        } else {
            InjectCodeIntoIframe();
        }

    }

}

main()