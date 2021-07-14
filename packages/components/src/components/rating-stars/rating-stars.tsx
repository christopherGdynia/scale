/**
 * @license
 * Scale https://github.com/telekom/scale
 *
 * Copyright (c) 2021 Egor Kirpichev and contributors, Deutsche Telekom AG
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
  Component,
  h,
  Prop,
  Host,
  Element,
  Event,
  EventEmitter,
} from '@stencil/core';

export interface StarInterface extends HTMLDivElement {
  dataset: {
    value: string;
    selected?: string;
  };
}
const sizes = {
  small: 16,
  large: 24,
};
let ratingStarCount = 0;

@Component({
  tag: 'scale-rating-stars',
  styleUrl: 'rating-stars.css',
  shadow: true,
})
export class RatingStars {
  @Element() host: HTMLElement;

  ratingStarId = `scale-rating-star-${ratingStarCount++}`;
  /** switch to define behaviour onTouch */
  firstStarSelected = false;

  /** The lower limit of the rating. In cases where  */
  @Prop({ reflect: true }) starSize: 'small' | 'large' = 'large';
  /** The lower limit of the rating. In cases where  */
  @Prop({ reflect: true }) minRating = 0;
  /** The upper limit of the rating */
  @Prop({ reflect: true }) maxRating = 5;
  /** Represents the current value of the rating */
  @Prop({ mutable: true, reflect: true }) rating = 0;
  /** makes the rating non-interactive (but still accessible)  */
  @Prop({ reflect: true }) readonly = false;
  /** disables input  */
  @Prop({ reflect: true }) disabled = false;
  /** a11y text for getting meaningful value. `$rating` and `$maxRating` are template variables and will be replaces by their corresponding properties.  */
  @Prop() ariaLabelTranslation = '$rating out of $maxRating stars';
  /** (optional) rating label */
  @Prop({ reflect: true }) label?: string;

  /** Emitted when the rating has changed */
  @Event() scaleChange: EventEmitter;

  // constructs the aria message for the current rating
  getRatingText() {
    const filledText = this.ariaLabelTranslation
      .replace(/\$rating/g, `${this.rating}`)
      .replace(/\$maxRating/g, `${this.maxRating}`);
    return filledText;
  }

  handleInput = (ev: InputEvent) => {
    const input = ev.composedPath()[0] as HTMLInputElement;
    const rating = input.value;

    if (this.rating === 0) {
      this.rating = 1;
    } else {
      this.rating = Number(rating);
    }

    this.scaleChange.emit({ value: this.rating });
  };

  handleTouchEnd = (ev: TouchEvent) => {
    const star = ev.composedPath()[0] as StarInterface;
    const starValue = Number(star.dataset.value);
    if (starValue === 1) {
      if (this.firstStarSelected) {
        this.rating = starValue;
        this.firstStarSelected = !this.firstStarSelected;
      } else {
        this.rating = this.minRating;
        this.firstStarSelected = !this.firstStarSelected;
      }
    } else {
      this.rating = starValue;
      this.scaleChange.emit({ value: this.rating });
    }
  };

  handleStarClick = (ev: MouseEvent) => {
    const star = ev.composedPath()[0] as StarInterface;
    const starValue = Number(star.dataset.value);
    // set focus on input to make arrow keys work to select stars
    const input = this.host.shadowRoot.querySelector('input');
    input.focus();

    if (starValue === 1 && this.rating === 1 && this.minRating === 0) {
      this.rating = this.minRating;
    } else {
      this.rating = starValue;
    }
    this.scaleChange.emit({ value: this.rating });
  };

  renderStar(index: number, selected = false, rating: number) {
    const size = sizes[this.starSize];
    const isWholeNumber = rating % 1 === 0;
    const isLastNumber = Math.ceil(rating) === index;

    return (
      <div
        part="star"
        data-value={index}
        data-selected={selected}
        data-half={isLastNumber && !isWholeNumber}
        onMouseUp={!this.readonly && this.handleStarClick}
        onTouchEnd={!this.readonly && this.handleTouchEnd}
      >
        <scale-icon-action-favorite size={size} part="placeholder-star"/>
        <div class="icon-clip">
          <scale-icon-action-favorite
            size={size}
            selected
            part="selected-star"
          />
        </div>
      </div>
    );
  }

  renderRating() {
    const stars = [];
    const roundedRating = Math.ceil(this.rating);
    const min = this.minRating === 0 ? this.minRating + 1 : this.minRating;
    const max = this.maxRating;

    for (let index = min; index <= max; index++) {
      const isSelected = roundedRating >= index;
      stars.push(this.renderStar(index, isSelected, this.rating));
    }
    return stars;
  }

  render() {
    return (
      <Host>
        <div part="container">
          {this.label && (
            <label
              id={`${this.ratingStarId}-label`}
              part="label"
              htmlFor={this.ratingStarId}
            >
              {this.label}
            </label>
          )}
          <input
            disabled={this.disabled || this.readonly}
            part="range-slider"
            type="range"
            id={this.ratingStarId}
            min={this.minRating}
            max={this.maxRating}
            value={this.rating}
            step="1"
            aria-orientation="horizontal"
            aria-valuemin={this.minRating}
            aria-valuemax={this.maxRating}
            aria-valuenow={this.rating}
            aria-valuetext={this.getRatingText()}
            onInput={this.handleInput}
          />
          <div
            part="wrapper"
            tabIndex={this.readonly ? 0 : -1}
            role="figure"
            aria-labeledby={`${this.ratingStarId}-label`}
            aria-valuetext={this.getRatingText()}
            aria-orientation="horizontal"
          >
            {this.renderRating()}
          </div>
        </div>
      </Host>
    );
  }
}
