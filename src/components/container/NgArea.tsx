import {Component, Host, Prop, h} from '@stencil/core';

@Component({
  tag: 'ng-area',
  styleUrl: 'NgArea.scss',
  shadow: true
})
export class NgArea {

  @Prop({reflect: true}) region : 'north' | 'south' | 'west' | 'east' | 'center' = 'center';

  @Prop() collapsible : boolean = true;

  @Prop({mutable: true}) collapsed : boolean = false;

  @Prop() splitter : boolean = true;

  @Prop() resizable : boolean = true;

  @Prop({mutable: true}) size : number;

  @Prop() minSize : number = 0;

  @Prop() maxSize : number = 1000;

  render() {
    return <Host><div class="content"><slot /></div></Host>;
  }
}
