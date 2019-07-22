import {Component, Element, h, Listen, Prop, State} from '@stencil/core';

@Component({
  tag: 'ng-date-time-field',
  styleUrls: ['NgInput.scss', 'NgDateTimeField.scss'],
  shadow: true
})
export class NgDateTimeField {

  @Element() host: HTMLElement;

  @Prop() name : string;

  @Prop({mutable: true}) value : string;

  @Prop() size : number;

  @Prop() disabled : boolean = false;

  @Prop() readOnly : boolean = false;

  @Prop() required : boolean = false;

  @Prop() autoComplete : boolean = false;

  @Prop() emptyText : string;

  @Prop() label : string;

  @Prop({reflectToAttr: true}) inline : boolean = false;

  @State() pickerVisible : boolean = false;

  constructor() {
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handlePickerFocus = this.handlePickerFocus.bind(this);
    this.handlePickerBlur = this.handlePickerBlur.bind(this);
  }

  handleInputFocus() {
    this.showPicker();
  }

  handleInputBlur() {
    this.hidePicker();
  }

  handlePickerFocus() {
    this.showPicker();
  }

  handlePickerBlur() {
    this.hidePicker();
  }

  @Listen("valueChange")
  handlePickerValueChange(event) {
    this.host.shadowRoot.querySelector("input").value = event.detail;
  }

  @Listen("input")
  handleInputChange() {
    this.value = this.host.shadowRoot.querySelector("input").value;
  }

  showPicker() {
    this.pickerVisible = true;
  }

  hidePicker() {
    this.pickerVisible = false;
  }

  togglePicker () {
    this.pickerVisible = !this.pickerVisible;
  }

  render() {
    let attributes = {
      type: 'text',
      value: this.value,
      size: this.size,
      disabled: this.disabled,
      readonly: this.readOnly,
      required: this.required,
      autocomplete: this.autoComplete? "on" : "off",
      placeholder: this.emptyText,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur
    };

    return <ng-field label={this.label} inline={this.inline}>
      <input {...attributes}/>
      {this.pickerVisible && (<div tabindex="0" onFocus={this.handlePickerFocus} onBlur={this.handlePickerBlur} class={{'picker-container': true}}>
        <ng-date-time-picker value={this.value}/>
      </div>)}
    </ng-field>;
  }

  componentDidRender() {
    if (this.pickerVisible) {
      let input = this.host.shadowRoot.querySelector("input");
      let inputBounds = input.getBoundingClientRect();
      let dateTimePicker = this.host.shadowRoot.querySelector(".picker-container") as HTMLElement;
      dateTimePicker.style.left = inputBounds.left + "px";
      dateTimePicker.style.top = inputBounds.bottom + "px";
      dateTimePicker.style.display = "block";
      input.focus();
    }
  }
}
