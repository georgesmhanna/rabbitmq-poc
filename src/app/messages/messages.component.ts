import {Component, IterableDiffers, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  receivedMessages = [];
  inputMessage: string;
  inputNumberRpc: string;
  resultRpc: string;
  queuedMessages: any[] = [];

  // private session: string;

  constructor(private rxStompService: RxStompService) {
  }

  ngOnInit() {

    // localStorage.setItem('queuedMessages');

    this.rxStompService.connected$.subscribe(() => {
      this.sendQueuedMessages();
    });
    // this.rxStompService.watch('/queue/queueNodeWeb').subscribe((message: Message) => {


    // this.rxStompService.serverHeaders$.subscribe(serverHeaders => {
    //     this.session = serverHeaders.session;
    //     this.rxStompService.watch(`/queue/${this.session}`).subscribe((message: Message) => {
    // this.receivedMessages.push(message.body);
    // });
  }

  // );
  // }

  onSendMessage() {
    const message = `${this.inputMessage} Message generated at ${new Date}`;
    this.rxStompService.publish({destination: '/queue/queueWebNode', body: message});
  }

  onSendRpcMessage() {
    const correlationId = this.generateUuid();
    const queueId = this.generateUuid();
    const num = this.inputNumberRpc;
    console.log(` [x] Requesting fib(${num})`);

    this.rxStompService.watch(`/queue/queue-${queueId}`).subscribe((message: Message) => {
      console.log(' [.] Got %s', message.body.toString());
      if (message.headers['correlation-id'] === correlationId) {
        this.resultRpc = message.body.toString();
      }
    });

    const message = {
      destination: '/queue/rpc_queue',
      headers: {
        correlationId: correlationId,
        replyTo: `queue-${queueId}`
      },
      body: num
    };

    // check if connected
    if (!this.rxStompService.connected()) {
      // const queued = JSON.parse(localStorage.getItem('queuedMessages'));
      // queued.push(message);
      // localStorage.setItem('queuedMessages', JSON.stringify(queued));
      this.queuedMessages.push(message);
      return;
    }

    this.rxStompService.publish(message);
  }

  generateUuid() {
    return Math.random().toString(36).slice(-5);
  }

  sendQueuedMessages() {
    const messages = this.queuedMessages;
    this.queuedMessages = [];
    if (messages.length === 0) {
      return;
    }
    messages.forEach(message => {
      this.rxStompService.publish(message);
    });
  }
}
