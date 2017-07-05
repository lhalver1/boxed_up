import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaderboardPage } from './leaderboard';

import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    LeaderboardPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaderboardPage),
    AngularFireDatabaseModule,
  ],
  exports: [
    LeaderboardPage
  ]
})
export class LeaderboardPageModule {}
