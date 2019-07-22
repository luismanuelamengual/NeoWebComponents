import {Component, h} from '@stencil/core';

@Component({
  tag: 'ng-page',
  styleUrl: 'NgPage.scss',
  shadow: true
})
export class NgPage {

  render() {
    return <div>
      <slot/>
    </div>;
  }
}
