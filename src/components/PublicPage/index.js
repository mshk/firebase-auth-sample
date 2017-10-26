import React, { Component } from 'react';
import classnames from 'classnames';

export default class PublicPage extends Component {

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('NotFound', className)} {...props}>
        <h1>
          誰でも閲覧できるページ
        </h1>
      </div>
    );
  }
}