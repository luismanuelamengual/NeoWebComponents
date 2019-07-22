import {Component, Element, h, Host, Prop, State} from '@stencil/core';

@Component({
  tag: 'ng-area-container',
  styleUrl: 'NgAreaContainer.scss',
  shadow: true
})
export class NgAreaContainer {

  @Element() host: HTMLElement;

  @Prop() splitterSize : number = 6;

  @State() areas : HTMLNgAreaElement[] = [];

  constructor () {
    this.handleResizerMouseDown = this.handleResizerMouseDown.bind(this);
    this.handleCollapseToggleButtonMouseDown = this.handleCollapseToggleButtonMouseDown.bind(this);
    this.handleCollapseToggleButtonClick = this.handleCollapseToggleButtonClick.bind(this);
  }

  handleCollapseToggleButtonMouseDown(e) {
    e.stopPropagation();
  }

  handleCollapseToggleButtonClick(e) {
    e.stopPropagation();
    const collapseToggleButton = e.currentTarget;
    const resizer = collapseToggleButton.parentElement;
    const resizerRegion = resizer.dataset.region;

    let regionArea = null;
    for (let i in this.areas) {
      let area = this.areas[i];
      if (area.region == resizerRegion) {
        regionArea = area;
        break;
      }
    }
    if (regionArea != null) {
      regionArea.collapsed = regionArea.collapsed !== true;
      const currentAreas = this.areas;
      this.areas = null;
      this.areas = currentAreas;
    }
  }

  handleResizerMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    const me = this;
    const resizer = e.currentTarget;
    const resizerRegion = resizer.dataset.region;
    const resizerBoundingRect = resizer.getBoundingClientRect();

    let regionArea : HTMLNgAreaElement = null;
    for (let i in this.areas) {
      let area = this.areas[i];
      if (area.region == resizerRegion) {
        regionArea = area;
        break;
      }
    }

