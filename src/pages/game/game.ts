import { Component, HostListener } from '@angular/core';
import { Platform, AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { AdMobPro } from '@ionic-native/admob-pro';

import { LeaderboardPage } from '../leaderboard/leaderboard';

import * as firebase from 'firebase/app';

interface AdMobType {
  banner: string,
  interstitial: string
};

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  highScores: FirebaseListObservable<any[]>;
  facebookUser: any;
  googleUser: any;
  score: string;
  devicePlatform: string;
  counter: number;
  adReady: boolean;
  admobid: AdMobType;

  @HostListener('window:gameScore', ['$event'])
  testListener(event) {
    this.counter += 1;
    console.log("counter: " + this.counter);
    if (this.counter % 4 === 0) {
      //Show Ad
      this.admob.showInterstitial();
      this.adReady = false;
    } else {
      if(!this.adReady) {
        //prepare ad
        this.prepareInterstitial();
      }
    }

    this.score = event.detail;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public afAuth: AngularFireAuth,
    private admob: AdMobPro, private platform: Platform, private alertCtrl: AlertController, public modalCtrl: ModalController,
    private screenOrientation: ScreenOrientation) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      
      this.facebookUser = '';
      this.googleUser = '';
      this.score = '';
      this.devicePlatform = '';
      this.counter = 1;
      this.adReady = false;

      if (this.platform.is('android')) {
        this.devicePlatform = 'Android';
        this.admobid = { // for Android
          banner: 'ca-app-pub-8794313592502337/8445069607',
          interstitial: 'ca-app-pub-8794313592502337/6968336405'
        };
      } else if (this.platform.is('ios')) {
        this.devicePlatform = "iOS"
        this.admobid = { // for iOS
          banner: 'ca-app-pub-8794313592502337/3875269205',
          interstitial: 'ca-app-pub-8794313592502337/2398536006'
        };
      }

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
  }
  

  googleLogin() {
    let _this2 = this;
    let provider = new firebase.auth.GoogleAuthProvider();
  
    if (this.facebookUser != '') {
      this.facebookUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential;
        _this2.googleUser = result.user;
      }).catch(function(error) {
        // Handle Errors here.
      });
    } else {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        _this2.googleUser = result.user;
      }).catch(function(error) {
        var errorMessage = error.message;
        console.log(errorMessage);
        _this2.googleUser = '';
      });
    }
  }
  googleLogout() {
    let _this2 = this;
    firebase.auth().signOut().then(function() {
      _this2.googleUser = '';
    }).catch(function(error) {

    });
  }

  facebookLogin() {
    let _this2 = this;
    let provider = new firebase.auth.FacebookAuthProvider();
    if (this.googleUser != '') {
      this.googleUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential;
        _this2.facebookUser = result.user;
      }).catch(function(error) {
        // Handle Errors here.
      });
    } else {
      provider.setCustomParameters({
        'display': 'popup'
      });
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // var token = result.credential.accessToken;
        _this2.facebookUser = result.user;
      }).catch(function(error) {
        var errorMessage = error.message;
        console.log(errorMessage);
        _this2.facebookUser = '';
      });
    }
  }
  facebookLogout() {
    let _this2 = this;
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      _this2.facebookUser = '';
    }).catch(function(error) {
      // An error happened.
    });
  }

  prepareInterstitial() {
    this.admob.prepareInterstitial({
      adId: this.admobid.interstitial,
      isTesting: false,
      autoShow: false
    }).then(() => { this.adReady = true; });
  }

  submitScore() {

    if (typeof this.score === 'undefined' || this.score == null) {
      let alert = this.alertCtrl.create({
        title: 'No Score to submit',
        subTitle: 'You must play at least once to submit your score!',
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.score === 'submitted') {
      let alert = this.alertCtrl.create({
        title: 'Already Submitted',
        subTitle: 'You already submitted this score, please play again',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let name = '';

      let alert = this.alertCtrl.create({
        title: 'Score: ' + this.score,
        message: "Please give a name for the leader board" + name,
        inputs: [
          {
            name: 'name',
            placeholder: 'Name',
            max: 10
          },
        ],
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
              let scoreInt = parseInt(this.score);
              if(data.name.length > 15) {
                data.name = data.name.substring(0, 15) 
              }
              
              if (typeof scoreInt != 'undefined' && scoreInt != null && scoreInt > 0) {
                this.highScores.push({
                  name: data.name,
                  platform: this.devicePlatform,
                  score: scoreInt
                });
                this.score = "submitted";
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
