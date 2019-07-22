import {Component, Event, EventEmitter, h, Method, Prop, State, Watch} from '@stencil/core';
import moment, {Moment} from 'moment';

@Component({
  tag: 'ng-date-time-picker',
  styleUrl: 'NgDateTimePicker.scss',
  shadow: true
})
export class NgDateTimePicker {

  @Prop() showDateControls : boolean = true;

  @Prop() showTimeControls : boolean = true;

  @Prop() format : string;

  @Prop({mutable: true}) value : string;

  @State() date : Moment;

  @State() viewDate : Moment;

  @State() mode: 'date' | 'time';

  @State() dateMode: 'year' | 'month' | 'day' = 'day';

  @State() timeMode: 'time' | 'hour' | 'minute' | 'second' = 'time';

  @Event() valueChange: EventEmitter;

  constructor() {
    if (!this.format) {
      let format = '';
      if (this.showDateControls) {
        format += 'YYYY-MM-DD';
      }
      if (this.showTimeControls) {
        if (format) {
          format += ' ';
        }
        format += 'HH:mm:ss';
      }
      this.format = format;
    }

    this.mode = this.showDateControls? 'date' : 'time';
    this.date = moment();
    if (this.value) {
      let date = moment(this.value, this.format);
      if (date.isValid()) {
        this.date.year(date.year()).month(date.month()).date(date.date()).hour(date.hour()).minute(date.minute()).second(date.second());
      }
    }
    this.viewDate = this.date.clone().startOf('M').startOf('d');
    this.handleDateModeChange = this.handleDateModeChange.bind(this);
    this.handlePreviousViewDatePeriod = this.handlePreviousViewDatePeriod.bind(this);
    this.handleNextViewDatePeriod = this.handleNextViewDatePeriod.bind(this);
    this.handleYearSelect = this.handleYearSelect.bind(this);
    this.handleMonthSelect = this.handleMonthSelect.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleShowDateControls = this.handleShowDateControls.bind(this);
    this.handleShowTimeControls = this.handleShowTimeControls.bind(this);
    this.handleHourIncrement = this.handleHourIncrement.bind(this);
    this.handleHourDecrement = this.handleHourDecrement.bind(this);
    this.handleMinuteIncrement = this.handleMinuteIncrement.bind(this);
    this.handleMinuteDecrement = this.handleMinuteDecrement.bind(this);
    this.handleSecondIncrement = this.handleSecondIncrement.bind(this);
    this.handleSecondDecrement = this.handleSecondDecrement.bind(this);
    this.handleHourTimeMode = this.handleHourTimeMode.bind(this);
    this.handleMinuteTimeMode = this.handleMinuteTimeMode.bind(this);
    this.handleSecondTimeMode = this.handleSecondTimeMode.bind(this);
    this.handleHourSelect = this.handleHourSelect.bind(this);
    this.handleMinuteSelect = this.handleMinuteSelect.bind(this);
    this.handleSecondSelect = this.handleSecondSelect.bind(this);
  }

  setDate(date : Moment) {
    this.date = date;
    this.setValue(this.date.format(this.format));
  }

  @Watch("value")
  onValueChange(newValue : string) {
    if (newValue) {
      let date = moment(newValue, this.format);
      if (date.isValid()) {
        this.date.year(date.year()).month(date.month()).date(date.date()).hour(date.hour()).minute(date.minute()).second(date.second());
      }
    }
    else {
      this.date = moment();
    }
    this.viewDate = this.date.clone().startOf('M').startOf('d');
    this.valueChange.emit(this.value);
  }

  @Method()
  async setValue(value : string) {
    this.value = value;
  }

  @Method()
  async getValue() {
    return this.value;
  }

  render() {
    let template = null;
    switch (this.mode) {
      case 'date':
        template = this.dateSelectTemplate;
        break;
      case 'time':
        template = this.timeSelectTemplate;
        break;
    }
    return <div class="picker">{template}</div>;
  }

  handleShowDateControls () {
    this.mode = 'date';
  }

  handleShowTimeControls () {
    this.mode = 'time';
  }

  handleDateModeChange () {
    switch (this.dateMode) {
      case 'month':
        this.dateMode = 'year';
        break;
      case 'day':
        this.dateMode = 'month';
        break;
    }
  }

  handlePreviousViewDatePeriod () {
    let newViewDate = this.viewDate.clone();
    switch (this.dateMode) {
      case 'year':
        newViewDate.subtract(12, 'y');
        break;
      case 'month':
        newViewDate.subtract(1, 'y');
        break;
      case 'day':
        newViewDate.subtract(1, 'M');
        break;
    }
    this.viewDate = newViewDate;
  }

