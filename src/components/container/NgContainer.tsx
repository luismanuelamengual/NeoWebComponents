import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-container',
  styleUrl: 'NgContainer.css',
  shadow: true
})
export class NgContainer {

  @Prop()
  fluid : boolean = false;

  render() {
    let className = "";
    if (this.fluid) {
      className += "container-fluid ";
    }
    else {
      className += "container ";
    }
    return <div class={className}>
      <slot/>
    </div>;
  }
}
