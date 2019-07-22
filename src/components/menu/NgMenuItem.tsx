import {Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-menu-item',
  styleUrl: 'NgMenuItem.scss',
  shadow: true
})
export class NgMenuItem {

  constructor() {
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleCheckToggle = this.handleCheckToggle.bind(this);
  }

  @Element() host: HTMLElement;

  @Prop() caption! : string;

  @Prop() menu : any[] = [];

  @Prop({mutable: true}) open: boolean = false;

  @Prop({mutable: true}) checked: true | false | null = null;

  @Event() checkChange: EventEmitter;

  handleMouseEnter() {
    this.open = true;
  }

  handleMouseLeave() {
    this.open = false;
  }

  handleCheckToggle(e) {
    e.stopPropagation();
    this.checked = !this.checked;
    this.checkChange.emit(this.checked);
  }

  render() {
    let menuItemAttributes : any = {
      class: {
        'menuItem': true,
        'hasMenu': this.menu.length > 0,
        'hasCheckbox': this.checked != null
      }
    };
    if (this.menu.length > 0) {
      menuItemAttributes.onMouseEnter = this.handleMouseEnter;
      menuItemAttributes.onMouseLeave = this.handleMouseLeave;
    }

    if (this.checked != null) {
      menuItemAttributes.onClick = this.handleCheckToggle;
    }
    return <div {...menuItemAttributes}>
      {this.checked !== null && <div class='menuItemCheckbox'>{this.checked? '☑' : '☐'}</div>}
      <div class="menuItemCaption">{this.caption}</div>
      {this.menu.length > 0 && this.open && <ng-menu anchorOriginVertical='top' anchorOriginHorizontal='right' anchorEl={this.host} anchorReference="anchorEl" menuItems={this.menu} />}
    </div>;
  }
}
