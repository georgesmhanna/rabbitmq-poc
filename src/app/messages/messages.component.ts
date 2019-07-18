import {Component, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  private receivedMessages = [];
  inputMessage: string;
  // private session: string;

  constructor(private rxStompService: RxStompService) {
  }

  ngOnInit() {
    this.rxStompService.watch('/queue/queueNodeWeb').subscribe((message: Message) => {


    // this.rxStompService.serverHeaders$.subscribe(serverHeaders => {
    //     this.session = serverHeaders.session;
    //     this.rxStompService.watch(`/queue/${this.session}`).subscribe((message: Message) => {
          this.receivedMessages.push(message.body);
        // });
      }
    );
  }

  onSendMessage() {
    const message = `${this.inputMessage} Message generated at ${new Date}`;
    this.rxStompService.publish({destination: '/queue/queueWebNode', body: message});
  }

}
