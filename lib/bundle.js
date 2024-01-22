import _extends from '@babel/runtime/helpers/extends';
import { createContext, useContext, useMemo, useEffect, useLayoutEffect as useLayoutEffect$1, useRef, useState, useCallback, memo, forwardRef, useImperativeHandle } from 'react';
import { flushSync } from 'react-dom';
import clsx from 'clsx';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';
import _ from 'lodash';

function getColSpan(column, lastFrozenColumnIndex, args) {
  var colSpan = typeof column.colSpan === 'function' ? column.colSpan(args) : 1;
  if (Number.isInteger(colSpan) && colSpan > 1 && (!column.frozen || column.idx + colSpan - 1 <= lastFrozenColumnIndex)) {
    return colSpan;
  }
  return undefined;
}

function stopPropagation(event) {
  event.stopPropagation();
}
function scrollIntoView(element) {
  element == null || element.scrollIntoView({
    inline: 'nearest',
    block: 'nearest'
  });
}

function createCellEvent(event) {
  var defaultPrevented = false;
  var cellEvent = _extends({}, event, {
    preventGridDefault: function preventGridDefault() {
      defaultPrevented = true;
    },
    isGridDefaultPrevented: function isGridDefaultPrevented() {
      return defaultPrevented;
    }
  });
  Object.setPrototypeOf(cellEvent, Object.getPrototypeOf(event));
  return cellEvent;
}

var nonInputKeys = new Set(['Unidentified', 'Alt', 'AltGraph', 'CapsLock', 'Control', 'Fn', 'FnLock', 'Meta', 'NumLock', 'ScrollLock', 'Shift', 'Tab', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp', 'Insert', 'ContextMenu', 'Escape', 'Pause', 'Play', 'PrintScreen', 'F1', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']);
function isCtrlKeyHeldDown(e) {
  return (e.ctrlKey || e.metaKey) && e.key !== 'Control';
}
function isDefaultCellInput(event) {
  return !nonInputKeys.has(event.key);
}
function onEditorNavigation(_ref) {
  var key = _ref.key,
    target = _ref.target;
  if (key === 'Tab' && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    var _target$closest;
    return ((_target$closest = target.closest('.rdg-editor-container')) == null ? void 0 : _target$closest.querySelectorAll('input, textarea, select').length) === 1;
  }
  return false;
}

var measuringCellClassname = "mlln6zg7-0-0-beta-41";
function renderMeasuringCells(viewportColumns) {
  return viewportColumns.map(function (_ref) {
    var key = _ref.key,
      idx = _ref.idx,
      minWidth = _ref.minWidth,
      maxWidth = _ref.maxWidth;
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: measuringCellClassname,
      style: {
        gridColumnStart: idx + 1,
        minWidth: minWidth,
        maxWidth: maxWidth
      },
      "data-measuring-cell-key": key
    });
  });
}

