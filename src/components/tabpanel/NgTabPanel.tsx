import {Component, Element, Event, EventEmitter, h, Host, Method, State, Watch} from '@stencil/core';
import {NgTab} from "./NgTab";

@Component({
  tag: 'ng-tab-panel',
  styleUrl: 'NgTabPanel.scss',
  shadow: true
})
export class NgTabPanel {

  @Element() host: HTMLElement;

  @State() tabs : NgTab[] = [];

  constructor() {
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleTabCloseClick = this.handleTabCloseClick.bind(this);
  }

  handleTabClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const tab = e.currentTarget;
    this.openTab(tab.dataset.tabIndex);
  }

  handleTabCloseClick(e) {
    e.stopPropagation();
    const tabButton = e.currentTarget;
    const tab = tabButton.parentElement;
    this.removeTab(tab.dataset.tabIndex);
  }

  @Watch('tabs')
  onTabsChange(newValue: NgTab[]) {
    const newIndex = newValue != null? newValue.findIndex(tab => tab.active) : null;
    this.changeDispatcher.emit({ tabId: newIndex });
  }

  @Event({ eventName: 'tabChange' })
  changeDispatcher: EventEmitter;

  @Method()
  async openTab(index: number) {
    if (index >= this.tabs.length) {
      throw new Error(`[ng-tabs-panel] Index ${index} is out of bounds of tabs length`);
    }
    this.tabs = this.tabs.map((tab, i) => {
      tab.active = i == index;
      return tab;
    });
    this.changeDispatcher.emit({ tabId: index });
  }

  @Method()
  async removeTab(index: number) {
    if (index >= this.tabs.length) {
      throw new Error(`[ng-tabs-panel] Index ${index} is out of bounds of tabs length`);
    }
    const tabToDelete = this.tabs.splice(index,1)[0];
    if (tabToDelete.active) {
      if (this.tabs.length > 0) {
        this.tabs[0].active = true;
        this.changeDispatcher.emit({ tabId: 0 });
      }
    }
    const tabToDeleteUnk = tabToDelete as unknown;
    const tabToDeleteElement = tabToDeleteUnk as HTMLElement;
    tabToDeleteElement.parentElement.removeChild(tabToDeleteElement);
    const currentTabs = this.tabs;
    this.tabs = null;
    this.tabs = currentTabs;
  }

  componentWillLoad() {
    this.tabs = [];
    const tabs = Array.from(this.host.querySelectorAll('ng-tab'));
    for (let i in tabs) {
      const tabElement : any = tabs[i];
      const tab = tabElement as NgTab;
      this.tabs.push(tab);
    }
  }

  render() {
    return <Host>
      <div class="tab-panel-header">
        {this.tabs.map((tab : NgTab, index : number) =>
          <div data-tab-index={index} class={{'tab': true, 'tab-selected': tab.active}} onClick={this.handleTabClick}>
            {tab.label}
            {tab.closable === true && (<button class="tab-close-button" onClick={this.handleTabCloseClick}>&times;</button>)}
          </div>)}
      </div>
      <div class="tab-panel-body-container">
        <div class="tab-panel-body">
          <slot />
        </div>
      </div>
    </Host>;
  }
}