  handleNextViewDatePeriod () {
    let newViewDate = this.viewDate.clone();
    switch (this.dateMode) {
      case 'year':
        newViewDate.add(12, 'y');
        break;
      case 'month':
        newViewDate.add(1, 'y');
        break;
      case 'day':
        newViewDate.add(1, 'M');
        break;
    }
    this.viewDate = newViewDate;
  }

  handleYearSelect (event) {
    const target = event.target;
    const year = target.dataset.year;
    this.viewDate = this.viewDate.clone().year(year);
    this.dateMode = 'month';
  }

  handleMonthSelect (event) {
    const target = event.target;
    const month = target.dataset.month;
    this.viewDate = this.viewDate.clone().month(month);
    this.dateMode = 'day';
  }

  handleDateSelect (event) {
    const target = event.target;
    const year = target.dataset.year;
    const month = target.dataset.month;
    const day = target.dataset.day;
    const newDate = this.date.clone().year(year).month(month).date(day);
    if (!newDate.isSame(this.viewDate, 'M') || !newDate.isSame(this.viewDate, 'y')) {
      this.viewDate = this.viewDate.clone().year(newDate.year()).month(newDate.month());
    }
    this.setDate(newDate);
  }

  handleHourIncrement () {
    this.setDate(this.date.clone().add(1, 'h'));
  }

  handleHourDecrement () {
    this.setDate(this.date.clone().subtract(1, 'h'));
  }

  handleMinuteIncrement () {
    this.setDate(this.date.clone().add(1, 'm'));
  }

  handleMinuteDecrement () {
    this.setDate(this.date.clone().subtract(1, 'm'));
  }

  handleSecondIncrement () {
    this.setDate(this.date.clone().add(1, 's'));
  }

  handleSecondDecrement () {
    this.setDate(this.date.clone().subtract(1, 's'));
  }

  handleHourTimeMode () {
    this.timeMode = 'hour';
  }

  handleMinuteTimeMode () {
    this.timeMode = 'minute';
  }

  handleSecondTimeMode () {
    this.timeMode = 'second';
  }

  handleHourSelect (event) {
    const target = event.target;
    const hour = target.dataset.hour;
    this.setDate(this.date.clone().hour(hour));
    this.timeMode = 'time';
  }

  handleMinuteSelect (event) {
    const target = event.target;
    const minute = target.dataset.minute;
    this.setDate(this.date.clone().minute(minute));
    this.timeMode = 'time';
  }

  handleSecondSelect (event) {
    const target = event.target;
    const second = target.dataset.second;
    this.setDate(this.date.clone().second(second));
    this.timeMode = 'time';
  }

  get timeSelectTemplate() {
    let currentDate = this.date.clone();
    let options = [];
    switch (this.timeMode) {
      case 'time':
        options.push(<a class="picker-button picker-time-button picker-time-slot" onClick={this.handleHourIncrement}><ng-icon name="chevron-up"></ng-icon></a>);
        options.push(<div class="picker-time-separator-slot"></div>);
        options.push(<a class="picker-button picker-time-button picker-time-slot" onClick={this.handleMinuteIncrement}><ng-icon name="chevron-up"></ng-icon></a>);
        options.push(<div class="picker-time-separator-slot"></div>);
        options.push(<a class="picker-button picker-time-button picker-time-slot" onClick={this.handleSecondIncrement}><ng-icon name="chevron-up"></ng-icon></a>);
        options.push(<a class="picker-button picker-time-slot" onClick={this.handleHourTimeMode}>{currentDate.format('HH')}</a>);
        options.push(<div class="picker-time-separator-slot">:</div>);
        options.push(<a class="picker-button picker-time-slot" onClick={this.handleMinuteTimeMode}>{currentDate.format("mm")}</a>);
        options.push(<div class="picker-time-separator-slot">:</div>);
        options.push(<a class="picker-button picker-time-slot" onClick={this.handleSecondTimeMode}>{currentDate.format("ss")}</a>);
        options.push(<a class="picker-button picker-time-button picker-time-slot" onClick={this.handleHourDecrement}><ng-icon name="chevron-down"></ng-icon></a>);
        options.push(<div class="picker-time-separator-slot"></div>);
        options.push(<a class="picker-button picker-time-button picker-time-slot" onClick={this.handleMinuteDecrement}><ng-icon name="chevron-down"></ng-icon></a>);
        options.push(<div class="picker-time-separator-slot"></div>);
        options.push(<a class="picker-button picker-time-button picker-time-slot" onClick={this.handleSecondDecrement}><ng-icon name="chevron-down"></ng-icon></a>);
        break;
      case 'hour':
        for (let i = 0; i <= 23; i++) {
          options.push(<a data-hour={i} class="picker-button picker-option-hour" onClick={this.handleHourSelect}>{i < 10? '0' + i : i}</a>);
        }
        break;
      case 'minute':
        for (let i = 0; i < 60; i+=5) {
          options.push(<a data-minute={i} class="picker-button picker-option-minute" onClick={this.handleMinuteSelect}>{i < 10? '0' + i : i}</a>);
        }
        break;
      case 'second':
        for (let i = 0; i < 60; i+=5) {
          options.push(<a data-second={i} class="picker-button picker-option-second" onClick={this.handleSecondSelect}>{i < 10? '0' + i : i}</a>);
        }
        break;
    }

    return <div class="picker-time">
      {this.showDateControls && (<div class="picker-time-date-controls">
        <a class="picker-button picker-date-toggle-button" onClick={this.handleShowDateControls}><ng-icon name="calendar-alt"></ng-icon></a>
      </div>)}
      <div class="picker-time-options">
        {options.map((option) => option)}
      </div>
    </div>;
  }

