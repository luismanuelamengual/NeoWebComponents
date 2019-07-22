import {Component, h, Prop} from '@stencil/core';

const fontAwesomeVersion = 'v5.8.2';
const path = 'https://use.fontawesome.com/releases/' + fontAwesomeVersion;
const cssPath = path + '/css/all.css';
const fontFace = (name, weight, file) => `
@font-face {
  font-family: '${name}';
  font-style: normal;
  font-weight: ${weight};
  src: url(${path}/webfonts/${file}.eot);
  src: url(${path}/webfonts/${file}.eot?#iefix) format('embedded-opentype'), url(${path}/webfonts/${file}.woff2) format('woff2'),
    url(${path}/webfonts/${file}.woff) format('woff'), url(${path}/webfonts/${file}.ttf) format('truetype'),
    url(${path}/webfonts/${file}.svg#fontawesome) format('svg');
}`;
const style = document.createElement('style');
style.innerHTML = fontFace('Font Awesome 5 Free', 900, 'fa-solid-900') + fontFace('Font Awesome 5 Free', 400, 'fa-regular-400');
document.head.appendChild(style);

@Component({
  tag: 'ng-icon'
})
export class NgIcon {

  @Prop() name! : string;

  @Prop() size : 'xs' | 'sm' | 'lg' | '2x' | '3x' | '5x' | '7x' | '10x';

  @Prop() fixedWidth : boolean = false;

  @Prop() bordered : boolean = false;

  @Prop() pullRight : boolean = false;

  @Prop() pullLeft : boolean = false;

  @Prop() spin : boolean = false;

  @Prop() type : 'solid' | 'regular' = 'solid';

  render() {
    let classes = [];
    classes.push(this.type == 'solid'? 'fas' : 'far');
    classes.push("fa-" + this.name);
    if (this.size) {
      classes.push("fa-" + this.size);
    }
    if (this.fixedWidth) {
      classes.push("fa-fw");
    }
    if (this.bordered) {
      classes.push("fa-border");
    }
    if (this.pullRight) {
      classes.push("fa-pull-right")
    }
    if (this.pullLeft) {
      classes.push("fa-pull-left")
    }
    if (this.spin) {
      classes.push("fa-spin");
    }
    return [
      <link rel="stylesheet" href={cssPath}/>,
      <i class={classes.join(' ')}/>
    ];
  }
}
