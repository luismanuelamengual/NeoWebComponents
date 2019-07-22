import {Component, h} from '@stencil/core';

@Component({
  tag: 'ng-row',
  styleUrl: 'NgRow.css',
  shadow: true
})
export class NgRow {

  render() {
    return <div><slot/></div>;
  }
}
