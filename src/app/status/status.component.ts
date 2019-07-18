import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {map} from 'rxjs/operators';
import {RxStompState} from '@stomp/rx-stomp';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  public connectionStatus$: Observable<string>;

  constructor(public rxStompService: RxStompService) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(map((state) => {
      return RxStompState[state];
    }));
  }

  // RxStompState can have one of the following values:

  // CONNECTING
  // OPEN
  // CLOSING
  // CLOSED

  ngOnInit() {
  }

}
