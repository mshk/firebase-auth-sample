import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { firebaseAuth } from '../../lib/firebase'
import Debug from 'debug'
const debug = Debug('app:components:RequireAuth')

class RequireAuth extends Component {
  constructor(props) {
    super(props)
    this.unsubscribeOnAuthStateChanged  = firebaseAuth().onAuthStateChanged(user => this.handleAuthStateChanged(user))

    this.state ={
      isLoaded: false,
      isAuthenticated: false
    } 

    this.render = this.render.bind(this)
    this.handleAuthStateChanged = this.handleAuthStateChanged.bind(this)    
  }

  componentWillMount() {
    //this.userWillTransfer(this.props);
  }

  componentWillUnmount() {
    this.unsubscribeOnAuthStateChanged()
  }

  componentWillUpdate(nextProps) {
    //this.userWillTransfer(this.props);
  }

  userWillTransfer(props) {
    let currentUser = firebaseAuth().currentUser

    debug("userWillTransfer", currentUser)

    if (!currentUser) {
      this.setState({ isAuthenticated: false });
    } else {
      this.setState({ isAuthenticated: true });
    }
  }

  handleAuthStateChanged(user) {
    debug("handleAuthStateChanged", user)    

    let currentUser = firebaseAuth().currentUser

    this.setState({
      isLoaded: true,
      isAuthenticated: currentUser ? true : false
    })
  }



  render() {
    debug("render: this.state = ", this.state)

    return (
      <div>
      {this.state.isLoaded ? (
        this.state.isAuthenticated ? (          
          <Route children={this.props.children} />
        ) : (
          <Redirect to="/login" />
        )
      ) : (
          <div style={{ width: '100vh', height: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, textAlign: 'center' }}>ロード中</div>
      )}    
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sessionId: state.sessionId
});

export default withRouter(RequireAuth);