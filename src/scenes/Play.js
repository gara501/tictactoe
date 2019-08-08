import db from '../share/share.js';

class Play extends Phaser.Scene {
  constructor() {
    super('Play');
  }

  init() {
    this.audioDraw = this.sound.add('draw');
    this.audioPop = this.sound.add('pop');
    this.audioWin = this.sound.add('win');

    this.turno = Phaser.Math.Between(0, 1);
    this.centroCanvas = {
      width: this.sys.game.config.width / 2,
      height: this.sys.game.config.height / 2,
    };

    this.turnoText = this.add.bitmapText(this.centroCanvas.width, 50, 'pixelFont', 'TURNO DE: ' + ((this.turno) ? 'O': 'X'))
    .setOrigin(0.5);

    this.puntosText = {
      cero: this.add.bitmapText(10, (this.centroCanvas.height * 2) - 70, 'pixelFont', 'CERO: ' + db.puntos.cero ),
      equis: this.add.bitmapText(10, (this.centroCanvas.height * 2) - 50, 'pixelFont', 'EQUIS: ' + db.puntos.equis ),
    };

    this.cambiarTurno();
  }

  create() {
    
    this.tablero_win = this.add.image(0, 0, 'tablero_win');
    this.tablero_text = this.add.bitmapText(0, 0, 'pixelFont', 'GANADOR\n\nX', 16, 1);
    this.tablero_button = this.add.image(0, 0, 'reload').setInteractive();
    Phaser.Display.Align.In.Center(this.tablero_text, this.tablero_win, 0, -15);
    Phaser.Display.Align.In.BottomCenter(this.tablero_button, this.tablero_win, 0, -15);

    this.tableroContainer = this.add.container(this.centroCanvas.width, this.centroCanvas.height);
    this.tableroContainer.add([
        this.tablero_win,
        this.tablero_text,
        this.tablero_button
    ]);
    this.tableroContainer.setDepth(2);
    this.tableroContainer.setScale(0);

    this.tablero_button.on(Phaser.Input.Events.POINTER_UP, () => {
      this.add.tween({
          targets: this.tableroContainer,
          scaleX: 0,
          scaleY: 0,
          duration: 1000,
          ease: 'Bounce',
          onComplete: () => {
              this.scene.start('Reload');
          }
      });
    });

    this.tablero = this.add.image(this.centroCanvas.width, this.centroCanvas.height, 'tablero');
    this.tablero.setAlpha(0);

    this.positionTablero = [
      this.add.image(this.centroCanvas.width -48, this.centroCanvas.height-48, 'position'),
      this.add.image(this.centroCanvas.width, this.centroCanvas.height-48, 'position'),
      this.add.image(this.centroCanvas.width+48, this.centroCanvas.height-48, 'position'),
      this.add.image(this.centroCanvas.width -48, this.centroCanvas.height, 'position'),
      this.add.image(this.centroCanvas.width, this.centroCanvas.height, 'position'),
      this.add.image(this.centroCanvas.width+48, this.centroCanvas.height, 'position'),
      this.add.image(this.centroCanvas.width -48, this.centroCanvas.height+48, 'position'),
      this.add.image(this.centroCanvas.width, this.centroCanvas.height+48, 'position'),
      this.add.image(this.centroCanvas.width+48, this.centroCanvas.height+48, 'position')
    ];
    this.positionTablero.map((position, i) => {
      position.setInteractive();
      position.setAlpha(0);

      position.on(Phaser.Input.Events.POINTER_OVER, () => {
        position.frame = this.textures.getFrame(db.jugadorActual + '_opaco');
      });
      position.on(Phaser.Input.Events.POINTER_OUT, () => {
        position.frame = this.textures.getFrame('position');
      });
      position.on(Phaser.Input.Events.POINTER_DOWN, () => {
        position.frame = this.textures.getFrame(db.jugadorActual);
      });
      position.on(Phaser.Input.Events.POINTER_UP, () => {
        position.removeInteractive();
        position.frame = this.textures.getFrame(db.jugadorActual);
        this.audioPop.play();
        this.logic(i);
      });
    });

    this.add.tween({
      targets: [...this.positionTablero, this.tablero],
      alpha: 1,
      duration: 1000,
      ease: 'Power1'
    });

  }

  cambiarTurno() {
    this.turno = !this.turno;
    db.jugadorActual = (this.turno) ? 'cero': 'equis';
    this.turnoText.setText('TURNO DE: ' + ((this.turno) ? '0': 'X'));
  }

  logic(i) {
    db.partidaActual[this.getBi(i).y][this.getBi(i).x] = this.turno ? 1 : 0;

    if (this.win().empate) {
      this.audioDraw.play();
      this.tablero_text.setText('EMPATE');
      Phaser.Display.Align.In.Center(this.tablero_text, this.tablero_win, 0, -15);
      this.add.tween({
        targets: this.tableroContainer,
        scaleX: 1,
        scaleY: 1,
        ease: 'Bounce',
        duration: 500
      });
    } else if (this.win().gano) {
        this.audioWin.play();
        db.puntos[this.win().jugador]++;
        this.puntosText[this.win().jugador].setText(this.win().jugador.toUpperCase() + 
        ': ' + db.puntos[this.win().jugador]);


        this.tablero_text.setText('GANADOR\n\n' + ((this.turno) ? 'O' : 'X'));
        this.add.tween({
            targets: this.tableroContainer,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce',
            duration: 500
        });
    }

    this.cambiarTurno();
  }

  getBi(i) {
    return {
      y: Math.floor(i / 3),
      x: i % 3
    }
  }

  win() {
    const salida = {
      gano: false,
      empate: false,
      jugador: db.jugadorActual
    };

    if (!db.partidaActual.flat().some(x => x === -1)) {
      salida.empate = true;
      
    }

    // Horizontales
    for (let i = 0; i<= 2; i++) {
      if ([
        db.partidaActual[i][0],
        db.partidaActual[i][1],
        db.partidaActual[i][2],
      ].every(x => ((this.turno) ? 1: 0) === x)) {
        salida.gano = true;
        salida.empate = false;
      } 
    }
    // Verticales
    for (let i = 0; i<= 2; i++) {
      if ([
        db.partidaActual[0][i],
        db.partidaActual[1][i],
        db.partidaActual[2][i],
      ].every(x => ((this.turno) ? 1: 0) === x)) {
        salida.gano = true;
        salida.empate = false;
      } 
    }
    // Diagonales
    
    if ([
      db.partidaActual[0][2],
      db.partidaActual[1][1],
      db.partidaActual[2][0],
    ].every(x => ((this.turno) ? 1: 0) === x)) {
      salida.gano = true;
      salida.empate = false;
    } else if ([
      db.partidaActual[0][0],
      db.partidaActual[1][1],
      db.partidaActual[2][2],
    ].every(x => ((this.turno) ? 1: 0) === x)) {
      salida.gano = true;
      salida.empate = false;
    }
    

    return salida;
  }
}

export default Play;