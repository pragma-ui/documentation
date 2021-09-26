document.addEventListener('turbolinks:load', function () {
  'use strict'

  // Class constructor for Pragma DataTable component.
  // Implements Pragma component design pattern
  //
  // @constructor
  // @param {HTMLElement} The element that will be upgraded to be Pragma DataTable.
  var PragmaDataTable = function PragmaDataTable(element) {
    this.element_ = element
    this.searchElement_ = this.element_.querySelector('.' + this.constants_.TABLE_SEARCH)
    this.totalRows = this.element_.tBodies[0].rows.length
    this.columns = this.element_.tHead.querySelector('tr.'+this.constants_.TABLE_HEADERS).cells
    if (this.totalRows > 10) {
      for (var i = 0; i < this.columns.length; i++) {
        this.columns[i].addEventListener('click', this.sortTable(this.columns[i], i))
      }
    }
    if ((this.element_.dataset.paginate === 'true') && (this.totalRows != 0)) {
      this.perPageField = null
      this.nextLink = null
      this.prevLink = null
      this.paginate()
    }
  };
  window['PragmaDataTable'] = PragmaDataTable

  // Store strings for class names defined by this component that are used in
  // Javascript. This allows us to simply change it in one place should we decide
  // to modify at a later date.
  //
  // @enum {string}
  // @private
  PragmaDataTable.prototype.constants_ = {
    TABLE_SEARCH: 'table-search .search-field',
    TABLE_HEADERS: 'table-headers',
    TABLE_LOADING: 'table-loading',
    ASC_SORTED: 'sorted-asc',
    DESC_SORTED: 'sorted-desc',
    DATATYPES: {
      DEFAULT: 'string',
      NUMBER: 'number',
      DATE: 'date'
    },
    DEFAULT_PER_PAGE: 10,
    PER_PAGE_OPTIONS: [10, 25, 50, 100],
    DEFAULT_START: 0,
    PREV: 'prev',
    NEXT: 'next',
    PAGINATION_ROW: 'pagination-row',
    FOOTER_STRUCTURE:
     `<td colspan="">
							<div class="pagination-container">
								<span class="pagination-per-page">Items per page: 
									<select name="per-page" class="pagination-per-page-value">
										<option value="10">10</option>
										<option value="25">25</option>
										<option value="50">50</option>
										<option value="100">100</option>
									</select>
								</span>
								<span class="pagination-description">
								<span class="pagination-range"></span>
									<span class="pagination-link">
										<button class="icon-button prev"><i class="material-icons">keyboard_arrow_left</i></button>
										<button class="icon-button next" data-start="" data-end=""><i class="material-icons">keyboard_arrow_right</i></button>
									</span>
								</span>
							</div>
						</td>`,
  };

  // Sort Table
  //
  // @param {HTMLElement} The column that will be sorted.
  // @param {integer} The column number that will be sorted.
  // @public
  PragmaDataTable.prototype.sortTable = function (column, index) {
    if (column.dataset.sortable != 'false') {
      return function () {
        this.element_.classList.add(this.constants_.TABLE_LOADING)
        if (column.classList.contains(this.constants_.ASC_SORTED)) {
          let sortEvent = componentHandler.createEvent(
           'sorting.pragma.table',
           {
             'column': column.innerText,
             'order': 'des'
           },
           false,
           true)
          this.element_.dispatchEvent(sortEvent)
          this.sortColumnDesc(column, index)
        } else {
          let sortEvent = componentHandler.createEvent(
           'sorting.pragma.table',
           {
             'column': column.innerText,
             'order': 'asc'
           },
           false,
           true)
          this.element_.dispatchEvent(sortEvent)
          this.sortColumnAsc(column, index)
        }
        this.element_.classList.remove(this.constants_.TABLE_LOADING)
      }.bind(this)
    }
  };
  PragmaDataTable.prototype['sortTable'] = PragmaDataTable.prototype.sortTable;

  // Ascending Column Sort
  //
  // @param {HTMLElement} The column that will be sorted.
  // @param {integer} The column number that will be sorted.
  // @public
  PragmaDataTable.prototype.sortColumnAsc = function (column, index) {
    column.classList.remove(this.constants_.DESC_SORTED)
    column.classList.add(this.constants_.ASC_SORTED)
    let rows = this.element_.tBodies[0].rows
    // .querySelectorAll('tr:not(.d-none)')
    let changed = false
    for (var i = 0; i < (rows.length - 1); i++) {
      let currentRow = rows[i]
      let nextRow = rows[i + 1]
      let currentValue = currentRow.cells[index].textContent.toLowerCase()
      let nextValue = nextRow.cells[index].textContent.toLowerCase()
      switch (column.dataset.type) {
        case(this.constants_.DATATYPES.NUMBER):
          currentValue = parseFloat(currentValue)
          nextValue = parseFloat(nextValue)
          break;
        case(this.constants_.DATATYPES.DATE):
          break;
      }
      if (currentValue > nextValue) {
        currentRow.parentNode.insertBefore(nextRow, currentRow)
        changed = true
      }
    }
    if (changed) this.sortColumnAsc(column, index);
    this.manageLinks(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.totalRows)
    this.drawRows(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.perPageField.value, this.totalRows)
    this.element_.dispatchEvent(
     componentHandler.createEvent(
      'sorted.pragma.table',
      {
        'column': column.innerText,
        'order': 'asc'
      },
      false,
      true)
    )
  }
  PragmaDataTable.prototype['sortColumnAsc'] = PragmaDataTable.prototype.sortColumnAsc;

  // Descending Column Sort
  //
  // @param {HTMLElement} The column that will be sorted.
  // @param {integer} The column number that will be sorted.
  // @public
  PragmaDataTable.prototype.sortColumnDesc = function (column, index) {
    column.classList.remove(this.constants_.ASC_SORTED)
    column.classList.add(this.constants_.DESC_SORTED)
    let rows = this.element_.tBodies[0].rows
    // .querySelectorAll('tr:not(.d-none)')
    let changed = false
    for (var i = 0; i < (rows.length - 1); i++) {
      let currentRow = rows[i]
      let nextRow = rows[i + 1]
      let currentValue = currentRow.cells[index].textContent.toLowerCase()
      let nextValue = nextRow.cells[index].textContent.toLowerCase()
      switch (column.dataset.type) {
        case(this.constants_.DATATYPES.NUMBER):
          currentValue = parseFloat(currentValue)
          nextValue = parseFloat(nextValue)
          break;
        case(this.constants_.DATATYPES.DATE):
          break;
      }
      if (currentValue < nextValue) {
        currentRow.parentNode.insertBefore(nextRow, currentRow)
        changed = true
      }
    }
    if (changed) this.sortColumnDesc(column, index);
    this.manageLinks(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.totalRows)
    this.drawRows(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.perPageField.value, this.totalRows)
    this.element_.dispatchEvent(
     componentHandler.createEvent(
      'sorted.pragma.table',
      {
        'column': column.innerText,
        'order': 'asc'
      },
      false,
      true)
    )
  }
  PragmaDataTable.prototype['sortColumnDesc'] = PragmaDataTable.prototype.sortColumnDesc;

  // Paginate
  //
  // @public
  PragmaDataTable.prototype.paginate = function () {
    let totalPages = parseInt(this.totalRows / this.constants_.DEFAULT_PER_PAGE)
    if (totalPages > 0) {
      let footer = this.element_.querySelector('tfoot') || document.createElement('tfoot')
      let tr = document.createElement('tr')
      tr.classList.add(this.constants_.PAGINATION_ROW)
      tr.innerHTML = this.constants_.FOOTER_STRUCTURE
      footer.append(tr)
      this.element_.append(footer)
      this.element_.querySelector('tr.pagination-row td').setAttribute("colspan", this.columns.length)
      this.perPageField = this.element_.querySelector('.pagination-per-page-value')
      this.perPageField.value = this.element_.dataset.paginatePerPage || this.constants_.DEFAULT_PER_PAGE
      let range = footer.querySelector('.pagination-range')
      range.innerText = (parseInt(this.constants_.DEFAULT_START) + 1) + ' - ' + (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)) + ' of ' + this.totalRows

      this.nextLink = footer.querySelector('.next')
      this.nextLink.addEventListener('click', this.changePage(this.constants_.NEXT))
      this.prevLink = footer.querySelector('.prev')
      this.prevLink.addEventListener('click', this.changePage(this.constants_.PREV))

      this.manageLinks(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.totalRows)
      this.drawRows(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.perPageField.value, this.totalRows)

      this.perPageField.addEventListener('change', this.changePerPage.bind(this))
    }
  }

  // Change Page
  //
  // @param {string} Change page direction ['prev', 'next']
  // @public
  PragmaDataTable.prototype.changePage = function (direction) {
    let perPage = this.perPageField.value
    return function () {
      switch (direction) {
        case (this.constants_.PREV):
          this.element_.dispatchEvent(
           componentHandler.createEvent(
            'changingPage.pragma.table',
            {
              'start': this.prevLink.dataset.start,
              'end': this.prevLink.dataset.end,
              direction: this.constants_.PREV,
            },
            false,
            true)
          )
          this.drawRows(parseInt(this.prevLink.dataset.start), parseInt(this.prevLink.dataset.end), perPage, this.totalRows)
          this.manageLinks(parseInt(this.prevLink.dataset.start), parseInt(this.prevLink.dataset.end), this.totalRows)
          this.element_.dispatchEvent(
           componentHandler.createEvent(
            'changePage.pragma.table',
            {
              'start': this.prevLink.dataset.start,
              'end': this.prevLink.dataset.end,
              direction: this.constants_.PREV,
            },
            false,
            true)
          )
          break;
        case (this.constants_.NEXT):
          this.element_.dispatchEvent(
           componentHandler.createEvent(
            'changingPage.pragma.table',
            {
              'start': this.nextLink.dataset.start,
              'end': this.nextLink.dataset.end,
              direction: this.constants_.NEXT,
            },
            false,
            true)
          )
          this.drawRows(parseInt(this.nextLink.dataset.start), parseInt(this.nextLink.dataset.end), perPage, this.totalRows)
          this.manageLinks(parseInt(this.nextLink.dataset.start), parseInt(this.nextLink.dataset.end), this.totalRows)
          this.element_.dispatchEvent(
           componentHandler.createEvent(
            'changePage.pragma.table',
            {
              'start': this.nextLink.dataset.start,
              'end': this.nextLink.dataset.end,
              direction: this.constants_.NEXT,
            },
            false,
            true)
          )
          break;
      }
    }.bind(this)
  }

  // Manage Links
  //
  // @param {integer} start index for the table rows to be displayed
  // @param {integer} end index for the table rows to be displayed
  // @param {integer} total table rows
  // @public
  PragmaDataTable.prototype.manageLinks = function (start, end, totalRows) {
    let range = this.element_.querySelector('.pagination-range')
    range.innerText = (start + 1) + ' - ' + end + ' of ' + totalRows
    if (end < totalRows) {
      this.nextLink.dataset.start = end
      if ((end + parseInt(this.perPageField.value)) < totalRows) {
        this.nextLink.dataset.end = end + parseInt(this.perPageField.value)
      } else {
        this.nextLink.dataset.end = totalRows
      }
      this.nextLink.disabled = false
    } else {
      this.nextLink.disabled = true
    }
    if (start > this.constants_.DEFAULT_START) {
      this.prevLink.dataset.start = start - parseInt(this.perPageField.value)
      this.prevLink.dataset.end = start
      this.prevLink.disabled = false
    } else {
      this.prevLink.disabled = true
    }
  }

  // Draw Rows
  //
  // @param {integer} start index for the table rows to be displayed
  // @param {integer} end index for the table rows to be displayed
  // @param {integer} per page display for the table
  // @param {integer} total table rows
  // @public
  PragmaDataTable.prototype.drawRows = function (start, end, per_page = this.constants_.DEFAULT_PER_PAGE, totalRows) {
    if (start > totalRows) throw new Error('Invalid argument provided to draw Pragma Data Table. Requested pagination range out of scope.');
    for (let i = 0; i < start; i++) {
      this.element_.tBodies[0].rows[i].classList.add('d-none')
    }
    for (let i = start; i < end; i++) {
      this.element_.tBodies[0].rows[i].classList.remove('d-none')
    }
    for (let i = end; i < totalRows; i++) {
      this.element_.tBodies[0].rows[i].classList.add('d-none')
    }
  }

  // Change Per Page
  //
  // @param {integer} rows to display per page
  // @public
  PragmaDataTable.prototype.changePerPage = function () {
    this.element_.dispatchEvent(
     componentHandler.createEvent('changingPerPage.pragma.table', null, false, true)
    )
    let range = this.element_.querySelector('.pagination-range')
    range.innerText = (parseInt(this.constants_.DEFAULT_START) + 1) + ' - ' + (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)) + ' of ' + this.totalRows
    this.manageLinks(this.constants_.DEFAULT_START, (this.constants_.DEFAULT_START + parseInt(this.perPageField.value)), this.totalRows)
    this.drawRows(this.constants_.DEFAULT_START, (parseInt(this.constants_.DEFAULT_START) + parseInt(this.perPageField.value)), this.perPageField.value, this.totalRows)
    this.element_.dispatchEvent(
     componentHandler.createEvent('changedPerPage.pragma.table', null, false, true)
    )
  }

  // The component registers itself. It can assume componentHandler is available
  // in the global scape.
  componentHandler.register({
    constructor: PragmaDataTable,
    classAsString: 'PragmaDataTable',
    cssClass: 'pragma-data-table',
    widget: true
  })
})