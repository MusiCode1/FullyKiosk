const functionsList = {

    makeMovie: {
        name: 'makeMovie',
        path: 'PIXI.game.state.states.game.makeMovie'
    },

    onShowAnimation: {
        name: 'makeMovie',
        path: 'PIXI.game.state.states.game.makeMovie'
    }
};

export const gameConfigs = [
    {
        gameName: 'tidy_up',
        triggerFunc: functionsList.makeMovie,
        delay: 5 * 1000,
        urlPath: '/wp-content/uploads/new_games/tidy_up/'
    },
    {
        gameName: 'touch_go',
        triggerFunc: functionsList.makeMovie,
        delay: 5 * 1000,
        urlPath: 'wp-content/uploads/new_games/touch_go/'
    },
    {
        gameName: 'earase_animals',
        triggerFunc: functionsList.onShowAnimation,
        delay: 5 * 1000,
        urlPath: '/wp-content/uploads/new_games/earase_animals/'
    }
];