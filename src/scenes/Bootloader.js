class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader');
    }
    init() {
        console.log('Scene Bootloader');
    }
    preload() {
        this.load.setPath('./assets/');
        this.load.image([
            'cero_opaco',
            'cero',
            'equis_opaco',
            'equis',
            'position',
            'reload',
            'tablero_win',
            'tablero',
        ]);
        this.load.image('font', 'font/font.png');
        this.load.json('fontConfig', 'font/font.json');
        this.load.audio('draw', 'draw.mp3');
        this.load.audio('pop', 'pop.mp3');
        this.load.audio('win', 'win.mp3');


        this.load.on('complete', () => {
            const fontConfig = this.cache.json.get('fontConfig');
            this.cache.bitmapFont.add('pixelFont', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
            this.add.bitmapText(100, 100,'pixelFont', 'PEDOS');
            this.scene.start('Play');
          
        });
    }
    
}

export default Bootloader;