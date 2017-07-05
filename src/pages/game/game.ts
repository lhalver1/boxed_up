import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { WindowRefService } from '../../providers/window-ref-service';
import { LeaderboardPage } from '../leaderboard/leaderboard';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  private _window: WindowRefService;
  highScores: FirebaseListObservable<any[]>;
  facebookUser: any;
  googleUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public afAuth: AngularFireAuth,
    windowRef: WindowRefService, private alertCtrl: AlertController, public modalCtrl: ModalController) {
      this.facebookUser = '';
      this.googleUser = '';
      let user = this.afAuth.auth.currentUser;
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
      }

      this.highScores = db.list('/scores', {
        query: {
          orderByChild: 'score',
          limitToFirst: 10 
        }
      });
  
      this._window = windowRef;
  }

  googleLogin() {
    let _this = this;
    let provider = new firebase.auth.GoogleAuthProvider();
  
    if (this.facebookUser != '') {
      this.facebookUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential;
        _this.googleUser = result.user;
      }).catch(function(error) {
        // Handle Errors here.
      });
    } else {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        _this.googleUser = result.user;
      }).catch(function(error) {
        var errorMessage = error.message;
        console.log(errorMessage);
        _this.googleUser = '';
      });
    }
  }
  googleLogout() {
    let _this = this;
    firebase.auth().signOut().then(function() {
      _this.googleUser = '';
    }).catch(function(error) {

    });
  }

  facebookLogin() {
    let _this = this;
    let provider = new firebase.auth.FacebookAuthProvider();
    if (this.googleUser != '') {
      this.googleUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential;
        _this.facebookUser = result.user;
      }).catch(function(error) {
        // Handle Errors here.
      });
    } else {
      provider.setCustomParameters({
        'display': 'popup'
      });
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // var token = result.credential.accessToken;
        _this.facebookUser = result.user;
      }).catch(function(error) {
        var errorMessage = error.message;
        console.log(errorMessage);
        _this.facebookUser = '';
      });
    }
  }
  facebookLogout() {
    let _this = this;
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      _this.facebookUser = '';
    }).catch(function(error) {
      // An error happened.
    });
  }

  submitScore() {
    let score = this._window.nativeWindow.gameScore;

    if (this.facebookUser == '' && this.googleUser == '') {
      let alert = this.alertCtrl.create({
        title: 'Must Login to Facebook or Google',
        subTitle: 'You must login to Facebook or Google to submit your score!',
        buttons: ['Ok']
      });
      alert.present();
    } else if (typeof score === 'undefined' || score == null) {
      let alert = this.alertCtrl.create({
        title: 'No Score to submit',
        subTitle: 'You must play at least once to submit your score!',
        buttons: ['Ok']
      });
      alert.present();
    } else if (score === 'submitted') {
      let alert = this.alertCtrl.create({
        title: 'Already Submitted',
        subTitle: 'You already submitted this score, please play again',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let name = '';
      if (typeof this.facebookUser === 'undefined' || this.facebookUser === null || this.facebookUser === '') {
        name = this.googleUser.displayName;
      } else {
        name = this.facebookUser.displayName;
      }

      let alert = this.alertCtrl.create({
        title: 'Score: ' + score,
        message: "Name: " + name,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Submit',
            handler: data => {
              let score = parseInt(this._window.nativeWindow.gameScore);
              
              if (typeof score != 'undefined' && score != null && score > 0) {
                this.highScores.push({
                  name: name,
                  score: score
                });
                this._window.nativeWindow.gameScore = "submitted";
              }
            }
          }
        ]
      });
      alert.present();
    }
  }

  viewLeaderboard() {
    let modal = this.modalCtrl.create(LeaderboardPage);
    modal.present();
  }

}
