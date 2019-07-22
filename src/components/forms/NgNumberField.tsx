import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-number-field',
  styleUrl: 'NgInput.scss'
})
export class NgNumberField {

  @Prop() name : string = '';

  @Prop() value : number = 0;

  @Prop() size : number = 0;

  @Prop() disabled : boolean = false;

  @Prop() readOnly : boolean = false;

  @Prop() required : boolean = false;

  @Prop() autoComplete : boolean = false;

  @Prop() emptyText : string = '';

  @Prop() minValue : number;

  @Prop() maxValue : number;

  @Prop() step : number;

  @Prop() label : string;

  @Prop({reflectToAttr: true}) inline : boolean = false;

  render() {
    let attributes = {
      type: "number",
      name: this.name,
      value: this.value.toString(),
      size: this.size,
      disabled: this.disabled,
      required: this.required,
      autocomplete: this.autoComplete? "on" : "off",
      emptyText: this.emptyText,
      min: this.minValue.toString(),
      max: this.maxValue.toString(),
      step: this.step
    };
    return <ng-field label={this.label} inline={this.inline}>
      <input {...attributes}/>
    </ng-field>;
  }
}
