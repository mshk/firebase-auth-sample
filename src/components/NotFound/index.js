import React, { Component } from 'react';
import classnames from 'classnames';

export default class NotFound extends Component {

  render() {
    console.log("render()")

    const { className, ...props } = this.props;
    return (
      <div className={classnames('NotFound', className)} {...props}>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}