import React from 'react'
import { firebaseApp, firebaseAuth, firebaseDb } from '../../lib/firebase'
import { Link } from 'react-router-dom'

import Debug from 'debug'
const debug = Debug('app:components:Home')


class Home extends React.Component {
  constructor(props) {
    debug("constructor()")

    super(props)
  }


  render() {

    return (
      <div>
        <h1>ホーム</h1>
        <Link to="/login">ログイン</Link>
      </div>
    )
  }
}

export default Home