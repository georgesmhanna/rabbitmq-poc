import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './my-rx-stomp.config';
import { MessagesComponent } from './messages/messages.component';
import {FormsModule} from '@angular/forms';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [{
    provide: InjectableRxStompConfig,
    useValue: myRxStompConfig
  },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
