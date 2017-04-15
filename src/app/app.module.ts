import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Health} from "@ionic-native/health";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {BrowserTab} from "@ionic-native/browser-tab";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Deeplinks} from "@ionic-native/deeplinks";
import {Facebook} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";
import {SocialSharing} from "@ionic-native/social-sharing";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      locationStrategy: 'path'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Health,
    BrowserTab,
    InAppBrowser,
    Deeplinks,
    Facebook,
    GooglePlus,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
