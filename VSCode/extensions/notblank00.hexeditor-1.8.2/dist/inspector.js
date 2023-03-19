(() => {
  // media/data_inspector/byteData.ts
  var ByteData = class {
    static constructFromMessage(message) {
      const byteObj = new ByteData(message.decimal !== null ? message.decimal : NaN, message.offset);
      for (const adjacentBytes of message.adjacentBytes) {
        const current = new ByteData(adjacentBytes.decimal !== null ? adjacentBytes.decimal : NaN, message.offset);
        byteObj.addAdjacentByte(current);
      }
      return byteObj;
    }
    constructor(uint8num, offset) {
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
    toBinary() {
      if (isNaN(this.decimal))
        return "End of File";
      return ("00000000" + this.decimal.toString(2)).slice(-8);
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
    toUTF16(littleEndian) {
      let uint8Data = [this.to8bitUInt()];
      if (this.adjacentBytes.length === 0)
        return "End of File";
      for (let i = 0; i < 3 && i < this.adjacentBytes.length; i++) {
        uint8Data.push(this.adjacentBytes[i].to8bitUInt());
      }
      if (!littleEndian) {
        uint8Data = uint8Data.reverse();
      }
      const utf16 = new TextDecoder("utf-16").decode(new Uint8Array(uint8Data));
      for (const char of utf16)
        return char;
      return utf16;
    }
    byteConverter(numBits, signed, littleEndian, float = false) {
      if (numBits % 8 != 0) {
        throw new Error("Bits must be a multiple of 8!");
      }
      if (this.adjacentBytes.length < numBits / 8 - 1)
        return NaN;
      const bytes = [];
      bytes.push(this.to8bitUInt());
      for (let i = 0; i < numBits / 8 - 1; i++) {
        bytes.push(this.adjacentBytes[i].to8bitUInt());
      }
      const uint8bytes = Uint8Array.from(bytes);
      const dataview = new DataView(uint8bytes.buffer);
      if (numBits == 64 && float) {
        return dataview.getFloat64(0, littleEndian);
      } else if (numBits == 64 && signed) {
        return dataview.getBigInt64(0, littleEndian);
      } else if (numBits == 64 && !signed) {
        return dataview.getBigUint64(0, littleEndian);
      } else if (numBits == 32 && float) {
        return dataview.getFloat32(0, littleEndian);
      } else if (numBits == 32 && signed) {
        return dataview.getInt32(0, littleEndian);
      } else if (numBits == 32 && !signed) {
        return dataview.getUint32(0, littleEndian);
      } else if (numBits == 24 && signed) {
        const first8 = this.adjacentBytes[1].byteConverter(8, signed, littleEndian) << 16;
        return first8 | this.byteConverter(16, signed, littleEndian);
      } else if (numBits == 24 && !signed) {
        const first8 = this.adjacentBytes[1].byteConverter(8, signed, littleEndian) << 16;
        return first8 | this.byteConverter(16, signed, littleEndian);
      } else if (numBits == 16 && signed) {
        return dataview.getInt16(0, littleEndian);
      } else if (numBits == 16 && !signed) {
        return dataview.getUint16(0, littleEndian);
      } else if (numBits == 8 && signed) {
        return dataview.getInt8(0);
      } else if (numBits == 8 && !signed) {
        return this.decimal;
      }
      return NaN;
    }
    getOffset() {
      return this.offset;
    }
  };

  // media/data_inspector/dataInspector.ts
  function clearDataInspector() {
    document.getElementById("binary8").value = "";
    document.getElementById("binary8").disabled = true;
    for (let i = 0; i < 4; i++) {
      const numBits = (i + 1) * 8;
      document.getElementById(`int${numBits}`).disabled = true;
      document.getElementById(`int${numBits}`).value = "";
      document.getElementById(`uint${numBits}`).disabled = true;
      document.getElementById(`uint${numBits}`).value = "";
    }
    document.getElementById("int64").value = "";
    document.getElementById("int64").disabled = true;
    document.getElementById("uint64").value = "";
    document.getElementById("uint64").disabled = true;
    document.getElementById("utf8").value = "";
    document.getElementById("utf8").disabled = true;
    document.getElementById("utf16").value = "";
    document.getElementById("utf16").disabled = true;
    document.getElementById("float32").value = "";
    document.getElementById("float32").disabled = true;
    document.getElementById("float64").value = "";
    document.getElementById("float64").disabled = true;
  }
  function populateDataInspector(byte_obj, littleEndian, tags2) {
    document.getElementById("binary8").value = byte_obj.toBinary();
    document.getElementById("binary8").disabled = false;
    for (let i = 0; i < 4; i++) {
      const numBits = (i + 1) * 8;
      const signed = byte_obj.byteConverter(numBits, true, littleEndian);
      const unsigned = byte_obj.byteConverter(numBits, false, littleEndian);
      document.getElementById(`int${numBits}`).value = isNaN(Number(signed)) ? "End of File" : signed.toString();
      document.getElementById(`int${numBits}`).disabled = false;
      document.getElementById(`uint${numBits}`).value = isNaN(Number(unsigned)) ? "End of File" : unsigned.toString();
      document.getElementById(`uint${numBits}`).disabled = false;
      if (numBits === 32) {
        const float32 = byte_obj.byteConverter(32, true, littleEndian, true);
        document.getElementById("float32").value = isNaN(Number(float32)) ? "End of File" : float32.toString();
        document.getElementById("float32").disabled = false;
      }
    }
    const signed64 = byte_obj.byteConverter(64, true, littleEndian);
    const unsigned64 = byte_obj.byteConverter(64, false, littleEndian);
    document.getElementById("int64").value = isNaN(Number(signed64)) ? "End of File" : signed64.toString();
    document.getElementById("int64").disabled = false;
    document.getElementById("uint64").value = isNaN(Number(unsigned64)) ? "End of File" : unsigned64.toString();
    document.getElementById("uint64").disabled = false;
    document.getElementById("utf8").value = byte_obj.toUTF8(littleEndian);
    document.getElementById("utf8").disabled = false;
    document.getElementById("utf16").value = byte_obj.toUTF16(littleEndian);
    document.getElementById("utf16").disabled = false;
    const float64 = byte_obj.byteConverter(64, true, littleEndian, true);
    document.getElementById("float64").value = isNaN(Number(float64)) ? "End of File" : float64.toString();
    document.getElementById("float64").disabled = false;
    document.getElementById("offset").value = byte_obj.getOffset().toString();
    document.getElementById("offset").disabled = false;
    document.getElementById("selectedTagCaption").value = "None";
    for (const tag of tags2) {
      if (byte_obj.getOffset() >= tag.from && byte_obj.getOffset() <= tag.to) {
        document.getElementById("selectedTagCaption").value = tag.caption;
      }
    }
    document.getElementById("offset").disabled = false;
  }
  function changeEndianness(byte_obj, tags2) {
    const littleEndian = document.getElementById("endianness").value === "little";
    populateDataInspector(byte_obj, littleEndian, tags2);
  }

  // media/data_inspector/inspector.ts
  var vscode = acquireVsCodeApi();
  var currentByteData;
  var tags;
  (() => {
    window.addEventListener("message", async (e) => {
      switch (e.data.method) {
        case "update":
          if (e.data.byteData)
            currentByteData = ByteData.constructFromMessage(e.data.byteData);
          tags = e.data.tags;
          populateDataInspector(currentByteData, document.getElementById("endianness").value === "little", e.data.tags);
          return;
        case "clear":
          clearDataInspector();
          return;
        case "caption":
          return;
      }
    });
    vscode.postMessage({ type: "ready" });
  })();
  var _a;
  (_a = document.getElementById("endianness")) == null ? void 0 : _a.addEventListener("change", () => changeEndianness(currentByteData, tags));
})();
