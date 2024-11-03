
import { wrapFunctionByPath } from "./wrap-fun-by-path.js";
import { searchFunInGlobal } from "./search-fun-in-global.js";
import { createVideoHTML } from "./video-element.js";
import { gameConfigs as gameConfigsFromFile } from "./game-configs.js";


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

    if (document.readyState !== 'complete') {

        window.onload = () => {
            document.body.appendChild(modal);
        }

    } else {
        document.body.appendChild(modal);
    }

    return { modalManager, modal };
}

function searchGame(path) {

    return gameConfigs.find((v) => path.includes(v.path))
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function main() {

    const gameConfig = searchGame(window.location.pathname);

    if (!gameConfig) return;

    const { modalManager, modal } = loadElements();

    window.modalManager = modalManager;
    window.video = modal.querySelector('video');

    const fnPath = searchFunInGlobal(gameConfig.functionName)?.[0];

    if (!fnPath) throw new Error("No wrapping function found.");

    wrapFunctionByPath(fnPath, null, async () => {

        await sleep(gameConfig.delay);

        modalManager.show();

        await sleep(videoDisplayTimeInMS);

        modalManager.hide();
    })

}

main()