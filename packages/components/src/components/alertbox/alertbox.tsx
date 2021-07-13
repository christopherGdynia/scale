import { Component, h, Host, Prop, Element, State } from '@stencil/core';
import classNames from 'classnames';
import statusNote from '../../utils/status-note';

@Component({
  tag: 'scale-alertbox',
  styleUrl: 'alertbox.css',
  shadow: true,
})
export class Alertbox {
  @Prop() color?: 'white' | 'black' | 'error' = 'white';
  @Prop() variant?: 'floating' | 'outline';
  @Prop() icon: boolean = false;
  @Prop({ reflect: true }) hasClose?: boolean = false;
  @Prop({ reflect: true }) opened: boolean;
  @Prop() timeout?: boolean | number = false;
  @State() content: boolean = true;
  @Element() hostElement: HTMLElement;

  defaultTimeout = 2000;

  componentDidLoad() {
    this.content = !!this.hostElement.querySelector("p[slot='text']");
  }

  connectedCallback() {
    statusNote({ source: this.hostElement, type: 'warn' });
  }

  handleIcons() {
    if (this.icon) {
      switch (this.color) {
        case 'white':
          return (
            <scale-icon-action-success
              class="alertbox__icon-success"
              accessibility-title="success"
            />
          );
        case 'black':
          return (
            <scale-icon-action-success
              class="alertbox__icon-success"
              accessibility-title="success"
            />
          );
        case 'error':
          return (
            <scale-icon-alert-error
              class="alertbox__icon-error"
              accessibility-title="error"
            />
          );
      }
    }
    return;
  }

  close() {
    this.opened = false;
  }

  onCloseAlertWithTimeout = () => {
    if (this.timeout !== false) {
      if (typeof this.timeout === 'number') {
        setTimeout(this.close, this.timeout);
      } else {
        setTimeout(this.close, this.defaultTimeout);
      }
    } else {
      return null;
    }
  };

  render() {
    this.onCloseAlertWithTimeout();

    if (!this.opened) {
      return null;
    }

    return (
      <Host>
        <div part={this.getBasePartMap()} class={this.getCssClassMap()}>
          <div part="container" class="alertbox__container">
            {this.handleIcons()}
            <header part="header" class="alertbox__container-header">
              <slot name="header">
                <p>Missing Title</p>
              </slot>
              {this.hasClose && (
                <scale-icon-action-circle-close
                  class="alertbox__icon-close"
                  onClick={() => {
                    this.close();
                  }}
                  accessibility-title="close"
                />
              )}
            </header>
          </div>
          {this.content && (
            <p part="content" class="alertbox__content">
              <slot name="text" />
            </p>
          )}
        </div>
      </Host>
    );
  }

  getBasePartMap() {
    return this.getCssOrBasePartMap('basePart');
  }

  getCssClassMap() {
    return this.getCssOrBasePartMap('css');
  }

  getCssOrBasePartMap(mode: 'basePart' | 'css') {
    const name = 'alertbox';
    const prefix = mode === 'basePart' ? '' : `${name}--`;

    return classNames(
      name,
      this.color && `${prefix}color-${this.color}`,
      this.variant && `${prefix}variant-${this.variant}`,
      this.icon && `${prefix}icon`
    );
  }
}