function _createForOfIteratorHelperLoose$6(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$6(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$6(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$6(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen); }
function _arrayLikeToArray$6(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function isSelectedCellEditable(_ref) {
  var selectedPosition = _ref.selectedPosition,
    columns = _ref.columns,
    rows = _ref.rows;
  var column = columns[selectedPosition.idx];
  var row = rows[selectedPosition.rowIdx];
  return isCellEditableUtil(column, row);
}
function isCellEditableUtil(column, row) {
  return column.renderEditCell != null && (typeof column.editable === 'function' ? column.editable(row) : column.editable) !== false;
}
function getSelectedCellColSpan(_ref2) {
  var _topSummaryRows$lengt;
  var rows = _ref2.rows,
    topSummaryRows = _ref2.topSummaryRows,
    bottomSummaryRows = _ref2.bottomSummaryRows,
    rowIdx = _ref2.rowIdx,
    mainHeaderRowIdx = _ref2.mainHeaderRowIdx,
    lastFrozenColumnIndex = _ref2.lastFrozenColumnIndex,
    column = _ref2.column;
  var topSummaryRowsCount = (_topSummaryRows$lengt = topSummaryRows == null ? void 0 : topSummaryRows.length) != null ? _topSummaryRows$lengt : 0;
  if (rowIdx === mainHeaderRowIdx) {
    return getColSpan(column, lastFrozenColumnIndex, {
      type: 'HEADER'
    });
  }
  if (topSummaryRows && rowIdx > mainHeaderRowIdx && rowIdx <= topSummaryRowsCount + mainHeaderRowIdx) {
    return getColSpan(column, lastFrozenColumnIndex, {
      type: 'SUMMARY',
      row: topSummaryRows[rowIdx + topSummaryRowsCount]
    });
  }
  if (rowIdx >= 0 && rowIdx < rows.length) {
    var row = rows[rowIdx];
    return getColSpan(column, lastFrozenColumnIndex, {
      type: 'ROW',
      row: row
    });
  }
  if (bottomSummaryRows) {
    return getColSpan(column, lastFrozenColumnIndex, {
      type: 'SUMMARY',
      row: bottomSummaryRows[rowIdx - rows.length]
    });
  }
  return undefined;
}
function getNextSelectedCellPosition(_ref3) {
  var moveUp = _ref3.moveUp,
    moveNext = _ref3.moveNext,
    cellNavigationMode = _ref3.cellNavigationMode,
    columns = _ref3.columns,
    colSpanColumns = _ref3.colSpanColumns,
    rows = _ref3.rows,
    topSummaryRows = _ref3.topSummaryRows,
    bottomSummaryRows = _ref3.bottomSummaryRows,
    minRowIdx = _ref3.minRowIdx,
    mainHeaderRowIdx = _ref3.mainHeaderRowIdx,
    maxRowIdx = _ref3.maxRowIdx,
    _ref3$currentPosition = _ref3.currentPosition,
    currentIdx = _ref3$currentPosition.idx,
    currentRowIdx = _ref3$currentPosition.rowIdx,
    nextPosition = _ref3.nextPosition,
    lastFrozenColumnIndex = _ref3.lastFrozenColumnIndex,
    isCellWithinBounds = _ref3.isCellWithinBounds;
  var nextIdx = nextPosition.idx,
    nextRowIdx = nextPosition.rowIdx;
  var columnsCount = columns.length;
  var setColSpan = function setColSpan(moveNext) {
    for (var _iterator = _createForOfIteratorHelperLoose$6(colSpanColumns), _step; !(_step = _iterator()).done;) {
      var column = _step.value;
      var colIdx = column.idx;
      if (colIdx > nextIdx) break;
      var colSpan = getSelectedCellColSpan({
        rows: rows,
        topSummaryRows: topSummaryRows,
        bottomSummaryRows: bottomSummaryRows,
        rowIdx: nextRowIdx,
        mainHeaderRowIdx: mainHeaderRowIdx,
        lastFrozenColumnIndex: lastFrozenColumnIndex,
        column: column
      });
      if (colSpan && nextIdx > colIdx && nextIdx < colSpan + colIdx) {
        nextIdx = colIdx + (moveNext ? colSpan : 0);
        break;
      }
    }
  };
  var getParentRowIdx = function getParentRowIdx(parent) {
    return parent.level + mainHeaderRowIdx;
  };
  var setHeaderGroupColAndRowSpan = function setHeaderGroupColAndRowSpan() {
    if (moveNext) {
      var nextColumn = columns[nextIdx];
      var parent = nextColumn.parent;
      while (parent !== undefined) {
        var parentRowIdx = getParentRowIdx(parent);
        if (nextRowIdx === parentRowIdx) {
          nextIdx = parent.idx + parent.colSpan;
          break;
        }
        parent = parent.parent;
      }
    } else if (moveUp) {
      var _nextColumn = columns[nextIdx];
      var _parent = _nextColumn.parent;
      var found = false;
      while (_parent !== undefined) {
        var _parentRowIdx = getParentRowIdx(_parent);
        if (nextRowIdx >= _parentRowIdx) {
          nextIdx = _parent.idx;
          nextRowIdx = _parentRowIdx;
          found = true;
          break;
        }
        _parent = _parent.parent;
      }
      if (!found) {
        nextIdx = currentIdx;
        nextRowIdx = currentRowIdx;
      }
    }
  };
  if (isCellWithinBounds(nextPosition)) {
    setColSpan(moveNext);
    if (nextRowIdx < mainHeaderRowIdx) {
      setHeaderGroupColAndRowSpan();
    }
  }
  if (cellNavigationMode === 'CHANGE_ROW') {
    var isAfterLastColumn = nextIdx === columnsCount;
    var isBeforeFirstColumn = nextIdx === -1;
    if (isAfterLastColumn) {
      var isLastRow = nextRowIdx === maxRowIdx;
      if (!isLastRow) {
        nextIdx = 0;
        nextRowIdx += 1;
      }
    } else if (isBeforeFirstColumn) {
      var isFirstRow = nextRowIdx === minRowIdx;
      if (!isFirstRow) {
        nextRowIdx -= 1;
        nextIdx = columnsCount - 1;
      }
      setColSpan(false);
    }
  }
  if (nextRowIdx < mainHeaderRowIdx) {
    var nextColumn = columns[nextIdx];
    var parent = nextColumn.parent;
    var nextParentRowIdx = nextRowIdx;
    nextRowIdx = mainHeaderRowIdx;
    while (parent !== undefined) {
      var parentRowIdx = getParentRowIdx(parent);
      if (parentRowIdx >= nextParentRowIdx) {
        nextRowIdx = parentRowIdx;
        nextIdx = parent.idx;
      }
      parent = parent.parent;
    }
  }
  return {
    idx: nextIdx,
    rowIdx: nextRowIdx
  };
}
function canExitGrid(_ref4) {
  var maxColIdx = _ref4.maxColIdx,
    minRowIdx = _ref4.minRowIdx,
    maxRowIdx = _ref4.maxRowIdx,
    _ref4$selectedPositio = _ref4.selectedPosition,
    rowIdx = _ref4$selectedPositio.rowIdx,
    idx = _ref4$selectedPositio.idx,
    shiftKey = _ref4.shiftKey;
  var atLastCellInRow = idx === maxColIdx;
  var atFirstCellInRow = idx === 0;
  var atLastRow = rowIdx === maxRowIdx;
  var atFirstRow = rowIdx === minRowIdx;
  return shiftKey ? atFirstCellInRow && atFirstRow : atLastCellInRow && atLastRow;
}

var cell = "cj343x07-0-0-beta-41";
var cellClassname = "rdg-cell " + cell;
var cellFrozen = "csofj7r7-0-0-beta-41";
var cellFrozenClassname = "rdg-cell-frozen " + cellFrozen;
var cellFrozenLast = "ch2wcw87-0-0-beta-41";
var cellFrozenLastClassname = "rdg-cell-frozen-last " + cellFrozenLast;

function getRowStyle(rowIdx, height) {
  if (height !== undefined) {
    return {
      '--rdg-grid-row-start': rowIdx,
      '--rdg-row-height': height + "px"
    };
  }
  return {
    '--rdg-grid-row-start': rowIdx
  };
}
function getHeaderCellStyle(column, rowIdx, rowSpan) {
  var gridRowEnd = rowIdx + 1;
  var paddingBlockStart = "calc(" + (rowSpan - 1) + " * var(--rdg-header-row-height))";
  if (column.parent === undefined) {
    return {
      insetBlockStart: 0,
      gridRowStart: 1,
      gridRowEnd: gridRowEnd,
      paddingBlockStart: paddingBlockStart
    };
  }
  return {
    insetBlockStart: "calc(" + (rowIdx - rowSpan) + " * var(--rdg-header-row-height))",
    gridRowStart: gridRowEnd - rowSpan,
    gridRowEnd: gridRowEnd,
    paddingBlockStart: paddingBlockStart
  };
}
function getCellStyle(column, colSpan) {
  if (colSpan === void 0) {
    colSpan = 1;
  }
  var index = column.idx + 1;
  return {
    gridColumnStart: index,
    gridColumnEnd: index + colSpan,
    insetInlineStart: column.frozen ? "var(--rdg-frozen-left-" + column.idx + ")" : undefined
  };
}
function getCellClassname(column) {
  for (var _len = arguments.length, extraClasses = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    extraClasses[_key - 1] = arguments[_key];
  }
  return clsx.apply(void 0, [cellClassname].concat(extraClasses, [column.frozen && cellFrozenClassname, column.isLastFrozenColumn && cellFrozenLastClassname]));
}

var min = Math.min,
  max = Math.max,
  floor = Math.floor,
  sign = Math.sign,
  abs = Math.abs;
function assertIsValidKeyGetter(keyGetter) {
  if (typeof keyGetter !== 'function') {
    throw new Error('Please specify the rowKeyGetter prop to use selection');
  }
}
function clampColumnWidth(width, _ref) {
  var minWidth = _ref.minWidth,
    maxWidth = _ref.maxWidth;
  width = max(width, minWidth);
  if (typeof maxWidth === 'number' && maxWidth >= minWidth) {
    return min(width, maxWidth);
  }
  return width;
}
function getHeaderCellRowSpan(column, rowIdx) {
  return column.parent === undefined ? rowIdx : column.level - column.parent.level;
}

var _excluded$5 = ["onChange"];
var checkboxLabel = "c1bn88vv7-0-0-beta-41";
var checkboxLabelClassname = "rdg-checkbox-label " + checkboxLabel;
var checkboxInput = "c1qt073l7-0-0-beta-41";
var checkboxInputClassname = "rdg-checkbox-input " + checkboxInput;
var checkbox = "cf71kmq7-0-0-beta-41";
var checkboxClassname = "rdg-checkbox " + checkbox;
var checkboxLabelDisabled = "c1lwve4p7-0-0-beta-41";
var checkboxLabelDisabledClassname = "rdg-checkbox-label-disabled " + checkboxLabelDisabled;
function renderCheckbox(_ref) {
  var onChange = _ref.onChange,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$5);
  function handleChange(e) {
    onChange(e.target.checked, e.nativeEvent.shiftKey);
  }
  return /*#__PURE__*/React.createElement("label", {
    className: clsx(checkboxLabelClassname, props.disabled && checkboxLabelDisabledClassname)
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, props, {
    className: checkboxInputClassname,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement("div", {
    className: checkboxClassname
  }));
}

var groupCellContent = "g1s9ylgp7-0-0-beta-41";
var groupCellContentClassname = "rdg-group-cell-content " + groupCellContent;
var caret = "cz54e4y7-0-0-beta-41";
var caretClassname = "rdg-caret " + caret;
function renderToggleGroup(props) {
  return /*#__PURE__*/React.createElement(ToggleGroup, props);
}
function ToggleGroup(_ref) {
  var groupKey = _ref.groupKey,
    isExpanded = _ref.isExpanded,
    tabIndex = _ref.tabIndex,
    toggleGroup = _ref.toggleGroup;
  function handleKeyDown(_ref2) {
    var key = _ref2.key;
    if (key === 'Enter') {
      toggleGroup();
    }
  }
  var d = isExpanded ? 'M1 1 L 7 7 L 13 1' : 'M1 7 L 7 1 L 13 7';
  return /*#__PURE__*/React.createElement("span", {
    className: groupCellContentClassname,
    tabIndex: tabIndex,
    onKeyDown: handleKeyDown
  }, groupKey, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 14 8",
    width: "14",
    height: "8",
    className: caretClassname,
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  })));
}

function renderValue(props) {
  try {
    return props.row[props.column.key];
  } catch (_unused) {
    return null;
  }
}

var DataGridDefaultRenderersContext = /*#__PURE__*/createContext(undefined);
var DataGridDefaultRenderersProvider = DataGridDefaultRenderersContext.Provider;
function useDefaultRenderers() {
  return useContext(DataGridDefaultRenderersContext);
}

function SelectCellFormatter(_ref) {
  var value = _ref.value,
    tabIndex = _ref.tabIndex,
    disabled = _ref.disabled,
    onChange = _ref.onChange,
    ariaLabel = _ref['aria-label'],
    ariaLabelledBy = _ref['aria-labelledby'];
  var renderCheckbox = useDefaultRenderers().renderCheckbox;
  return renderCheckbox({
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    tabIndex: tabIndex,
    disabled: disabled,
    checked: value,
    onChange: onChange
  });
}

var RowSelectionContext = /*#__PURE__*/createContext(undefined);
var RowSelectionProvider = RowSelectionContext.Provider;
var RowSelectionChangeContext = /*#__PURE__*/createContext(undefined);
var RowSelectionChangeProvider = RowSelectionChangeContext.Provider;
function useRowSelection() {
  var rowSelectionContext = useContext(RowSelectionContext);
  var rowSelectionChangeContext = useContext(RowSelectionChangeContext);
  if (rowSelectionContext === undefined || rowSelectionChangeContext === undefined) {
    throw new Error('useRowSelection must be used within DataGrid cells');
  }
  return [rowSelectionContext, rowSelectionChangeContext];
}

var SELECT_COLUMN_KEY = 'select-row';
function HeaderRenderer(props) {
  var _useRowSelection = useRowSelection(),
    isRowSelected = _useRowSelection[0],
    onRowSelectionChange = _useRowSelection[1];
  return /*#__PURE__*/React.createElement(SelectCellFormatter, {
    "aria-label": "Select All",
    tabIndex: props.tabIndex,
    value: isRowSelected,
    onChange: function onChange(checked) {
      onRowSelectionChange({
        type: 'HEADER',
        checked: checked
      });
    }
  });
}
function SelectFormatter(props) {
  var _useRowSelection2 = useRowSelection(),
    isRowSelected = _useRowSelection2[0],
    onRowSelectionChange = _useRowSelection2[1];
  return /*#__PURE__*/React.createElement(SelectCellFormatter, {
    "aria-label": "Select",
    tabIndex: props.tabIndex,
    value: isRowSelected,
    onChange: function onChange(checked, isShiftClick) {
      onRowSelectionChange({
        type: 'ROW',
        row: props.row,
        checked: checked,
        isShiftClick: isShiftClick
      });
    }
  });
}
function SelectGroupFormatter(props) {
  var _useRowSelection3 = useRowSelection(),
    isRowSelected = _useRowSelection3[0],
    onRowSelectionChange = _useRowSelection3[1];
  return /*#__PURE__*/React.createElement(SelectCellFormatter, {
    "aria-label": "Select Group",
    tabIndex: props.tabIndex,
    value: isRowSelected,
    onChange: function onChange(checked) {
      onRowSelectionChange({
        type: 'ROW',
        row: props.row,
        checked: checked,
        isShiftClick: false
      });
    }
  });
}
var SelectColumn = {
  key: SELECT_COLUMN_KEY,
  name: '',
  width: 35,
  minWidth: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,
  renderHeaderCell: function renderHeaderCell(props) {
    return /*#__PURE__*/React.createElement(HeaderRenderer, props);
  },
  renderCell: function renderCell(props) {
    return /*#__PURE__*/React.createElement(SelectFormatter, props);
  },
  renderGroupCell: function renderGroupCell(props) {
    return /*#__PURE__*/React.createElement(SelectGroupFormatter, props);
  }
};

function _createForOfIteratorHelperLoose$5(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$5(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }
function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DEFAULT_COLUMN_WIDTH = 'auto';
var DEFAULT_COLUMN_MIN_WIDTH = 50;
function useCalculatedColumns(_ref) {
  var _defaultColumnOptions, _defaultColumnOptions2, _defaultColumnOptions3, _defaultColumnOptions4, _defaultColumnOptions5, _defaultColumnOptions6, _defaultColumnOptions7;
  var rawColumns = _ref.rawColumns,
    defaultColumnOptions = _ref.defaultColumnOptions,
    getColumnWidth = _ref.getColumnWidth,
    viewportWidth = _ref.viewportWidth,
    scrollLeft = _ref.scrollLeft,
    enableVirtualization = _ref.enableVirtualization;
  var defaultWidth = (_defaultColumnOptions = defaultColumnOptions == null ? void 0 : defaultColumnOptions.width) != null ? _defaultColumnOptions : DEFAULT_COLUMN_WIDTH;
  var defaultMinWidth = (_defaultColumnOptions2 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.minWidth) != null ? _defaultColumnOptions2 : DEFAULT_COLUMN_MIN_WIDTH;
  var defaultMaxWidth = (_defaultColumnOptions3 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.maxWidth) != null ? _defaultColumnOptions3 : undefined;
  var defaultCellRenderer = (_defaultColumnOptions4 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.renderCell) != null ? _defaultColumnOptions4 : renderValue;
  var defaultSortable = (_defaultColumnOptions5 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.sortable) != null ? _defaultColumnOptions5 : false;
  var defaultResizable = (_defaultColumnOptions6 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.resizable) != null ? _defaultColumnOptions6 : false;
  var defaultDraggable = (_defaultColumnOptions7 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.draggable) != null ? _defaultColumnOptions7 : false;
  var _useMemo = useMemo(function () {
      var lastFrozenColumnIndex = -1;
      var headerRowsCount = 1;
      var columns = [];
      collectColumns(rawColumns, 1);
      function collectColumns(rawColumns, level, parent) {
        for (var _iterator = _createForOfIteratorHelperLoose$5(rawColumns), _step; !(_step = _iterator()).done;) {
          var _rawColumn$frozen, _rawColumn$width, _rawColumn$minWidth, _rawColumn$maxWidth, _rawColumn$sortable, _rawColumn$resizable, _rawColumn$draggable, _rawColumn$renderCell;
          var rawColumn = _step.value;
          if ('children' in rawColumn) {
            var calculatedColumnParent = {
              name: rawColumn.name,
              parent: parent,
              idx: -1,
              colSpan: 0,
              level: 0,
              headerCellClass: rawColumn.headerCellClass
            };
            collectColumns(rawColumn.children, level + 1, calculatedColumnParent);
            continue;
          }
          var frozen = (_rawColumn$frozen = rawColumn.frozen) != null ? _rawColumn$frozen : false;
          var _column = _extends({}, rawColumn, {
            parent: parent,
            idx: 0,
            level: 0,
            frozen: frozen,
            isLastFrozenColumn: false,
            width: (_rawColumn$width = rawColumn.width) != null ? _rawColumn$width : defaultWidth,
            minWidth: (_rawColumn$minWidth = rawColumn.minWidth) != null ? _rawColumn$minWidth : defaultMinWidth,
            maxWidth: (_rawColumn$maxWidth = rawColumn.maxWidth) != null ? _rawColumn$maxWidth : defaultMaxWidth,
            sortable: (_rawColumn$sortable = rawColumn.sortable) != null ? _rawColumn$sortable : defaultSortable,
            resizable: (_rawColumn$resizable = rawColumn.resizable) != null ? _rawColumn$resizable : defaultResizable,
            draggable: (_rawColumn$draggable = rawColumn.draggable) != null ? _rawColumn$draggable : defaultDraggable,
            renderCell: (_rawColumn$renderCell = rawColumn.renderCell) != null ? _rawColumn$renderCell : defaultCellRenderer
          });
          columns.push(_column);
          if (frozen) {
            lastFrozenColumnIndex++;
          }
          if (level > headerRowsCount) {
            headerRowsCount = level;
          }
        }
      }
      columns.sort(function (_ref2, _ref3) {
        var aKey = _ref2.key,
          frozenA = _ref2.frozen;
        var bKey = _ref3.key,
          frozenB = _ref3.frozen;
        if (aKey === SELECT_COLUMN_KEY) return -1;
        if (bKey === SELECT_COLUMN_KEY) return 1;
        if (frozenA) {
          if (frozenB) return 0;
          return -1;
        }
        if (frozenB) return 1;
        return 0;
      });
      var colSpanColumns = [];
      columns.forEach(function (column, idx) {
        column.idx = idx;
        updateColumnParent(column, idx, 0);
        if (column.colSpan != null) {
          colSpanColumns.push(column);
        }
      });
      if (lastFrozenColumnIndex !== -1) {
        columns[lastFrozenColumnIndex].isLastFrozenColumn = true;
      }
      return {
        columns: columns,
        colSpanColumns: colSpanColumns,
        lastFrozenColumnIndex: lastFrozenColumnIndex,
        headerRowsCount: headerRowsCount
      };
    }, [rawColumns, defaultWidth, defaultMinWidth, defaultMaxWidth, defaultCellRenderer, defaultResizable, defaultSortable, defaultDraggable]),
    columns = _useMemo.columns,
    colSpanColumns = _useMemo.colSpanColumns,
    lastFrozenColumnIndex = _useMemo.lastFrozenColumnIndex,
    headerRowsCount = _useMemo.headerRowsCount;
  var _useMemo2 = useMemo(function () {
      var columnMetrics = new Map();
      var left = 0;
      var totalFrozenColumnWidth = 0;
      var templateColumns = [];
      for (var _iterator2 = _createForOfIteratorHelperLoose$5(columns), _step2; !(_step2 = _iterator2()).done;) {
        var _column3 = _step2.value;
        var width = getColumnWidth(_column3);
        if (typeof width === 'number') {
          width = clampColumnWidth(width, _column3);
        } else {
          width = _column3.minWidth;
        }
        templateColumns.push(width + "px");
        columnMetrics.set(_column3, {
          width: width,
          left: left
        });
        left += width;
      }
      if (lastFrozenColumnIndex !== -1) {
        var columnMetric = columnMetrics.get(columns[lastFrozenColumnIndex]);
        totalFrozenColumnWidth = columnMetric.left + columnMetric.width;
      }
      var layoutCssVars = {};
      for (var i = 0; i <= lastFrozenColumnIndex; i++) {
        var _column2 = columns[i];
        layoutCssVars["--rdg-frozen-left-" + _column2.idx] = columnMetrics.get(_column2).left + "px";
      }
      return {
        templateColumns: templateColumns,
        layoutCssVars: layoutCssVars,
        totalFrozenColumnWidth: totalFrozenColumnWidth,
        columnMetrics: columnMetrics
      };
    }, [getColumnWidth, columns, lastFrozenColumnIndex]),
    templateColumns = _useMemo2.templateColumns,
    layoutCssVars = _useMemo2.layoutCssVars,
    totalFrozenColumnWidth = _useMemo2.totalFrozenColumnWidth,
    columnMetrics = _useMemo2.columnMetrics;
  var _useMemo3 = useMemo(function () {
      if (!enableVirtualization) {
        return [0, columns.length - 1];
      }
      var viewportLeft = scrollLeft + totalFrozenColumnWidth;
      var viewportRight = scrollLeft + viewportWidth;
      var lastColIdx = columns.length - 1;
      var firstUnfrozenColumnIdx = min(lastFrozenColumnIndex + 1, lastColIdx);
      if (viewportLeft >= viewportRight) {
        return [firstUnfrozenColumnIdx, firstUnfrozenColumnIdx];
      }
      var colVisibleStartIdx = firstUnfrozenColumnIdx;
      while (colVisibleStartIdx < lastColIdx) {
        var _ref4 = columnMetrics.get(columns[colVisibleStartIdx]),
          left = _ref4.left,
          width = _ref4.width;
        if (left + width > viewportLeft) {
          break;
        }
        colVisibleStartIdx++;
      }
      var colVisibleEndIdx = colVisibleStartIdx;
      while (colVisibleEndIdx < lastColIdx) {
        var _ref5 = columnMetrics.get(columns[colVisibleEndIdx]),
          _left = _ref5.left,
          _width = _ref5.width;
        if (_left + _width >= viewportRight) {
          break;
        }
        colVisibleEndIdx++;
      }
      var colOverscanStartIdx = max(firstUnfrozenColumnIdx, colVisibleStartIdx - 1);
      var colOverscanEndIdx = min(lastColIdx, colVisibleEndIdx + 1);
      return [colOverscanStartIdx, colOverscanEndIdx];
    }, [columnMetrics, columns, lastFrozenColumnIndex, scrollLeft, totalFrozenColumnWidth, viewportWidth, enableVirtualization]),
    colOverscanStartIdx = _useMemo3[0],
    colOverscanEndIdx = _useMemo3[1];
  return {
    columns: columns,
    colSpanColumns: colSpanColumns,
    colOverscanStartIdx: colOverscanStartIdx,
    colOverscanEndIdx: colOverscanEndIdx,
    templateColumns: templateColumns,
    layoutCssVars: layoutCssVars,
    headerRowsCount: headerRowsCount,
    lastFrozenColumnIndex: lastFrozenColumnIndex,
    totalFrozenColumnWidth: totalFrozenColumnWidth
  };
}
function updateColumnParent(column, index, level) {
  if (level < column.level) {
    column.level = level;
  }
  if (column.parent !== undefined) {
    var parent = column.parent;
    if (parent.idx === -1) {
      parent.idx = index;
    }
    parent.colSpan += 1;
    updateColumnParent(parent, index, level - 1);
  }
}

var useLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect$1;

function _createForOfIteratorHelperLoose$4(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }
function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function useColumnWidths(columns, viewportColumns, templateColumns, gridRef, gridWidth, resizedColumnWidths, measuredColumnWidths, setResizedColumnWidths, setMeasuredColumnWidths, onColumnResize) {
  var prevGridWidthRef = useRef(gridWidth);
  var columnsCanFlex = columns.length === viewportColumns.length;
  var ignorePreviouslyMeasuredColumns = columnsCanFlex && gridWidth !== prevGridWidthRef.current;
  var newTemplateColumns = [].concat(templateColumns);
  var columnsToMeasure = [];
  for (var _iterator = _createForOfIteratorHelperLoose$4(viewportColumns), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
      key = _step$value.key,
      idx = _step$value.idx,
      width = _step$value.width;
    if (typeof width === 'string' && (ignorePreviouslyMeasuredColumns || !measuredColumnWidths.has(key)) && !resizedColumnWidths.has(key)) {
      newTemplateColumns[idx] = width;
      columnsToMeasure.push(key);
    }
  }
  var gridTemplateColumns = newTemplateColumns.join(' ');
  useLayoutEffect(function () {
    prevGridWidthRef.current = gridWidth;
    updateMeasuredWidths(columnsToMeasure);
  });
  function updateMeasuredWidths(columnsToMeasure) {
    if (columnsToMeasure.length === 0) return;
    setMeasuredColumnWidths(function (measuredColumnWidths) {
      var newMeasuredColumnWidths = new Map(measuredColumnWidths);
      var hasChanges = false;
      for (var _iterator2 = _createForOfIteratorHelperLoose$4(columnsToMeasure), _step2; !(_step2 = _iterator2()).done;) {
        var key = _step2.value;
        var measuredWidth = measureColumnWidth(gridRef, key);
        hasChanges || (hasChanges = measuredWidth !== measuredColumnWidths.get(key));
        if (measuredWidth === undefined) {
          newMeasuredColumnWidths["delete"](key);
        } else {
          newMeasuredColumnWidths.set(key, measuredWidth);
        }
      }
      return hasChanges ? newMeasuredColumnWidths : measuredColumnWidths;
    });
  }
  function handleColumnResize(column, nextWidth) {
    var resizingKey = column.key;
    var newTemplateColumns = [].concat(templateColumns);
    var columnsToMeasure = [];
    for (var _iterator3 = _createForOfIteratorHelperLoose$4(viewportColumns), _step3; !(_step3 = _iterator3()).done;) {
      var _step3$value = _step3.value,
        key = _step3$value.key,
        idx = _step3$value.idx,
        width = _step3$value.width;
      if (resizingKey === key) {
        var _width = typeof nextWidth === 'number' ? nextWidth + "px" : nextWidth;
        newTemplateColumns[idx] = _width;
      } else if (columnsCanFlex && typeof width === 'string' && !resizedColumnWidths.has(key)) {
        newTemplateColumns[idx] = width;
        columnsToMeasure.push(key);
      }
    }
    gridRef.current.style.gridTemplateColumns = newTemplateColumns.join(' ');
    var measuredWidth = typeof nextWidth === 'number' ? nextWidth : measureColumnWidth(gridRef, resizingKey);
    flushSync(function () {
      setResizedColumnWidths(function (resizedColumnWidths) {
        var newResizedColumnWidths = new Map(resizedColumnWidths);
        newResizedColumnWidths.set(resizingKey, measuredWidth);
        return newResizedColumnWidths;
      });
      updateMeasuredWidths(columnsToMeasure);
    });
    onColumnResize == null || onColumnResize(column.idx, measuredWidth);
  }
  return {
    gridTemplateColumns: gridTemplateColumns,
    handleColumnResize: handleColumnResize
  };
}
function measureColumnWidth(gridRef, key) {
  var selector = "[data-measuring-cell-key=\"" + CSS.escape(key) + "\"]";
  var measuringCell = gridRef.current.querySelector(selector);
  return measuringCell == null ? void 0 : measuringCell.getBoundingClientRect().width;
}

function useGridDimensions() {
  var gridRef = useRef(null);
  var _useState = useState(1),
    inlineSize = _useState[0],
    setInlineSize = _useState[1];
  var _useState2 = useState(1),
    blockSize = _useState2[0],
    setBlockSize = _useState2[1];
  useLayoutEffect(function () {
    var _window = window,
      ResizeObserver = _window.ResizeObserver;
    if (ResizeObserver == null) return;
    var _ref = gridRef.current,
      clientWidth = _ref.clientWidth,
      clientHeight = _ref.clientHeight,
      offsetWidth = _ref.offsetWidth,
      offsetHeight = _ref.offsetHeight;
    var _getBoundingClientRec = gridRef.current.getBoundingClientRect(),
      width = _getBoundingClientRec.width,
      height = _getBoundingClientRec.height;
    var initialWidth = width - offsetWidth + clientWidth;
    var initialHeight = height - offsetHeight + clientHeight;
    setInlineSize(initialWidth);
    setBlockSize(initialHeight);
    var resizeObserver = new ResizeObserver(function (entries) {
      var size = entries[0].contentBoxSize[0];
      flushSync(function () {
        setInlineSize(size.inlineSize);
        setBlockSize(size.blockSize);
      });
    });
    resizeObserver.observe(gridRef.current);
    return function () {
      resizeObserver.disconnect();
    };
  }, []);
  return [gridRef, inlineSize, blockSize];
}

function useLatestFunc(fn) {
  var ref = useRef(fn);
  useEffect(function () {
    ref.current = fn;
  });
  var callbackFn = useCallback(function () {
    ref.current.apply(ref, arguments);
  }, []);
  return fn ? callbackFn : fn;
}

function useRovingTabIndex(isSelected) {
  var _useState = useState(false),
    isChildFocused = _useState[0],
    setIsChildFocused = _useState[1];
  if (isChildFocused && !isSelected) {
    setIsChildFocused(false);
  }
  function onFocus(event) {
    if (event.target !== event.currentTarget) {
      setIsChildFocused(true);
    }
  }
  var isFocusable = isSelected && !isChildFocused;
  return {
    tabIndex: isFocusable ? 0 : -1,
    childTabIndex: isSelected ? 0 : -1,
    onFocus: isSelected ? onFocus : undefined
  };
}

function _createForOfIteratorHelperLoose$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }
function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function useViewportColumns(_ref) {
  var columns = _ref.columns,
    colSpanColumns = _ref.colSpanColumns,
    rows = _ref.rows,
    topSummaryRows = _ref.topSummaryRows,
    bottomSummaryRows = _ref.bottomSummaryRows,
    colOverscanStartIdx = _ref.colOverscanStartIdx,
    colOverscanEndIdx = _ref.colOverscanEndIdx,
    lastFrozenColumnIndex = _ref.lastFrozenColumnIndex,
    rowOverscanStartIdx = _ref.rowOverscanStartIdx,
    rowOverscanEndIdx = _ref.rowOverscanEndIdx;
  var startIdx = useMemo(function () {
    if (colOverscanStartIdx === 0) return 0;
    var startIdx = colOverscanStartIdx;
    var updateStartIdx = function updateStartIdx(colIdx, colSpan) {
      if (colSpan !== undefined && colIdx + colSpan > colOverscanStartIdx) {
        startIdx = colIdx;
        return true;
      }
      return false;
    };
    for (var _iterator = _createForOfIteratorHelperLoose$3(colSpanColumns), _step; !(_step = _iterator()).done;) {
      var column = _step.value;
      var colIdx = column.idx;
      if (colIdx >= startIdx) break;
      if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
        type: 'HEADER'
      }))) {
        break;
      }
      for (var rowIdx = rowOverscanStartIdx; rowIdx <= rowOverscanEndIdx; rowIdx++) {
        var row = rows[rowIdx];
        if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
          type: 'ROW',
          row: row
        }))) {
          break;
        }
      }
      if (topSummaryRows != null) {
        for (var _iterator2 = _createForOfIteratorHelperLoose$3(topSummaryRows), _step2; !(_step2 = _iterator2()).done;) {
          var _row = _step2.value;
          if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
            type: 'SUMMARY',
            row: _row
          }))) {
            break;
          }
        }
      }
      if (bottomSummaryRows != null) {
        for (var _iterator3 = _createForOfIteratorHelperLoose$3(bottomSummaryRows), _step3; !(_step3 = _iterator3()).done;) {
          var _row2 = _step3.value;
          if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
            type: 'SUMMARY',
            row: _row2
          }))) {
            break;
          }
        }
      }
    }
    return startIdx;
  }, [rowOverscanStartIdx, rowOverscanEndIdx, rows, topSummaryRows, bottomSummaryRows, colOverscanStartIdx, lastFrozenColumnIndex, colSpanColumns]);
  return useMemo(function () {
    var viewportColumns = [];
    for (var colIdx = 0; colIdx <= colOverscanEndIdx; colIdx++) {
      var column = columns[colIdx];
      if (colIdx < startIdx && !column.frozen) continue;
      viewportColumns.push(column);
    }
    return viewportColumns;
  }, [startIdx, colOverscanEndIdx, columns]);
}

