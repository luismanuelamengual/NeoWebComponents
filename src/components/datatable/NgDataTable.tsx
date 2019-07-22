import {Component, Element, h, Prop, State, Watch, Host} from '@stencil/core';
import {NgDataTableColumn} from "./NgDataTableColumn";
import {NgDataTableSorter} from "./NgDataTableSorter";
import {NgDataTableDataSource} from "./NgDataTableDataSource";

@Component({
  tag: 'ng-data-table',
  styleUrl: 'NgDataTable.scss',
  shadow: true
})
export class NgDataTable {

  @Element() host: HTMLElement;

  @Prop({mutable: true}) columns? : NgDataTableColumn[] = [];

  @Prop({mutable: true}) dataSource : NgDataTableDataSource;

  @Prop({mutable: true}) data : any[];

  @Prop({mutable: true}) page : number = 1;

  @Prop() pageSize: number = 0;

  @Prop({mutable: true}) sorters : NgDataTableSorter[] = [];

  @Prop({reflectToAttr: true}) fullsize : boolean = false;

  @Prop() defaultColumnConfig : NgDataTableColumn = {
    title: '',
    titleAlign: null,
    visible: true,
    width: 200,
    resizable: true,
    sortable: true,
    draggable: true,
    minWidth: 0,
    maxWidth: 1000,
    dataField: null,
    sortField: null,
    align: null,
    defaultValue: ''
  };

  @State() viewData : any[];

  @State() loadingData : boolean = false;

  @State() optionsMenuColumnIndex : number = -1;

  private optionsMenu: any;

  private dragHeaderTask: number;

  constructor() {
    this.handleResizerMouseDown = this.handleResizerMouseDown.bind(this);
    this.handleHeaderMouseDown = this.handleHeaderMouseDown.bind(this);
    this.handleHeaderMouseUp = this.handleHeaderMouseUp.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleHeaderOptionsClick = this.handleHeaderOptionsClick.bind(this);
    this.handleHeaderOptionsMouseEvents = this.handleHeaderOptionsMouseEvents.bind(this);
    this.handleMenuBlur = this.handleMenuBlur.bind(this);
    if (this.columns.length > 0) {
      this.handleColumnsChanged(this.columns);
    }
    if (this.data != null && this.data.length > 0) {
      this.dataSource = this.createLocalDataSource(this.data);
    }
    this.generateViewData();
  }

  handleMenuBlur() {
    if (this.optionsMenu != null && !this.optionsMenu.contains(document.activeElement)) {
      this.optionsMenuColumnIndex = -1;
    }
  }

  @Watch("columns")
  handleColumnsChanged(columns : NgDataTableColumn[]) {
    for (let i in columns) {
      let column = columns[i];
      for (let prop in this.defaultColumnConfig) {
        if (!(prop in column)) {
          column[prop] = this.defaultColumnConfig[prop];
        }
      }
    }
  }

  @Watch("data")
  handleDataChanged() {
    this.dataSource = this.createLocalDataSource(this.data);
    this.generateViewData();
  }

  @Watch("sorters")
  handleSortersChanged() {
    this.generateViewData();
  }

  @Watch("page")
  handlePageChanged() {
    this.generateViewData();
  }

  createLocalDataSource(data) : NgDataTableDataSource {
    const me = this;
    return options => new Promise((resolve, reject) => {
      try {
        let viewData = data.slice();

        if (options.sorters != null && options.sorters.length > 0) {
          let sortData = viewData.map(function (data, idx) {
            return {idx: idx, data: data}
          });
          sortData.sort(function (obj1, obj2) {
            let result = obj1.idx - obj2.idx;
            for (let i in options.sorters) {
              let sorter = options.sorters[i];
              let obj1Field = me.getCellValue(obj1.data, sorter.field);
              let obj2Field = me.getCellValue(obj2.data, sorter.field);
              if (obj1Field == null) {
                obj1Field = "";
              }
              if (obj2Field == null) {
                obj2Field = "";
              }
              if (obj1Field < obj2Field) {
                result = sorter.direction == 'ASC' ? -1 : 1;
                break;
              } else if (obj1Field > obj2Field) {
                result = sorter.direction == 'ASC' ? 1 : -1;
                break;
              }
            }
            return result;
          });
          viewData = sortData.map(function (val) {
            return val.data
          });
        }

        if (options.start != null && options.limit != null) {
          viewData = viewData.slice(options.start, Math.min(viewData.length, options.start + options.limit));
        }
        resolve(viewData);
      } catch (e) {
        reject(e);
      }
    });
  }

