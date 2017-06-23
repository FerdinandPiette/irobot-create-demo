import polyfill from 'babel-polyfill';
import { install } from 'source-map-support';
install();
import SerialPort from 'serialport';
import readline from 'readline';
import {Robot, sensors} from 'irobot-create-open-interface';
import mqtt from 'mqtt';
import config from 'config';

const applicationName = config.application.name;
const mqttAddress = `${config.mqtt.protocol}://${config.mqtt.host}:${config.mqtt.port}`;
const robotSerial = config.robot.serial;

(function() {
    
    /**
    * Init MQTT client
    */
    var mqttClient  = mqtt.connect(mqttAddress);
    mqttClient.on('connect', function () {
        mqttClient.subscribe(applicationName+':command:drive');
    });

    mqttClient.on('message', function (topic, message) {    
        console.log(topic, ':', message.toString());
        switch(topic) {
            case applicationName+':command:drive':
                let data = JSON.parse(message.toString());
                if(data.left && data.right) {
                    robot.drive(data.left, data.right, true);
                } else if(data.velocity, data.radius) {
                    robot.drive(data.velocity, data.radius, false);
                } else {
                    console.log('packet error');
                }
                break;
        }
    });

    /**
    * Init irobot-create
    */
    var robot = new Robot(robotSerial);
    robot.on('connected', () => {
        robot.fullMode();
        robot.streamAllSensors();
    });

    robot.on('data', data => {
        if(mqttClient.connected) {
            mqttClient.publish(applicationName+':sensor:'+data.packet.name, JSON.stringify(data));
        }
    });

})();


