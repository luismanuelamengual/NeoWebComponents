import {Component, h, Host, Prop} from '@stencil/core';

@Component({
  tag: 'ng-tab',
  styleUrl: 'NgTab.scss',
  shadow: true
})
export class NgTab {

  @Prop() label: string;

  @Prop({reflectToAttr: true, mutable: true}) active: boolean = false;

  @Prop() closable: boolean = false;

  @Prop({reflectToAttr:true}) padding: boolean = true;

  render() {
    return <Host><slot /></Host>;
  }
}
