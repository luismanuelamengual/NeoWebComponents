import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-col',
  styleUrl: 'NgCol.css',
  shadow: true
})
export class NgCol {

  @Prop() smSize : number = 0;

  @Prop() mdSize : number = 0;

  @Prop() lgSize : number = 0;

  @Prop() xlSize : number = 0;

  render() {
    return <div><slot/></div>;
  }
}