  generateViewData() {
    let me = this;
    if (!this.loadingData) {
      if (this.dataSource != null) {
        this.loadingData = true;
        let options = {} as any;
        options.sorters = this.sorters;
        if (this.pageSize > 0) {
          options.start = (this.page - 1) * this.pageSize;
          options.limit = this.pageSize;
        }
        this.dataSource(options)
          .then(data => { me.viewData = data; me.loadingData = false; } )
          .catch(() => { me.viewData = []; me.loadingData = false; } )
      }
    }
  }

  handleHeaderClick (e) {
    e.stopPropagation();
    const headerCell = e.currentTarget;
    const columnIndex = parseInt(headerCell.dataset.columnIndex);
    const column = this.columns[columnIndex];
    const sortField = column.sortField || column.dataField;
    let sorter = this.getSorter(sortField);
    if (sorter == null) {
      this.sorters = [{
        field: sortField,
        direction: 'ASC'
      }];
    }
    else if (sorter.direction == 'ASC') {
      this.sorters = [{
        field: sortField,
        direction: 'DESC'
      }];
    }
    else {
      this.sorters = [];
    }
  }

  handleHeaderMouseUp (e) {
    e.stopPropagation();
    clearTimeout(this.dragHeaderTask);
  }

  handleHeaderMouseDown(e) {
    e.stopPropagation();
    const me = this;
    const headerCell = e.currentTarget;
    const headerCells = headerCell.parentElement.children;
    this.dragHeaderTask = setTimeout(function() {
      const dataTableBoundingRect = me.host.getBoundingClientRect();
      const columnIndex = parseInt(headerCell.dataset.columnIndex);
      const column = me.columns[columnIndex];
      let headersBoundingRects = [];
      let lastHeaderColumnIndex, lastHeaderBoundingRect;
      for (let i = 0; i < headerCells.length; i++) {
        let currentHeaderCell = headerCells[i];
        let currentHeaderColumnIndex = parseInt(currentHeaderCell.dataset.columnIndex);
        let currentHeaderBoundingRect = currentHeaderCell.getBoundingClientRect();
        lastHeaderColumnIndex = currentHeaderColumnIndex;
        lastHeaderBoundingRect = currentHeaderBoundingRect;
        headersBoundingRects[currentHeaderColumnIndex] = currentHeaderBoundingRect;
      }

      const draggingMarker = document.createElement("div");
      draggingMarker.dataset.newColumnIndex = headerCell.dataset.columnIndex;
      draggingMarker.style.position = "absolute";
      draggingMarker.style.cursor = "col-resize";
      draggingMarker.style.width = "0";
      draggingMarker.style.zIndex = "6000";
      draggingMarker.style.background = "lightgray";
      draggingMarker.style.border = "1px solid gray";
      draggingMarker.style.left = headerCell.getBoundingClientRect().left + "px";
      draggingMarker.style.top = dataTableBoundingRect.top + "px";
      draggingMarker.style.height = (dataTableBoundingRect.bottom - dataTableBoundingRect.top) + "px";
      draggingMarker.style.display = "none";

      const draggingCaptionIndicator = document.createElement("span");
      draggingCaptionIndicator.style.color = "red";
      draggingCaptionIndicator.style.marginRight = "5px";
      draggingCaptionIndicator.innerHTML = "☒";

      const draggingCaptionText = document.createElement("span");
      draggingCaptionText.style.fontFamily = "Helvetica Neue,Helvetica,Arial,sans-serif";
      draggingCaptionText.style.fontSize = "14px";
      draggingCaptionText.innerHTML = column.title;

      const draggingCaption = document.createElement("div");
      draggingCaption.style.position = "absolute";
      draggingCaption.style.zIndex = "7000";
      draggingCaption.style.background = "white";
      draggingCaption.style.padding = "4px";
      draggingCaption.style.borderRadius = "3px";
      draggingCaption.style.boxShadow = "2px 3px 3px 0px rgba(0,0,0,0.75)";
      draggingCaption.style.left = (e.clientX - 5) + "px";
      draggingCaption.style.top = (e.clientY - 5) + "px";
      draggingCaption.appendChild(draggingCaptionIndicator);
      draggingCaption.appendChild(draggingCaptionText);

      const draggingOverlay = document.createElement("div");
      draggingOverlay.classList.add("notAllowed");
      draggingOverlay.style.position = "fixed";
      draggingOverlay.style.top = "0";
      draggingOverlay.style.left = "0";
      draggingOverlay.style.width = "100%";
      draggingOverlay.style.height = "100%";
      draggingOverlay.style.zIndex = "8000";
      draggingOverlay.style.cursor = "grabbing";
      draggingOverlay.appendChild(draggingMarker);
      draggingOverlay.appendChild(draggingCaption);

      draggingOverlay.addEventListener("mousemove", function(e) {
        let currentX = e.clientX;
        let currentY = e.clientY;
        let newColumnIndex = lastHeaderColumnIndex;
        let newColumnXPosition = lastHeaderBoundingRect.left + lastHeaderBoundingRect.width;
        let currentHeaderColumnIndex : any = columnIndex;
        for (let headerColumnIndex in headersBoundingRects) {
          let headerBoundingRects = headersBoundingRects[headerColumnIndex];
          if (currentX < headerBoundingRects.left + (headerBoundingRects.width/2)) {
            newColumnIndex = parseInt(headerColumnIndex);
            if (newColumnIndex > columnIndex) {
              newColumnIndex = currentHeaderColumnIndex;
            }
            newColumnXPosition = headerBoundingRects.left;
            break;
          }
          currentHeaderColumnIndex = headerColumnIndex;
        }
        if (newColumnIndex != columnIndex) {
          draggingMarker.style.display = "block";
          draggingCaptionIndicator.style.color = "green";
          draggingCaptionIndicator.innerHTML = "☑";
        }
        else {
          draggingMarker.style.display = "none";
          draggingCaptionIndicator.style.color = "red";
          draggingCaptionIndicator.innerHTML = "☒";
        }
        draggingCaption.style.left = (currentX - 5) + "px";
        draggingCaption.style.top = (currentY - 5) + "px";
        draggingMarker.style.left = newColumnXPosition + "px";
        draggingMarker.dataset.newColumnIndex = newColumnIndex;
      });
      draggingOverlay.addEventListener("mouseup", function() {
        let newColumnIndex = parseInt(draggingMarker.dataset.newColumnIndex);
        if (newColumnIndex != columnIndex) {
          let columns = me.columns;
          columns.splice(newColumnIndex, 0, columns.splice(columnIndex, 1)[0]);
          me.columns = null;
          me.columns = columns;
        }
        document.body.removeChild(this);
      });
      document.body.appendChild(draggingOverlay);
    }, 300);
  }

