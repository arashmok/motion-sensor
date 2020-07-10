load('api_mqtt.js');

MQTT.sub('/rcv', function(conn, topic, msg) {
  print('Topic:', topic, 'message:', msg);
  MQTT.pub('/send','msg from esp32');
}, null);
