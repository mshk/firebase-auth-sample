import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { firebaseAuth, firebaseDb } from '../../lib/firebase'
import FontAwesome from 'react-fontawesome'
import Debug from 'debug'

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import TextField from 'material-ui/TextField';

const debug = Debug('app:components:Login')

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
}

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.provider = new firebaseAuth.TwitterAuthProvider()
    this.provider.setCustomParameters({
      'lang': 'ja'
    })


    this.state = {
      currentUser: {
        isLoggedIn: false,
        id: null,
        isEmailVerified: null,
        name: null,
        email: null
      },
      emailField: null,
      passwordField: null
    }

    this.unsubscribeOnAuthStateChanged = firebaseAuth().onAuthStateChanged(this.handleAuthStateChanged.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribeOnAuthStateChanged()
  }

  handleAuthStateChanged(user) {
    debug("handleAuthStateChanged(): user = ", user)

    let currentUser = firebaseAuth().currentUser
    let currentUserId = null

    if (currentUser) {
      this.setState({
        currentUser: {
          isLoggedIn: true,
          id: currentUser.uid,
          isEmailVerified: currentUser.emailVerified,
          name: currentUser.displayName,
          email: currentUser.email,
        }
      })
    } else {
      this.setState({
        currentUser: {
          isLoggedIn: false,
          id: null,
          isEmailVerified: null,
          name: null,
          email: null
        }
      })
    }
  }

  onTextChange(event) {
    if (event.target.id === 'email') {
      this.setState({
        emailField: event.target.value
      });
    }

    if (event.target.id === 'password') {
      this.setState({
        passwordField: event.target.value
      });
    }
  }

  handleEmailSineup(event) {
    firebaseAuth()
      .createUserWithEmailAndPassword(this.state.emailField, this.state.passwordField)
      .catch(function (error) {
        if (error) {
          console.error('Error(' + error.code + '): ' + error.message);
        }
      });
  }

  handleEmailLogin(event) {
    debug("handleEmailLogin: state = ", this.state);

    firebaseAuth()
      .signInWithEmailAndPassword(this.state.emailField, this.state.passwordField)
      .catch(function (error) {
        if (error) {
          console.error('Error(' + error.code + '): ' + error.message);
        }
      });
  }

  handleTwitterLogin(event) {
    firebaseAuth().signInWithPopup(this.provider)
      .then((result) => {
        firebaseDb.ref('credentials/' + result.user.uid)
          .set({
            userId: result.user.uid,
            twitterAccessToken: result.credential.accessToken,
            twitterSecret: result.credential.secret,
            twitterIdStr: result.additionalUserInfo.profile.id_str
          })
      })
      .catch((error) => {
        console.error("Firebase sign-in error:", error)
      })

  }

  handleLogout(event) {
    firebaseAuth().signOut()
      .then((result) => {
        debug("logout:" + JSON.stringify(result))
      })
      .catch((error) => {
        console.error("Firebase sign-out error:", error)
      })

  }

  handleVerifyEmailAddress() {
    firebaseAuth().currentUser.sendEmailVerification().then(function (resp) {
      debug("email sent");
    }).catch(function (error) {
      console.error(error.code + ': ' + error.message);
    });
  }

  handleSendToken() {
    debug('handleSendToken():');

    firebaseAuth().currentUser.getToken(/* forceRefresh */ true).then(function (idToken) {
      // Send token to your backend via HTTPS
      // ...
      console.log('got token: ', idToken);
      console.log('email verified: ', firebaseAuth().currentUser.emailVerified);
    }).catch(function (error) {
      // Handle error
    });
  }

  render() {
    if (this.state.currentUser.isLoggedIn == null) {
      return (<div>ロード中...</div>)
    }

    return (
      <div>
        {this.state.currentUser.isLoggedIn &&
          (
            <div style={{ margin: '4em 10em 4em 10em' }}>
              <Card>
                <CardTitle title={this.state.currentUser.name ? this.state.currentUser.name : '(名前設定なし)'} />
                <CardText>
                  <p><strong>id:</strong> {this.state.currentUser.id}</p>                                    
                  <p><strong>email:</strong> {this.state.currentUser.email}</p>
                  <p><strong>メール認証済み:</strong> { this.state.currentUser.isEmailVerified ? 'はい' : 'いいえ'}</p>                  
                </CardText>
                <CardActions>
                  <FlatButton label="アドレス確認メールを送信" onClick={this.handleVerifyEmailAddress.bind(this)} />
                  <FlatButton label="Tokenを確認" onClick={this.handleSendToken.bind(this)} />
                  <FlatButton label="ログアウト" onClick={this.handleLogout.bind(this)} />

                </CardActions>
              </Card>
            </div>
          ) ||
          (
            <div style={{ padding: '4em 4em 4em 4em' }}>
              <Paper style={{ textAlign: 'center', padding: '2em', margin: 'auto auto' }} zDepth={1} rounded={false} >
                <TextField id="email" floatingLabelText="Eメールアドレス" onChange={this.onTextChange.bind(this)} /><br />
                <TextField id="password" floatingLabelText="パスワード" onChange={this.onTextChange.bind(this)} type="password" /><br />
                <RaisedButton label="新規登録" onClick={this.handleEmailSineup.bind(this)} style={{ margin: '2em 2em' }} />
                <RaisedButton label="ログイン" onClick={this.handleEmailLogin.bind(this)} style={{ margin: '2em 2em' }} primary={true} /><br />
              </Paper>
              <div style={{ textAlign: 'center', marginTop: '2em' }} ><strong>又は</strong>
                <RaisedButton
                  label="Twitterでログイン"
                  labelPosition="before"
                  primary={true}
                  icon={<FontAwesome name="twitter" />}
                  style={styles.button}
                  onClick={this.handleTwitterLogin.bind(this)}
                />
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

export default Login