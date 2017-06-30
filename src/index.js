import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Calendar extends React.Component {
	constructor(props) {
	super(props);
    var date = new Date();
	  this.state = {
    	    year: date.getFullYear(),
            month: date.getMonth(),
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth(),
            selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            startDay: 1,
            currentDate: date.getDate(),
            weekNumbers: false,
            minDate: this.props.minDate ? this.props.minDate : null,
            disablePast: this.props.disablePast ? this.props.disablePast : false,
            dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            firstOfMonth: null,
            daysInMonth: null,
            userSelectedDateStr: '',
            userSelDay: null,
            userSelMonth: null,
            userSelYear: null,
            selectedElement: null
	  } // state end

	} // constructor end
    calc (year, month) {
        if (this.state.selectedElement) {
            if (this.state.selectedMonth != month || this.state.selectedYear != year) {
                this.state.selectedElement.classList.remove('r-selected');
            } else {
                this.state.selectedElement.classList.add('r-selected');
            }
        }
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    } // calc end

    customInputDate(elem) {
      var newMonth = this.state.userSelMonth;
      var newDay = this.state.userSelDay;
      var newYear = this.state.userSelYear;
      var getCallState = this.calc(parseInt(newYear), parseInt(newMonth));
      this.setState(getCallState);
      this.selectDate(parseInt(newYear), parseInt(newMonth), parseInt(newDay), elem);
    } //customInputDate end

    componentWillMount() {
        var getCallState = this.calc(this.state.year, this.state.month);
        this.setState(getCallState);
      }
      componentDidMount() {
        var that = this;
        var curDate = this.state.currentDate;
        document.getElementsByName(curDate)[0].click();
        console.log('componentDidMount');
      }
      componentDidUpdate(prevProps, prevState) {
      }
      getPrev() {
          var state = {};
          if (this && this.state && this.state.month && this.state.month > 0) {
              state.month = this.state.month - 1;
              state.year = this.state.year;
          } else {
              state.month = 11;
              state.year = this.state.year - 1;
          }
          var getCallState = this.calc(state.year, state.month);
          Object.assign(state, getCallState);
          this.setState(state);
      }
      getNext() {
          var state = {};
          if (this && this.state && this.state.month && this.state.month < 11) {
              state.month = this.state.month + 1;
              state.year = this.state.year;
          } else {
              state.month = 0;
              state.year = this.state.year + 1;
          }
          var getCallState = this.calc(state.year, state.month);
           Object.assign(state, getCallState);
          this.setState(state);
      }
      selectDate(year, month, date, element) {
          if (this && this.state && this.state.selectedElement) {
              this.state.selectedElement.classList.remove('r-selected');
          }
          element.target.classList.add('r-selected');
          let selMonth = this.state.monthNamesFull[month];
          let sel = 'Date:' + date + ' || Month:' + selMonth + ' || Year:' + year;
          this.setState({
              selectedYear: year,
              selectedMonth: month,
              selectedDt: new Date(year, month, date),
              selectedElement: element.target,
              userSelectedDateStr: sel

          });
      } //selectDate end

      onDateInputChange(e) {
        var selectedVal = e.target.value;
        // TODO:: strict condition check required.
        selectedVal = selectedVal.split('-');
        var selYear = selectedVal[0];
        var selMonth = selectedVal[1];
        var selDay = selectedVal[2];
        this.setState({
            userSelDay: selDay,
            userSelMonth: selMonth,
            userSelYear:selYear

        });
      } //onDateInputChange end
      render() {
        return (
            <div className="amplify-cal">
                <div className="amplify-cal-inner">
                    <Header monthNames={this.state.monthNamesFull} month={this.state.month} year={this.state.year} onPrev={this.getPrev.bind(this)} onNext={this.getNext.bind(this)} />
                    <WeekDays dayNames={this.state.dayNames} startDay={this.state.startDay} weekNumbers={this.state.weekNumbers} />
                    <MonthDates userSelectedDateStr={this.state.userSelectedDateStr} month={this.state.month} year={this.state.year} daysInMonth={this.state.daysInMonth} firstOfMonth={this.state.firstOfMonth} startDay={this.state.startDay} onSelect={this.selectDate.bind(this)} weekNumbers={this.state.weekNumbers} disablePast={this.state.disablePast} minDate={this.state.minDate} />
                    <CustomDatePicker onDateInputChange={this.onDateInputChange.bind(this)} onClickCustomInputDate={this.customInputDate.bind(this)}/>
                </div>
            </div>
        )
      } // render end
}; //Calender End

