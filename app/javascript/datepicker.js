DAYS = ["S", "M", "T", "W", "T", "F", "S"]
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

document.addEventListener('turbolinks:load', function () {
	'use strict'

	// Class constructor for Pragma Datepicker component.
	// Implements Pragma component design pattern
	//
	// @constructor
	// @param {HTMLElement} The element that will be upgraded to be Pragma Accordion.
	var PragmaDatepicker = function PragmaDatepicker(element) {
		this.element_ = element
		this.currentDate = new Date()
		this.currentMonth = this.currentDate.getMonth()
		this.currentYear = this.currentDate.getFullYear()
		this.lastDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
		this.calTable = null
		this.monthDisplay = null
		this.buildCalendar(this.currentDate, this.lastDate)
	};
	window['PragmaDatepicker'] = PragmaDatepicker

	// Store strings for class names defined by this component that are used in
	// Javascript. This allows us to simply change it in one place should we decide
	// to modify at a later date.
	//
	// @enum {string}
	// @private
	PragmaDatepicker.prototype.constants_ = {
		ACTIVE: 'is-visible',
		HEADER: 'datepicker-header',
		BODY: 'datepicker-body',
		CONTAINER: 'datepicker-container',
		CALENDAR_ROW: `<td></td><td></td><td></td><td></td><td></td><td></td><td></td>`,
		TEMPLATE:
				`<div class="datepicker-header">
			<span>Previous</span>
			<span class="datepicker-month">Month</span>
			<span>Next</span>
		</div>
		<div class="datepicker-body">
			<table>
				<thead>
					<tr>
						<th>S</th>
						<th>M</th>
						<th>T</th>
						<th>W</th>
						<th>T</th>
						<th>F</th>
						<th>S</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>`,
	};


	// Build Calendar.
	//
	// @public
	PragmaDatepicker.prototype.buildCalendar = function (currentDate, lastDate) {
		let month = currentDate.getMonth()
		let year = currentDate.getFullYear()
		let datepicker = document.createElement('div')
		datepicker.classList.add(this.constants_.CONTAINER)
		datepicker.innerHTML = this.constants_.TEMPLATE
		this.calTable = datepicker.querySelector('.' + this.constants_.BODY + ' table')
		this.monthDisplay = datepicker.querySelector('.' + this.constants_.HEADER + ' .datepicker-month')
		this.monthDisplay.innerText = MONTHS[month]
		let currentRow = this.createCalendarRow_()
		for (let curr = 1; curr <= lastDate.getDate(); curr++) {
			let date = new Date(year, month, curr)
			switch (date.getDay()) {
				case(0):
					if (curr = 1) currentRow = this.createCalendarRow_()
					currentRow.cells[0].innerHTML = curr
					break;
				default:
					currentRow.cells[date.getDay()].innerHTML = curr
					break;
			}
		}
		this.element_.innerHTML = datepicker.outerHTML
	};
	PragmaDatepicker.prototype['buildCalendar'] = PragmaDatepicker.prototype.buildCalendar;

	// Create Row.
	//
	// @private
	PragmaDatepicker.prototype.createCalendarRow_ = function () {
		let row = document.createElement('tr')
		row.innerHTML = this.constants_.CALENDAR_ROW
		this.calTable.tBodies[0].appendChild(row)
		return row
	};

	// Build Calendar.
	//
	// @public
	PragmaDatepicker.prototype.changeMonth = function (direction) {
		switch (direction) {
			case('previous'):
				this.currentMonth = this.currentMonth - 1
				let prevMonthlyDate = new Date(this.currentYear, this.currentMonth, this.currentDate.getDate())
				let prevMonthLastDate = new Date(this.currentYear, this.currentMonth + 1, 0)
				this.buildCalendar(prevMonthlyDate, prevMonthLastDate)
				break;
			case('next'):
				if (this.currentMonth == 12) this.currentYear = this.currentYear + 1
				this.currentMonth = this.currentMonth + 1
				let nextMonthlyDate = new Date(this.currentYear, this.currentMonth, this.currentDate.getDate())
				let nextMonthLastDate = new Date(this.currentYear, this.currentMonth + 1, 0)
				this.buildCalendar(nextMonthlyDate, nextMonthLastDate)
				break;
		}
	};
	PragmaDatepicker.prototype['nextMonth'] = PragmaDatepicker.prototype.nextMonth;

	// The component registers itself. It can assume componentHandler is available
	// in the global scape.
	componentHandler.register({
		constructor: PragmaDatepicker,
		classAsString: 'PragmaDatepicker',
		cssClass: 'datepicker',
		widget: true
	})
})