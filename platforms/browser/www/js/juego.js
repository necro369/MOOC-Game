var app={
  variable: {
	danger: false,
	//backgroundColor: '#f27d0c'
	backgroundColor: 'rgb(0,0,0)', //#000000
	backgroundColorDanger: '#ff0000',
  },
  
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = app.variable.backgroundColor;
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
	  game.load.image('cup', 'assets/cup.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#10f70d' });
      
	  cup = game.add.sprite(app.inicioX(), app.inicioY(), 'cup');
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
	  game.physics.arcade.enable(cup);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
	  if(app.variable.danger){
		app.variable.danger = false;
		game.stage.backgroundColor = app.variable.backgroundColorDanger;
	  }else{
		game.stage.backgroundColor = app.variable.backgroundColor;
	  }
	  
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
	  game.physics.arcade.overlap(bola, cup, app.incrementaPuntuacion, null, this);
	  
	  app.updateBackgroundColor();
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
	app.variable.danger = true;
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
	
	if (dificultad > 0){
      dificultad = dificultad - 1;
    }
  },

  incrementaPuntuacion: function(ball, object){
	var updateScore = 1;
	
	if(object.key == 'cup'){
	  cup.body.x = app.inicioX();
	  cup.body.y = app.inicioY();
	  updateScore = 10;
	}else{
	  objetivo.body.x = app.inicioX();
	  objetivo.body.y = app.inicioY();
	}
	
    puntuacion = puntuacion + updateScore;
    scoreText.text = puntuacion;

    if (puntuacion > 0){
      dificultad = dificultad + updateScore;
    }
  },
  
  updateBackgroundColor: function(){
	  var code = dificultad * 3;
	  if(code > 255){
		code = 255;
	  }
	  app.variable.backgroundColor = 'rgb('+code+','+code+','+code+')';
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}