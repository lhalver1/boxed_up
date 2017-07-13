import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMobPro } from '@ionic-native/admob-pro';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { GamePageModule } from '../pages/game/game.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyBQZurahyzElAVIYCOWOCr1j-BFmdr5Fd4",
  authDomain: "boxed-up.firebaseapp.com",
  databaseURL: "https://boxed-up.firebaseio.com",
  projectId: "boxed-up",
  storageBucket: "boxed-up.appspot.com",
  messagingSenderId: "346518771858"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    GamePageModule,
    // LeaderboardPageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SplashScreen,
    StatusBar,
    ScreenOrientation,
    AdMobPro,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
