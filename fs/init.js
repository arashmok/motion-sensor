load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_timer.js');

let pin = 21;
let led = 2;
let status = '/devices/esp32/0';
let cmd = '/devices/esp32/0/cmd';
let events= '/devices/esp32/events';
GPIO.set_mode(led, GPIO.MODE_OUTPUT);

MQTT.sub(cmd,
function(conn, topic, msg) {
  print ('recv message:', msg);
  if (msg==='enable'){
   GPIO.write(led, 1);
  }
  else if (msg==='disable'){
   GPIO.write(led, 0);
  }
  MQTT.pub(status, msg, 1);
}, null);

GPIO.set_button_handler(pin, GPIO.PULL_DOWN, GPIO.INT_EDGE_ANY, 200, 
function() {
  let msg = JSON.stringify({ motion: GPIO.read(pin) });
  let readPinVal = ffi('bool mgos_gpio_read_out(int)');
  let pinStatus = readPinVal(led);
  if (pinStatus){
    let ok = MQTT.pub(events, msg, 1);
    print(ok, msg);
  }
}, null);
