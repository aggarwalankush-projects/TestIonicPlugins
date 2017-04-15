import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Health} from "@ionic-native/health";
import {BrowserTab} from "@ionic-native/browser-tab";
import {HomePage} from "../pages/home/home";
import {Deeplinks} from "@ionic-native/deeplinks";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";
import {SocialSharing} from "@ionic-native/social-sharing";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  @ViewChild(Nav) navChild: Nav;


  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public browserTab: BrowserTab,
              public deep: Deeplinks,
              public fb: Facebook,
              public googlePlus: GooglePlus,
              public socialSharing: SocialSharing,
              public health: Health) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      // this.initShare();
      // this.initGooglePlus();
      // this.initFacebook();
      // this.initHealth();
      // this.initFitbit();
    });
  }

  initShare() {
    this.socialSharing.shareWithOptions({
      message: "this is message to be shared"
    })
      .then(res => {
        console.log("==========Share success=============");
        console.log("Share completed? " + res.completed);
      })
      .catch(err => {
        console.log("==========Share error error=============");
        console.log(JSON.stringify(err));
      });
  }

  initGooglePlus() {
    this.googlePlus.login({})
      .then(res => {
        console.log("==========Google login=============");
        console.log(JSON.stringify(res));
      })
      .catch(err => {
        console.log("==========Google login error=============");
        console.log(JSON.stringify(err));
      });
    //
    // this.googlePlus.trySilentLogin({})
    //   .then(res => {
    //     console.log("==========Google silent login=============");
    //     console.log(JSON.stringify(res));
    //   })
    //   .catch(err => {
    //     console.log("==========Google silent login error=============");
    //     console.log(JSON.stringify(err));
    //   });
  }

  initFacebook() {
    this.fb.getLoginStatus()
      .then(loginStatus => {
        console.log("==========FB Login status=============", loginStatus.status);
        console.log(JSON.stringify(loginStatus));
        if (loginStatus.status !== 'connected') {
          this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => {
              console.log('Logged into Facebook!');
              console.log(JSON.stringify(res));
              this.getFBData();
            })
            .catch(e => console.log('Error logging into Facebook', e));
        } else {
          this.getFBData();
        }
      }).catch(err => console.error(err));
  }

  getFBData() {
    this.fb.api('/me?fields=name,age_range,gender,email', null)
      .then(user => {
        let picture = "https://graph.facebook.com/" + user.id + "/picture?height=540&width=540";
        console.log(picture);
        console.log("==========FB API=============");
        console.log(JSON.stringify(user));
      });

  }


  initFitbit() {

    let self = this;
    this.deep.route({
      'my-home': HomePage
    }).subscribe((match) => {
      console.log('Successfully routed hey');
      console.log(match);
    }, (nomatch) => {
      console.warn('Unmatched Route');
      console.log(nomatch);

      if (nomatch && nomatch['$link'] && nomatch['$link']['queryString']) {
        let query = nomatch['$link']['queryString'];
        console.log("QueryString found - ", query);


        if (self.browserTab) {
          self.browserTab.close()
            .then(res => {
              console.log('browser tab success close');
              console.log(res);
            })
            .catch(err => {
              console.log('browser tab error');
              console.error(err);
            });
        } else {
          console.log('no browser tab');
        }

      }
    });

    const redirect_uri = 'myapp%3A%2F%2Ftojo123.com%2Fmy-home';

    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        console.log("==========browser is available=============");
        console.log(isAvailable);
        if (isAvailable) {

          this.browserTab.openUrl('https://www.fitbit.com/oauth2/authorize?' +
            'response_type=code' +
            '&client_id=2288F' +
            '&redirect_uri=' + redirect_uri +
            '&scope=activity')
            .then(res => {
              console.log('OPEN BROWSER DONE');
              console.log(res);
              console.log('OPEN BROWSER AGAIN DONE');
            })
            .catch(err => console.error(err));

        } else {

          // open URL with InAppBrowser instead or SafariViewController

        }

      });

    if (!this.platform.is('cordova')) {
      return;
    }

    // console.log('will open window');
    // let ref = window.open('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=2288FM&redirect_uri=myapp%3A%2F%2Ftojo123.com%2Fmy-home&scope=activity&expires_in=604800', '_blank');
    // ref.addEventListener('loadstart', (event: any) => {
    //   if ((event.url).startsWith("http://localhost/callback")) {
    //     let token = event.url;
    //     console.log(token);
    //     ref.close();
    //   }
    // });


  }

  initHealth() {
    console.log('[][][][][][][]INIT HEALTH[][][][][]');
    this.health.isAvailable()
      .then(res => {
        console.log("==========health is available=============");
        console.log(res);

        this.health.promptInstallFit()
          .then(res => {
            console.log("==========promptInstallFit OK=============");
            console.log(res);
          })
          .catch(err => {
            console.log("==========promptInstallFit ERROR=============");
            console.log(err);
          });


        // this.health.isAuthorized(['steps'])
        //   .then(res => {
        //     console.log("==========steps is isAuthorized=============");
        //     console.log(res);
        //   });

        this.health.requestAuthorization(
          [
            'distance',   //read and write permissions
            {
              read: ['steps'],       //read only permission
              write: ['height', 'weight']  //write only permission
            }
          ]
          // [{read:['steps','height']}]
        )
          .then(res => {
            console.log("==========steps is authorized=============");
            console.log(res);
            this.health.queryAggregated({
              startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
              endDate: new Date(), // now
              dataType: 'steps',
              bucket: 'day'
            })
              .then(res => {
                console.log("==========query aggregated is completed=============");
                console.log(res);
              })
              .catch(e => {
                console.log("==========query aggregated is NOT completed=============");
                console.error(e);

              });
          })
          .catch(e => {
            console.log("*********steps is NOT authorized***********");
            console.error(e);
          });

      })
      .catch(e => {
        console.log("*********health is NOT available***********");
        console.error(e);
      });
  }

}