function useViewportRows(_ref) {
  var rows = _ref.rows,
    rowHeight = _ref.rowHeight,
    clientHeight = _ref.clientHeight,
    scrollTop = _ref.scrollTop,
    enableVirtualization = _ref.enableVirtualization;
  var _useMemo = useMemo(function () {
      if (typeof rowHeight === 'number') {
        return {
          totalRowHeight: rowHeight * rows.length,
          gridTemplateRows: " repeat(" + rows.length + ", " + rowHeight + "px)",
          getRowTop: function getRowTop(rowIdx) {
            return rowIdx * rowHeight;
          },
          getRowHeight: function getRowHeight() {
            return rowHeight;
          },
          findRowIdx: function findRowIdx(offset) {
            return floor(offset / rowHeight);
          }
        };
      }
      var totalRowHeight = 0;
      var gridTemplateRows = ' ';
      var rowPositions = rows.map(function (row) {
        var currentRowHeight = rowHeight(row);
        var position = {
          top: totalRowHeight,
          height: currentRowHeight
        };
        gridTemplateRows += currentRowHeight + "px ";
        totalRowHeight += currentRowHeight;
        return position;
      });
      var validateRowIdx = function validateRowIdx(rowIdx) {
        return max(0, min(rows.length - 1, rowIdx));
      };
      return {
        totalRowHeight: totalRowHeight,
        gridTemplateRows: gridTemplateRows,
        getRowTop: function getRowTop(rowIdx) {
          return rowPositions[validateRowIdx(rowIdx)].top;
        },
        getRowHeight: function getRowHeight(rowIdx) {
          return rowPositions[validateRowIdx(rowIdx)].height;
        },
        findRowIdx: function findRowIdx(offset) {
          var start = 0;
          var end = rowPositions.length - 1;
          while (start <= end) {
            var middle = start + floor((end - start) / 2);
            var currentOffset = rowPositions[middle].top;
            if (currentOffset === offset) return middle;
            if (currentOffset < offset) {
              start = middle + 1;
            } else if (currentOffset > offset) {
              end = middle - 1;
            }
            if (start > end) return end;
          }
          return 0;
        }
      };
    }, [rowHeight, rows]),
    totalRowHeight = _useMemo.totalRowHeight,
    gridTemplateRows = _useMemo.gridTemplateRows,
    getRowTop = _useMemo.getRowTop,
    getRowHeight = _useMemo.getRowHeight,
    findRowIdx = _useMemo.findRowIdx;
  var rowOverscanStartIdx = 0;
  var rowOverscanEndIdx = rows.length - 1;
  if (enableVirtualization) {
    var overscanThreshold = 4;
    var rowVisibleStartIdx = findRowIdx(scrollTop);
    var rowVisibleEndIdx = findRowIdx(scrollTop + clientHeight);
    rowOverscanStartIdx = max(0, rowVisibleStartIdx - overscanThreshold);
    rowOverscanEndIdx = min(rows.length - 1, rowVisibleEndIdx + overscanThreshold);
  }
  return {
    rowOverscanStartIdx: rowOverscanStartIdx,
    rowOverscanEndIdx: rowOverscanEndIdx,
    totalRowHeight: totalRowHeight,
    gridTemplateRows: gridTemplateRows,
    getRowTop: getRowTop,
    getRowHeight: getRowHeight,
    findRowIdx: findRowIdx
  };
}

var _excluded$4 = ["insetInlineStart"];
var cellDragHandle = "c1w9bbhr7-0-0-beta-41";
var cellDragHandleFrozenClassname = "c1creorc7-0-0-beta-41";
var cellDragHandleClassname = "rdg-cell-drag-handle " + cellDragHandle;
function DragHandle(_ref) {
  var gridRowStart = _ref.gridRowStart,
    rows = _ref.rows,
    column = _ref.column,
    columnWidth = _ref.columnWidth,
    maxColIdx = _ref.maxColIdx,
    isLastRow = _ref.isLastRow,
    selectedPosition = _ref.selectedPosition,
    latestDraggedOverRowIdx = _ref.latestDraggedOverRowIdx,
    isCellEditable = _ref.isCellEditable,
    onRowsChange = _ref.onRowsChange,
    onFill = _ref.onFill,
    onClick = _ref.onClick,
    setDragging = _ref.setDragging,
    setDraggedOverRowIdx = _ref.setDraggedOverRowIdx;
  var idx = selectedPosition.idx,
    rowIdx = selectedPosition.rowIdx;
  function handleMouseDown(event) {
    event.preventDefault();
    if (event.buttons !== 1) return;
    setDragging(true);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseup', onMouseUp);
    function onMouseOver(event) {
      if (event.buttons !== 1) onMouseUp();
    }
    function onMouseUp() {
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseup', onMouseUp);
      setDragging(false);
      handleDragEnd();
    }
  }
  function handleDragEnd() {
    var overRowIdx = latestDraggedOverRowIdx.current;
    if (overRowIdx === undefined) return;
    var startRowIndex = rowIdx < overRowIdx ? rowIdx + 1 : overRowIdx;
    var endRowIndex = rowIdx < overRowIdx ? overRowIdx + 1 : rowIdx;
    updateRows(startRowIndex, endRowIndex);
    setDraggedOverRowIdx(undefined);
  }
  function handleDoubleClick(event) {
    event.stopPropagation();
    updateRows(rowIdx + 1, rows.length);
  }
  function updateRows(startRowIdx, endRowIdx) {
    var sourceRow = rows[rowIdx];
    var updatedRows = [].concat(rows);
    var indexes = [];
    for (var i = startRowIdx; i < endRowIdx; i++) {
      if (isCellEditable({
        rowIdx: i,
        idx: idx
      })) {
        var updatedRow = onFill({
          columnKey: column.key,
          sourceRow: sourceRow,
          targetRow: rows[i]
        });
        if (updatedRow !== rows[i]) {
          updatedRows[i] = updatedRow;
          indexes.push(i);
        }
      }
    }
    if (indexes.length > 0) {
      onRowsChange == null || onRowsChange(updatedRows, {
        indexes: indexes,
        column: column
      });
    }
  }
  function getStyle() {
    var _column$colSpan;
    var colSpan = (_column$colSpan = column.colSpan == null ? void 0 : column.colSpan({
      type: 'ROW',
      row: rows[rowIdx]
    })) != null ? _column$colSpan : 1;
    var _getCellStyle = getCellStyle(column, colSpan),
      insetInlineStart = _getCellStyle.insetInlineStart,
      style = _objectWithoutPropertiesLoose(_getCellStyle, _excluded$4);
    var marginEnd = 'calc(var(--rdg-drag-handle-size) * -0.5 + 1px)';
    var isLastColumn = column.idx + colSpan - 1 === maxColIdx;
    return _extends({}, style, {
      gridRowStart: gridRowStart,
      marginInlineEnd: isLastColumn ? undefined : marginEnd,
      marginBlockEnd: isLastRow ? undefined : marginEnd,
      insetInlineStart: insetInlineStart ? "calc(" + insetInlineStart + " + " + columnWidth + "px + var(--rdg-drag-handle-size) * -0.5 - 1px)" : undefined
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: getStyle(),
    className: clsx(cellDragHandleClassname, column.frozen && cellDragHandleFrozenClassname),
    onClick: onClick,
    onMouseDown: handleMouseDown,
    onDoubleClick: handleDoubleClick
  });
}

var cellEditing = "cis5rrm7-0-0-beta-41";
function EditCell(_ref) {
  var _column$editorOptions, _column$editorOptions2, _column$editorOptions3;
  var column = _ref.column,
    colSpan = _ref.colSpan,
    row = _ref.row,
    rowIdx = _ref.rowIdx,
    onRowChange = _ref.onRowChange,
    closeEditor = _ref.closeEditor,
    onKeyDown = _ref.onKeyDown,
    _navigate = _ref.navigate;
  var frameRequestRef = useRef();
  var commitOnOutsideClick = ((_column$editorOptions = column.editorOptions) == null ? void 0 : _column$editorOptions.commitOnOutsideClick) !== false;
  var commitOnOutsideMouseDown = useLatestFunc(function () {
    onClose(true, false);
  });
  useEffect(function () {
    if (!commitOnOutsideClick) return;
    function onWindowCaptureMouseDown() {
      frameRequestRef.current = requestAnimationFrame(commitOnOutsideMouseDown);
    }
    addEventListener('mousedown', onWindowCaptureMouseDown, {
      capture: true
    });
    return function () {
      removeEventListener('mousedown', onWindowCaptureMouseDown, {
        capture: true
      });
      cancelFrameRequest();
    };
  }, [commitOnOutsideClick, commitOnOutsideMouseDown]);
  function cancelFrameRequest() {
    cancelAnimationFrame(frameRequestRef.current);
  }
  function handleKeyDown(event) {
    if (onKeyDown) {
      var cellEvent = createCellEvent(event);
      onKeyDown({
        mode: 'EDIT',
        row: row,
        column: column,
        rowIdx: rowIdx,
        navigate: function navigate() {
          _navigate(event);
        },
        onClose: onClose
      }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Enter') {
      onClose(true);
    } else if (onEditorNavigation(event)) {
      _navigate(event);
    }
  }
  function onClose(commitChanges, shouldFocusCell) {
    if (commitChanges === void 0) {
      commitChanges = false;
    }
    if (shouldFocusCell === void 0) {
      shouldFocusCell = true;
    }
    if (commitChanges) {
      onRowChange(row, true, shouldFocusCell);
    } else {
      closeEditor(shouldFocusCell);
    }
  }
  function onEditorRowChange(row, commitChangesAndFocus) {
    if (commitChangesAndFocus === void 0) {
      commitChangesAndFocus = false;
    }
    onRowChange(row, commitChangesAndFocus, commitChangesAndFocus);
  }
  var cellClass = column.cellClass;
  var className = getCellClassname(column, 'rdg-editor-container', typeof cellClass === 'function' ? cellClass(row) : cellClass, !((_column$editorOptions2 = column.editorOptions) != null && _column$editorOptions2.displayCellContent) && cellEditing);
  return /*#__PURE__*/React.createElement("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    "aria-selected": true,
    className: className,
    style: getCellStyle(column, colSpan),
    onKeyDown: handleKeyDown,
    onMouseDownCapture: cancelFrameRequest
  }, column.renderEditCell != null && /*#__PURE__*/React.createElement(React.Fragment, null, column.renderEditCell({
    column: column,
    row: row,
    onRowChange: onEditorRowChange,
    onClose: onClose
  }), ((_column$editorOptions3 = column.editorOptions) == null ? void 0 : _column$editorOptions3.displayCellContent) && column.renderCell({
    column: column,
    row: row,
    rowIdx: rowIdx,
    isCellEditable: true,
    tabIndex: -1,
    onRowChange: onEditorRowChange
  })));
}

function GroupedColumnHeaderCell(_ref) {
  var column = _ref.column,
    rowIdx = _ref.rowIdx,
    isCellSelected = _ref.isCellSelected,
    selectCell = _ref.selectCell;
  var _useRovingTabIndex = useRovingTabIndex(isCellSelected),
    tabIndex = _useRovingTabIndex.tabIndex,
    onFocus = _useRovingTabIndex.onFocus;
  var colSpan = column.colSpan;
  var rowSpan = getHeaderCellRowSpan(column, rowIdx);
  var index = column.idx + 1;
  function onClick() {
    selectCell({
      idx: column.idx,
      rowIdx: rowIdx
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "columnheader",
    "aria-colindex": index,
    "aria-colspan": colSpan,
    "aria-rowspan": rowSpan,
    "aria-selected": isCellSelected,
    tabIndex: tabIndex,
    className: clsx(cellClassname, column.headerCellClass),
    style: _extends({}, getHeaderCellStyle(column, rowIdx, rowSpan), {
      gridColumnStart: index,
      gridColumnEnd: index + colSpan
    }),
    onFocus: onFocus,
    onClick: onClick
  }, column.name);
}

var headerSortCellClassname = "h44jtk67-0-0-beta-41";
var headerSortName = "hcgkhxz7-0-0-beta-41";
var headerSortNameClassname = "rdg-header-sort-name " + headerSortName;
function renderHeaderCell(_ref) {
  var column = _ref.column,
    sortDirection = _ref.sortDirection,
    priority = _ref.priority;
  if (!column.sortable) return column.name;
  return /*#__PURE__*/React.createElement(SortableHeaderCell, {
    sortDirection: sortDirection,
    priority: priority
  }, column.name);
}
function SortableHeaderCell(_ref2) {
  var sortDirection = _ref2.sortDirection,
    priority = _ref2.priority,
    children = _ref2.children;
  var renderSortStatus = useDefaultRenderers().renderSortStatus;
  return /*#__PURE__*/React.createElement("span", {
    className: headerSortCellClassname
  }, /*#__PURE__*/React.createElement("span", {
    className: headerSortNameClassname
  }, children), /*#__PURE__*/React.createElement("span", null, renderSortStatus({
    sortDirection: sortDirection,
    priority: priority
  })));
}

var cellSortableClassname = "c6l2wv17-0-0-beta-41";
var cellResizable = "c1kqdw7y7-0-0-beta-41";
var cellResizableClassname = "rdg-cell-resizable " + cellResizable;
var resizeHandleClassname = "r1y6ywlx7-0-0-beta-41";
var cellDraggableClassname = 'rdg-cell-draggable';
var cellDragging = "c1bezg5o7-0-0-beta-41";
var cellDraggingClassname = "rdg-cell-dragging " + cellDragging;
var cellOver = "c1vc96037-0-0-beta-41";
var cellOverClassname = "rdg-cell-drag-over " + cellOver;
function HeaderCell(_ref) {
  var _column$renderHeaderC;
  var column = _ref.column,
    colSpan = _ref.colSpan,
    rowIdx = _ref.rowIdx,
    isCellSelected = _ref.isCellSelected,
    onColumnResize = _ref.onColumnResize,
    onColumnsReorder = _ref.onColumnsReorder,
    sortColumns = _ref.sortColumns,
    onSortColumnsChange = _ref.onSortColumnsChange,
    selectCell = _ref.selectCell,
    shouldFocusGrid = _ref.shouldFocusGrid,
    direction = _ref.direction,
    dragDropKey = _ref.dragDropKey;
  var _useState = useState(false),
    isDragging = _useState[0],
    setIsDragging = _useState[1];
  var _useState2 = useState(false),
    isOver = _useState2[0],
    setIsOver = _useState2[1];
  var isRtl = direction === 'rtl';
  var rowSpan = getHeaderCellRowSpan(column, rowIdx);
  var _useRovingTabIndex = useRovingTabIndex(isCellSelected),
    tabIndex = _useRovingTabIndex.tabIndex,
    childTabIndex = _useRovingTabIndex.childTabIndex,
    onFocus = _useRovingTabIndex.onFocus;
  var sortIndex = sortColumns == null ? void 0 : sortColumns.findIndex(function (sort) {
    return sort.columnKey === column.key;
  });
  var sortColumn = sortIndex !== undefined && sortIndex > -1 ? sortColumns[sortIndex] : undefined;
  var sortDirection = sortColumn == null ? void 0 : sortColumn.direction;
  var priority = sortColumn !== undefined && sortColumns.length > 1 ? sortIndex + 1 : undefined;
  var ariaSort = sortDirection && !priority ? sortDirection === 'ASC' ? 'ascending' : 'descending' : undefined;
  var sortable = column.sortable,
    resizable = column.resizable,
    draggable = column.draggable;
  var className = getCellClassname(column, column.headerCellClass, sortable && cellSortableClassname, resizable && cellResizableClassname, draggable && cellDraggableClassname, isDragging && cellDraggingClassname, isOver && cellOverClassname);
  var renderHeaderCell$1 = (_column$renderHeaderC = column.renderHeaderCell) != null ? _column$renderHeaderC : renderHeaderCell;
  function onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.buttons !== 1) {
      return;
    }
    event.preventDefault();
    var currentTarget = event.currentTarget,
      pointerId = event.pointerId;
    var headerCell = currentTarget.parentElement;
    var _headerCell$getBoundi = headerCell.getBoundingClientRect(),
      right = _headerCell$getBoundi.right,
      left = _headerCell$getBoundi.left;
    var offset = isRtl ? event.clientX - left : right - event.clientX;
    function onPointerMove(event) {
      var _headerCell$getBoundi2 = headerCell.getBoundingClientRect(),
        right = _headerCell$getBoundi2.right,
        left = _headerCell$getBoundi2.left;
      var width = isRtl ? right + offset - event.clientX : event.clientX + offset - left;
      if (width > 0) {
        onColumnResize(column, clampColumnWidth(width, column));
      }
    }
    function onLostPointerCapture() {
      currentTarget.removeEventListener('pointermove', onPointerMove);
      currentTarget.removeEventListener('lostpointercapture', onLostPointerCapture);
    }
    currentTarget.setPointerCapture(pointerId);
    currentTarget.addEventListener('pointermove', onPointerMove);
    currentTarget.addEventListener('lostpointercapture', onLostPointerCapture);
  }
  function onSort(ctrlClick) {
    if (onSortColumnsChange == null) return;
    var sortDescendingFirst = column.sortDescendingFirst;
    if (sortColumn === undefined) {
      var nextSort = {
        columnKey: column.key,
        direction: sortDescendingFirst ? 'DESC' : 'ASC'
      };
      onSortColumnsChange(sortColumns && ctrlClick ? [].concat(sortColumns, [nextSort]) : [nextSort]);
    } else {
      var nextSortColumn;
      if (sortDescendingFirst === true && sortDirection === 'DESC' || sortDescendingFirst !== true && sortDirection === 'ASC') {
        nextSortColumn = {
          columnKey: column.key,
          direction: sortDirection === 'ASC' ? 'DESC' : 'ASC'
        };
      }
      if (ctrlClick) {
        var nextSortColumns = [].concat(sortColumns);
        if (nextSortColumn) {
          nextSortColumns[sortIndex] = nextSortColumn;
        } else {
          nextSortColumns.splice(sortIndex, 1);
        }
        onSortColumnsChange(nextSortColumns);
      } else {
        onSortColumnsChange(nextSortColumn ? [nextSortColumn] : []);
      }
    }
  }
  function onClick(event) {
    selectCell({
      idx: column.idx,
      rowIdx: rowIdx
    });
    if (sortable) {
      onSort(event.ctrlKey || event.metaKey);
    }
  }
  function onDoubleClick() {
    onColumnResize(column, 'max-content');
  }
  function handleFocus(event) {
    onFocus == null || onFocus(event);
    if (shouldFocusGrid) {
      selectCell({
        idx: 0,
        rowIdx: rowIdx
      });
    }
  }
  function onKeyDown(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey);
    }
  }
  function onDragStart(event) {
    event.dataTransfer.setData(dragDropKey, column.key);
    event.dataTransfer.dropEffect = 'move';
    setIsDragging(true);
  }
  function onDragEnd() {
    setIsDragging(false);
  }
  function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }
  function onDrop(event) {
    setIsOver(false);
    if (event.dataTransfer.types.includes(dragDropKey)) {
      var sourceKey = event.dataTransfer.getData(dragDropKey);
      if (sourceKey !== column.key) {
        event.preventDefault();
        onColumnsReorder == null || onColumnsReorder(sourceKey, column.key);
      }
    }
  }
  function onDragEnter(event) {
    if (isEventPertinent(event)) {
      setIsOver(true);
    }
  }
  function onDragLeave(event) {
    if (isEventPertinent(event)) {
      setIsOver(false);
    }
  }
  var draggableProps;
  if (draggable) {
    draggableProps = {
      draggable: true,
      onDragStart: onDragStart,
      onDragEnd: onDragEnd,
      onDragOver: onDragOver,
      onDragEnter: onDragEnter,
      onDragLeave: onDragLeave,
      onDrop: onDrop
    };
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "columnheader",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    "aria-rowspan": rowSpan,
    "aria-selected": isCellSelected,
    "aria-sort": ariaSort,
    tabIndex: shouldFocusGrid ? 0 : tabIndex,
    className: className,
    style: _extends({}, getHeaderCellStyle(column, rowIdx, rowSpan), getCellStyle(column, colSpan)),
    onFocus: handleFocus,
    onClick: onClick,
    onKeyDown: sortable ? onKeyDown : undefined
  }, draggableProps), renderHeaderCell$1({
    column: column,
    sortDirection: sortDirection,
    priority: priority,
    tabIndex: childTabIndex
  }), resizable && /*#__PURE__*/React.createElement("div", {
    className: resizeHandleClassname,
    onClick: stopPropagation,
    onDoubleClick: onDoubleClick,
    onPointerDown: onPointerDown
  }));
}
function isEventPertinent(event) {
  var relatedTarget = event.relatedTarget;
  return !event.currentTarget.contains(relatedTarget);
}

