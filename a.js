var arDrone = require('node-ar-drone');
var client  = arDrone.createClient();
//client.createRepl();


var five = require("johnny-five"),
    board, nunchuk, flying = 0;

board = new five.Board();

board.on("ready", function() {

  // Create a new `nunchuk` hardware instance.
  nunchuk = new five.Nunchuk({
    freq: 50
  });

  nunchuk.joystick.on( "change", function( err, event ) {
    
    var val = event.target[ event.axis ];

    val = event.target[ event.axis ];
    if (event.axis === "x") {
      if (val > 600) {
        client.right(0.25);
      } else if (val < 400) {
        client.left(0.25);
      } else {
        client.left(0);
        client.right(0);
      }
    }

    if (event.axis === "y") {
      if (val > 600) {
        client.front(0.25);
      } else if (val < 400) {
        client.back(0.25);
      } else {
        client.front(0);
        client.back(0);
      }

    }
  });


  nunchuk.on("down", function(err, event) {
    if (event.target.which === "c") {
      client.up(1);
    }
    if (event.target.which === "z") {
      client.down(1);
    }
  });

  nunchuk.on("up", function(err, event) {
    if (event.target.which === "c") {
      client.up(0);
    }
    if (event.target.which === "z") {
      client.down(0);
    }
  });

  nunchuk.accelerometer.on( "change", function( err, event ) {
    if ( event.axis === "z" && event.target.z > 900) {
      if ( !flying ) {
        console.log("takeoff");
        client.takeoff();
        flying = 1;
      } else {
        console.log("land");
        client.land();
        flying = 0;
      }
      console.log(event.target.z + ' ' + event.direction);
    }
    
  });

});
