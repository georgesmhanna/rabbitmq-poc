const amqp = require('amqplib/callback_api');

const opt = { credentials: require('amqplib').credentials.plain('test', 'test') };

amqp.connect('amqp://192.168.0.125', opt,  (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('connected.... creating channel...');
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        console.log('channel created.');


        // sending .............................................
        console.log('sending message ....');

        const queue1 = 'queueNodeWeb';

        // setInterval(()=>{
        //     let msg = `Hello from node server at ${new Date()}`;
        //     channel.assertQueue(queue1, {durable: true});
        //     channel.sendToQueue(queue1, Buffer.from(msg));
        //     console.log(" [x] Sent %s", msg);
        // }, 60000);

      channel.assertQueue('', {exclusive: true});
      channel.sendToQueue('rpc_queue', Buffer.from('10'), {replyTo: queue1});


        // receiving ..........
        let queue2 = 'queueWebNode';
        channel.assertQueue(queue2, {durable: true});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue2);
        channel.consume(queue2, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});