var row = "r1upfr807-0-0-beta-41";
var rowClassname = "rdg-row " + row;
var rowSelected = "r190mhd37-0-0-beta-41";
var rowSelectedClassname = 'rdg-row-selected';
var rowSelectedWithFrozenCell = "r139qu9m7-0-0-beta-41";

var headerRow = "h10tskcx7-0-0-beta-41";
var headerRowClassname = "rdg-header-row " + headerRow;
function HeaderRow(_ref) {
  var rowIdx = _ref.rowIdx,
    columns = _ref.columns,
    onColumnResize = _ref.onColumnResize,
    onColumnsReorder = _ref.onColumnsReorder,
    sortColumns = _ref.sortColumns,
    onSortColumnsChange = _ref.onSortColumnsChange,
    lastFrozenColumnIndex = _ref.lastFrozenColumnIndex,
    selectedCellIdx = _ref.selectedCellIdx,
    selectCell = _ref.selectCell,
    shouldFocusGrid = _ref.shouldFocusGrid,
    direction = _ref.direction;
  var dragDropKey = _.uniqueId();
  var cells = [];
  for (var index = 0; index < columns.length; index++) {
    var _column = columns[index];
    var colSpan = getColSpan(_column, lastFrozenColumnIndex, {
      type: 'HEADER'
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    cells.push( /*#__PURE__*/React.createElement(HeaderCell, {
      key: _column.key,
      column: _column,
      colSpan: colSpan,
      rowIdx: rowIdx,
      isCellSelected: selectedCellIdx === _column.idx,
      onColumnResize: onColumnResize,
      onColumnsReorder: onColumnsReorder,
      onSortColumnsChange: onSortColumnsChange,
      sortColumns: sortColumns,
      selectCell: selectCell,
      shouldFocusGrid: shouldFocusGrid && index === 0,
      direction: direction,
      dragDropKey: dragDropKey
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "row",
    "aria-rowindex": rowIdx,
    className: clsx(headerRowClassname, selectedCellIdx === -1 && rowSelectedClassname)
  }, cells);
}
const HeaderRow$1 = /*#__PURE__*/memo(HeaderRow);

function _createForOfIteratorHelperLoose$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }
function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function GroupedColumnHeaderRow(_ref) {
  var rowIdx = _ref.rowIdx,
    level = _ref.level,
    columns = _ref.columns,
    selectedCellIdx = _ref.selectedCellIdx,
    selectCell = _ref.selectCell;
  var cells = [];
  var renderedParents = new Set();
  for (var _iterator = _createForOfIteratorHelperLoose$2(columns), _step; !(_step = _iterator()).done;) {
    var column = _step.value;
    var parent = column.parent;
    if (parent === undefined) continue;
    while (parent.level > level) {
      if (parent.parent === undefined) break;
      parent = parent.parent;
    }
    if (parent.level === level && !renderedParents.has(parent)) {
      renderedParents.add(parent);
      var _parent = parent,
        idx = _parent.idx;
      cells.push( /*#__PURE__*/React.createElement(GroupedColumnHeaderCell, {
        key: idx,
        column: parent,
        rowIdx: rowIdx,
        isCellSelected: selectedCellIdx === idx,
        selectCell: selectCell
      }));
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "row",
    "aria-rowindex": rowIdx,
    className: headerRowClassname
  }, cells);
}
const GroupedColumnHeaderRow$1 = /*#__PURE__*/memo(GroupedColumnHeaderRow);

var _excluded$3 = ["column", "colSpan", "isCellSelected", "isCopied", "isDraggedOver", "row", "rowIdx", "onClick", "onDoubleClick", "onContextMenu", "onRowChange", "selectCell"];
var cellCopied = "c6ra8a37-0-0-beta-41";
var cellCopiedClassname = "rdg-cell-copied " + cellCopied;
var cellDraggedOver = "cq910m07-0-0-beta-41";
var cellDraggedOverClassname = "rdg-cell-dragged-over " + cellDraggedOver;
function Cell(_ref) {
  var column = _ref.column,
    colSpan = _ref.colSpan,
    isCellSelected = _ref.isCellSelected,
    isCopied = _ref.isCopied,
    isDraggedOver = _ref.isDraggedOver,
    row = _ref.row,
    rowIdx = _ref.rowIdx,
    onClick = _ref.onClick,
    onDoubleClick = _ref.onDoubleClick,
    onContextMenu = _ref.onContextMenu,
    onRowChange = _ref.onRowChange,
    selectCell = _ref.selectCell,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$3);
  var _useRovingTabIndex = useRovingTabIndex(isCellSelected),
    tabIndex = _useRovingTabIndex.tabIndex,
    childTabIndex = _useRovingTabIndex.childTabIndex,
    onFocus = _useRovingTabIndex.onFocus;
  var cellClass = column.cellClass;
  var className = getCellClassname(column, typeof cellClass === 'function' ? cellClass(row) : cellClass, isCopied && cellCopiedClassname, isDraggedOver && cellDraggedOverClassname);
  var isEditable = isCellEditableUtil(column, row);
  function selectCellWrapper(openEditor) {
    selectCell({
      rowIdx: rowIdx,
      idx: column.idx
    }, openEditor);
  }
  function handleClick(event) {
    if (onClick) {
      var cellEvent = createCellEvent(event);
      onClick({
        row: row,
        column: column,
        selectCell: selectCellWrapper
      }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper();
  }
  function handleContextMenu(event) {
    if (onContextMenu) {
      var cellEvent = createCellEvent(event);
      onContextMenu({
        row: row,
        column: column,
        selectCell: selectCellWrapper
      }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper();
  }
  function handleDoubleClick(event) {
    if (onDoubleClick) {
      var cellEvent = createCellEvent(event);
      onDoubleClick({
        row: row,
        column: column,
        selectCell: selectCellWrapper
      }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper(true);
  }
  function handleRowChange(newRow) {
    onRowChange(column, newRow);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    "aria-selected": isCellSelected,
    "aria-readonly": !isEditable || undefined,
    tabIndex: tabIndex,
    className: className,
    style: getCellStyle(column, colSpan),
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onContextMenu: handleContextMenu,
    onFocus: onFocus
  }, props), column.renderCell({
    column: column,
    row: row,
    rowIdx: rowIdx,
    isCellEditable: isEditable,
    tabIndex: childTabIndex,
    onRowChange: handleRowChange
  }));
}
const Cell$1 = /*#__PURE__*/memo(Cell);

var _excluded$2 = ["className", "rowIdx", "gridRowStart", "height", "selectedCellIdx", "isRowSelected", "copiedCellIdx", "draggedOverCellIdx", "lastFrozenColumnIndex", "row", "viewportColumns", "selectedCellEditor", "onCellClick", "onCellDoubleClick", "onCellContextMenu", "rowClass", "setDraggedOverRowIdx", "onMouseEnter", "onRowChange", "selectCell"];
function Row(_ref, ref) {
  var className = _ref.className,
    rowIdx = _ref.rowIdx,
    gridRowStart = _ref.gridRowStart,
    height = _ref.height,
    selectedCellIdx = _ref.selectedCellIdx,
    isRowSelected = _ref.isRowSelected,
    copiedCellIdx = _ref.copiedCellIdx,
    draggedOverCellIdx = _ref.draggedOverCellIdx,
    lastFrozenColumnIndex = _ref.lastFrozenColumnIndex,
    row = _ref.row,
    viewportColumns = _ref.viewportColumns,
    selectedCellEditor = _ref.selectedCellEditor,
    onCellClick = _ref.onCellClick,
    onCellDoubleClick = _ref.onCellDoubleClick,
    onCellContextMenu = _ref.onCellContextMenu,
    rowClass = _ref.rowClass,
    setDraggedOverRowIdx = _ref.setDraggedOverRowIdx,
    onMouseEnter = _ref.onMouseEnter,
    onRowChange = _ref.onRowChange,
    selectCell = _ref.selectCell,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  var handleRowChange = useLatestFunc(function (column, newRow) {
    onRowChange(column, rowIdx, newRow);
  });
  function handleDragEnter(event) {
    setDraggedOverRowIdx == null || setDraggedOverRowIdx(rowIdx);
    onMouseEnter == null || onMouseEnter(event);
  }
  className = clsx(rowClassname, "rdg-row-" + (rowIdx % 2 === 0 ? 'even' : 'odd'), rowClass == null ? void 0 : rowClass(row, rowIdx), className, selectedCellIdx === -1 && rowSelectedClassname);
  var cells = [];
  for (var index = 0; index < viewportColumns.length; index++) {
    var column = viewportColumns[index];
    var idx = column.idx;
    var colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: 'ROW',
      row: row
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    var isCellSelected = selectedCellIdx === idx;
    if (isCellSelected && selectedCellEditor) {
      cells.push(selectedCellEditor);
    } else {
      cells.push( /*#__PURE__*/React.createElement(Cell$1, {
        key: column.key,
        column: column,
        colSpan: colSpan,
        row: row,
        rowIdx: rowIdx,
        isCopied: copiedCellIdx === idx,
        isDraggedOver: draggedOverCellIdx === idx,
        isCellSelected: isCellSelected,
        onClick: onCellClick,
        onDoubleClick: onCellDoubleClick,
        onContextMenu: onCellContextMenu,
        onRowChange: handleRowChange,
        selectCell: selectCell
      }));
    }
  }
  return /*#__PURE__*/React.createElement(RowSelectionProvider, {
    value: isRowSelected
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "row",
    ref: ref,
    className: className,
    onMouseEnter: handleDragEnter,
    style: getRowStyle(gridRowStart, height)
  }, props), cells));
}
var RowComponent = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(Row));
const RowComponent$1 = RowComponent;
function defaultRenderRow(key, props) {
  return /*#__PURE__*/React.createElement(RowComponent, _extends({
    key: key
  }, props));
}

function ScrollToCell(_ref) {
  var _ref$scrollToPosition = _ref.scrollToPosition,
    idx = _ref$scrollToPosition.idx,
    rowIdx = _ref$scrollToPosition.rowIdx,
    gridElement = _ref.gridElement,
    setScrollToCellPosition = _ref.setScrollToCellPosition;
  var ref = useRef(null);
  useLayoutEffect(function () {
    scrollIntoView(ref.current);
  });
  useLayoutEffect(function () {
    function removeScrollToCell() {
      setScrollToCellPosition(null);
    }
    var observer = new IntersectionObserver(removeScrollToCell, {
      root: gridElement,
      threshold: 1.0
    });
    observer.observe(ref.current);
    return function () {
      observer.disconnect();
    };
  }, [gridElement, setScrollToCellPosition]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      gridColumn: idx === undefined ? '1/-1' : idx + 1,
      gridRow: rowIdx === undefined ? '1/-1' : rowIdx + 2
    }
  });
}

var arrow = "a3ejtar7-0-0-beta-41";
var arrowClassname = "rdg-sort-arrow " + arrow;
function renderSortStatus(_ref) {
  var sortDirection = _ref.sortDirection,
    priority = _ref.priority;
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderSortIcon({
    sortDirection: sortDirection
  }), renderSortPriority({
    priority: priority
  }));
}
function renderSortIcon(_ref2) {
  var sortDirection = _ref2.sortDirection;
  if (sortDirection === undefined) return null;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 12 8",
    width: "12",
    height: "8",
    className: arrowClassname,
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("path", {
    d: sortDirection === 'ASC' ? 'M0 8 6 0 12 8' : 'M0 0 6 8 12 0'
  }));
}
function renderSortPriority(_ref3) {
  var priority = _ref3.priority;
  return priority;
}

