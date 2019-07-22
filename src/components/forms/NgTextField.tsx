import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'ng-text-field',
  styleUrl: 'NgInput.scss'
})
export class NgTextField {

  @Prop() name : string;

  @Prop() value : string;

  @Prop() size : number;

  @Prop() disabled : boolean = false;

  @Prop() readOnly : boolean = false;

  @Prop() required : boolean = false;

  @Prop() autoComplete : boolean = false;

  @Prop() emptyText : string;

  @Prop() label : string;

  @Prop({reflectToAttr: true}) inline : boolean = false;

  render() {
    let attributes = {
      type: 'text',
      name: this.name,
      value: this.value,
      size: this.size,
      disabled: this.disabled,
      readonly: this.readOnly,
      required: this.required,
      autocomplete: this.autoComplete? "on" : "off",
      placeholder: this.emptyText
    };
    return <ng-field label={this.label} inline={this.inline}>
      <input {...attributes}/>
    </ng-field>;
  }
}
