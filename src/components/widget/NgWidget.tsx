import {Component, Element, h, Host, Prop} from '@stencil/core';

@Component({
  tag: 'ng-widget',
  styleUrl: 'NgWidget.scss',
  shadow: true
})
export class NgWidget {

  @Element() host: HTMLElement;

  @Prop() icon : string;

  @Prop() label : string;

  @Prop({ mutable: true, reflectToAttr: true }) expanded : boolean = true;

  @Prop({ mutable: true, reflectToAttr: true  }) fullScreen : boolean = false;

  @Prop() padding : boolean = true;

  constructor() {
    this.handleToggleExpand = this.handleToggleExpand.bind(this);
    this.handleToggleFullscreen = this.handleToggleFullscreen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggleExpand() {
    this.expanded = !this.expanded;
  }

  handleToggleFullscreen() {
    this.fullScreen = !this.fullScreen;
  }

  handleClose() {
    this.host.parentNode.removeChild(this.host);
  }

  render() {
    return <Host>
      <div class="widget-header">
        {this.icon && (<div class="widget-icon"><ng-icon name={this.icon}></ng-icon></div>)}
        {this.label && (<div class="widget-title">{this.label}</div>)}
        <div class="widget-toolbar">
          <a class="widget-toolbar-button btn-toggle-expanded" onClick={this.handleToggleExpand}>{this.expanded? (<ng-icon name="minus"></ng-icon>) : (<ng-icon name="plus"></ng-icon>)}</a>
          <a class="widget-toolbar-button btn-toggle-fullscreen" onClick={this.handleToggleFullscreen}>{this.fullScreen? (<ng-icon name="compress"></ng-icon>) : (<ng-icon name="expand"></ng-icon>)}</a>
          <a class="widget-toolbar-button btn-delete" onClick={this.handleClose}><ng-icon name="times"></ng-icon></a>
        </div>
      </div>
      <div class="widget-body-container">
        <div class={{'widget-body': true, 'widget-body-padding': this.padding}}>
          <slot/>
        </div>
      </div>
    </Host>;
  }
}