var root = "rnvodz57-0-0-beta-41";
var rootClassname = "rdg " + root;
var viewportDragging = "vlqv91k7-0-0-beta-41";
var viewportDraggingClassname = "rdg-viewport-dragging " + viewportDragging;
var focusSinkClassname = "f1lsfrzw7-0-0-beta-41";
var focusSinkHeaderAndSummaryClassname = "f1cte0lg7-0-0-beta-41";

var summaryCellClassname = "s8wc6fl7-0-0-beta-41";
function SummaryCell(_ref) {
  var column = _ref.column,
    colSpan = _ref.colSpan,
    row = _ref.row,
    rowIdx = _ref.rowIdx,
    isCellSelected = _ref.isCellSelected,
    selectCell = _ref.selectCell;
  var _useRovingTabIndex = useRovingTabIndex(isCellSelected),
    tabIndex = _useRovingTabIndex.tabIndex,
    childTabIndex = _useRovingTabIndex.childTabIndex,
    onFocus = _useRovingTabIndex.onFocus;
  var summaryCellClass = column.summaryCellClass;
  var className = getCellClassname(column, summaryCellClassname, typeof summaryCellClass === 'function' ? summaryCellClass(row) : summaryCellClass);
  function onClick() {
    selectCell({
      rowIdx: rowIdx,
      idx: column.idx
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    "aria-selected": isCellSelected,
    tabIndex: tabIndex,
    className: className,
    style: getCellStyle(column, colSpan),
    onClick: onClick,
    onFocus: onFocus
  }, column.renderSummaryCell == null ? void 0 : column.renderSummaryCell({
    column: column,
    row: row,
    tabIndex: childTabIndex
  }));
}
const SummaryCell$1 = /*#__PURE__*/memo(SummaryCell);

var summaryRow = "skuhp557-0-0-beta-41";
var topSummaryRow = "tf8l5ub7-0-0-beta-41";
var topSummaryRowBorderClassname = "tb9ughf7-0-0-beta-41";
var bottomSummaryRowBorderClassname = "b1yssfnt7-0-0-beta-41";
var summaryRowClassname = "rdg-summary-row " + summaryRow;
var topSummaryRowClassname = "rdg-top-summary-row " + topSummaryRow;
function SummaryRow(_ref) {
  var rowIdx = _ref.rowIdx,
    gridRowStart = _ref.gridRowStart,
    row = _ref.row,
    viewportColumns = _ref.viewportColumns,
    top = _ref.top,
    bottom = _ref.bottom,
    lastFrozenColumnIndex = _ref.lastFrozenColumnIndex,
    selectedCellIdx = _ref.selectedCellIdx,
    isTop = _ref.isTop,
    showBorder = _ref.showBorder,
    selectCell = _ref.selectCell,
    ariaRowIndex = _ref['aria-rowindex'];
  var cells = [];
  for (var index = 0; index < viewportColumns.length; index++) {
    var column = viewportColumns[index];
    var colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: 'SUMMARY',
      row: row
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    var isCellSelected = selectedCellIdx === column.idx;
    cells.push( /*#__PURE__*/React.createElement(SummaryCell$1, {
      key: column.key,
      column: column,
      colSpan: colSpan,
      row: row,
      rowIdx: rowIdx,
      isCellSelected: isCellSelected,
      selectCell: selectCell
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "row",
    "aria-rowindex": ariaRowIndex,
    className: clsx(rowClassname, "rdg-row-" + (rowIdx % 2 === 0 ? 'even' : 'odd'), summaryRowClassname, isTop ? [topSummaryRowClassname, showBorder && topSummaryRowBorderClassname] : ['rdg-bottom-summary-row', showBorder && bottomSummaryRowBorderClassname], selectedCellIdx === -1 && rowSelectedClassname),
    style: _extends({}, getRowStyle(gridRowStart), {
      '--rdg-summary-row-top': top !== undefined ? top + "px" : undefined,
      '--rdg-summary-row-bottom': bottom !== undefined ? bottom + "px" : undefined
    })
  }, cells);
}
const SummaryRow$1 = /*#__PURE__*/memo(SummaryRow);

function _createForOfIteratorHelperLoose$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function DataGrid(props, ref) {
  var _ref, _renderers$renderRow, _ref2, _renderers$renderSort, _ref3, _renderers$renderChec, _renderers$noRowsFall, _topSummaryRows$lengt, _bottomSummaryRows$le;
  var rawColumns = props.columns,
    rows = props.rows,
    topSummaryRows = props.topSummaryRows,
    bottomSummaryRows = props.bottomSummaryRows,
    rowKeyGetter = props.rowKeyGetter,
    onRowsChange = props.onRowsChange,
    rawRowHeight = props.rowHeight,
    rawHeaderRowHeight = props.headerRowHeight,
    rawSummaryRowHeight = props.summaryRowHeight,
    selectedRows = props.selectedRows,
    onSelectedRowsChange = props.onSelectedRowsChange,
    sortColumns = props.sortColumns,
    onSortColumnsChange = props.onSortColumnsChange,
    defaultColumnOptions = props.defaultColumnOptions,
    onCellClick = props.onCellClick,
    onCellDoubleClick = props.onCellDoubleClick,
    onCellContextMenu = props.onCellContextMenu,
    onCellKeyDown = props.onCellKeyDown,
    onSelectedCellChange = props.onSelectedCellChange,
    onScroll = props.onScroll,
    onColumnResize = props.onColumnResize,
    onColumnsReorder = props.onColumnsReorder,
    onFill = props.onFill,
    onCopy = props.onCopy,
    onPaste = props.onPaste,
    rawEnableVirtualization = props.enableVirtualization,
    renderers = props.renderers,
    className = props.className,
    style = props.style,
    rowClass = props.rowClass,
    rawDirection = props.direction,
    rawRole = props.role,
    ariaLabel = props['aria-label'],
    ariaLabelledBy = props['aria-labelledby'],
    ariaDescribedBy = props['aria-describedby'],
    rawAriaRowCount = props['aria-rowcount'],
    testId = props['data-testid'];
  var defaultRenderers = useDefaultRenderers();
  var role = rawRole != null ? rawRole : 'grid';
  var rowHeight = rawRowHeight != null ? rawRowHeight : 35;
  var headerRowHeight = rawHeaderRowHeight != null ? rawHeaderRowHeight : typeof rowHeight === 'number' ? rowHeight : 35;
  var summaryRowHeight = rawSummaryRowHeight != null ? rawSummaryRowHeight : typeof rowHeight === 'number' ? rowHeight : 35;
  var renderRow = (_ref = (_renderers$renderRow = renderers == null ? void 0 : renderers.renderRow) != null ? _renderers$renderRow : defaultRenderers == null ? void 0 : defaultRenderers.renderRow) != null ? _ref : defaultRenderRow;
  var renderSortStatus$1 = (_ref2 = (_renderers$renderSort = renderers == null ? void 0 : renderers.renderSortStatus) != null ? _renderers$renderSort : defaultRenderers == null ? void 0 : defaultRenderers.renderSortStatus) != null ? _ref2 : renderSortStatus;
  var renderCheckbox$1 = (_ref3 = (_renderers$renderChec = renderers == null ? void 0 : renderers.renderCheckbox) != null ? _renderers$renderChec : defaultRenderers == null ? void 0 : defaultRenderers.renderCheckbox) != null ? _ref3 : renderCheckbox;
  var noRowsFallback = (_renderers$noRowsFall = renderers == null ? void 0 : renderers.noRowsFallback) != null ? _renderers$noRowsFall : defaultRenderers == null ? void 0 : defaultRenderers.noRowsFallback;
  var enableVirtualization = rawEnableVirtualization != null ? rawEnableVirtualization : true;
  var direction = rawDirection != null ? rawDirection : 'ltr';
  var _useState = useState(0),
    scrollTop = _useState[0],
    setScrollTop = _useState[1];
  var _useState2 = useState(0),
    scrollLeft = _useState2[0],
    setScrollLeft = _useState2[1];
  var _useState3 = useState(function () {
      return new Map();
    }),
    resizedColumnWidths = _useState3[0],
    setResizedColumnWidths = _useState3[1];
  var _useState4 = useState(function () {
      return new Map();
    }),
    measuredColumnWidths = _useState4[0],
    setMeasuredColumnWidths = _useState4[1];
  var _useState5 = useState(null),
    copiedCell = _useState5[0],
    setCopiedCell = _useState5[1];
  var _useState6 = useState(false),
    isDragging = _useState6[0],
    setDragging = _useState6[1];
  var _useState7 = useState(undefined),
    draggedOverRowIdx = _useState7[0],
    setOverRowIdx = _useState7[1];
  var _useState8 = useState(null),
    scrollToPosition = _useState8[0],
    setScrollToPosition = _useState8[1];
  var getColumnWidth = useCallback(function (column) {
    var _ref4, _resizedColumnWidths$;
    return (_ref4 = (_resizedColumnWidths$ = resizedColumnWidths.get(column.key)) != null ? _resizedColumnWidths$ : measuredColumnWidths.get(column.key)) != null ? _ref4 : column.width;
  }, [measuredColumnWidths, resizedColumnWidths]);
  var _useGridDimensions = useGridDimensions(),
    gridRef = _useGridDimensions[0],
    gridWidth = _useGridDimensions[1],
    gridHeight = _useGridDimensions[2];
  var _useCalculatedColumns = useCalculatedColumns({
      rawColumns: rawColumns,
      defaultColumnOptions: defaultColumnOptions,
      getColumnWidth: getColumnWidth,
      scrollLeft: scrollLeft,
      viewportWidth: gridWidth,
      enableVirtualization: enableVirtualization
    }),
    columns = _useCalculatedColumns.columns,
    colSpanColumns = _useCalculatedColumns.colSpanColumns,
    lastFrozenColumnIndex = _useCalculatedColumns.lastFrozenColumnIndex,
    headerRowsCount = _useCalculatedColumns.headerRowsCount,
    colOverscanStartIdx = _useCalculatedColumns.colOverscanStartIdx,
    colOverscanEndIdx = _useCalculatedColumns.colOverscanEndIdx,
    templateColumns = _useCalculatedColumns.templateColumns,
    layoutCssVars = _useCalculatedColumns.layoutCssVars,
    totalFrozenColumnWidth = _useCalculatedColumns.totalFrozenColumnWidth;
  var topSummaryRowsCount = (_topSummaryRows$lengt = topSummaryRows == null ? void 0 : topSummaryRows.length) != null ? _topSummaryRows$lengt : 0;
  var bottomSummaryRowsCount = (_bottomSummaryRows$le = bottomSummaryRows == null ? void 0 : bottomSummaryRows.length) != null ? _bottomSummaryRows$le : 0;
  var summaryRowsCount = topSummaryRowsCount + bottomSummaryRowsCount;
  var headerAndTopSummaryRowsCount = headerRowsCount + topSummaryRowsCount;
  var groupedColumnHeaderRowsCount = headerRowsCount - 1;
  var minRowIdx = -headerAndTopSummaryRowsCount;
  var mainHeaderRowIdx = minRowIdx + groupedColumnHeaderRowsCount;
  var maxRowIdx = rows.length + bottomSummaryRowsCount - 1;
  var _useState9 = useState(function () {
      return {
        idx: -1,
        rowIdx: minRowIdx - 1,
        mode: 'SELECT'
      };
    }),
    selectedPosition = _useState9[0],
    setSelectedPosition = _useState9[1];
  var prevSelectedPosition = useRef(selectedPosition);
  var latestDraggedOverRowIdx = useRef(draggedOverRowIdx);
  var lastSelectedRowIdx = useRef(-1);
  var focusSinkRef = useRef(null);
  var shouldFocusCellRef = useRef(false);
  var isTreeGrid = role === 'treegrid';
  var headerRowsHeight = headerRowsCount * headerRowHeight;
  var clientHeight = gridHeight - headerRowsHeight - summaryRowsCount * summaryRowHeight;
  var isSelectable = selectedRows != null && onSelectedRowsChange != null;
  var isRtl = direction === 'rtl';
  var leftKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
  var rightKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  var ariaRowCount = rawAriaRowCount != null ? rawAriaRowCount : headerRowsCount + rows.length + summaryRowsCount;
  var defaultGridComponents = useMemo(function () {
    return {
      renderCheckbox: renderCheckbox$1,
      renderSortStatus: renderSortStatus$1
    };
  }, [renderCheckbox$1, renderSortStatus$1]);
  var allRowsSelected = useMemo(function () {
    var length = rows.length;
    return length !== 0 && selectedRows != null && rowKeyGetter != null && selectedRows.size >= length && rows.every(function (row) {
      return selectedRows.has(rowKeyGetter(row));
    });
  }, [rows, selectedRows, rowKeyGetter]);
  var _useViewportRows = useViewportRows({
      rows: rows,
      rowHeight: rowHeight,
      clientHeight: clientHeight,
      scrollTop: scrollTop,
      enableVirtualization: enableVirtualization
    }),
    rowOverscanStartIdx = _useViewportRows.rowOverscanStartIdx,
    rowOverscanEndIdx = _useViewportRows.rowOverscanEndIdx,
    totalRowHeight = _useViewportRows.totalRowHeight,
    gridTemplateRows = _useViewportRows.gridTemplateRows,
    getRowTop = _useViewportRows.getRowTop,
    getRowHeight = _useViewportRows.getRowHeight,
    findRowIdx = _useViewportRows.findRowIdx;
  var viewportColumns = useViewportColumns({
    columns: columns,
    colSpanColumns: colSpanColumns,
    colOverscanStartIdx: colOverscanStartIdx,
    colOverscanEndIdx: colOverscanEndIdx,
    lastFrozenColumnIndex: lastFrozenColumnIndex,
    rowOverscanStartIdx: rowOverscanStartIdx,
    rowOverscanEndIdx: rowOverscanEndIdx,
    rows: rows,
    topSummaryRows: topSummaryRows,
    bottomSummaryRows: bottomSummaryRows
  });
  var _useColumnWidths = useColumnWidths(columns, viewportColumns, templateColumns, gridRef, gridWidth, resizedColumnWidths, measuredColumnWidths, setResizedColumnWidths, setMeasuredColumnWidths, onColumnResize),
    gridTemplateColumns = _useColumnWidths.gridTemplateColumns,
    handleColumnResize = _useColumnWidths.handleColumnResize;
  var minColIdx = isTreeGrid ? -1 : 0;
  var maxColIdx = columns.length - 1;
  var selectedCellIsWithinSelectionBounds = isCellWithinSelectionBounds(selectedPosition);
  var selectedCellIsWithinViewportBounds = isCellWithinViewportBounds(selectedPosition);
  var handleColumnResizeLatest = useLatestFunc(handleColumnResize);
  var onColumnsReorderLastest = useLatestFunc(onColumnsReorder);
  var onSortColumnsChangeLatest = useLatestFunc(onSortColumnsChange);
  var onCellClickLatest = useLatestFunc(onCellClick);
  var onCellDoubleClickLatest = useLatestFunc(onCellDoubleClick);
  var onCellContextMenuLatest = useLatestFunc(onCellContextMenu);
  var selectRowLatest = useLatestFunc(selectRow);
  var handleFormatterRowChangeLatest = useLatestFunc(updateRow);
  var selectCellLatest = useLatestFunc(selectCell);
  var selectHeaderCellLatest = useLatestFunc(function (_ref5) {
    var idx = _ref5.idx,
      rowIdx = _ref5.rowIdx;
    selectCell({
      rowIdx: minRowIdx + rowIdx - 1,
      idx: idx
    });
  });
  useLayoutEffect(function () {
    if (!selectedCellIsWithinSelectionBounds || isSamePosition(selectedPosition, prevSelectedPosition.current)) {
      prevSelectedPosition.current = selectedPosition;
      return;
    }
    prevSelectedPosition.current = selectedPosition;
    if (selectedPosition.idx === -1) {
      focusSinkRef.current.focus({
        preventScroll: true
      });
      scrollIntoView(focusSinkRef.current);
    }
  });
  useLayoutEffect(function () {
    if (!shouldFocusCellRef.current) return;
    shouldFocusCellRef.current = false;
    focusCellOrCellContent();
  });
  useImperativeHandle(ref, function () {
    return {
      element: gridRef.current,
      scrollToCell: function scrollToCell(_ref6) {
        var idx = _ref6.idx,
          rowIdx = _ref6.rowIdx;
        var scrollToIdx = idx !== undefined && idx > lastFrozenColumnIndex && idx < columns.length ? idx : undefined;
        var scrollToRowIdx = rowIdx !== undefined && isRowIdxWithinViewportBounds(rowIdx) ? rowIdx : undefined;
        if (scrollToIdx !== undefined || scrollToRowIdx !== undefined) {
          setScrollToPosition({
            idx: scrollToIdx,
            rowIdx: scrollToRowIdx
          });
        }
      },
      selectCell: selectCell
    };
  });
  var setDraggedOverRowIdx = useCallback(function (rowIdx) {
    setOverRowIdx(rowIdx);
    latestDraggedOverRowIdx.current = rowIdx;
  }, []);
  function selectRow(args) {
    if (!onSelectedRowsChange) return;
    assertIsValidKeyGetter(rowKeyGetter);
    if (args.type === 'HEADER') {
      var _newSelectedRows = new Set(selectedRows);
      for (var _iterator = _createForOfIteratorHelperLoose$1(rows), _step; !(_step = _iterator()).done;) {
        var _row = _step.value;
        var _rowKey = rowKeyGetter(_row);
        if (args.checked) {
          _newSelectedRows.add(_rowKey);
        } else {
          _newSelectedRows["delete"](_rowKey);
        }
      }
      onSelectedRowsChange(_newSelectedRows);
      return;
    }
    var row = args.row,
      checked = args.checked,
      isShiftClick = args.isShiftClick;
    var newSelectedRows = new Set(selectedRows);
    var rowKey = rowKeyGetter(row);
    if (checked) {
      newSelectedRows.add(rowKey);
      var previousRowIdx = lastSelectedRowIdx.current;
      var _rowIdx = rows.indexOf(row);
      lastSelectedRowIdx.current = _rowIdx;
      if (isShiftClick && previousRowIdx !== -1 && previousRowIdx !== _rowIdx) {
        var step = sign(_rowIdx - previousRowIdx);
        for (var i = previousRowIdx + step; i !== _rowIdx; i += step) {
          var _row2 = rows[i];
          newSelectedRows.add(rowKeyGetter(_row2));
        }
      }
    } else {
      newSelectedRows["delete"](rowKey);
      lastSelectedRowIdx.current = -1;
    }
    onSelectedRowsChange(newSelectedRows);
  }
  function handleKeyDown(event) {
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx,
      mode = selectedPosition.mode;
    if (mode === 'EDIT') return;
    if (onCellKeyDown && isRowIdxWithinViewportBounds(rowIdx)) {
      var _row3 = rows[rowIdx];
      var cellEvent = createCellEvent(event);
      onCellKeyDown({
        mode: 'SELECT',
        row: _row3,
        column: columns[idx],
        rowIdx: rowIdx,
        selectCell: selectCell
      }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    if (!(event.target instanceof Element)) return;
    var isCellEvent = event.target.closest('.rdg-cell') !== null;
    var isRowEvent = isTreeGrid && event.target === focusSinkRef.current;
    if (!isCellEvent && !isRowEvent) return;
    var keyCode = event.keyCode;
    if (selectedCellIsWithinViewportBounds && (onPaste != null || onCopy != null) && isCtrlKeyHeldDown(event)) {
      var cKey = 67;
      var vKey = 86;
      if (keyCode === cKey) {
        handleCopy();
        return;
      }
      if (keyCode === vKey) {
        handlePaste();
        return;
      }
    }
    switch (event.key) {
      case 'Escape':
        setCopiedCell(null);
        return;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Tab':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        navigate(event);
        break;
      default:
        handleCellInput(event);
        break;
    }
  }
  function handleScroll(event) {
    var _event$currentTarget = event.currentTarget,
      scrollTop = _event$currentTarget.scrollTop,
      scrollLeft = _event$currentTarget.scrollLeft;
    flushSync(function () {
      setScrollTop(scrollTop);
      setScrollLeft(abs(scrollLeft));
    });
    onScroll == null || onScroll(event);
  }
  function updateRow(column, rowIdx, row) {
    if (typeof onRowsChange !== 'function') return;
    if (row === rows[rowIdx]) return;
    var updatedRows = [].concat(rows);
    updatedRows[rowIdx] = row;
    onRowsChange(updatedRows, {
      indexes: [rowIdx],
      column: column
    });
  }
  function commitEditorChanges() {
    if (selectedPosition.mode !== 'EDIT') return;
    updateRow(columns[selectedPosition.idx], selectedPosition.rowIdx, selectedPosition.row);
  }
  function handleCopy() {
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var sourceRow = rows[rowIdx];
    var sourceColumnKey = columns[idx].key;
    setCopiedCell({
      row: sourceRow,
      columnKey: sourceColumnKey
    });
    onCopy == null || onCopy({
      sourceRow: sourceRow,
      sourceColumnKey: sourceColumnKey
    });
  }
  function handlePaste() {
    if (!onPaste || !onRowsChange || copiedCell === null || !isCellEditable(selectedPosition)) {
      return;
    }
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var targetColumn = columns[idx];
    var targetRow = rows[rowIdx];
    var updatedTargetRow = onPaste({
      sourceRow: copiedCell.row,
      sourceColumnKey: copiedCell.columnKey,
      targetRow: targetRow,
      targetColumnKey: targetColumn.key
    });
    updateRow(targetColumn, rowIdx, updatedTargetRow);
  }
  function handleCellInput(event) {
    if (!selectedCellIsWithinViewportBounds) return;
    var row = rows[selectedPosition.rowIdx];
    var key = event.key,
      shiftKey = event.shiftKey;
    if (isSelectable && shiftKey && key === ' ') {
      assertIsValidKeyGetter(rowKeyGetter);
      var rowKey = rowKeyGetter(row);
      selectRow({
        type: 'ROW',
        row: row,
        checked: !selectedRows.has(rowKey),
        isShiftClick: false
      });
      event.preventDefault();
      return;
    }
    if (isCellEditable(selectedPosition) && isDefaultCellInput(event)) {
      setSelectedPosition(function (_ref7) {
        var idx = _ref7.idx,
          rowIdx = _ref7.rowIdx;
        return {
          idx: idx,
          rowIdx: rowIdx,
          mode: 'EDIT',
          row: row,
          originalRow: row
        };
      });
    }
  }
  function isColIdxWithinSelectionBounds(idx) {
    return idx >= minColIdx && idx <= maxColIdx;
  }
  function isRowIdxWithinViewportBounds(rowIdx) {
    return rowIdx >= 0 && rowIdx < rows.length;
  }
  function isCellWithinSelectionBounds(_ref8) {
    var idx = _ref8.idx,
      rowIdx = _ref8.rowIdx;
    return rowIdx >= minRowIdx && rowIdx <= maxRowIdx && isColIdxWithinSelectionBounds(idx);
  }
  function isCellWithinEditBounds(_ref9) {
    var idx = _ref9.idx,
      rowIdx = _ref9.rowIdx;
    return isRowIdxWithinViewportBounds(rowIdx) && idx >= 0 && idx <= maxColIdx;
  }
  function isCellWithinViewportBounds(_ref10) {
    var idx = _ref10.idx,
      rowIdx = _ref10.rowIdx;
    return isRowIdxWithinViewportBounds(rowIdx) && isColIdxWithinSelectionBounds(idx);
  }
  function isCellEditable(position) {
    return isCellWithinEditBounds(position) && isSelectedCellEditable({
      columns: columns,
      rows: rows,
      selectedPosition: position
    });
  }
  function selectCell(position, enableEditor) {
    if (!isCellWithinSelectionBounds(position)) return;
    commitEditorChanges();
    var row = rows[position.rowIdx];
    var samePosition = isSamePosition(selectedPosition, position);
    if (enableEditor && isCellEditable(position)) {
      setSelectedPosition(_extends({}, position, {
        mode: 'EDIT',
        row: row,
        originalRow: row
      }));
    } else if (samePosition) {
      scrollIntoView(getCellToScroll(gridRef.current));
    } else {
      shouldFocusCellRef.current = true;
      setSelectedPosition(_extends({}, position, {
        mode: 'SELECT'
      }));
    }
    if (onSelectedCellChange && !samePosition) {
      onSelectedCellChange({
        rowIdx: position.rowIdx,
        row: row,
        column: columns[position.idx]
      });
    }
  }
  function getNextPosition(key, ctrlKey, shiftKey) {
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var isRowSelected = selectedCellIsWithinSelectionBounds && idx === -1;
    switch (key) {
      case 'ArrowUp':
        return {
          idx: idx,
          rowIdx: rowIdx - 1
        };
      case 'ArrowDown':
        return {
          idx: idx,
          rowIdx: rowIdx + 1
        };
      case leftKey:
        return {
          idx: idx - 1,
          rowIdx: rowIdx
        };
      case rightKey:
        return {
          idx: idx + 1,
          rowIdx: rowIdx
        };
      case 'Tab':
        return {
          idx: idx + (shiftKey ? -1 : 1),
          rowIdx: rowIdx
        };
      case 'Home':
        if (isRowSelected) return {
          idx: idx,
          rowIdx: minRowIdx
        };
        return {
          idx: 0,
          rowIdx: ctrlKey ? minRowIdx : rowIdx
        };
      case 'End':
        if (isRowSelected) return {
          idx: idx,
          rowIdx: maxRowIdx
        };
        return {
          idx: maxColIdx,
          rowIdx: ctrlKey ? maxRowIdx : rowIdx
        };
      case 'PageUp':
        {
          if (selectedPosition.rowIdx === minRowIdx) return selectedPosition;
          var nextRowY = getRowTop(rowIdx) + getRowHeight(rowIdx) - clientHeight;
          return {
            idx: idx,
            rowIdx: nextRowY > 0 ? findRowIdx(nextRowY) : 0
          };
        }
      case 'PageDown':
        {
          if (selectedPosition.rowIdx >= rows.length) return selectedPosition;
          var _nextRowY = getRowTop(rowIdx) + clientHeight;
          return {
            idx: idx,
            rowIdx: _nextRowY < totalRowHeight ? findRowIdx(_nextRowY) : rows.length - 1
          };
        }
      default:
        return selectedPosition;
    }
  }
  function navigate(event) {
    var key = event.key,
      shiftKey = event.shiftKey;
    var cellNavigationMode = 'NONE';
    if (key === 'Tab') {
      if (canExitGrid({
        shiftKey: shiftKey,
        maxColIdx: maxColIdx,
        minRowIdx: minRowIdx,
        maxRowIdx: maxRowIdx,
        selectedPosition: selectedPosition
      })) {
        commitEditorChanges();
        return;
      }
      cellNavigationMode = 'CHANGE_ROW';
    }
    event.preventDefault();
    var ctrlKey = isCtrlKeyHeldDown(event);
    var nextPosition = getNextPosition(key, ctrlKey, shiftKey);
    if (isSamePosition(selectedPosition, nextPosition)) return;
    var nextSelectedCellPosition = getNextSelectedCellPosition({
      moveUp: key === 'ArrowUp',
      moveNext: key === rightKey || key === 'Tab' && !shiftKey,
      columns: columns,
      colSpanColumns: colSpanColumns,
      rows: rows,
      topSummaryRows: topSummaryRows,
      bottomSummaryRows: bottomSummaryRows,
      minRowIdx: minRowIdx,
      mainHeaderRowIdx: mainHeaderRowIdx,
      maxRowIdx: maxRowIdx,
      lastFrozenColumnIndex: lastFrozenColumnIndex,
      cellNavigationMode: cellNavigationMode,
      currentPosition: selectedPosition,
      nextPosition: nextPosition,
      isCellWithinBounds: isCellWithinSelectionBounds
    });
    selectCell(nextSelectedCellPosition);
  }
  function getDraggedOverCellIdx(currentRowIdx) {
    if (draggedOverRowIdx === undefined) return;
    var rowIdx = selectedPosition.rowIdx;
    var isDraggedOver = rowIdx < draggedOverRowIdx ? rowIdx < currentRowIdx && currentRowIdx <= draggedOverRowIdx : rowIdx > currentRowIdx && currentRowIdx >= draggedOverRowIdx;
    return isDraggedOver ? selectedPosition.idx : undefined;
  }
  function focusCellOrCellContent() {
    var _cell$querySelector;
    var cell = getCellToScroll(gridRef.current);
    if (cell === null) return;
    scrollIntoView(cell);
    var elementToFocus = (_cell$querySelector = cell.querySelector('[tabindex="0"]')) != null ? _cell$querySelector : cell;
    elementToFocus.focus({
      preventScroll: true
    });
  }
  function renderDragHandle() {
    if (onFill == null || selectedPosition.mode === 'EDIT' || !isCellWithinViewportBounds(selectedPosition)) {
      return;
    }
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var column = columns[idx];
    if (column.renderEditCell == null || column.editable === false) {
      return;
    }
    var columnWidth = getColumnWidth(column);
    return /*#__PURE__*/React.createElement(DragHandle, {
      gridRowStart: headerAndTopSummaryRowsCount + rowIdx + 1,
      rows: rows,
      column: column,
      columnWidth: columnWidth,
      maxColIdx: maxColIdx,
      isLastRow: rowIdx === maxRowIdx,
      selectedPosition: selectedPosition,
      isCellEditable: isCellEditable,
      latestDraggedOverRowIdx: latestDraggedOverRowIdx,
      onRowsChange: onRowsChange,
      onClick: focusCellOrCellContent,
      onFill: onFill,
      setDragging: setDragging,
      setDraggedOverRowIdx: setDraggedOverRowIdx
    });
  }
  function getCellEditor(rowIdx) {
    if (selectedPosition.rowIdx !== rowIdx || selectedPosition.mode === 'SELECT') return;
    var idx = selectedPosition.idx,
      row = selectedPosition.row;
    var column = columns[idx];
    var colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: 'ROW',
      row: row
    });
    var closeEditor = function closeEditor(shouldFocusCell) {
      shouldFocusCellRef.current = shouldFocusCell;
      setSelectedPosition(function (_ref11) {
        var idx = _ref11.idx,
          rowIdx = _ref11.rowIdx;
        return {
          idx: idx,
          rowIdx: rowIdx,
          mode: 'SELECT'
        };
      });
    };
    var onRowChange = function onRowChange(row, commitChanges, shouldFocusCell) {
      if (commitChanges) {
        flushSync(function () {
          updateRow(column, selectedPosition.rowIdx, row);
          closeEditor(shouldFocusCell);
        });
      } else {
        setSelectedPosition(function (position) {
          return _extends({}, position, {
            row: row
          });
        });
      }
    };
    if (rows[selectedPosition.rowIdx] !== selectedPosition.originalRow) {
      closeEditor(false);
    }
    return /*#__PURE__*/React.createElement(EditCell, {
      key: column.key,
      column: column,
      colSpan: colSpan,
      row: row,
      rowIdx: rowIdx,
      onRowChange: onRowChange,
      closeEditor: closeEditor,
      onKeyDown: onCellKeyDown,
      navigate: navigate
    });
  }
  function getRowViewportColumns(rowIdx) {
    var selectedColumn = selectedPosition.idx === -1 ? undefined : columns[selectedPosition.idx];
    if (selectedColumn !== undefined && selectedPosition.rowIdx === rowIdx && !viewportColumns.includes(selectedColumn)) {
      return selectedPosition.idx > colOverscanEndIdx ? [].concat(viewportColumns, [selectedColumn]) : [].concat(viewportColumns.slice(0, lastFrozenColumnIndex + 1), [selectedColumn], viewportColumns.slice(lastFrozenColumnIndex + 1));
    }
    return viewportColumns;
  }
  function getViewportRows() {
    var rowElements = [];
    var selectedIdx = selectedPosition.idx,
      selectedRowIdx = selectedPosition.rowIdx;
    var startRowIdx = selectedCellIsWithinViewportBounds && selectedRowIdx < rowOverscanStartIdx ? rowOverscanStartIdx - 1 : rowOverscanStartIdx;
    var endRowIdx = selectedCellIsWithinViewportBounds && selectedRowIdx > rowOverscanEndIdx ? rowOverscanEndIdx + 1 : rowOverscanEndIdx;
    for (var viewportRowIdx = startRowIdx; viewportRowIdx <= endRowIdx; viewportRowIdx++) {
      var isRowOutsideViewport = viewportRowIdx === rowOverscanStartIdx - 1 || viewportRowIdx === rowOverscanEndIdx + 1;
      var _rowIdx2 = isRowOutsideViewport ? selectedRowIdx : viewportRowIdx;
      var rowColumns = viewportColumns;
      var selectedColumn = selectedIdx === -1 ? undefined : columns[selectedIdx];
      if (selectedColumn !== undefined) {
        if (isRowOutsideViewport) {
          rowColumns = [selectedColumn];
        } else {
          rowColumns = getRowViewportColumns(_rowIdx2);
        }
      }
      var _row4 = rows[_rowIdx2];
      var gridRowStart = headerAndTopSummaryRowsCount + _rowIdx2 + 1;
      var key = _rowIdx2;
      var isRowSelected = false;
      if (typeof rowKeyGetter === 'function') {
        var _selectedRows$has;
        key = rowKeyGetter(_row4);
        isRowSelected = (_selectedRows$has = selectedRows == null ? void 0 : selectedRows.has(key)) != null ? _selectedRows$has : false;
      }
      rowElements.push(renderRow(key, {
        'aria-rowindex': headerAndTopSummaryRowsCount + _rowIdx2 + 1,
        'aria-selected': isSelectable ? isRowSelected : undefined,
        rowIdx: _rowIdx2,
        row: _row4,
        viewportColumns: rowColumns,
        isRowSelected: isRowSelected,
        onCellClick: onCellClickLatest,
        onCellDoubleClick: onCellDoubleClickLatest,
        onCellContextMenu: onCellContextMenuLatest,
        rowClass: rowClass,
        gridRowStart: gridRowStart,
        height: getRowHeight(_rowIdx2),
        copiedCellIdx: copiedCell !== null && copiedCell.row === _row4 ? columns.findIndex(function (c) {
          return c.key === copiedCell.columnKey;
        }) : undefined,
        selectedCellIdx: selectedRowIdx === _rowIdx2 ? selectedIdx : undefined,
        draggedOverCellIdx: getDraggedOverCellIdx(_rowIdx2),
        setDraggedOverRowIdx: isDragging ? setDraggedOverRowIdx : undefined,
        lastFrozenColumnIndex: lastFrozenColumnIndex,
        onRowChange: handleFormatterRowChangeLatest,
        selectCell: selectCellLatest,
        selectedCellEditor: getCellEditor(_rowIdx2)
      }));
    }
    return rowElements;
  }
  if (selectedPosition.idx > maxColIdx || selectedPosition.rowIdx > maxRowIdx) {
    setSelectedPosition({
      idx: -1,
      rowIdx: minRowIdx - 1,
      mode: 'SELECT'
    });
    setDraggedOverRowIdx(undefined);
  }
  var templateRows = "repeat(" + headerRowsCount + ", " + headerRowHeight + "px)";
  if (topSummaryRowsCount > 0) {
    templateRows += " repeat(" + topSummaryRowsCount + ", " + summaryRowHeight + "px)";
  }
  if (rows.length > 0) {
    templateRows += gridTemplateRows;
  }
  if (bottomSummaryRowsCount > 0) {
    templateRows += " repeat(" + bottomSummaryRowsCount + ", " + summaryRowHeight + "px)";
  }
  var isGroupRowFocused = selectedPosition.idx === -1 && selectedPosition.rowIdx !== minRowIdx - 1;
  return /*#__PURE__*/React.createElement("div", {
    role: role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-multiselectable": isSelectable ? true : undefined,
    "aria-colcount": columns.length,
    "aria-rowcount": ariaRowCount,
    className: clsx(rootClassname, className, isDragging && viewportDraggingClassname),
    style: _extends({}, style, {
      scrollPaddingInlineStart: selectedPosition.idx > lastFrozenColumnIndex || (scrollToPosition == null ? void 0 : scrollToPosition.idx) !== undefined ? totalFrozenColumnWidth + "px" : undefined,
      scrollPaddingBlock: isRowIdxWithinViewportBounds(selectedPosition.rowIdx) || (scrollToPosition == null ? void 0 : scrollToPosition.rowIdx) !== undefined ? headerRowsHeight + topSummaryRowsCount * summaryRowHeight + "px " + bottomSummaryRowsCount * summaryRowHeight + "px" : undefined,
      gridTemplateColumns: gridTemplateColumns,
      gridTemplateRows: templateRows,
      '--rdg-header-row-height': headerRowHeight + "px",
      '--rdg-summary-row-height': summaryRowHeight + "px",
      '--rdg-sign': isRtl ? -1 : 1
    }, layoutCssVars),
    dir: direction,
    ref: gridRef,
    onScroll: handleScroll,
    onKeyDown: handleKeyDown,
    "data-testid": testId
  }, /*#__PURE__*/React.createElement(DataGridDefaultRenderersProvider, {
    value: defaultGridComponents
  }, /*#__PURE__*/React.createElement(RowSelectionChangeProvider, {
    value: selectRowLatest
  }, /*#__PURE__*/React.createElement(RowSelectionProvider, {
    value: allRowsSelected
  }, Array.from({
    length: groupedColumnHeaderRowsCount
  }, function (_, index) {
    return /*#__PURE__*/React.createElement(GroupedColumnHeaderRow$1, {
      key: index,
      rowIdx: index + 1,
      level: -groupedColumnHeaderRowsCount + index,
      columns: getRowViewportColumns(minRowIdx + index),
      selectedCellIdx: selectedPosition.rowIdx === minRowIdx + index ? selectedPosition.idx : undefined,
      selectCell: selectHeaderCellLatest
    });
  }), /*#__PURE__*/React.createElement(HeaderRow$1, {
    rowIdx: headerRowsCount,
    columns: getRowViewportColumns(mainHeaderRowIdx),
    onColumnResize: handleColumnResizeLatest,
    onColumnsReorder: onColumnsReorderLastest,
    sortColumns: sortColumns,
    onSortColumnsChange: onSortColumnsChangeLatest,
    lastFrozenColumnIndex: lastFrozenColumnIndex,
    selectedCellIdx: selectedPosition.rowIdx === mainHeaderRowIdx ? selectedPosition.idx : undefined,
    selectCell: selectHeaderCellLatest,
    shouldFocusGrid: !selectedCellIsWithinSelectionBounds,
    direction: direction
  })), rows.length === 0 && noRowsFallback ? noRowsFallback : /*#__PURE__*/React.createElement(React.Fragment, null, topSummaryRows == null ? void 0 : topSummaryRows.map(function (row, rowIdx) {
    var gridRowStart = headerRowsCount + 1 + rowIdx;
    var summaryRowIdx = mainHeaderRowIdx + 1 + rowIdx;
    var isSummaryRowSelected = selectedPosition.rowIdx === summaryRowIdx;
    var top = headerRowsHeight + summaryRowHeight * rowIdx;
    return /*#__PURE__*/React.createElement(SummaryRow$1, {
      key: rowIdx,
      "aria-rowindex": gridRowStart,
      rowIdx: summaryRowIdx,
      gridRowStart: gridRowStart,
      row: row,
      top: top,
      bottom: undefined,
      viewportColumns: getRowViewportColumns(summaryRowIdx),
      lastFrozenColumnIndex: lastFrozenColumnIndex,
      selectedCellIdx: isSummaryRowSelected ? selectedPosition.idx : undefined,
      isTop: true,
      showBorder: rowIdx === topSummaryRowsCount - 1,
      selectCell: selectCellLatest
    });
  }), getViewportRows(), bottomSummaryRows == null ? void 0 : bottomSummaryRows.map(function (row, rowIdx) {
    var gridRowStart = headerAndTopSummaryRowsCount + rows.length + rowIdx + 1;
    var summaryRowIdx = rows.length + rowIdx;
    var isSummaryRowSelected = selectedPosition.rowIdx === summaryRowIdx;
    var top = clientHeight > totalRowHeight ? gridHeight - summaryRowHeight * (bottomSummaryRows.length - rowIdx) : undefined;
    var bottom = top === undefined ? summaryRowHeight * (bottomSummaryRows.length - 1 - rowIdx) : undefined;
    return /*#__PURE__*/React.createElement(SummaryRow$1, {
      "aria-rowindex": ariaRowCount - bottomSummaryRowsCount + rowIdx + 1,
      key: rowIdx,
      rowIdx: summaryRowIdx,
      gridRowStart: gridRowStart,
      row: row,
      top: top,
      bottom: bottom,
      viewportColumns: getRowViewportColumns(summaryRowIdx),
      lastFrozenColumnIndex: lastFrozenColumnIndex,
      selectedCellIdx: isSummaryRowSelected ? selectedPosition.idx : undefined,
      isTop: false,
      showBorder: rowIdx === 0,
      selectCell: selectCellLatest
    });
  })))), renderDragHandle(), renderMeasuringCells(viewportColumns), isTreeGrid && /*#__PURE__*/React.createElement("div", {
    ref: focusSinkRef,
    tabIndex: isGroupRowFocused ? 0 : -1,
    className: clsx(focusSinkClassname, isGroupRowFocused && [rowSelected, lastFrozenColumnIndex !== -1 && rowSelectedWithFrozenCell], !isRowIdxWithinViewportBounds(selectedPosition.rowIdx) && focusSinkHeaderAndSummaryClassname),
    style: {
      gridRowStart: selectedPosition.rowIdx + headerAndTopSummaryRowsCount + 1
    }
  }), scrollToPosition !== null && /*#__PURE__*/React.createElement(ScrollToCell, {
    scrollToPosition: scrollToPosition,
    setScrollToCellPosition: setScrollToPosition,
    gridElement: gridRef.current
  }));
}
function getCellToScroll(gridEl) {
  return gridEl.querySelector(':scope > [role="row"] > [tabindex="0"]');
}
function isSamePosition(p1, p2) {
  return p1.idx === p2.idx && p1.rowIdx === p2.rowIdx;
}
const DataGrid$1 = /*#__PURE__*/forwardRef(DataGrid);

function GroupCell(_ref) {
  var id = _ref.id,
    groupKey = _ref.groupKey,
    childRows = _ref.childRows,
    isExpanded = _ref.isExpanded,
    isCellSelected = _ref.isCellSelected,
    column = _ref.column,
    row = _ref.row,
    groupColumnIndex = _ref.groupColumnIndex,
    isGroupByColumn = _ref.isGroupByColumn,
    toggleGroupWrapper = _ref.toggleGroup;
  var _useRovingTabIndex = useRovingTabIndex(isCellSelected),
    tabIndex = _useRovingTabIndex.tabIndex,
    childTabIndex = _useRovingTabIndex.childTabIndex,
    onFocus = _useRovingTabIndex.onFocus;
  function toggleGroup() {
    toggleGroupWrapper(id);
  }
  var isLevelMatching = isGroupByColumn && groupColumnIndex === column.idx;
  return /*#__PURE__*/React.createElement("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-selected": isCellSelected,
    tabIndex: tabIndex,
    key: column.key,
    className: getCellClassname(column),
    style: _extends({}, getCellStyle(column), {
      cursor: isLevelMatching ? 'pointer' : 'default'
    }),
    onClick: isLevelMatching ? toggleGroup : undefined,
    onFocus: onFocus
  }, (!isGroupByColumn || isLevelMatching) && (column.renderGroupCell == null ? void 0 : column.renderGroupCell({
    groupKey: groupKey,
    childRows: childRows,
    column: column,
    row: row,
    isExpanded: isExpanded,
    tabIndex: childTabIndex,
    toggleGroup: toggleGroup
  })));
}
const GroupCell$1 = /*#__PURE__*/memo(GroupCell);

var _excluded$1 = ["className", "row", "rowIdx", "viewportColumns", "selectedCellIdx", "isRowSelected", "selectCell", "gridRowStart", "height", "groupBy", "toggleGroup"];
var groupRow = "g1yxluv37-0-0-beta-41";
var groupRowClassname = "rdg-group-row " + groupRow;
function GroupedRow(_ref) {
  var className = _ref.className,
    row = _ref.row,
    rowIdx = _ref.rowIdx,
    viewportColumns = _ref.viewportColumns,
    selectedCellIdx = _ref.selectedCellIdx,
    isRowSelected = _ref.isRowSelected,
    selectCell = _ref.selectCell,
    gridRowStart = _ref.gridRowStart,
    height = _ref.height,
    groupBy = _ref.groupBy,
    toggleGroup = _ref.toggleGroup,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  var idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? row.level + 1 : row.level;
  function handleSelectGroup() {
    selectCell({
      rowIdx: rowIdx,
      idx: -1
    });
  }
  return /*#__PURE__*/React.createElement(RowSelectionProvider, {
    value: isRowSelected
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "row",
    "aria-level": row.level + 1,
    "aria-setsize": row.setSize,
    "aria-posinset": row.posInSet + 1,
    "aria-expanded": row.isExpanded,
    className: clsx(rowClassname, groupRowClassname, "rdg-row-" + (rowIdx % 2 === 0 ? 'even' : 'odd'), className, selectedCellIdx === -1 && rowSelectedClassname),
    onClick: handleSelectGroup,
    style: getRowStyle(gridRowStart, height)
  }, props), viewportColumns.map(function (column) {
    return /*#__PURE__*/React.createElement(GroupCell$1, {
      key: column.key,
      id: row.id,
      groupKey: row.groupKey,
      childRows: row.childRows,
      isExpanded: row.isExpanded,
      isCellSelected: selectedCellIdx === column.idx,
      column: column,
      row: row,
      groupColumnIndex: idx,
      toggleGroup: toggleGroup,
      isGroupByColumn: groupBy.includes(column.key)
    });
  })));
}
const GroupedRow$1 = /*#__PURE__*/memo(GroupedRow);

