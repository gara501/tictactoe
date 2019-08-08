import Bootloader from './scenes/Bootloader.js';
import Play from './scenes/Play.js';
import Reload from './scenes/Reload.js';

const config = {
    title: 'Curso Phaser',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'contenedor',
        width: 180,
        height: 320,
    },
    type: Phaser.AUTO,
    pixelArt: true,
    backgroundColor: '#372538',
    scene: [Bootloader, Play, Reload]
};

const game = new Phaser.Game(config);