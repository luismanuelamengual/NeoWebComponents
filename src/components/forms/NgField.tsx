import {Component, h, Host, Prop} from '@stencil/core';

@Component({
  tag: 'ng-field',
  styleUrl: 'NgField.scss',
  shadow: true
})
export class NgField {

  @Prop() label : string;

  @Prop({reflectToAttr: true}) inline : boolean = false;

  render() {
    return <Host>
      {this.label && (<label>{this.label}</label>)}
      <slot/>
    </Host>;
  }
}
