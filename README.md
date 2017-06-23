# irobot-create-manager
Need a MQTT server and an iRobot Create connected with Serial Port.

## Configuration
In folder `config`

```
{
    "application": {
        "name": "irobot-create"
    },
    "mqtt": {
        "protocol": "mqtt",
        "host": "127.0.0.1",
        "port": "1883"
    },
    "robot": {
        "serial": "/dev/ttyUSB0"
    }
}
```

## Run
`npm start` to run in dev environment

`npm run start-prod` to run in prod environment

`npm clean` to clean build folder
