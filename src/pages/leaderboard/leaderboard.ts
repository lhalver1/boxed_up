import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  highScores: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, private viewCtrl: ViewController) {
    this.highScores = db.list('/scores', {
        query: {
          orderByChild: 'score',
          limitToLast: 10 
        }
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
