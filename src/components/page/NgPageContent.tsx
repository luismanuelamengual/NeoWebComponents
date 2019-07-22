import {Component, h} from '@stencil/core';

@Component({
  tag: 'ng-page-content',
  styleUrl: 'NgPageContent.scss',
  shadow: true
})
export class NgPageContent {
  render() {
    return <div>
        <slot/>
    </div>;
  }
}
