import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-menu',
  styleUrl: 'NgMenu.scss',
  shadow: true
})
export class NgMenu {

  @Prop() anchorReference: 'anchorEl' | 'anchorPosition' = 'anchorPosition';

  @Prop({mutable: true}) anchorEl: HTMLElement;

  @Prop({mutable: true}) anchorPositionLeft: number;

  @Prop({mutable: true}) anchorPositionTop: number;

  @Prop() anchorOriginVertical: 'top' | 'center' | 'bottom' = 'bottom';

  @Prop() anchorOriginHorizontal: 'left' | 'center' | 'right' = 'left';

  @Prop() menuItems : any[] = [];

  render() {
    let top = this.anchorPositionTop;
    let left = this.anchorPositionLeft;
    let display = 'block';
    if (this.anchorReference == 'anchorEl') {
      if (this.anchorEl != null) {
        const anchorElBoundingRect = this.anchorEl.getBoundingClientRect();
        switch (this.anchorOriginHorizontal) {
          case "center":
            left = anchorElBoundingRect.left + (anchorElBoundingRect.width / 2);
            break;
          case "left":
            left = anchorElBoundingRect.left;
            break;
          case "right":
            left = anchorElBoundingRect.right;
            break;
        }
        switch (this.anchorOriginVertical) {
          case "center":
            top = anchorElBoundingRect.top + (anchorElBoundingRect.height / 2);
            break;
          case "top":
            top = anchorElBoundingRect.top;
            break;
          case "bottom":
            top = anchorElBoundingRect.bottom;
            break;
        }
      }
      else {
        display = 'none';
      }
    }
    let menuItems = [];
    for (let i in this.menuItems) {
      const menuItem = this.menuItems[i];
      switch (menuItem.type) {

        case "separator":
          menuItems.push(<hr class="separator"/>);
          break;
        case "normal":
        default:
          menuItems.push(<ng-menu-item {...menuItem}/>);
          break;
      }
    }

    return <div class="menu" style={{left: left + 'px', top: top + 'px', display: display}}>
      {menuItems.map((menuItem) => menuItem)}
    </div>;
  }
}