  handleResizerMouseDown(e) {
    e.stopPropagation();
    const me = this;
    const dataTableBoundingRect = me.host.getBoundingClientRect();
    const resizer = e.target;
    const columnCell = resizer.parentElement;
    const columnCellBoundingRect = columnCell.getBoundingClientRect();
    const columnIndex = columnCell.dataset.columnIndex;
    const column = this.columns[columnIndex];

    const resizerMarkerStart = document.createElement("div");
    resizerMarkerStart.style.position = "absolute";
    resizerMarkerStart.style.cursor = "col-resize";
    resizerMarkerStart.style.width = "0";
    resizerMarkerStart.style.zIndex = "6000";
    resizerMarkerStart.style.background = "lightgray";
    resizerMarkerStart.style.border = "1px solid gray";
    resizerMarkerStart.style.top = dataTableBoundingRect.top + "px";
    resizerMarkerStart.style.left = columnCellBoundingRect.left + "px";
    resizerMarkerStart.style.height = (dataTableBoundingRect.bottom - dataTableBoundingRect.top) + "px";

    const resizerMarkerEnd = document.createElement("div");
    resizerMarkerEnd.style.position = "absolute";
    resizerMarkerEnd.style.cursor = "col-resize";
    resizerMarkerEnd.style.width = "0";
    resizerMarkerEnd.style.zIndex = "6000";
    resizerMarkerEnd.style.background = "lightgray";
    resizerMarkerEnd.style.border = "1px solid gray";
    resizerMarkerEnd.style.top = dataTableBoundingRect.top + "px";
    resizerMarkerEnd.style.left = columnCellBoundingRect.right + "px";
    resizerMarkerEnd.style.height = (dataTableBoundingRect.bottom - dataTableBoundingRect.top) + "px";

    const resizeOverlay = document.createElement("div");
    resizeOverlay.style.position = "fixed";
    resizeOverlay.style.top = "0px";
    resizeOverlay.style.left = "0px";
    resizeOverlay.style.width = "100%";
    resizeOverlay.style.height = "100%";
    resizeOverlay.style.zIndex = "8000";
    resizeOverlay.style.cursor = "col-resize";
    resizeOverlay.appendChild(resizerMarkerStart);
    resizeOverlay.appendChild(resizerMarkerEnd);

    resizeOverlay.addEventListener("mousemove", function(e) {
      let currentX = e.clientX;
      let minX = columnCellBoundingRect.left + column.minWidth;
      let maxX = columnCellBoundingRect.left + column.maxWidth;
      if (currentX < minX) { currentX = minX; }
      if (currentX > maxX) { currentX = maxX; }
      resizerMarkerEnd.style.left = currentX + "px";
    });
    resizeOverlay.addEventListener("mouseup", function() {
      column.width = resizerMarkerEnd.offsetLeft - resizerMarkerStart.offsetLeft;
      const currentColumns = me.columns;
      me.columns = null;
      me.columns = currentColumns;
      document.body.removeChild(this);
    });

    document.body.appendChild(resizeOverlay);
  }