    if (regionArea != null) {
      const resizerShadow = document.createElement("div");
      resizerShadow.style.position = "absolute";
      resizerShadow.style.background = "#323232";
      resizerShadow.style.opacity = "0.40";
      resizerShadow.style.top = resizerBoundingRect.top + "px";
      resizerShadow.style.left = resizerBoundingRect.left + "px";
      resizerShadow.style.height = resizerBoundingRect.height + "px";
      resizerShadow.style.width = resizerBoundingRect.width + "px";

      const resizeOverlay = document.createElement("div");
      resizeOverlay.style.position = "fixed";
      resizeOverlay.style.top = "0";
      resizeOverlay.style.left = "0";
      resizeOverlay.style.width = "100%";
      resizeOverlay.style.height = "100%";
      resizeOverlay.style.zIndex = "8000";
      resizeOverlay.style.cursor = regionArea.region == 'west' || regionArea.region == 'east'? 'col-resize' : 'row-resize';
      resizeOverlay.appendChild(resizerShadow);

      resizeOverlay.addEventListener("mousemove", function(e) {
        switch (regionArea.region) {
          case 'west':
          case 'east':
            resizerShadow.style.left = (e.clientX - (me.splitterSize / 2)) + "px";
            break;
          case 'north':
          case 'south':
            resizerShadow.style.top = (e.clientY - (me.splitterSize / 2)) + "px";
            break;
        }
      });
      resizeOverlay.addEventListener("mouseup", function(e) {
        let newSize = 0;
        let hostBoundingRect = me.host.getBoundingClientRect();
        switch (regionArea.region) {
          case 'west':
            newSize = e.clientX - (me.splitterSize / 2) - hostBoundingRect.left;
            break;
          case 'east':
            newSize = hostBoundingRect.right - e.clientX - (me.splitterSize / 2);
            break;
          case 'north':
            newSize = e.clientY - (me.splitterSize / 2) - hostBoundingRect.top;
            break;
          case 'south':
            newSize = hostBoundingRect.bottom - e.clientY - (me.splitterSize / 2);
            break;
        }
        if (newSize < regionArea.minSize) {
          newSize = regionArea.minSize;
        }
        if (newSize > regionArea.maxSize) {
          newSize = regionArea.maxSize;
        }
        if (newSize != regionArea.size) {
          regionArea.size = newSize;
          const currentAreas = me.areas;
          me.areas = null;
          me.areas = currentAreas;
        }
        document.body.removeChild(this);
      });
      document.body.appendChild(resizeOverlay);
    }
  }

  componentWillLoad() {
    const areas : HTMLNgAreaElement[] = [];
    const areaElements = Array.from(this.host.children);
    for (let i in areaElements) {
      const areaElement : any = areaElements[i];
      const area = areaElement as HTMLNgAreaElement;
      areas.push(area);
    }
    this.areas = areas;
  }

  componentDidRender() {
    const areasByRegion = [];
    this.areas.map(area => areasByRegion[area.region] = area);
    let centerTop = 0, centerBottom = 0, centerLeft = 0, centerRight = 0;
    const northArea : HTMLNgAreaElement = areasByRegion['north'];
    if (northArea) {
      const northSize = (northArea.collapsible && northArea.collapsed? 0 : northArea.size);
      centerTop = northSize + (northArea.splitter? this.splitterSize : 0);
      northArea.style.height = northSize + "px";
      if (northArea.splitter) {
        const northAreaResizer = this.host.shadowRoot.querySelector('.resizer-north') as HTMLDivElement;
        northAreaResizer.style.height = this.splitterSize + "px";
        northAreaResizer.style.top = northSize + "px";
      }
    }
    const southArea : HTMLNgAreaElement = areasByRegion['south'];
    if (southArea) {
      const southSize = (southArea.collapsible && southArea.collapsed? 0 : southArea.size);
      centerBottom = southSize + (southArea.splitter? this.splitterSize : 0);
      southArea.style.height = southSize + "px";
      if (southArea.splitter) {
        const southAreaResizer = this.host.shadowRoot.querySelector('.resizer-south') as HTMLDivElement;
        southAreaResizer.style.height = this.splitterSize + "px";
        southAreaResizer.style.bottom = southSize + "px";
      }
    }
    const westArea : HTMLNgAreaElement = areasByRegion['west'];
    if (westArea) {
      const westSize = (westArea.collapsible && westArea.collapsed? 0 : westArea.size);
      centerLeft = westSize + (westArea.splitter? this.splitterSize : 0);
      westArea.style.top = centerTop + "px";
      westArea.style.bottom = centerBottom + "px";
      westArea.style.width = westSize + "px";
      if (westArea.splitter) {
        const westAreaResizer = this.host.shadowRoot.querySelector('.resizer-west') as HTMLDivElement;
        westAreaResizer.style.width = this.splitterSize + "px";
        westAreaResizer.style.left = westSize + "px";
        westAreaResizer.style.top = centerTop + "px";
        westAreaResizer.style.bottom = centerBottom + "px";
      }
    }
    const eastArea : HTMLNgAreaElement = areasByRegion['east'];
    if (eastArea) {
      const eastSize = (eastArea.collapsible && eastArea.collapsed? 0 : eastArea.size);
      centerRight = eastSize + (eastArea.splitter? this.splitterSize : 0);
      eastArea.style.top = centerTop + "px";
      eastArea.style.bottom = centerBottom + "px";
      eastArea.style.width = eastSize + "px";
      if (eastArea.splitter) {
        const eastAreaResizer = this.host.shadowRoot.querySelector('.resizer-east') as HTMLDivElement;
        eastAreaResizer.style.width = this.splitterSize + "px";
        eastAreaResizer.style.right = eastSize + "px";
        eastAreaResizer.style.top = centerTop + "px";
        eastAreaResizer.style.bottom = centerBottom + "px";
      }
    }
    const centerArea : HTMLNgAreaElement = areasByRegion['center'];
    if (centerArea) {
      centerArea.style.top = centerTop + "px";
      centerArea.style.bottom = centerBottom + "px";
      centerArea.style.left = centerLeft + "px";
      centerArea.style.right = centerRight + "px";
    }
  }

  render() {
    return <Host>
      {this.areas.map(area => area.region != 'center' && area.splitter?
        <div data-region={area.region} onMouseDown={area.resizable && !area.collapsed? this.handleResizerMouseDown : null} class={{'resizer': true, 'resizer-collapsed':area.collapsed, 'resizer-north':area.region == 'north','resizer-west':area.region == 'west','resizer-east':area.region == 'east','resizer-south':area.region == 'south'}}>
          {area.collapsible && <div class="collapse-toggle-button" onMouseDown={this.handleCollapseToggleButtonMouseDown} onClick={this.handleCollapseToggleButtonClick} />}
        </div>
      : null )}
      <slot />
    </Host>;
  }
}
