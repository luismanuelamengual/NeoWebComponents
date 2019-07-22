import {Component, Element, h, Prop, State} from '@stencil/core';

@Component({
  tag: 'ng-toolbar',
  styleUrl: 'NgToolbar.scss',
  shadow: true
})
export class NgToolbar {

  constructor() {
    this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
  }

  @Element() host: HTMLElement;

  @Prop() header : string;

  @State() collapsed : boolean = true;

  @State() showToggleButton : boolean = false;

  handleToggleButtonClick() {
    this.collapsed = !this.collapsed;
  }

  componentWillLoad() {
    this.showToggleButton = this.host.children.length > 0;
  }

  render() {
    return <div class="toolbar">
      <div class="toolbar-header">
        {this.header && (<span class="toolbar-title">{this.header}</span>)}
        {this.showToggleButton && <button class="toggleButton" onClick={this.handleToggleButtonClick}>☰</button>}
      </div>
      <div class={{'toolbar-content': true, 'collapsed': this.collapsed}}>
        <slot/>
      </div>
    </div>;
  }
}