  handleHeaderOptionsClick (e) {
    e.stopPropagation();
    const headerOptionsButton = e.currentTarget;
    const header = headerOptionsButton.parentElement;
    const columnIndex = parseInt(header.dataset.columnIndex);
    this.optionsMenuColumnIndex = columnIndex == this.optionsMenuColumnIndex? -1 : columnIndex;
  }

  handleHeaderOptionsMouseEvents (e) {
    e.stopPropagation();
  }

  componentDidRender() {
    this.optionsMenu.anchorEl = null;
    if (this.optionsMenuColumnIndex >= 0) {
      const selectedHeaderCell = this.host.shadowRoot.querySelector('.headerTable th.open');
      this.optionsMenu.anchorEl = selectedHeaderCell.querySelector(".headerOptionsButton");
      this.optionsMenu.focus();
    }
  }

  getTableWidth () {
    let tableWidth = 0;
    for (let i in this.columns) {
      let column = this.columns[i];
      if (column.visible) {
        tableWidth += column.width;
      }
    }
    return tableWidth;
  }

  getSorter (sortField) {
    let currentSorter = null;
    for (let i in this.sorters) {
      let sorter = this.sorters[i];
      if (sorter.field == sortField) {
        currentSorter = sorter;
        break;
      }
    }
    return currentSorter;
  }

  render() {
    let tableWidth = this.getTableWidth();
    return <Host>
      {this.loadingData && this.renderWaitScreen()}
      {this.renderHeaderTable(tableWidth)}
      {this.renderBodyTable(tableWidth)}
      {this.renderOptionsMenu()}
    </Host>;
  }

  renderWaitScreen () {
    return <div class="waitScreen"/>;
  }

  renderHeaderTable (tableWidth : number) {
    return <table class="headerTable" style={{width: tableWidth.toString() + 'px'}}>
      {this.renderColGroup()}
      <thead>
        <tr>
          {this.columns.map((column, index) => this.renderHeaderCell(column, index))}
        </tr>
      </thead>
    </table>;
  }

  renderBodyTable (tableWidth : number) {
    return <table class="bodyTable" style={{width: tableWidth.toString() + 'px'}}>
      {this.renderColGroup()}
      <tbody>
        {this.viewData != null && this.viewData.map(dataItem => (<tr>
          {this.columns.map(column => this.renderCell(dataItem, column))}
        </tr>))}
      </tbody>
    </table>;
  }

