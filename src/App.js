import React, { Component } from 'react'

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'

// components
import Login from './components/Login'

import Debug from 'debug'
const debug = Debug('app:components:App')


class App extends Component {
  constructor(props) {
    debug("constructor()")

    super(props);
    this.state = {
      user: null
    }

    /*
    this.unsubscribeOnAuthStateChanged =
      firebaseAuth().onAuthStateChanged((user) => {
        debug("onAuthStateChanged():", user)

        if (user) {
          this.setState({
            user: {
              name: user.name,
              profile_image_url: user.photoURL
            }
          })
        } else {
          this.setState({
            user: null
          })
        }
      })
      */
  }

  componentWillUnmount() {
    debug("componentWillUnmount")
    //this.unsubscribeOnAuthStateChanged()
  }

  render() {
    return (
      <div style={{ margin: 0 }}>
        <MuiThemeProvider>
          <div>
            <AppBar
              title={<div style={{ textAlign: 'center' }}>firebase-auth-sample</div>}
              showMenuIconButton={false}
              style={{ position: "fixed", top: "0", width: "100%" }}
            />
            <div style={{ paddingTop: 60, paddingBottom: 60 }}>
              <Login />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}


export default App;
