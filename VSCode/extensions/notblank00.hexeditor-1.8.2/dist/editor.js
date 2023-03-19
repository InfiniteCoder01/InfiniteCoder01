(() => {
  // media/editor/byteData.ts
  var ByteData = class {
    constructor(uint8num, offset = 0) {
      this.decimal = uint8num;
      this.adjacentBytes = [];
      this.offset = offset;
    }
    addAdjacentByte(byte_obj) {
      this.adjacentBytes.push(byte_obj);
    }
    toHex() {
      return this.decimal.toString(16).toUpperCase();
    }
    to8bitUInt() {
      return this.decimal;
    }
    toUTF8(littleEndian) {
      let uint8Data = [this.to8bitUInt()];
      for (let i = 0; i < 3 && i < this.adjacentBytes.length; i++) {
        uint8Data.push(this.adjacentBytes[i].to8bitUInt());
      }
      if (!littleEndian) {
        uint8Data = uint8Data.reverse();
      }
      const utf8 = new TextDecoder("utf-8").decode(new Uint8Array(uint8Data));
      for (const char of utf8)
        return char;
      return utf8;
    }
    getOffset() {
      return this.offset;
    }
  };

  // media/editor/util.ts
  var isMac = navigator.userAgent.indexOf("Mac OS X") >= 0;
  var Range = class {
    constructor(start, end = Number.MAX_SAFE_INTEGER) {
      if (start > end) {
        this.start = end;
        this.end = start;
      } else {
        this.start = start;
        this.end = end;
      }
    }
    between(num) {
      if (this.end) {
        return num >= this.start && num <= this.end;
      } else {
        return num >= this.start;
      }
    }
  };
  function withinAnyRange(num, ranges) {
    for (const range of ranges) {
      if (range.between(num)) {
        return true;
      }
    }
    return false;
  }
  function generateCharacterRanges() {
    const ranges = [];
    ranges.push(new Range(0, 31));
    ranges.push(new Range(127, 160));
    ranges.push(new Range(173, 173));
    ranges.push(new Range(256));
    return ranges;
  }
  function getElementsWithGivenOffset(offset) {
    return document.getElementsByClassName(`cell-offset-${offset}`);
  }
  function getElementsOffset(element) {
    for (const currentClass of element.classList) {
      if (currentClass.indexOf("cell-offset") !== -1) {
        const offset = parseInt(currentClass.replace("cell-offset-", ""));
        return offset;
      }
    }
    return NaN;
  }
  function getElementsColumn(element) {
    if (element.classList.contains("hex"))
      return "hex";
    if (element.classList.contains("ascii"))
      return "ascii";
    return;
  }
  function getElementsGivenMouseEvent(event) {
    if (!event || !event.target)
      return [];
    const hovered = event.target;
    return getElementsWithGivenOffset(getElementsOffset(hovered));
  }
  function updateAsciiValue(byteData, asciiElement) {
    asciiElement.classList.remove("nongraphic");
    if (withinAnyRange(byteData.to8bitUInt(), generateCharacterRanges())) {
      asciiElement.classList.add("nongraphic");
      asciiElement.innerText = ".";
    } else {
      const ascii_char = String.fromCharCode(byteData.to8bitUInt());
      asciiElement.innerText = ascii_char;
    }
  }
  function pad(number, width) {
    number = number + "";
    return number.length >= width ? number : new Array(width - number.length + 1).join("0") + number;
  }
  function retrieveSelectedByteObject(elements) {
    var _a, _b, _c;
    for (const [index, element] of Array.from(elements).entries()) {
      if (element.parentElement && element.classList.contains("hex")) {
        const byte_object = new ByteData(parseInt(element.innerHTML, 16), index);
        let current_element = element.nextElementSibling || ((_a = element.parentElement.nextElementSibling) == null ? void 0 : _a.children[0]);
        for (let i = 0; i < 7; i++) {
          if (!current_element || current_element.innerHTML === "+")
            break;
          byte_object.addAdjacentByte(new ByteData(parseInt(current_element.innerHTML, 16), index));
          current_element = current_element.nextElementSibling || ((_c = (_b = current_element.parentElement) == null ? void 0 : _b.nextElementSibling) == null ? void 0 : _c.children[0]);
        }
        return byte_object;
      }
    }
    return;
  }
  function createOffsetRange(startOffset, endOffset) {
    const offsetsToSelect = [];
    if (endOffset < startOffset) {
      const temp = endOffset;
      endOffset = startOffset;
      startOffset = temp;
    }
    for (let i = startOffset; i <= endOffset; i++) {
      offsetsToSelect.push(i);
    }
    return offsetsToSelect;
  }
  function hexQueryToArray(query) {
    let currentCharacterSequence = "";
    const queryArray = [];
    for (let i = 0; i < query.length; i++) {
      if (query[i] === " ")
        continue;
      currentCharacterSequence += query[i];
      if (currentCharacterSequence.length === 2) {
        queryArray.push(currentCharacterSequence);
        currentCharacterSequence = "";
      }
    }
    if (currentCharacterSequence.length > 0) {
      queryArray.push("0" + currentCharacterSequence);
    }
    return queryArray;
  }
  function disjunction(one, other) {
    const result = [];
    let i = 0, j = 0;
    while (i < one.length || j < other.length) {
      if (i >= one.length) {
        result.push(other[j++]);
      } else if (j >= other.length) {
        result.push(one[i++]);
      } else if (one[i] === other[j]) {
        result.push(one[i]);
        i++;
        j++;
        continue;
      } else if (one[i] < other[j]) {
        result.push(one[i++]);
      } else {
        result.push(other[j++]);
      }
    }
    return result;
  }
  function relativeComplement(one, other) {
    const result = [];
    let i = 0, j = 0;
    while (i < one.length || j < other.length) {
      if (i >= one.length) {
        result.push(other[j++]);
      } else if (j >= other.length) {
        result.push(one[i++]);
      } else if (one[i] === other[j]) {
        i++;
        j++;
        continue;
      } else if (one[i] < other[j]) {
        result.push(one[i++]);
      } else {
        result.push(other[j++]);
      }
    }
    return result;
  }
  function binarySearch(array, key, comparator) {
    let low = 0, high = array.length - 1;
    while (low <= high) {
      const mid = (low + high) / 2 | 0;
      const comp = comparator(array[mid], key);
      if (comp < 0) {
        low = mid + 1;
      } else if (comp > 0) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    return -(low + 1);
  }

  // media/editor/eventHandlers.ts
  function toggleHover(event) {
    const elements = getElementsGivenMouseEvent(event);
    if (elements.length === 0)
      return;
    elements[0].classList.toggle("hover");
    elements[1].classList.toggle("hover");
  }

  // media/editor/webviewStateManager.ts
  var WebviewStateManager = class {
    static setProperty(propertyName, propertyValue) {
      let currentState = WebviewStateManager.getState();
      if (currentState === void 0) {
        currentState = {};
      }
      currentState[propertyName] = propertyValue;
      vscode.setState(currentState);
    }
    static clearState() {
      vscode.setState();
    }
    static getState() {
      return typeof vscode.getState() === "string" ? JSON.parse(vscode.getState()) : vscode.getState();
    }
    static setState(state) {
      vscode.setState(state);
    }
    static getProperty(propertyName) {
      const state = WebviewStateManager.getState();
      return state[propertyName];
    }
  };

  // media/editor/scrollBarHandler.ts
  var ScrollBarHandler = class {
    constructor(scrollBarId, numRows, rowHeight) {
      this.scrollTop = 0;
      this.isDragging = false;
      if (document.getElementById(scrollBarId)) {
        this.scrollBar = document.getElementById(scrollBarId);
        this.scrollThumb = this.scrollBar.children[0];
      } else {
        this.scrollBar = document.createElement("div");
        this.scrollThumb = document.createElement("div");
        throw "Invalid scrollbar id!";
      }
      window.addEventListener("wheel", this.onMouseWheel.bind(this));
      this.scrollBar.addEventListener("mousedown", () => {
        this.scrollThumb.classList.add("scrolling");
        this.isDragging = true;
      });
      this.scrollBar.addEventListener("mouseup", () => {
        this.scrollThumb.classList.remove("scrolling");
        this.isDragging = false;
      });
      window.addEventListener("mousemove", this.scrollThumbDrag.bind(this));
      this.rowHeight = rowHeight;
      this.updateScrollBar(numRows);
    }
    updateScrollBar(numRows) {
      const contentHeight = (numRows + 1) * this.rowHeight;
      this.scrollBarHeight = this.scrollBar.clientHeight;
      this.scrollThumbHeight = Math.min(this.scrollBarHeight, Math.max(this.scrollBarHeight * (this.scrollBarHeight / contentHeight), 30));
      this.scrollThumb.style.height = `${this.scrollThumbHeight}px`;
      this.scrollJump = Math.max(0, (contentHeight - this.scrollBarHeight) / (this.scrollBarHeight - this.scrollThumbHeight));
      this.updateScrolledPosition();
    }
    scrollThumbDrag(event) {
      if (this.scrollBarHeight === this.scrollThumbHeight)
        return;
      if (!this.isDragging || event.buttons == 0) {
        this.isDragging = false;
        this.scrollThumb.classList.remove("scrolling");
        return;
      }
      event.preventDefault();
      this.updateVirtualScrollTop(event.clientY * this.scrollJump);
      this.updateScrolledPosition();
    }
    async updateScrolledPosition() {
      if (!virtualHexDocument || !virtualHexDocument.documentHeight)
        return [];
      this.scrollThumb.style.transform = `translateY(${this.scrollTop / this.scrollJump}px)`;
      document.getElementsByClassName("rowwrapper")[0].style.transform = `translateY(-${this.scrollTop % virtualHexDocument.documentHeight}px)`;
      document.getElementsByClassName("rowwrapper")[1].style.transform = `translateY(-${this.scrollTop % virtualHexDocument.documentHeight}px)`;
      document.getElementsByClassName("rowwrapper")[2].style.transform = `translateY(-${this.scrollTop % virtualHexDocument.documentHeight}px)`;
      return virtualHexDocument.scrollHandler();
    }
    onMouseWheel(event) {
      if (this.scrollBarHeight === this.scrollThumbHeight)
        return;
      if (event.deltaY === 0 || event.shiftKey)
        return;
      if (isMac && Math.abs(event.deltaY) !== 120) {
        switch (event.deltaMode) {
          case WheelEvent.DOM_DELTA_LINE:
            if (event.deltaY > 0) {
              this.updateVirtualScrollTop(this.scrollTop + this.rowHeight);
            } else {
              this.updateVirtualScrollTop(this.scrollTop - this.rowHeight);
            }
            break;
          case WheelEvent.DOM_DELTA_PIXEL:
          default:
            this.updateVirtualScrollTop(this.scrollTop + event.deltaY);
        }
      } else {
        if (event.deltaY > 0) {
          this.updateVirtualScrollTop(this.scrollTop + this.rowHeight);
        } else {
          this.updateVirtualScrollTop(this.scrollTop - this.rowHeight);
        }
      }
      this.updateScrolledPosition();
    }
    async scrollDocument(numRows, direction) {
      if (direction === "up") {
        this.updateVirtualScrollTop(this.scrollTop - this.rowHeight * numRows);
      } else {
        this.updateVirtualScrollTop(this.scrollTop + this.rowHeight * numRows);
      }
      return this.updateScrolledPosition();
    }
    scrollToTop() {
      this.updateVirtualScrollTop(0);
      this.updateScrolledPosition();
    }
    scrollToBottom() {
      this.updateVirtualScrollTop((this.scrollBarHeight - this.scrollThumbHeight) * this.scrollJump + this.rowHeight);
      this.updateScrolledPosition();
    }
    page(viewportHeight, direction) {
      if (direction == "up") {
        this.updateVirtualScrollTop(this.scrollTop - viewportHeight);
      } else {
        this.updateVirtualScrollTop(this.scrollTop + viewportHeight);
      }
      this.updateScrolledPosition();
    }
    updateVirtualScrollTop(newScrollTop) {
      this.scrollTop = Math.max(0, newScrollTop);
      newScrollTop = this.scrollTop;
      this.scrollTop = Math.min(newScrollTop, (this.scrollBarHeight - this.scrollThumbHeight) * this.scrollJump + this.rowHeight);
      WebviewStateManager.setProperty("scroll_top", this.scrollTop);
    }
    get virtualScrollTop() {
      return this.scrollTop;
    }
    resyncScrollPosition() {
      if (WebviewStateManager.getState() && WebviewStateManager.getState().scroll_top) {
        this.updateVirtualScrollTop(WebviewStateManager.getState().scroll_top);
        this.updateScrolledPosition();
      }
    }
    async scrollToOffset(offset, force) {
      if (this.scrollBarHeight === this.scrollThumbHeight)
        return [];
      const topOffset = virtualHexDocument.topOffset();
      if (!force && offset >= topOffset && offset <= virtualHexDocument.bottomOffset())
        return [];
      const rowDifference = Math.floor(Math.abs(offset - topOffset) / 16);
      if (offset > topOffset) {
        return this.scrollDocument(rowDifference - 3, "down");
      } else {
        return this.scrollDocument(rowDifference + 3, "up");
      }
    }
  };

  // media/editor/selectHandler.ts
  var SelectHandler = class {
    constructor() {
      this._selection = [];
    }
    static toggleSelectOffset(offset, force) {
      const elements = getElementsWithGivenOffset(offset);
      if (elements.length === 0) {
        return;
      }
      elements[0].classList.toggle("selected", force);
      elements[1].classList.toggle("selected", force);
    }
    getFocused() {
      return this._focus;
    }
    setFocused(offset) {
      this._focus = offset;
    }
    getSelectionStart() {
      var _a;
      return (_a = this._selectionStart) != null ? _a : this._focus;
    }
    getSelected() {
      var _a;
      return (_a = WebviewStateManager.getProperty("selected_offsets")) != null ? _a : [];
    }
    setSelected(offsets, forceRender = false) {
      const oldSelection = this._selection;
      this._selection = [...offsets].sort((a, b) => a - b);
      this._selectionStart = this._selection[0];
      WebviewStateManager.setProperty("selected_offsets", this._selection);
      const toRender = forceRender ? disjunction(oldSelection, this._selection) : relativeComplement(oldSelection, this._selection);
      this.renderSelection(toRender);
    }
    getAnchor() {
      return WebviewStateManager.getProperty("selection_anchor");
    }
    setAnchor(offset) {
      WebviewStateManager.setProperty("selection_anchor", offset);
    }
    renderSelection(offsets) {
      const contains = (offset) => binarySearch(this._selection, offset, (a, b) => a - b) >= 0;
      for (const offset of offsets) {
        SelectHandler.toggleSelectOffset(offset, contains(offset));
      }
    }
    static getSelectedHex() {
      const hex = [];
      const selected = document.getElementsByClassName("selected hex");
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].innerText === "+")
          continue;
        hex.push(selected[i].innerText);
      }
      return hex;
    }
    static focusSelection(section) {
      const selection = document.getElementsByClassName(`selected ${section}`);
      if (selection.length !== 0)
        selection[0].focus();
    }
    static getSelectedValue() {
      var _a;
      let selectedValue = "";
      let section = "hex";
      let selectedElements;
      if ((_a = document.activeElement) == null ? void 0 : _a.classList.contains("ascii")) {
        section = "ascii";
        selectedElements = document.getElementsByClassName("selected ascii");
      } else {
        selectedElements = document.getElementsByClassName("selected hex");
      }
      for (const element of selectedElements) {
        if (element.innerText === "+")
          continue;
        selectedValue += element.innerText;
        if (section === "hex")
          selectedValue += " ";
      }
      if (section === "hex")
        selectedValue = selectedValue.trimRight();
      return selectedValue;
    }
  };

  // media/editor/editHandler.ts
  var EditHandler = class {
    constructor() {
      this.pendingEdit = void 0;
    }
    async editHex(element, keyPressed) {
      if (keyPressed === "Escape" && this.pendingEdit && this.pendingEdit.previousValue) {
        element.innerText = this.pendingEdit.previousValue;
        element.classList.remove("editing");
        this.pendingEdit = void 0;
      }
      const regex = new RegExp(/^[a-fA-F0-9]$/gm);
      if (keyPressed.match(regex) === null && keyPressed !== "Delete") {
        return;
      }
      const offset = getElementsOffset(element);
      if (!this.pendingEdit || this.pendingEdit.offset != offset) {
        this.pendingEdit = {
          offset,
          previousValue: element.innerText === "+" ? void 0 : element.innerText,
          newValue: "",
          element
        };
      }
      element.classList.add("editing");
      element.innerText = element.innerText.trimRight();
      if (keyPressed === "Delete") {
        element.innerText = "  ";
      } else {
        element.innerText = element.innerText.length !== 1 || element.innerText === "+" ? `${keyPressed.toUpperCase()} ` : element.innerText + keyPressed.toUpperCase();
      }
      this.pendingEdit.newValue = element.innerText;
      if (element.innerText.trimRight().length == 2) {
        element.classList.remove("add-cell");
        if (this.pendingEdit.newValue == this.pendingEdit.previousValue) {
          this.pendingEdit = void 0;
          return;
        }
        await this.sendEditToExtHost([this.pendingEdit]);
        this.updateAscii(element.innerText, offset);
        element.classList.add("edited");
        if (!this.pendingEdit.previousValue) {
          virtualHexDocument.createAddCell();
        }
        this.pendingEdit = void 0;
      }
    }
    async editAscii(element, keyPressed) {
      if (keyPressed.length != 1)
        return;
      const offset = getElementsOffset(element);
      const hexElement = getElementsWithGivenOffset(offset)[0];
      const newValueHex = keyPressed.charCodeAt(0).toString(16).toUpperCase();
      if (hexElement.innerText === newValueHex) {
        return;
      }
      this.pendingEdit = {
        offset,
        previousValue: hexElement.innerText === "+" ? void 0 : hexElement.innerText,
        newValue: newValueHex,
        element
      };
      element.classList.remove("add-cell");
      element.classList.add("editing");
      element.classList.add("edited");
      this.updateAscii(this.pendingEdit.newValue, offset);
      this.updateHex(keyPressed, offset);
      await this.sendEditToExtHost([this.pendingEdit]);
      if (!this.pendingEdit.previousValue) {
        virtualHexDocument.createAddCell();
      }
      this.pendingEdit = void 0;
    }
    updateAscii(hexValue, offset) {
      if (!hexValue)
        return;
      const ascii = getElementsWithGivenOffset(offset)[1];
      ascii.classList.remove("add-cell");
      updateAsciiValue(new ByteData(parseInt(hexValue, 16), offset), ascii);
      ascii.classList.add("edited");
    }
    updateHex(asciiValue, offset) {
      const hex = getElementsWithGivenOffset(offset)[0];
      hex.innerText = asciiValue.charCodeAt(0).toString(16).toUpperCase();
      hex.classList.remove("add-cell");
      hex.classList.add("edited");
    }
    async completePendingEdits() {
      if (this.pendingEdit && this.pendingEdit.element && this.pendingEdit.newValue) {
        if (this.pendingEdit.element.classList.contains("selected"))
          return;
        this.pendingEdit.newValue = "00" + this.pendingEdit.newValue.trimRight();
        this.pendingEdit.newValue = this.pendingEdit.newValue.slice(this.pendingEdit.newValue.length - 2);
        this.pendingEdit.element.classList.remove("editing");
        this.pendingEdit.element.innerText = this.pendingEdit.newValue;
        if (this.pendingEdit.newValue === this.pendingEdit.previousValue) {
          return;
        }
        this.updateAscii(this.pendingEdit.newValue, this.pendingEdit.offset);
        this.pendingEdit.element.classList.add("edited");
        this.pendingEdit.element.classList.remove("add-cell");
        await this.sendEditToExtHost([this.pendingEdit]);
        if (!this.pendingEdit.previousValue) {
          virtualHexDocument.createAddCell();
        }
        this.pendingEdit = void 0;
      }
    }
    async sendEditToExtHost(edits) {
      const extHostMessage = [];
      for (const edit of edits) {
        const oldValue = edit.previousValue ? parseInt(edit.previousValue, 16) : void 0;
        const newValue = edit.newValue ? parseInt(edit.newValue, 16) : void 0;
        const currentMessage = {
          offset: edit.offset,
          oldValue,
          newValue,
          sameOnDisk: false
        };
        extHostMessage.push(currentMessage);
      }
      try {
        const syncedFileSize = (await messageHandler.postMessageWithResponse("edit", extHostMessage)).fileSize;
        virtualHexDocument.updateDocumentSize(syncedFileSize);
      } catch (e) {
        return;
      }
    }
    undo(edits) {
      if (edits.length > 1 && edits[0].offset < edits[edits.length - 1].offset) {
        edits = edits.reverse();
      }
      for (const edit of edits) {
        if (edit.oldValue === void 0) {
          virtualHexDocument.focusElementWithGivenOffset(virtualHexDocument.documentSize);
          virtualHexDocument.removeLastCell();
          continue;
        }
        const elements = getElementsWithGivenOffset(edit.offset);
        if (elements.length != 2)
          return;
        if (edit.sameOnDisk) {
          elements[0].classList.remove("edited");
          elements[1].classList.remove("edited");
        } else {
          elements[0].classList.add("edited");
          elements[1].classList.add("edited");
        }
        elements[0].innerText = edit.oldValue.toString(16).toUpperCase();
        elements[0].innerText = elements[0].innerText.length == 2 ? elements[0].innerText : `0${elements[0].innerText}`;
        updateAsciiValue(new ByteData(edit.oldValue, edit.offset), elements[1]);
        virtualHexDocument.focusElementWithGivenOffset(edit.offset);
      }
    }
    redo(edits) {
      for (const edit of edits) {
        if (edit.newValue === void 0)
          continue;
        const elements = getElementsWithGivenOffset(edit.offset);
        if (elements.length != 2)
          continue;
        elements[0].classList.remove("add-cell");
        elements[1].classList.remove("add-cell");
        if (edit.sameOnDisk) {
          elements[0].classList.remove("edited");
          elements[1].classList.remove("edited");
        } else {
          elements[0].classList.add("edited");
          elements[1].classList.add("edited");
        }
        elements[0].innerText = edit.newValue.toString(16).toUpperCase();
        elements[0].innerText = elements[0].innerText.length == 2 ? elements[0].innerText : `0${elements[0].innerText}`;
        updateAsciiValue(new ByteData(edit.newValue, edit.offset), elements[1]);
        if (document.getElementsByClassName("add-cell").length === 0 && edit.oldValue === void 0) {
          virtualHexDocument.updateDocumentSize(virtualHexDocument.documentSize + 1);
          virtualHexDocument.createAddCell();
        }
        virtualHexDocument.focusElementWithGivenOffset(edit.offset);
      }
    }
    copy(event) {
      var _a, _b;
      (_a = event.clipboardData) == null ? void 0 : _a.setData("text/json", JSON.stringify(SelectHandler.getSelectedHex()));
      (_b = event.clipboardData) == null ? void 0 : _b.setData("text/plain", SelectHandler.getSelectedValue());
      event.preventDefault();
    }
    async paste(event) {
      if (!event.clipboardData || event.clipboardData.types.indexOf("text/json") < 0)
        return;
      const hexData = JSON.parse(event.clipboardData.getData("text/json"));
      const selected = Array.from(document.getElementsByClassName("selected hex"));
      const edits = [];
      for (let i = 0; i < selected.length && i < hexData.length; i++) {
        const element = selected[i];
        const offset = getElementsOffset(element);
        const currentEdit = {
          offset,
          previousValue: element.innerText === "+" ? void 0 : element.innerText,
          newValue: hexData[i],
          element
        };
        element.classList.remove("add-cell");
        if (currentEdit.newValue == currentEdit.previousValue) {
          continue;
        }
        element.innerText = hexData[i];
        this.updateAscii(element.innerText, offset);
        element.classList.add("edited");
        if (currentEdit.previousValue === void 0) {
          virtualHexDocument.updateDocumentSize(virtualHexDocument.documentSize + 1);
          virtualHexDocument.createAddCell();
          selected.push(getElementsWithGivenOffset(virtualHexDocument.documentSize)[0]);
        }
        edits.push(currentEdit);
      }
      await this.sendEditToExtHost(edits);
      event.preventDefault();
    }
    revert() {
      virtualHexDocument.reRequestChunks();
    }
  };

  // media/editor/searchHandler.ts
  var SearchHandler = class {
    constructor() {
      this.searchType = "hex";
      this.resultIndex = 0;
      this.preserveCase = false;
      var _a;
      this.searchContainer = document.getElementById("search-container");
      this.searchContainer.innerHTML = SearchHandler.getSearchWidgetHTML();
      this.searchResults = [];
      this.searchOptions = {
        regex: false,
        caseSensitive: false
      };
      this.findTextBox = document.getElementById("find");
      this.replaceTextBox = document.getElementById("replace");
      this.replaceButton = document.getElementById("replace-btn");
      this.replaceAllButton = document.getElementById("replace-all");
      this.findPreviousButton = document.getElementById("find-previous");
      this.findNextButton = document.getElementById("find-next");
      this.stopSearchButton = document.getElementById("search-stop");
      const closeButton = document.getElementById("close");
      this.findNextButton.addEventListener("click", () => this.findNext(true));
      this.findPreviousButton.addEventListener("click", () => this.findPrevious(true));
      this.updateInputGlyphs();
      (_a = document.getElementById("data-type")) == null ? void 0 : _a.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        this.searchType = selectedValue;
        this.updateInputGlyphs();
        this.search();
      });
      this.searchOptionsHandler();
      this.replaceOptionsHandler();
      this.findTextBox.addEventListener("keyup", (event) => {
        if ((event.key === "Enter" || event.key === "F3") && event.shiftKey) {
          this.findPrevious(false);
        } else if (event.key === "Enter" || event.key === "F3") {
          this.findNext(false);
        } else if (event.key === "Escape") {
          this.hideWidget();
          const selected = document.getElementsByClassName(`selected ${this.searchType}`)[0];
          if (selected !== void 0) {
            selected.focus();
          } else {
            virtualHexDocument.focusElementWithGivenOffset(virtualHexDocument.topOffset());
          }
        } else if (event.ctrlKey || new RegExp("(^Arrow|^End|^Home)", "i").test(event.key)) {
          return;
        } else {
          this.search();
        }
      });
      window.addEventListener("keyup", (event) => {
        if (event.key === "F3" && event.shiftKey && document.activeElement !== this.findTextBox) {
          this.findPrevious(true);
          event.preventDefault();
        } else if (event.key === "F3" && document.activeElement !== this.findTextBox) {
          this.findNext(true);
          event.preventDefault();
        }
      });
      this.replaceTextBox.addEventListener("keyup", this.updateReplaceButtons.bind(this));
      this.replaceButton.addEventListener("click", () => this.replace(false));
      this.replaceAllButton.addEventListener("click", () => this.replace(true));
      this.stopSearchButton.addEventListener("click", this.cancelSearch.bind(this));
      closeButton.addEventListener("click", () => this.hideWidget());
      document.getElementById("find-message-box").hidden = true;
      document.getElementById("replace-message-box").hidden = true;
    }
    static getSearchWidgetHTML() {
      return `
        <div class="header">
            SEARCH IN
            <span>
                <select id="data-type" class="inline-select">
                    <option value="hex">Hex</option>
                    <option value="ascii">Text</option>
                </select>
            </span>
        </div>
        <div class="search-widget">
            <div class="bar find-bar">
                <span class="input-glyph-group">
                    <input type="text" autocomplete="off" spellcheck="off" name="find" id="find" placeholder="Find"/>
                    <span class="bar-glyphs">
                        <span class="codicon codicon-case-sensitive" id="case-sensitive" title="Match Case"></span>
                        <span class="codicon codicon-regex" id="regex-icon" title="Use Regular Expression"></span>
                    </span>
                    <div id="find-message-box">
                    </div>
                </span>
                <span class="icon-group">
                    <span class="codicon codicon-search-stop disabled" id="search-stop" title="Cancel Search"></span>
                    <span class="codicon codicon-arrow-up disabled" id="find-previous" title="Previous Match"></span>
                    <span class="codicon codicon-arrow-down disabled" id="find-next" title="Next Match"></span>
										<span class ="codicon codicon-close" id="close" title="Close (Escape)"></span>
                </span>
            </div>
            <div class="bar replace-bar">
                <span class="input-glyph-group">
                    <input type="text" autocomplete="off" spellcheck="off" name="replace" id="replace" placeholder="Replace"/>
                    <span class="bar-glyphs">
                        <span class="codicon codicon-preserve-case" id="preserve-case" title="Preserve Case"></span>
                    </span>
                    <div id="replace-message-box">
                        </div>
                </span>
                <span class="icon-group">
                    <span class="codicon codicon-replace disabled" id="replace-btn" title="Replace"></span>
                    <span class="codicon codicon-replace-all disabled" id="replace-all" title="Replace All"></span>
                </span>
            </div>
        </div>`;
    }
    async search() {
      if (this.findTextBox.value === "") {
        this.removeInputMessage("find");
        return;
      }
      this.cancelSearch();
      virtualHexDocument.setSelection([]);
      this.searchResults = [];
      this.updateReplaceButtons();
      this.findNextButton.classList.add("disabled");
      this.findPreviousButton.classList.add("disabled");
      let query = this.findTextBox.value;
      const hexSearchRegex = new RegExp("^[a-fA-F0-9? ]+$");
      if (this.searchType === "hex" && !hexSearchRegex.test(query)) {
        if (query.length > 0)
          this.addInputMessage("find", "Invalid query", "error");
        return;
      }
      if (this.searchOptions.regex) {
        try {
          new RegExp(query);
        } catch (err) {
          const message = err.message.substr(0, 27) + "\n" + err.message.substr(27);
          this.addInputMessage("find", message, "error");
          return;
        }
      }
      query = this.searchType === "hex" ? hexQueryToArray(query) : query;
      if (query.length === 0) {
        if (this.findTextBox.value.length > 0)
          this.addInputMessage("find", "Invalid query", "error");
        return;
      }
      this.stopSearchButton.classList.remove("disabled");
      let results;
      this.removeInputMessage("find");
      try {
        results = (await messageHandler.postMessageWithResponse("search", {
          query,
          type: this.searchType,
          options: this.searchOptions
        })).results;
      } catch (err) {
        this.stopSearchButton.classList.add("disabled");
        this.addInputMessage("find", "Search returned an error!", "error");
        return;
      }
      if (results.partial) {
        this.addInputMessage("find", "Partial results returned, try\n narrowing your query.", "warning");
      }
      this.stopSearchButton.classList.add("disabled");
      this.resultIndex = 0;
      this.searchResults = results.result;
      if (this.searchResults.length !== 0) {
        await virtualHexDocument.scrollDocumentToOffset(this.searchResults[this.resultIndex][0]);
        virtualHexDocument.setSelection(this.searchResults[this.resultIndex]);
        if (this.resultIndex + 1 < this.searchResults.length) {
          this.findNextButton.classList.remove("disabled");
        }
        this.updateReplaceButtons();
      }
    }
    async findNext(focus) {
      if (this.findNextButton.classList.contains("disabled"))
        return;
      await virtualHexDocument.scrollDocumentToOffset(this.searchResults[++this.resultIndex][0]);
      virtualHexDocument.setSelection(this.searchResults[this.resultIndex]);
      if (focus)
        SelectHandler.focusSelection(this.searchType);
      if (this.resultIndex < this.searchResults.length - 1) {
        this.findNextButton.classList.remove("disabled");
      } else {
        this.findNextButton.classList.add("disabled");
      }
      if (this.resultIndex != 0) {
        this.findPreviousButton.classList.remove("disabled");
      }
    }
    async findPrevious(focus) {
      if (this.findPreviousButton.classList.contains("disabled"))
        return;
      await virtualHexDocument.scrollDocumentToOffset(this.searchResults[--this.resultIndex][0]);
      virtualHexDocument.setSelection(this.searchResults[this.resultIndex]);
      if (focus)
        SelectHandler.focusSelection(this.searchType);
      this.findNextButton.classList.remove("disabled");
      if (this.resultIndex == 0) {
        this.findPreviousButton.classList.add("disabled");
      }
    }
    updateInputGlyphs() {
      const inputGlyphs = document.getElementsByClassName("bar-glyphs");
      const inputFields = document.querySelectorAll(".bar > .input-glyph-group > input");
      if (this.searchType == "hex") {
        inputGlyphs[0].hidden = true;
        inputGlyphs[1].hidden = true;
        document.documentElement.style.setProperty("--input-glyph-padding", "0px");
      } else {
        for (let i = 0; i < inputGlyphs.length; i++) {
          inputGlyphs[i].hidden = false;
        }
        const glyphRect = inputGlyphs[0].getBoundingClientRect();
        const inputRect = inputFields[0].getBoundingClientRect();
        const inputPadding = inputRect.x + inputRect.width + 1 - glyphRect.x;
        document.documentElement.style.setProperty("--input-glyph-padding", `${inputPadding}px`);
      }
    }
    searchOptionsHandler() {
      var _a, _b;
      (_a = document.getElementById("regex-icon")) == null ? void 0 : _a.addEventListener("click", (event) => {
        const regexIcon = event.target;
        if (regexIcon.classList.contains("toggled")) {
          this.searchOptions.regex = false;
          regexIcon.classList.remove("toggled");
        } else {
          this.searchOptions.regex = true;
          regexIcon.classList.add("toggled");
        }
        this.search();
      });
      (_b = document.getElementById("case-sensitive")) == null ? void 0 : _b.addEventListener("click", (event) => {
        const caseSensitive = event.target;
        if (caseSensitive.classList.contains("toggled")) {
          this.searchOptions.caseSensitive = false;
          caseSensitive.classList.remove("toggled");
        } else {
          this.searchOptions.caseSensitive = true;
          caseSensitive.classList.add("toggled");
        }
        this.search();
      });
    }
    replaceOptionsHandler() {
      var _a;
      (_a = document.getElementById("preserve-case")) == null ? void 0 : _a.addEventListener("click", (event) => {
        const preserveCase = event.target;
        if (preserveCase.classList.contains("toggled")) {
          this.preserveCase = false;
          preserveCase.classList.remove("toggled");
        } else {
          this.preserveCase = true;
          preserveCase.classList.add("toggled");
        }
      });
    }
    cancelSearch() {
      if (this.stopSearchButton.classList.contains("disabled"))
        return;
      this.stopSearchButton.classList.add("disabled");
      messageHandler.postMessageWithResponse("search", { cancel: true });
    }
    updateReplaceButtons() {
      this.removeInputMessage("replace");
      const hexReplaceRegex = new RegExp("^[a-fA-F0-9]+$");
      const queryNoSpaces = this.replaceTextBox.value.replace(/\s/g, "");
      if (this.searchType === "hex" && !hexReplaceRegex.test(queryNoSpaces)) {
        this.replaceAllButton.classList.add("disabled");
        this.replaceButton.classList.add("disabled");
        if (this.replaceTextBox.value.length > 0)
          this.addInputMessage("replace", "Invalid replacement", "error");
        return;
      }
      const replaceQuery = this.replaceTextBox.value;
      const replaceArray = this.searchType === "hex" ? hexQueryToArray(replaceQuery) : Array.from(replaceQuery);
      if (this.searchResults.length !== 0 && replaceArray.length !== 0) {
        this.replaceAllButton.classList.remove("disabled");
        this.replaceButton.classList.remove("disabled");
      } else {
        if (this.replaceTextBox.value.length > 0 && replaceArray.length === 0)
          this.addInputMessage("replace", "Invalid replacement", "error");
        this.replaceAllButton.classList.add("disabled");
        this.replaceButton.classList.add("disabled");
      }
    }
    async replace(all) {
      const replaceQuery = this.replaceTextBox.value;
      const replaceArray = this.searchType === "hex" ? hexQueryToArray(replaceQuery) : Array.from(replaceQuery);
      let replaceBits = [];
      if (this.searchType === "hex") {
        replaceBits = replaceArray.map((val) => parseInt(val, 16));
      } else {
        replaceBits = replaceArray.map((val) => val.charCodeAt(0));
      }
      let offsets = [];
      if (all) {
        offsets = this.searchResults;
      } else {
        offsets = [this.searchResults[this.resultIndex]];
      }
      const edits = (await messageHandler.postMessageWithResponse("replace", {
        query: replaceBits,
        offsets,
        preserveCase: this.preserveCase
      })).edits;
      virtualHexDocument.redo(edits, virtualHexDocument.documentSize);
      this.findNext(true);
    }
    searchKeybindingHandler() {
      var _a;
      this.showWidget();
      this.searchType = ((_a = document.activeElement) == null ? void 0 : _a.classList.contains("ascii")) ? "ascii" : "hex";
      const dataTypeSelect = document.getElementById("data-type");
      dataTypeSelect.value = this.searchType;
      dataTypeSelect.dispatchEvent(new Event("change"));
      this.findTextBox.focus();
    }
    addInputMessage(inputBoxName, message, type) {
      const inputBox = inputBoxName === "find" ? this.findTextBox : this.replaceTextBox;
      const messageBox = document.getElementById(`${inputBoxName}-message-box`);
      if (messageBox.innerText === message && messageBox.classList.contains(`input-${type}`)) {
        return;
      } else if (messageBox.classList.contains(`input-${type}`)) {
        messageBox.innerText = message;
        return;
      } else {
        this.removeInputMessage("find", true);
        messageBox.innerText = message;
        inputBox.classList.add(`${type}-border`);
        messageBox.classList.add(`${type}-border`, `input-${type}`);
        messageBox.hidden = false;
      }
    }
    removeInputMessage(inputBoxName, skipHiding) {
      const inputBox = inputBoxName === "find" ? this.findTextBox : this.replaceTextBox;
      const errorMessageBox = document.getElementById(`${inputBoxName}-message-box`);
      inputBox.classList.remove("error-border", "warning-border");
      errorMessageBox.classList.remove("error-border", "warning-border", "input-warning", "input-error");
      if (skipHiding !== true)
        errorMessageBox.hidden = true;
    }
    showWidget() {
      if (this.searchContainer.style.display === "block")
        return;
      this.searchContainer.style.display = "block";
      let currentTop = -85;
      const frameInterval = setInterval(() => {
        if (currentTop === -4) {
          clearInterval(frameInterval);
        } else {
          currentTop++;
          this.searchContainer.style.top = `${currentTop}px`;
        }
      }, 3);
    }
    hideWidget() {
      let currentTop = -4;
      const frameInterval = setInterval(() => {
        if (currentTop === -85) {
          this.searchContainer.style.display = "none";
          clearInterval(frameInterval);
        } else {
          currentTop--;
          this.searchContainer.style.top = `${currentTop}px`;
        }
      }, 3);
    }
  };

  // media/editor/dataInspectorHandler.ts
  var DataInspectorHandler = class {
    static clearInspector() {
      messageHandler.postMessage("dataInspector", {
        method: "clear"
      });
    }
    static updateInspector(byte_obj, tags) {
      messageHandler.postMessage("dataInspector", {
        method: "update",
        byteData: byte_obj,
        offset: byte_obj.getOffset(),
        tags
      });
    }
  };

  // media/editor/virtualDocument.ts
  var VirtualDocument = class {
    constructor(fileSize, editorFontSize, baseAddress = 0) {
      this.tags = [];
      this.fileSize = fileSize;
      this.baseAddress = baseAddress;
      this.editHandler = new EditHandler();
      this.selectHandler = new SelectHandler();
      this.searchHandler = new SearchHandler();
      this.editorContainer = document.getElementById("editor-container");
      this.rowHeight = editorFontSize * 2;
      document.getElementsByClassName("header")[2].style.width = "16rem";
      this.documentHeight = 5e5;
      this.rows = [];
      for (let i = 0; i < 3; i++) {
        this.rows.push(new Map());
      }
      const headerHeight = document.getElementsByClassName("header")[0].offsetHeight;
      document.getElementsByClassName("header")[0].style.visibility = "hidden";
      document.getElementsByClassName("header")[0].style.height = `${headerHeight + 1}px`;
      this.scrollBarHandler = new ScrollBarHandler("scrollbar", this.fileSize / 16, this.rowHeight);
      this.documentResize();
      this.bindEventListeners();
    }
    render(newPackets, tags) {
      var _a, _b, _c;
      this.tags = tags;
      let rowData = [];
      const addrFragment = document.createDocumentFragment();
      const hexFragment = document.createDocumentFragment();
      const asciiFragment = document.createDocumentFragment();
      for (let i = 0; i < newPackets.length; i++) {
        rowData.push(newPackets[i]);
        if (i === newPackets.length - 1 || rowData.length == 16) {
          if (!this.rows[0].get(rowData[0].offset.toString())) {
            this.populateHexAdresses(addrFragment, rowData);
            this.populateHexBody(hexFragment, rowData, tags);
            this.populateAsciiTable(asciiFragment, rowData, tags);
          }
          rowData = [];
        }
      }
      (_a = document.getElementById("hexaddr")) == null ? void 0 : _a.appendChild(addrFragment);
      (_b = document.getElementById("hexbody")) == null ? void 0 : _b.appendChild(hexFragment);
      (_c = document.getElementById("ascii")) == null ? void 0 : _c.appendChild(asciiFragment);
      if (WebviewStateManager.getState()) {
        const selectedOffsets = this.selectHandler.getSelected();
        if (selectedOffsets.length > 0) {
          this.selectHandler.setSelected(selectedOffsets, true);
        }
        const savedScrollTop = WebviewStateManager.getState().scroll_top;
        if (savedScrollTop && savedScrollTop !== this.scrollBarHandler.virtualScrollTop) {
          this.scrollBarHandler.resyncScrollPosition();
        }
      }
    }
    bindEventListeners() {
      this.editorContainer.addEventListener("keydown", this.editorKeyBoardHandler.bind(this));
      this.editorContainer.addEventListener("mouseover", toggleHover);
      this.editorContainer.addEventListener("mouseleave", toggleHover);
      this.editorContainer.addEventListener("click", this.clickHandler.bind(this));
      this.editorContainer.addEventListener("mousedown", this.mouseDownHandler.bind(this));
      window.addEventListener("copy", (event) => {
        var _a, _b;
        if (((_a = document.activeElement) == null ? void 0 : _a.classList.contains("hex")) || ((_b = document.activeElement) == null ? void 0 : _b.classList.contains("ascii"))) {
          this.editHandler.copy(event);
        }
      });
      window.addEventListener("paste", (event) => {
        var _a, _b;
        if (((_a = document.activeElement) == null ? void 0 : _a.classList.contains("hex")) || ((_b = document.activeElement) == null ? void 0 : _b.classList.contains("ascii"))) {
          this.editHandler.paste(event);
        }
      });
      window.addEventListener("resize", this.documentResize.bind(this));
      window.addEventListener("keydown", this.windowKeyboardHandler.bind(this));
    }
    documentResize() {
      this.viewPortHeight = document.documentElement.clientHeight;
      if (this.scrollBarHandler) {
        this.scrollBarHandler.updateScrollBar(this.fileSize / 16);
      }
    }
    topOffset() {
      return Math.floor(this.scrollBarHandler.virtualScrollTop / this.rowHeight) * 16;
    }
    bottomOffset() {
      const clientHeight = document.getElementsByTagName("html")[0].clientHeight;
      const numRowsInViewport = Math.floor(clientHeight / this.rowHeight);
      return Math.min(this.topOffset() + numRowsInViewport * 16 - 1, this.fileSize - 1);
    }
    offsetYPos(offset) {
      return Math.floor(offset / 16) * this.rowHeight % this.documentHeight;
    }
    async scrollHandler() {
      var _a, _b, _c;
      const chunkHandlerResponse = await chunkHandler.ensureBuffer(virtualHexDocument.topOffset(), {
        topBufferSize: 2,
        bottomBufferSize: 4
      });
      const removedChunks = chunkHandlerResponse.removed;
      for (const chunk of removedChunks) {
        for (let i = chunk; i < chunk + chunkHandler.chunkSize; i += 16) {
          (_a = this.rows[0].get(i.toString())) == null ? void 0 : _a.remove();
          this.rows[0].delete(i.toString());
          (_b = this.rows[1].get(i.toString())) == null ? void 0 : _b.remove();
          this.rows[1].delete(i.toString());
          (_c = this.rows[2].get(i.toString())) == null ? void 0 : _c.remove();
          this.rows[2].delete(i.toString());
        }
      }
      return chunkHandlerResponse.requested;
    }
    populateHexAdresses(fragment, rowData) {
      const offset = rowData[0].offset;
      const addr = document.createElement("div");
      const displayOffset = offset + this.baseAddress;
      addr.className = "row";
      addr.setAttribute("data-offset", offset.toString());
      addr.innerText = pad(displayOffset.toString(16), 8).toUpperCase();
      fragment.appendChild(addr);
      this.rows[0].set(offset.toString(), addr);
      this.translateRow(addr, offset);
    }
    populateAsciiTable(fragment, rowData, tags) {
      const row = document.createElement("div");
      row.className = "row";
      const rowOffset = rowData[0].offset.toString();
      for (let i = 0; i < rowData.length; i++) {
        const ascii_element = this.createAsciiElement(rowData[i], tags);
        row.appendChild(ascii_element);
      }
      fragment.appendChild(row);
      this.rows[2].set(rowOffset, row);
      this.translateRow(row, parseInt(rowOffset));
    }
    populateHexBody(fragment, rowData, tags) {
      const row = document.createElement("div");
      row.className = "row";
      const rowOffset = rowData[0].offset.toString();
      for (let i = 0; i < rowData.length; i++) {
        const hex_element = this.createHexElement(rowData[i], tags);
        row.appendChild(hex_element);
      }
      fragment.appendChild(row);
      this.rows[1].set(rowOffset, row);
      this.translateRow(row, parseInt(rowOffset));
    }
    createHexElement(packet, tags) {
      const hex_element = document.createElement("span");
      hex_element.classList.add("hex");
      hex_element.classList.add(`cell-offset-${packet.offset.toString()}`);
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].from <= packet.offset && tags[i].to >= packet.offset) {
          hex_element.style.color = tags[i].color;
          break;
        }
      }
      if (packet.offset < this.fileSize) {
        hex_element.innerText = pad(packet.data.toHex(), 2);
      } else {
        hex_element.classList.add("add-cell");
        hex_element.innerText = "+";
      }
      hex_element.tabIndex = -1;
      hex_element.addEventListener("mouseleave", toggleHover);
      return hex_element;
    }
    createAsciiElement(packet, tags) {
      const ascii_element = document.createElement("span");
      ascii_element.classList.add(`cell-offset-${packet.offset.toString()}`);
      ascii_element.classList.add("ascii");
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].from <= packet.offset && tags[i].to >= packet.offset) {
          ascii_element.style.color = tags[i].color;
          break;
        }
      }
      if (packet.offset < this.fileSize) {
        updateAsciiValue(packet.data, ascii_element);
      } else {
        ascii_element.classList.add("add-cell");
        ascii_element.innerText = "+";
      }
      ascii_element.addEventListener("mouseleave", toggleHover);
      ascii_element.tabIndex = -1;
      return ascii_element;
    }
    translateRow(row, offset) {
      const expectedY = this.offsetYPos(offset);
      row.style.top = `${expectedY}px`;
    }
    clickHandler(event) {
      if (event.buttons > 1)
        return;
      const target = event.target;
      if (!target || isNaN(getElementsOffset(target))) {
        return;
      }
      event.preventDefault();
      this.editHandler.completePendingEdits();
      const offset = getElementsOffset(target);
      if (event.shiftKey) {
        const startSelection = this.selectHandler.getSelectionStart();
        if (startSelection !== void 0) {
          this.selectHandler.setFocused(offset);
          let selectionAnchor = this.selectHandler.getAnchor();
          if (selectionAnchor === void 0) {
            selectionAnchor = offset;
          }
          const min = Math.min(selectionAnchor, offset);
          const max = Math.max(offset, selectionAnchor);
          this.selectHandler.setSelected(createOffsetRange(min, max));
          target.focus({ preventScroll: true });
        }
      } else {
        this.selectHandler.setAnchor(offset);
        this.selectHandler.setFocused(offset);
        if (event.ctrlKey) {
          const selection = this.selectHandler.getSelected();
          const newSelection = selection.filter((i) => i !== offset);
          if (selection.length === newSelection.length) {
            this.selectHandler.setSelected([...newSelection, offset]);
          } else {
            this.selectHandler.setSelected(newSelection);
          }
        } else {
          this.selectHandler.setSelected([offset]);
        }
        this.updateInspector();
        target.focus({ preventScroll: true });
      }
    }
    mouseDownHandler(event) {
      if (event.buttons !== 1) {
        return;
      }
      const target = event.target;
      if (!target || isNaN(getElementsOffset(target))) {
        return;
      }
      event.preventDefault();
      this.editHandler.completePendingEdits();
      const offset = getElementsOffset(target);
      const startMouseMoveOffset = offset;
      const startSelection = event.shiftKey ? this.selectHandler.getSelectionStart() : offset;
      const onMouseMove = (event2) => {
        if (event2.buttons !== 1) {
          return;
        }
        const target2 = event2.target;
        if (!target2 || isNaN(getElementsOffset(target2))) {
          return;
        }
        const offset2 = getElementsOffset(target2);
        if (startSelection !== void 0 && offset2 !== startMouseMoveOffset) {
          this.selectHandler.setFocused(offset2);
          const min = Math.min(startSelection, offset2);
          const max = Math.max(startSelection, offset2);
          this.selectHandler.setSelected(createOffsetRange(min, max));
          target2.focus({ preventScroll: true });
        }
      };
      const onMouseUp = () => {
        this.editorContainer.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.updateInspector();
      };
      this.editorContainer.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    async editorKeyBoardHandler(event) {
      if (!event || !event.target)
        return;
      const targetElement = event.target;
      const modifierKeyPressed = event.metaKey || event.altKey || event.ctrlKey;
      if (event.key === "Tab") {
        const currentOffset = getElementsOffset(targetElement);
        const columnToFocus = getElementsColumn(targetElement) === "hex" ? "ascii" : "hex";
        this.focusElementWithGivenOffset(currentOffset, columnToFocus);
        event.preventDefault();
      } else if (new RegExp(/ArrowLeft|ArrowRight|ArrowUp|ArrowDown/gm).test(event.key) || (event.key === "End" || event.key === "Home") && !event.ctrlKey) {
        this.navigateByKey(event.key, targetElement, event.shiftKey, event.metaKey);
        event.preventDefault();
      } else if (!modifierKeyPressed && targetElement.classList.contains("hex")) {
        await this.editHandler.editHex(targetElement, event.key);
        if (targetElement.innerText.trimRight().length == 2 && targetElement.classList.contains("editing")) {
          targetElement.classList.remove("editing");
          this.navigateByKey("ArrowRight", targetElement, false, false);
        }
      } else if (!modifierKeyPressed && event.key.length === 1 && targetElement.classList.contains("ascii")) {
        await this.editHandler.editAscii(targetElement, event.key);
        targetElement.classList.remove("editing");
        this.navigateByKey("ArrowRight", targetElement, false, false);
      }
      await this.editHandler.completePendingEdits();
    }
    windowKeyboardHandler(event) {
      if (!event || !event.target)
        return;
      if ((event.metaKey || event.ctrlKey) && event.key === "f") {
        this.searchHandler.searchKeybindingHandler();
      } else if ((event.key == "Home" || event.key == "End") && event.ctrlKey) {
        event.key == "Home" ? this.scrollBarHandler.scrollToTop() : this.scrollBarHandler.scrollToBottom();
      } else if (event.key == "PageUp") {
        this.scrollBarHandler.page(this.viewPortHeight, "up");
      } else if (event.key == "PageDown") {
        this.scrollBarHandler.page(this.viewPortHeight, "down");
      }
    }
    navigateByKey(keyName, targetElement, isRangeSelection, metaKey) {
      let next;
      switch (keyName) {
        case "ArrowLeft":
          next = (isMac && metaKey ? this._getStartOfLineCell : this._getPreviousCell)(targetElement);
          break;
        case "ArrowRight":
          next = (isMac && metaKey ? this._getEndOfLineCell : this._getNextCell)(targetElement);
          break;
        case "ArrowUp":
          next = this._getCellAbove(targetElement);
          break;
        case "ArrowDown":
          next = this._getCellBelow(targetElement);
          break;
        case "End":
          next = this._getEndOfLineCell(targetElement);
          break;
        case "Home":
          next = this._getStartOfLineCell(targetElement);
          break;
      }
      if ((next == null ? void 0 : next.tagName) === "SPAN") {
        const nextRect = next.getBoundingClientRect();
        if (this.viewPortHeight <= nextRect.bottom) {
          this.scrollBarHandler.scrollDocument(1, "down");
        } else if (nextRect.top <= 0) {
          this.scrollBarHandler.scrollDocument(1, "up");
        }
        const offset = getElementsOffset(next);
        this.selectHandler.setFocused(offset);
        const startSelection = this.selectHandler.getSelectionStart();
        const currentSelection = this.selectHandler.getSelected();
        if (isRangeSelection && startSelection !== void 0) {
          const min = Math.min(startSelection, offset);
          const max = Math.max(offset, currentSelection[currentSelection.length - 1]);
          this.selectHandler.setSelected(createOffsetRange(min, max));
        } else {
          this.selectHandler.setSelected([offset]);
          this.updateInspector();
        }
        next.focus({ preventScroll: true });
      }
    }
    _getPreviousCell(currentCell) {
      var _a, _b;
      return currentCell.previousElementSibling || ((_b = (_a = currentCell.parentElement) == null ? void 0 : _a.previousElementSibling) == null ? void 0 : _b.children[15]);
    }
    _getNextCell(currentCell) {
      var _a, _b;
      return currentCell.nextElementSibling || ((_b = (_a = currentCell.parentElement) == null ? void 0 : _a.nextElementSibling) == null ? void 0 : _b.children[0]);
    }
    _getStartOfLineCell(currentCell) {
      return currentCell.parentElement.children[0];
    }
    _getEndOfLineCell(currentCell) {
      const parentChildren = currentCell.parentElement.children;
      return parentChildren[parentChildren.length - 1];
    }
    _getCellAbove(currentCell) {
      const elements_above = getElementsWithGivenOffset(getElementsOffset(currentCell) - 16);
      if (elements_above.length === 0) {
        return void 0;
      }
      return currentCell.classList.contains("hex") ? elements_above[0] : elements_above[1];
    }
    _getCellBelow(currentCell) {
      const elements_below = getElementsWithGivenOffset(Math.min(getElementsOffset(currentCell) + 16, this.fileSize - 1));
      if (elements_below.length === 0) {
        return void 0;
      }
      return currentCell.classList.contains("hex") ? elements_below[0] : elements_below[1];
    }
    updateInspector() {
      const offset = this.selectHandler.getSelectionStart();
      if (offset !== void 0) {
        const elements = getElementsWithGivenOffset(offset);
        const byte_obj = retrieveSelectedByteObject(elements);
        byte_obj.offset = offset;
        DataInspectorHandler.updateInspector(byte_obj, this.tags);
      }
    }
    setSelection(offsets) {
      this.selectHandler.setSelected(offsets);
    }
    focusElementWithGivenOffset(offset, column) {
      const elements = getElementsWithGivenOffset(offset);
      if (elements.length != 2)
        return;
      this.selectHandler.setSelected([offset]);
      this.updateInspector();
      if (!column && document.activeElement && getElementsColumn(document.activeElement) === "ascii" || column === "ascii") {
        elements[1].focus();
      } else {
        elements[0].focus();
      }
    }
    undo(edits, fileSize) {
      this.fileSize = fileSize;
      this.editHandler.undo(edits);
    }
    redo(edits, fileSize) {
      this.editHandler.redo(edits);
      this.fileSize = fileSize;
    }
    revert(fileSize) {
      this.fileSize = fileSize;
      this.editHandler.revert();
    }
    createAddCell() {
      var _a, _b;
      if (document.getElementsByClassName("add-cell").length !== 0)
        return;
      const packet = {
        offset: this.fileSize,
        data: new ByteData(0, this.fileSize)
      };
      if (this.fileSize % 16 === 0) {
        this.render([packet], []);
        if (this.fileSize % chunkHandler.chunkSize === 0) {
          chunkHandler.addChunk(this.fileSize);
        }
        this.scrollBarHandler.updateScrollBar(this.fileSize / 16);
      } else {
        const hex_element = this.createHexElement(packet, []);
        const ascii_element = this.createAsciiElement(packet, []);
        const elements = getElementsWithGivenOffset(this.fileSize - 1);
        (_a = elements[0].parentElement) == null ? void 0 : _a.appendChild(hex_element);
        (_b = elements[1].parentElement) == null ? void 0 : _b.appendChild(ascii_element);
      }
    }
    removeLastCell() {
      var _a, _b, _c;
      const plusCellOffset = getElementsOffset(document.getElementsByClassName("add-cell")[0]);
      if (isNaN(plusCellOffset))
        return;
      const lastCells = getElementsWithGivenOffset(plusCellOffset);
      const secondToLastCells = getElementsWithGivenOffset(plusCellOffset - 1);
      if (plusCellOffset % 16 === 0) {
        (_a = this.rows[0].get(plusCellOffset.toString())) == null ? void 0 : _a.remove();
        this.rows[0].delete(plusCellOffset.toString());
        (_b = this.rows[1].get(plusCellOffset.toString())) == null ? void 0 : _b.remove();
        this.rows[1].delete(plusCellOffset.toString());
        (_c = this.rows[2].get(plusCellOffset.toString())) == null ? void 0 : _c.remove();
        this.rows[2].delete(plusCellOffset.toString());
        this.scrollBarHandler.updateScrollBar((plusCellOffset - 1) / 16);
      } else {
        lastCells[0].remove();
        lastCells[0].remove();
      }
      secondToLastCells[0].innerText = "+";
      secondToLastCells[0].classList.add("add-cell");
      secondToLastCells[0].classList.remove("nongraphic");
      secondToLastCells[0].classList.remove("edited");
      secondToLastCells[1].innerText = "+";
      secondToLastCells[1].classList.remove("nongraphic");
      secondToLastCells[1].classList.add("add-cell");
      secondToLastCells[1].classList.remove("edited");
    }
    get documentSize() {
      return this.fileSize;
    }
    updateDocumentSize(newSize) {
      this.fileSize = newSize;
    }
    async reRequestChunks() {
      var _a, _b, _c;
      const allChunks = Array.from(chunkHandler.allChunks);
      for (const chunk of allChunks) {
        for (let i = chunk; i < chunk + chunkHandler.chunkSize; i += 16) {
          (_a = this.rows[0].get(i.toString())) == null ? void 0 : _a.remove();
          this.rows[0].delete(i.toString());
          (_b = this.rows[1].get(i.toString())) == null ? void 0 : _b.remove();
          this.rows[1].delete(i.toString());
          (_c = this.rows[2].get(i.toString())) == null ? void 0 : _c.remove();
          this.rows[2].delete(i.toString());
        }
        chunkHandler.removeChunk(chunk);
        await chunkHandler.requestMoreChunks(chunk);
      }
    }
    getSelectionStart() {
      const selectionStart = this.selectHandler.getSelectionStart();
      return typeof selectionStart !== "undefined" ? selectionStart : -1;
    }
    getSelectionEnd() {
      if (this.getSelectionStart() != -1)
        return this.getSelectionStart() + this.selectHandler.getSelected().length - 1;
      return -1;
    }
    async scrollDocumentToOffset(offset, force) {
      return this.scrollBarHandler.scrollToOffset(offset, force);
    }
    findTagByCaption(caption) {
      const tagArray = this.tags.filter((cur) => {
        return cur.caption == caption;
      });
      if (tagArray.length == 0)
        return void 0;
      return tagArray[0];
    }
  };

  // media/editor/chunkHandler.ts
  var ChunkHandler = class {
    constructor(chunkSize) {
      this.chunks = new Set();
      this._chunkSize = chunkSize;
    }
    get chunkSize() {
      return this._chunkSize;
    }
    hasChunk(offset) {
      const chunkStart = this.retrieveChunkStart(offset);
      return this.chunks.has(chunkStart);
    }
    async requestMoreChunks(chunkStart) {
      if (chunkStart >= virtualHexDocument.documentSize && chunkStart !== 0)
        return;
      try {
        const request = await messageHandler.postMessageWithResponse("packet", {
          initialOffset: chunkStart,
          numElements: this.chunkSize
        });
        this.processChunks(request.offset, request.data, request.edits, request.fileSize, request.tags);
      } catch (err) {
        return;
      }
    }
    retrieveChunkStart(offset) {
      return Math.floor(offset / this.chunkSize) * this.chunkSize;
    }
    async ensureBuffer(offset, bufferOpts) {
      const chunksToRequest = new Set();
      const chunkStart = this.retrieveChunkStart(offset);
      chunksToRequest.add(chunkStart);
      for (let i = 1; i <= bufferOpts.topBufferSize; i++) {
        chunksToRequest.add(Math.max(0, chunkStart - i * this.chunkSize));
      }
      for (let i = 1; i <= bufferOpts.bottomBufferSize; i++) {
        chunksToRequest.add(chunkStart + i * this.chunkSize);
      }
      const chunksToRequestArr = [...chunksToRequest].filter((x) => !this.chunks.has(x));
      const chunksOutsideBuffer = [...this.chunks].filter((x) => !chunksToRequest.has(x));
      chunksOutsideBuffer.forEach((chunk) => this.removeChunk(chunk));
      const requested = [];
      chunksToRequestArr.forEach((chunkOffset) => requested.push(this.requestMoreChunks(chunkOffset)));
      const result = {
        removed: chunksOutsideBuffer,
        requested: Promise.all(requested)
      };
      return result;
    }
    processChunks(offset, data, edits, fileSize, tags) {
      const packets = [];
      for (let i = 0; i < data.length; i++) {
        if ((i + offset) % this.chunkSize === 0) {
          this.addChunk(i + offset);
        }
        packets.push({
          offset: i + offset,
          data: new ByteData(data[i], offset)
        });
        if (i + offset + 1 === virtualHexDocument.documentSize) {
          packets.push({
            offset: i + offset + 1,
            data: new ByteData(0, offset)
          });
        }
      }
      if (data.length === 0 && fileSize === 0) {
        packets.push({
          offset: 0,
          data: new ByteData(0, offset)
        });
      }
      virtualHexDocument.render(packets, tags);
      virtualHexDocument.redo(edits, fileSize);
    }
    addChunk(offset) {
      this.chunks.add(offset);
    }
    removeChunk(offset) {
      this.chunks.delete(offset);
    }
    get allChunks() {
      return this.chunks;
    }
  };

  // media/editor/messageHandler.ts
  var MessageHandler = class {
    constructor(maximumRequests) {
      this.maxRequests = maximumRequests;
      this.requestsMap = new Map();
      this.requestId = 0;
    }
    async postMessageWithResponse(type, body) {
      var _a;
      const promise = new Promise((resolve, reject) => this.requestsMap.set(this.requestId, { resolve, reject }));
      if (this.requestsMap.size > this.maxRequests) {
        const removed = this.requestsMap.keys().next().value;
        (_a = this.requestsMap.get(removed)) == null ? void 0 : _a.reject("Request Timed out");
        this.requestsMap.delete(removed);
      }
      vscode.postMessage({ requestId: this.requestId++, type, body });
      return promise;
    }
    postMessage(type, body) {
      vscode.postMessage({ type, body });
    }
    incomingMessageHandler(message) {
      const request = this.requestsMap.get(message.requestId);
      if (!request)
        return;
      request.resolve(message.body);
      this.requestsMap.delete(message.requestId);
    }
  };

  // media/editor/hexEdit.ts
  var vscode = acquireVsCodeApi();
  var virtualHexDocument;
  var chunkHandler = new ChunkHandler(800);
  var messageHandler = new MessageHandler(10);
  function openAnyway() {
    messageHandler.postMessage("open-anyways");
  }
  (() => {
    window.addEventListener("message", async (e) => {
      var _a;
      const { type, body } = e.data;
      switch (type) {
        case "init":
          if (body.html !== void 0) {
            document.getElementsByTagName("body")[0].innerHTML = body.html;
            virtualHexDocument = new VirtualDocument(body.fileSize, body.editorFontSize, body.baseAddress);
            chunkHandler.ensureBuffer(virtualHexDocument.topOffset(), {
              topBufferSize: 0,
              bottomBufferSize: 5
            });
          }
          if (body.fileSize != 0 && body.html === void 0) {
            document.getElementsByTagName("body")[0].innerHTML = `
						<div>
						<p>Opening this large file may cause instability. <a id="open-anyway" href="#">Open anyways</a></p>
						</div>
											`;
            document.getElementById("open-anyway").addEventListener("click", openAnyway);
            return;
          }
          return;
        case "update":
          if (body.type === "undo") {
            virtualHexDocument.undo(body.edits, body.fileSize);
          } else if (body.type === "redo") {
            virtualHexDocument.redo(body.edits, body.fileSize);
          } else if (body.type === "redraw") {
            virtualHexDocument.reRequestChunks();
          } else {
            virtualHexDocument.revert(body.fileSize);
          }
          return;
        case "save":
          const dirtyCells = Array.from(document.getElementsByClassName("edited"));
          dirtyCells.map((cell) => cell.classList.remove("edited"));
          return;
        case "goToOffset":
          const offset = parseInt(body.offset, 16);
          virtualHexDocument.scrollDocumentToOffset(offset).then(() => {
            setTimeout(() => virtualHexDocument.focusElementWithGivenOffset(offset), 10);
          });
          return;
        case "goToTag":
          const caption = body.caption;
          const tagFromOffset = (_a = virtualHexDocument.findTagByCaption(caption)) == null ? void 0 : _a.from;
          if (!tagFromOffset)
            return;
          virtualHexDocument.scrollDocumentToOffset(tagFromOffset).then(() => {
            setTimeout(() => virtualHexDocument.focusElementWithGivenOffset(tagFromOffset), 10);
          });
          return;
        case "addTag":
          const selectionStart = virtualHexDocument.getSelectionStart();
          if (selectionStart == -1) {
            return;
          }
          const selectionEnd = virtualHexDocument.getSelectionEnd();
          await messageHandler.postMessageWithResponse("addTagToFile", { from: selectionStart, to: selectionEnd, color: body.color, caption: body.caption });
          return;
        case "removeTagAtSelection":
          const selection = virtualHexDocument.getSelectionStart();
          const tagIndex = virtualHexDocument.tags.findIndex((tag) => {
            return tag.from <= selection && tag.to >= selection;
          });
          if (tagIndex == -1)
            return;
          virtualHexDocument.tags.splice(tagIndex, 1);
          await messageHandler.postMessageWithResponse("rewriteTagsInFile", {
            tags: virtualHexDocument.tags
          });
          return;
        case "removeTag":
          const dTagIndex = virtualHexDocument.tags.findIndex((tag) => {
            return tag.caption == body.caption;
          });
          if (dTagIndex == -1)
            return;
          virtualHexDocument.tags.splice(dTagIndex, 1);
          await messageHandler.postMessageWithResponse("rewriteTagsInFile", {
            tags: virtualHexDocument.tags
          });
          return;
        case "removeAllTags":
          await messageHandler.postMessageWithResponse("rewriteTagsInFile", {
            tags: []
          });
          return;
        default:
          messageHandler.incomingMessageHandler(e.data);
          return;
      }
    });
    messageHandler.postMessage("ready");
  })();
})();
