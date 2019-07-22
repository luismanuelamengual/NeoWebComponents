import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-button',
  styleUrl:'NgButton.scss',
  shadow: true
})
export class NgButton {

  @Prop() label : string = '';

  @Prop() type : 'default' | 'primary' | 'danger' = 'default';

  @Prop() disabled : boolean = false;

  @Prop({reflectToAttr: true}) inline : boolean = false;

  render() {
    return <button
      class={this.type}
      type="button"
      disabled={this.disabled}>
      {this.label}
      <slot/>
    </button>;
  }
}
