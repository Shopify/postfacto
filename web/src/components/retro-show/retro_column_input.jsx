/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import types from 'prop-types';
import {Actions} from 'p-flux';
import TextareaAutosize from 'react-autosize-textarea';

export default class RetroColumnInput extends React.Component {
  static propTypes = {
    category: types.string.isRequired,
    retroId: types.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      isFocused: false,
      multiline: '',
    };

    this.submitRetroItem = this.submitRetroItem.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
    this.inputBlur = this.inputBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  resolvePlaceholder() {
    const {category} = this.props;
    if (category === 'happy') {
      return 'I\'m glad that...';
    }
    if (category === 'meh') {
      return 'I\'m wondering about...';
    }
    if (category === 'sad') {
      return 'It wasn\'t so great that...';
    }
    return 'Add an action item';
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (event.target.value !== '') {
        this.submitRetroItem();
      }
      event.preventDefault();
    }
  }

  submitRetroItem() {
    const {retroId, category} = this.props;
    const {inputText} = this.state;
    if (category === 'action') {
      Actions.createRetroActionItem({retro_id: retroId, description: inputText});
    } else {
      Actions.createRetroItem({retro_id: retroId, category, description: inputText});
    }
    this.setState({inputText: '', multiline: ''});
  }

  onChange(event) {
    if (event.target.value.trim().length === 0) {
      this.setState({multiline: ''});
    }

    this.setState({inputText: event.target.value});
  }

  onResize(event) {
    // store value as well to work around https://github.com/buildo/react-autosize-textarea/issues/109
    this.setState({multiline: 'multiline', inputText: event.target.value});
  }

  inputFocus() {
    this.setState({isFocused: true});
  }

  inputBlur() {
    this.setState({isFocused: false});
  }

  renderButton() {
    if (this.state.inputText) {
      return (
        <div className={'input-button-wrapper ' + this.state.multiline}>
          <div
            className="input-button"
            onClick={this.submitRetroItem}
          >
            <i className="fa fa-check" aria-hidden="true"/>
          </div>
        </div>
      );
    }
    return null;
  }

  resolveInputBoxClass() {
    const {multiline, isFocused} = this.state;
    let classes = 'input-box ' + multiline;

    if (isFocused) {
      classes += ' focused';
    }
    return classes;
  }

  render() {
    const {category} = this.props;

    const classNames = 'retro-item-add-input';

    return (
      <div className="retro-item-list-input">
        <div className={this.resolveInputBoxClass()}>
          <TextareaAutosize
            type="text"
            className={classNames}
            placeholder={this.resolvePlaceholder(category)}
            onFocus={this.inputFocus}
            onBlur={this.inputBlur}
            onChange={this.onChange}
            value={this.state.inputText}
            onKeyPress={this.onKeyPress}
            onResize={this.onResize}
            required
            autoComplete="off"
          />
          {this.renderButton()}
        </div>
      </div>
    );
  }
}
