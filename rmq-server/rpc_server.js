const amqp = require('amqplib/callback_api');

const opt = {credentials: require('amqplib').credentials.plain('test', 'test')};

amqp.connect('amqp://192.168.0.125', opt, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  console.log('connected.... creating channel...');
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    console.log('channel created.');

    const queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: true
    });

    console.log(' [x] Awaiting RPC requests');


    channel.consume(queue, function (msg) {
      const n = parseInt(msg.content.toString());
      console.log(" [.] fib(%d)", n);

      const r = fibonacci(n);

      console.log('fibonacci is ', r);

      channel.sendToQueue(msg.properties.headers.replyTo,
        Buffer.from(r.toString()), {
          correlationId: msg.properties.headers.correlationId
        });

      channel.ack(msg);

    }, {
      noAck: false
    });
  });
});

function fibonacci(n) {
  return (n === 0 || n === 1) ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
