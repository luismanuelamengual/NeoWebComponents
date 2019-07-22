import {Element, Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-alert',
  styleUrl: 'NgAlert.scss',
  shadow: true
})
export class NgAlert {

  @Element() host: HTMLElement;

  @Prop() header : string;

  @Prop() type : "info" | "danger" | "warning" | "success" = "info";

  @Prop() closable : boolean = false;

  constructor() {
    this.handleAlertClose = this.handleAlertClose.bind(this);
  }

  handleAlertClose() {
    this.host.parentNode.removeChild(this.host);
  }

  render() {
    let attributes = {
      class: this.type
    };
    return <div {...attributes}>
      {this.header && (<header>{this.header}</header>)}
      <slot/>
      {this.closable && (<button onClick={this.handleAlertClose}><span>&times;</span></button>)}
    </div>;
  }
}