var _excluded = ["columns", "rows", "rowHeight", "rowKeyGetter", "onCellKeyDown", "onRowsChange", "selectedRows", "onSelectedRowsChange", "renderers", "groupBy", "rowGrouper", "expandedGroupIds", "onExpandedGroupIdsChange"],
  _excluded2 = ["row", "rowClass", "onCellClick", "onCellDoubleClick", "onCellContextMenu", "onRowChange", "lastFrozenColumnIndex", "copiedCellIdx", "draggedOverCellIdx", "setDraggedOverRowIdx", "selectedCellEditor"];
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function TreeDataGrid(_ref, ref) {
  var _ref2, _renderers$renderRow, _props$topSummaryRows, _props$topSummaryRows2, _props$topSummaryRows3, _props$topSummaryRows4, _props$bottomSummaryR, _props$bottomSummaryR2;
  var rawColumns = _ref.columns,
    rawRows = _ref.rows,
    rawRowHeight = _ref.rowHeight,
    rawRowKeyGetter = _ref.rowKeyGetter,
    rawOnCellKeyDown = _ref.onCellKeyDown,
    onRowsChange = _ref.onRowsChange,
    rawSelectedRows = _ref.selectedRows,
    rawOnSelectedRowsChange = _ref.onSelectedRowsChange,
    renderers = _ref.renderers,
    rawGroupBy = _ref.groupBy,
    rowGrouper = _ref.rowGrouper,
    expandedGroupIds = _ref.expandedGroupIds,
    onExpandedGroupIdsChange = _ref.onExpandedGroupIdsChange,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var defaultRenderers = useDefaultRenderers();
  var rawRenderRow = (_ref2 = (_renderers$renderRow = renderers == null ? void 0 : renderers.renderRow) != null ? _renderers$renderRow : defaultRenderers == null ? void 0 : defaultRenderers.renderRow) != null ? _ref2 : defaultRenderRow;
  var headerAndTopSummaryRowsCount = 1 + ((_props$topSummaryRows = (_props$topSummaryRows2 = props.topSummaryRows) == null ? void 0 : _props$topSummaryRows2.length) != null ? _props$topSummaryRows : 0);
  var isRtl = props.direction === 'rtl';
  var leftKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
  var rightKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  var toggleGroupLatest = useLatestFunc(toggleGroup);
  var _useMemo = useMemo(function () {
      var columns = [].concat(rawColumns).sort(function (_ref3, _ref4) {
        var aKey = _ref3.key;
        var bKey = _ref4.key;
        if (aKey === SELECT_COLUMN_KEY) return -1;
        if (bKey === SELECT_COLUMN_KEY) return 1;
        if (rawGroupBy.includes(aKey)) {
          if (rawGroupBy.includes(bKey)) {
            return rawGroupBy.indexOf(aKey) - rawGroupBy.indexOf(bKey);
          }
          return -1;
        }
        if (rawGroupBy.includes(bKey)) return 1;
        return 0;
      });
      var groupBy = [];
      for (var _iterator = _createForOfIteratorHelperLoose(columns.entries()), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
          index = _step$value[0],
          column = _step$value[1];
        if (rawGroupBy.includes(column.key)) {
          var _column$renderGroupCe;
          groupBy.push(column.key);
          columns[index] = _extends({}, column, {
            frozen: true,
            renderCell: function renderCell() {
              return null;
            },
            renderGroupCell: (_column$renderGroupCe = column.renderGroupCell) != null ? _column$renderGroupCe : renderToggleGroup,
            editable: false
          });
        }
      }
      return {
        columns: columns,
        groupBy: groupBy
      };
    }, [rawColumns, rawGroupBy]),
    columns = _useMemo.columns,
    groupBy = _useMemo.groupBy;
  var _useMemo2 = useMemo(function () {
      if (groupBy.length === 0) return [undefined, rawRows.length];
      var groupRows = function groupRows(rows, _ref5, startRowIndex) {
        var groupByKey = _ref5[0],
          remainingGroupByKeys = _ref5.slice(1);
        var groupRowsCount = 0;
        var groups = {};
        for (var _i = 0, _Object$entries = Object.entries(rowGrouper(rows, groupByKey)); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _Object$entries[_i],
            key = _Object$entries$_i[0],
            childRows = _Object$entries$_i[1];
          var _ref6 = remainingGroupByKeys.length === 0 ? [childRows, childRows.length] : groupRows(childRows, remainingGroupByKeys, startRowIndex + groupRowsCount + 1),
            childGroups = _ref6[0],
            childRowsCount = _ref6[1];
          groups[key] = {
            childRows: childRows,
            childGroups: childGroups,
            startRowIndex: startRowIndex + groupRowsCount
          };
          groupRowsCount += childRowsCount + 1;
        }
        return [groups, groupRowsCount];
      };
      return groupRows(rawRows, groupBy, 0);
    }, [groupBy, rowGrouper, rawRows]),
    groupedRows = _useMemo2[0],
    rowsCount = _useMemo2[1];
  var _useMemo3 = useMemo(function () {
      var allGroupRows = new Set();
      if (!groupedRows) return [rawRows, isGroupRow];
      var flattenedRows = [];
      var expandGroup = function expandGroup(rows, parentId, level) {
        if (isReadonlyArray(rows)) {
          flattenedRows.push.apply(flattenedRows, rows);
          return;
        }
        Object.keys(rows).forEach(function (groupKey, posInSet, keys) {
          var id = parentId !== undefined ? parentId + "__" + groupKey : groupKey;
          var isExpanded = expandedGroupIds.has(id);
          var _rows$groupKey = rows[groupKey],
            childRows = _rows$groupKey.childRows,
            childGroups = _rows$groupKey.childGroups,
            startRowIndex = _rows$groupKey.startRowIndex;
          var groupRow = {
            id: id,
            parentId: parentId,
            groupKey: groupKey,
            isExpanded: isExpanded,
            childRows: childRows,
            level: level,
            posInSet: posInSet,
            startRowIndex: startRowIndex,
            setSize: keys.length
          };
          flattenedRows.push(groupRow);
          allGroupRows.add(groupRow);
          if (isExpanded) {
            expandGroup(childGroups, id, level + 1);
          }
        });
      };
      expandGroup(groupedRows, undefined, 0);
      return [flattenedRows, isGroupRow];
      function isGroupRow(row) {
        return allGroupRows.has(row);
      }
    }, [expandedGroupIds, groupedRows, rawRows]),
    rows = _useMemo3[0],
    isGroupRow = _useMemo3[1];
  var rowHeight = useMemo(function () {
    if (typeof rawRowHeight === 'function') {
      return function (row) {
        if (isGroupRow(row)) {
          return rawRowHeight({
            type: 'GROUP',
            row: row
          });
        }
        return rawRowHeight({
          type: 'ROW',
          row: row
        });
      };
    }
    return rawRowHeight;
  }, [isGroupRow, rawRowHeight]);
  var getParentRowAndIndex = useCallback(function (row) {
    var rowIdx = rows.indexOf(row);
    for (var i = rowIdx - 1; i >= 0; i--) {
      var parentRow = rows[i];
      if (isGroupRow(parentRow) && (!isGroupRow(row) || row.parentId === parentRow.id)) {
        return [parentRow, i];
      }
    }
    return undefined;
  }, [isGroupRow, rows]);
  var rowKeyGetter = useCallback(function (row) {
    if (isGroupRow(row)) {
      return row.id;
    }
    if (typeof rawRowKeyGetter === 'function') {
      return rawRowKeyGetter(row);
    }
    var parentRowAndIndex = getParentRowAndIndex(row);
    if (parentRowAndIndex !== undefined) {
      var _parentRowAndIndex$ = parentRowAndIndex[0],
        startRowIndex = _parentRowAndIndex$.startRowIndex,
        childRows = _parentRowAndIndex$.childRows;
      var groupIndex = childRows.indexOf(row);
      return startRowIndex + groupIndex + 1;
    }
    return rows.indexOf(row);
  }, [getParentRowAndIndex, isGroupRow, rawRowKeyGetter, rows]);
  var selectedRows = useMemo(function () {
    if (rawSelectedRows == null) return null;
    assertIsValidKeyGetter(rawRowKeyGetter);
    var selectedRows = new Set(rawSelectedRows);
    for (var _iterator2 = _createForOfIteratorHelperLoose(rows), _step2; !(_step2 = _iterator2()).done;) {
      var _row = _step2.value;
      if (isGroupRow(_row)) {
        var isGroupRowSelected = _row.childRows.every(function (cr) {
          return rawSelectedRows.has(rawRowKeyGetter(cr));
        });
        if (isGroupRowSelected) {
          selectedRows.add(_row.id);
        }
      }
    }
    return selectedRows;
  }, [isGroupRow, rawRowKeyGetter, rawSelectedRows, rows]);
  function onSelectedRowsChange(newSelectedRows) {
    if (!rawOnSelectedRowsChange) return;
    assertIsValidKeyGetter(rawRowKeyGetter);
    var newRawSelectedRows = new Set(rawSelectedRows);
    for (var _iterator3 = _createForOfIteratorHelperLoose(rows), _step3; !(_step3 = _iterator3()).done;) {
      var _row2 = _step3.value;
      var key = rowKeyGetter(_row2);
      if (selectedRows != null && selectedRows.has(key) && !newSelectedRows.has(key)) {
        if (isGroupRow(_row2)) {
          for (var _iterator4 = _createForOfIteratorHelperLoose(_row2.childRows), _step4; !(_step4 = _iterator4()).done;) {
            var cr = _step4.value;
            newRawSelectedRows["delete"](rawRowKeyGetter(cr));
          }
        } else {
          newRawSelectedRows["delete"](key);
        }
      } else if (!(selectedRows != null && selectedRows.has(key)) && newSelectedRows.has(key)) {
        if (isGroupRow(_row2)) {
          for (var _iterator5 = _createForOfIteratorHelperLoose(_row2.childRows), _step5; !(_step5 = _iterator5()).done;) {
            var _cr = _step5.value;
            newRawSelectedRows.add(rawRowKeyGetter(_cr));
          }
        } else {
          newRawSelectedRows.add(key);
        }
      }
    }
    rawOnSelectedRowsChange(newRawSelectedRows);
  }
  function handleKeyDown(args, event) {
    var _column$idx;
    rawOnCellKeyDown == null || rawOnCellKeyDown(args, event);
    if (event.isGridDefaultPrevented()) return;
    if (args.mode === 'EDIT') return;
    var column = args.column,
      rowIdx = args.rowIdx,
      selectCell = args.selectCell;
    var idx = (_column$idx = column == null ? void 0 : column.idx) != null ? _column$idx : -1;
    var row = rows[rowIdx];
    if (!isGroupRow(row)) return;
    if (idx === -1 && (event.key === leftKey && row.isExpanded || event.key === rightKey && !row.isExpanded)) {
      event.preventDefault();
      event.preventGridDefault();
      toggleGroup(row.id);
    }
    if (idx === -1 && event.key === leftKey && !row.isExpanded && row.level !== 0) {
      var parentRowAndIndex = getParentRowAndIndex(row);
      if (parentRowAndIndex !== undefined) {
        event.preventGridDefault();
        selectCell({
          idx: idx,
          rowIdx: parentRowAndIndex[1]
        });
      }
    }
    if (isCtrlKeyHeldDown(event) && (event.keyCode === 67 || event.keyCode === 86)) {
      event.preventGridDefault();
    }
  }
  function handleRowsChange(updatedRows, _ref7) {
    var indexes = _ref7.indexes,
      column = _ref7.column;
    if (!onRowsChange) return;
    var updatedRawRows = [].concat(rawRows);
    var rawIndexes = [];
    for (var _iterator6 = _createForOfIteratorHelperLoose(indexes), _step6; !(_step6 = _iterator6()).done;) {
      var index = _step6.value;
      var rawIndex = rawRows.indexOf(rows[index]);
      updatedRawRows[rawIndex] = updatedRows[index];
      rawIndexes.push(rawIndex);
    }
    onRowsChange(updatedRawRows, {
      indexes: rawIndexes,
      column: column
    });
  }
  function toggleGroup(groupId) {
    var newExpandedGroupIds = new Set(expandedGroupIds);
    if (newExpandedGroupIds.has(groupId)) {
      newExpandedGroupIds["delete"](groupId);
    } else {
      newExpandedGroupIds.add(groupId);
    }
    onExpandedGroupIdsChange(newExpandedGroupIds);
  }
  function renderRow(key, _ref8) {
    var row = _ref8.row,
      rowClass = _ref8.rowClass,
      onCellClick = _ref8.onCellClick,
      onCellDoubleClick = _ref8.onCellDoubleClick,
      onCellContextMenu = _ref8.onCellContextMenu,
      onRowChange = _ref8.onRowChange,
      lastFrozenColumnIndex = _ref8.lastFrozenColumnIndex,
      copiedCellIdx = _ref8.copiedCellIdx,
      draggedOverCellIdx = _ref8.draggedOverCellIdx,
      setDraggedOverRowIdx = _ref8.setDraggedOverRowIdx,
      selectedCellEditor = _ref8.selectedCellEditor,
      rowProps = _objectWithoutPropertiesLoose(_ref8, _excluded2);
    if (isGroupRow(row)) {
      var startRowIndex = row.startRowIndex;
      return /*#__PURE__*/React.createElement(GroupedRow$1, _extends({
        key: key
      }, rowProps, {
        "aria-rowindex": headerAndTopSummaryRowsCount + startRowIndex + 1,
        row: row,
        groupBy: groupBy,
        toggleGroup: toggleGroupLatest
      }));
    }
    var ariaRowIndex = rowProps['aria-rowindex'];
    var parentRowAndIndex = getParentRowAndIndex(row);
    if (parentRowAndIndex !== undefined) {
      var _parentRowAndIndex$2 = parentRowAndIndex[0],
        _startRowIndex = _parentRowAndIndex$2.startRowIndex,
        childRows = _parentRowAndIndex$2.childRows;
      var groupIndex = childRows.indexOf(row);
      ariaRowIndex = _startRowIndex + headerAndTopSummaryRowsCount + groupIndex + 2;
    }
    return rawRenderRow(key, _extends({}, rowProps, {
      'aria-rowindex': ariaRowIndex,
      row: row,
      rowClass: rowClass,
      onCellClick: onCellClick,
      onCellDoubleClick: onCellDoubleClick,
      onCellContextMenu: onCellContextMenu,
      onRowChange: onRowChange,
      lastFrozenColumnIndex: lastFrozenColumnIndex,
      copiedCellIdx: copiedCellIdx,
      draggedOverCellIdx: draggedOverCellIdx,
      setDraggedOverRowIdx: setDraggedOverRowIdx,
      selectedCellEditor: selectedCellEditor
    }));
  }
  return /*#__PURE__*/React.createElement(DataGrid$1, _extends({}, props, {
    role: "treegrid",
    "aria-rowcount": rowsCount + 1 + ((_props$topSummaryRows3 = (_props$topSummaryRows4 = props.topSummaryRows) == null ? void 0 : _props$topSummaryRows4.length) != null ? _props$topSummaryRows3 : 0) + ((_props$bottomSummaryR = (_props$bottomSummaryR2 = props.bottomSummaryRows) == null ? void 0 : _props$bottomSummaryR2.length) != null ? _props$bottomSummaryR : 0),
    ref: ref,
    columns: columns,
    rows: rows,
    rowHeight: rowHeight,
    rowKeyGetter: rowKeyGetter,
    onRowsChange: handleRowsChange,
    selectedRows: selectedRows,
    onSelectedRowsChange: onSelectedRowsChange,
    onCellKeyDown: handleKeyDown,
    renderers: _extends({}, renderers, {
      renderRow: renderRow
    })
  }));
}
function isReadonlyArray(arr) {
  return Array.isArray(arr);
}
const TreeDataGrid$1 = /*#__PURE__*/forwardRef(TreeDataGrid);