class Header extends React.Component {
    constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="amplify-cal-row r-head">
            <div className="r-cell r-prev" onClick={this.props.onPrev.bind(this)} role="button" tabIndex="0"></div>
            <div className="r-cell r-title">{this.props.monthNames[this.props.month]}&nbsp;{this.props.year}</div>
            <div className="r-cell r-next" onClick={this.props.onNext.bind(this)} role="button" tabIndex="0"></div>
        </div>
    )
  } // render end
} // Header end


class WeekDays extends React.Component {
constructor(props) {
    super(props);

  }
  render() {
        var that = this;
    var haystack = Array.apply(null, {length: 7}).map(Number.call, Number);
    return (
            <div className="amplify-cal-row r-weekdays">
                {(() => {
                    if (that.props.weekNumbers) {
                        return (
                            <div className="r-cell r-weeknum">wn</div>
                        );
                    }
                })()}
                {haystack.map(function (item, i) {
                    return (
                        <div className="r-cell">{that.props.dayNames[(that.props.startDay + i) % 7]}</div>
                    );
                })}
            </div>
    )
  } // render end
} // Header end

class MonthDates extends React.Component {
constructor(props) {
    super(props);
  }
  render() {
    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth();
    var getDate = new Date().getDate();
    var todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    var statics: {
        year: getYear,
        month: getMonth,
        date: getDate,
        today: todayDate
    }
    var haystack, day, d, current, onClick,
        isDate, className,
        weekStack = Array.apply(null, {length: 7}).map(Number.call, Number),
        that = this,
        startDay = this.props.firstOfMonth.getUTCDay(),
        first = this.props.firstOfMonth.getDay(),
        janOne = new Date(that.props.year, 0, 1),
        rows = 5;

    if ((startDay == 5 && this.props.daysInMonth == 31) || (startDay == 6 && this.props.daysInMonth > 29)) {
        rows = 6;
    }

    className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
    haystack = Array.apply(null, {length: rows}).map(Number.call, Number);
    day = this.props.startDay + 1 - first;
    while (day > 1) {
        day -= 7;
    }
    day -= 1;
    return (
        <div className={className}>
        {haystack.map(function (item, i) {
            d = day + i * 7;
            return (
                <div className="amplify-cal-row">
                {(() => {
                    if (that.props.weekNumbers) {
                        var weeknum = Math.ceil((((new Date(that.props.year, that.props.month, d) - janOne) / 86400000) + janOne.getDay() + 1) / 7);
                        return (
                            <div className="r-cell r-weeknum">{weeknum}</div>
                        );
                    }
                })()}
                {weekStack.map(function (item, i) {
                    d += 1;
                    isDate = d > 0 && d <= that.props.daysInMonth;

                    if (isDate) {
                        current = new Date(that.props.year, that.props.month, d);
                        className = current != that.constructor.today ? 'r-cell r-date' : 'r-cell r-date r-today';
                        if (that.props.disablePast && current < that.constructor.today) {
                            className += ' r-past';
                        } else if (that.props.minDate !== null && current < that.props.minDate) {
                            className += ' r-past';
                        }

                        if (/r-past/.test(className)) {
                            return (
                                <div ref={d} className={className} role="button" tabIndex="0" name={d}>{d}</div>
                            );
                        }

                        return (
                            <div ref={d} name={d} className={className} role="button" tabIndex="0"  onClick={that.props.onSelect.bind(that, that.props.year, that.props.month, d)}>{d}</div>
                        );
                    }

                    return (
                        <div className="r-cell"></div>
                    );
                })}
                </div>
            );
        })}

        <div className="calender-sel"> You have Selected: {that.props.userSelectedDateStr} </div>
        </div>
    );
  } // render end
} // monthdates end


class CustomDatePicker extends React.Component {
    constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="mrgnTp30">
          <div> <label> Enter Valid Date to Navigate:</label> </div>
          <div className="parent-container">
                <input id="customDate" type="date"  onChange={this.props.onDateInputChange.bind(this)}/>
                <input type="submit" onClick={this.props.onClickCustomInputDate.bind(this)}/>
          </div>
        </div>
    )
  } // render end
}// CustomDatePicker end
ReactDOM.render(<Calendar />, document.getElementById('root'));