  get dateSelectTemplate() {
    let todayDate = moment();
    let currentDate = this.date.clone();
    let options = [];
    let optionsTitle = '';
    switch (this.dateMode) {
      case 'year':
        let currentYear = this.viewDate.clone().subtract(5, 'y');
        let endYear = this.viewDate.clone().add(6, 'y');
        optionsTitle = currentYear.year() + '-' + endYear.year();
        while (!currentYear.isAfter(endYear, 'y')) {
          options.push(<a data-year={currentYear.year()} onClick={this.handleYearSelect} class={{'picker-button': true, 'picker-option-year': true, 'active': currentYear.isSame(currentDate, 'y')}}>{currentYear.year()}</a>);
          currentYear.add(1, 'y');
        }
        break;
      case 'month':
        let currentMonth = this.viewDate.clone().startOf('y').startOf('d');
        optionsTitle = this.viewDate.year().toString();
        while (currentMonth.isSame(this.viewDate, 'y')) {
          options.push(<a data-month={currentMonth.month()} onClick={this.handleMonthSelect} class={{'picker-button': true, 'picker-option-month': true, 'active': currentMonth.isSame(currentDate, 'month')}}>{currentMonth.format('MMM')}</a>);
          currentMonth.add(1, 'M');
        }
        break;
      case 'day':
        let currentDow = this.viewDate.clone().startOf('w').startOf('d');
        while (currentDow.isBefore(this.viewDate.clone().endOf('w'))) {
          options.push(<span class={{'picker-option-day': true, 'dow': true}}>{currentDow.format('dd')}</span>);
          currentDow.add(1, 'd');
        }
        let currentDay = this.viewDate.clone().startOf('M').startOf('w').startOf('d');
        optionsTitle = this.viewDate.format('MMMM') + ' ' + this.viewDate.year();
        for (let i = 0; i < 42; i++) {
          options.push(<a data-year={currentDay.year()} data-month={currentDay.month()} data-day={currentDay.date()} onClick={this.handleDateSelect} class={{'picker-button': true,'picker-option-day': true,'active': currentDay.isSame(currentDate, 'date'),'old': currentDay.isBefore(this.viewDate, 'M'),'new': currentDay.isAfter(this.viewDate, 'M'),'today': currentDay.isSame(todayDate, 'd'),'weekend': currentDay.day() === 0 || currentDay.day() === 6}}>{currentDay.date()}</a>);
          currentDay.add(1, 'd');
        }
        break;
    }
    return <div class="picker-date">
      <div class="picker-date-controls">
        <a class="picker-button picker-date-previous-button" onClick={this.handlePreviousViewDatePeriod}><ng-icon name="chevron-left"></ng-icon></a>
        <a class="picker-button picker-date-mode-selector" onClick={this.handleDateModeChange}>{optionsTitle}</a>
        <a class="picker-button picker-date-next-button" onClick={this.handleNextViewDatePeriod}><ng-icon name="chevron-right"></ng-icon></a>
      </div>
      <div class="picker-date-options">
        {options.map((option) => option)}
      </div>
      {this.showTimeControls && (<div class="picker-date-time-controls">
        <a class="picker-button picker-time-toggle-button" onClick={this.handleShowTimeControls}><ng-icon type='regular' name="clock"></ng-icon></a>
      </div>)}
    </div>;
  }
}