var textEditorInternalClassname = "t7vyx3i7-0-0-beta-41";
var textEditorClassname = "rdg-text-editor " + textEditorInternalClassname;
function autoFocusAndSelect(input) {
  input == null || input.focus();
  input == null || input.select();
}
function textEditor(_ref) {
  var row = _ref.row,
    column = _ref.column,
    onRowChange = _ref.onRowChange,
    onClose = _ref.onClose;
  return /*#__PURE__*/React.createElement("input", {
    className: textEditorClassname,
    ref: autoFocusAndSelect,
    value: row[column.key],
    onChange: function onChange(event) {
      var _extends2;
      return onRowChange(_extends({}, row, (_extends2 = {}, _extends2[column.key] = event.target.value, _extends2)));
    },
    onBlur: function onBlur() {
      return onClose(true, false);
    }
  });
}

export { DataGridDefaultRenderersProvider, RowComponent$1 as Row, SELECT_COLUMN_KEY, SelectCellFormatter, SelectColumn, ToggleGroup, TreeDataGrid$1 as TreeDataGrid, DataGrid$1 as default, renderCheckbox, renderHeaderCell, renderSortIcon, renderSortPriority, renderToggleGroup, renderValue, textEditor, useRowSelection };
//# sourceMappingURL=bundle.js.map
