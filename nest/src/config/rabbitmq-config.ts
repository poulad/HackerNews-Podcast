export default () => ({
  rabbitmq: {
    uri: process.env.AMQP_URI || 'amqp://localhost:5672',
  },
});
