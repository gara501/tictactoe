import db from '../share/share.js';

class Reload extends Phaser.Scene {
    constructor() {
        super('Reload');
    }

    init() {
        db.partidaActual = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ];
        this.scene.start('Play');
    }
}

export default Reload;