import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-panel',
  styleUrl: 'NgPanel.scss',
  shadow: true
})
export class NgPanel {

  @Prop() addHeader : boolean = false;

  @Prop() addFooter : boolean = false;

  render() {
    return <div class="panel">
      {this.addHeader && (<header class="panel-header"><slot name="header" /></header>)}
      <div class="panel-body">
        <slot/>
      </div>
      {this.addFooter && (<footer class="panel-footer"><slot name="footer" /></footer>)}
    </div>;
  }
}