  renderOptionsMenu () {
    const me = this;
    const menuItems = [];
    if (this.optionsMenuColumnIndex >= 0) {
      const column = this.columns[this.optionsMenuColumnIndex];
      if (column.sortable) {
        menuItems.push({
          caption: 'Ordenar ascendentemente',
          onClick: () => me.sorters = [{ field: column.sortField || column.dataField, direction: 'ASC' }]
        });
        menuItems.push({
          caption: 'Ordenar descendentemente' ,
          onClick: () => me.sorters = [{ field: column.sortField || column.dataField, direction: 'DESC' }]
        });
      }
      if (menuItems.length > 0) {
        menuItems.push({
          type: "separator"
        });
      }
      const columnMenuItems = [];
      for (let i in this.columns) {
        const currentColumn  = this.columns[i];
        columnMenuItems.push({
          caption: currentColumn.title,
          checked: currentColumn.visible,
          onCheckChange: (e) => {
            currentColumn.visible = e.detail;
            const columns = me.columns;
            me.columns = null;
            me.columns = columns;
          }
        });
      }
      menuItems.push({
        caption: 'Columnas',
        menu: columnMenuItems
      });
    }
    let menuAttributes : any = {
      ref: el => this.optionsMenu = el,
      anchorReference: 'anchorEl',
      menuItems: menuItems
    };
    return <ng-menu onBlur={this.handleMenuBlur} tabindex="0" {...menuAttributes}/>;
  }

  renderColGroup () {
    return <colgroup>
      {this.columns.map((column) => column.visible ? <col style={{width: column.width.toString() + 'px'}}/> : null)}
    </colgroup>;
  }

  renderHeaderCell (column, index) {
    let headerCell = null;
    if (column.visible) {
      let headerAttributes : any = {};
      let headerSorter = this.getSorter(column.sortField || column.dataField);
      if (column.draggable) {
        headerAttributes.onMouseUp = this.handleHeaderMouseUp;
        headerAttributes.onMouseDown = this.handleHeaderMouseDown;
      }
      if (column.sortable) {
        headerAttributes.onClick = this.handleHeaderClick;
      }
      headerCell = <th data-column-index={index} class={{'open': index == this.optionsMenuColumnIndex, 'resizable': column.resizable,'draggable': column.draggable,'sortable': column.sortable, 'sortedAsc': headerSorter != null && headerSorter.direction == 'ASC', 'sortedDesc': headerSorter != null && headerSorter.direction == 'DESC'}} {...headerAttributes}>
        <div class="headerTitle" style={{textAlign: column.titleAlign}}>{column.title}</div>
        <div class="headerOptionsButton" onClick={this.handleHeaderOptionsClick} onMouseDown={this.handleHeaderOptionsMouseEvents} onMouseUp={this.handleHeaderOptionsMouseEvents}/>
        {column.resizable && <div class="headerResizer" onMouseDown={this.handleResizerMouseDown}/>}
      </th>;
    }
    return headerCell;
  }

  renderCell (dataItem, column) {
    let cell = null;
    if (column.visible) {
      let dataField = column.dataField;
      let cellValue = this.getCellValue(dataItem, dataField);
      if (cellValue == null || cellValue == '') {
        cellValue = column.defaultValue;
      }
      cell = <td style={{textAlign: column.align}}>{cellValue}</td>;
    }
    return cell;
  }

  getCellValue (dataItem, dataField) {
    let cellValue = null;
    if (dataField != null) {
      if (dataField instanceof Function) {
        cellValue = dataField(dataItem);
      } else {
        let dataTemplateFields = dataField.match(/[^{}]+(?=})/g);
        if (dataTemplateFields != null) {
          cellValue = dataField;
          for (let k = 0; k < dataTemplateFields.length; k++) {
            let field = dataTemplateFields[k];
            cellValue = cellValue.replace("{" + field + "}", this.getCellValue(dataItem, field));
          }
        } else {
          let dataFieldTokens = dataField.split(".");
          let dataFieldReference = null;
          for (let k = 0; k < dataFieldTokens.length; k++) {
            if (dataFieldReference == null) {
              dataFieldReference = dataItem[dataFieldTokens[k]];
              if (!dataFieldReference) {
                break;
              }
            } else {
              dataFieldReference = dataFieldReference[dataFieldTokens[k]];
            }
          }
          cellValue = dataFieldReference;
        }
      }
    }
    return cellValue;
  }
}
