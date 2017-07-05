import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GamePage } from './game';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { LeaderboardPageModule } from '../leaderboard/leaderboard.module';

@NgModule({
  declarations: [
    GamePage,
  ],
  imports: [
    IonicPageModule.forChild(GamePage),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LeaderboardPageModule
  ],
  exports: [
    GamePage
  ]
})
export class GamePageModule {}
