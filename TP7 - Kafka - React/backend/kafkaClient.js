const { Kafka } = require('kafkajs');


const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const kafka = new Kafka({
clientId: 'tp7-app',
brokers
});


module.exports = { kafka };