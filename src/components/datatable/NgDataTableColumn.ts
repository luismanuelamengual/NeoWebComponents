
export interface NgDataTableColumn {
  title?: string,
  visible?: boolean,
  resizable?: boolean,
  sortable?: boolean,
  draggable?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number,
  dataField?: any,
  sortField?: any,
  align?: null | 'justify' | 'left' | 'center' | 'right',
  titleAlign?: null | 'justify' | 'left' | 'center' | 'right',
  defaultValue?: string
}
