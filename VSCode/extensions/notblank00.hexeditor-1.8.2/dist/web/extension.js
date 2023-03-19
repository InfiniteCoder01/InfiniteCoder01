var q=Object.create;var C=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var $=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var I=a=>C(a,"__esModule",{value:!0});var N=(a,e)=>{I(a);for(var t in e)C(a,t,{get:e[t],enumerable:!0})},Q=(a,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of B(e))!L.call(a,s)&&s!=="default"&&C(a,s,{get:()=>e[s],enumerable:!(t=j(e,s))||t.enumerable});return a},g=a=>Q(I(C(a!=null?q($(a)):{},"default",a&&a.__esModule&&"default"in a?{get:()=>a.default,enumerable:!0}:{value:a,enumerable:!0})),a);N(exports,{activate:()=>J});var f=g(require("vscode"));var m=g(require("vscode"));var M=g(require("vscode"));function k(){let a="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<32;t++)a+=e.charAt(Math.floor(Math.random()*e.length));return a}async function F(){return M.window.showInputBox({placeHolder:"Enter offset to go to",validateInput:a=>a.length>8||new RegExp("^[a-fA-F0-9]+$").test(a)?null:"Invalid offset string"})}var S=class{constructor(e){this._extensionURI=e}resolveWebviewView(e,t,s){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[this._extensionURI]},e.webview.html=this._getWebviewHTML(e.webview),e.webview.onDidReceiveMessage(i=>{i.type==="ready"&&e.show()}),this._view.onDidDispose(()=>this._view=void 0),e.onDidChangeVisibility(()=>{e.visible&&this._lastMessage&&e.webview.postMessage(this._lastMessage)}),this._lastMessage&&e.webview.postMessage(this._lastMessage)}handleEditorMessage(e){var t;this._lastMessage=e,(t=this._view)==null||t.webview.postMessage(e)}show(e){var t;(e==null?void 0:e.autoReveal)&&!m.workspace.getConfiguration("hexeditor.dataInspector").get("autoReveal",!1)||(this._view&&!(e==null?void 0:e.forceFocus)?this._view.show():m.commands.executeCommand(`${S.viewType}.focus`),this._lastMessage&&((t=this._view)==null||t.webview.postMessage(this._lastMessage)))}_getWebviewHTML(e){let t=e.asWebviewUri(m.Uri.joinPath(this._extensionURI,"dist","inspector.js")),s=e.asWebviewUri(m.Uri.joinPath(this._extensionURI,"dist","inspector.css")),i=m.workspace.getConfiguration().get("hexeditor.defaultEndianness"),o=k();return`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
              -->
              <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${e.cspSource}; script-src 'nonce-${o}';">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="${s}" rel="stylesheet">

              <title>Data Inspector</title>
            </head>
            <body>
              <div id="data-inspector">
                <div class="grid-container">
                  <div class="grid-item">
                    <label for="offset">Offset</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="offset" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="binary8">8 bit Binary</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="binary8" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="int8">Int8</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="int8" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="uint8">UInt8</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="uint8" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="int16">Int16</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="int16" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="uint16">UInt16</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="uint16" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="int24">Int24</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="int24" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="uint24">UInt24</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="uint24" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="int32">Int32</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="int32" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="uint32">UInt32</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="uint32" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="int64">Int64</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="int64" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="uint64">UInt64</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="uint64" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="utf8">UTF-8</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="utf8" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="utf16">UTF-16</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="utf16" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="float32">Float 32</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="float32" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="float64">Float 64</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="float64" readonly/>
                  </div>
                  <div class="grid-item">
                    <label for="selectedTagCaption">Tag</label>
                  </div>
                  <div class="grid-item">
                    <input type="text" autocomplete="off" spellcheck="off" id="selectedTagCaption" readonly/>
                  </div>
                  <div class="grid-item endian-select">
                    <label for="endianness">Endianness</label>
                  </div>
                  <div class="grid-item endian-select">
                    <select id="endianness">
                      <option value="little" ${i==="little"?"selected":""}>Little Endian</option>
                      <option value="big" ${i==="big"?"selected":""}>Big Endian</option>
                    </select>
                  </div>
                </div>
              </div>
              <script nonce="${o}" src="${t}"><\/script>
            </body>
            </html>`}},D=S;D.viewType="hexEditor.dataInspectorView";var u=g(require("vscode"));var p=g(require("vscode"));function U(a){for(;a.length;){let e=a.pop();e&&e.dispose()}}var A=class{constructor(){this._isDisposed=!1;this._disposables=[]}dispose(){this._isDisposed||(this._isDisposed=!0,U(this._disposables))}_register(e){return this._isDisposed?e.dispose():this._disposables.push(e),e}get isDisposed(){return this._isDisposed}};var b=class{constructor(e){this._cancelled=!1;this._documentDataWithEdits=e.documentDataWithEdits}async textSearch(e,t){let s={result:[],partial:!1};return t.regex?new Promise(i=>{this.regexTextSearch(e,t.caseSensitive,s,String.fromCharCode.apply(null,Array.from(this._documentDataWithEdits)),i)}):new Promise(i=>{this.normalTextSearch(e,t.caseSensitive,0,s,i)})}async hexSearch(e){let t={result:[],partial:!1};return new Promise(s=>{this.normalHexSearch(e,0,t,s)})}normalHexSearch(e,t,s,i){let o=Date.now();for(;t<this._documentDataWithEdits.length;t++){let l=[];for(let d=0;d<e.length;d++){if(t+d>=this._documentDataWithEdits.length){i(s);return}let r=this._documentDataWithEdits[t+d].toString(16).toUpperCase();r=r.length!==2?"0"+r:r;let n=e[d].toUpperCase();if(n==="??"||n===r)l.push(t+d);else break}if(l.length===e.length&&(s.result.push(l),s.result.length===b._searchResultLimit)){s.partial=!0,i(s);return}if(this._cancelled){this._cancelled=!1,s.partial=!0,i(s);return}if(Date.now()-o>b._interruptTime){setImmediate(()=>this.normalHexSearch(e,t,s,i));return}}i(s)}regexTextSearch(e,t,s,i,o){let l=Date.now(),d=t?"g":"gi",r=new RegExp(e,d),n;for(;(n=r.exec(i))!==null;){if(n.index===void 0)continue;let c=[];for(let y=n.index;y<n.index+n[0].length;y++)c.push(y);if(s.result.push(c),this._cancelled){this._cancelled=!1,s.partial=!0,o(s);return}if(Date.now()-l>b._interruptTime){setImmediate(()=>this.regexTextSearch(e,t,s,i,o));return}if(s.result.length===b._searchResultLimit){s.partial=!0,o(s);return}}o(s)}normalTextSearch(e,t,s,i,o){let l=Date.now();for(;s<this._documentDataWithEdits.length;s++){let d=[];for(let r=0;r<e.length;r++){if(s+r>=this._documentDataWithEdits.length){o(i);return}let n=String.fromCharCode(this._documentDataWithEdits[s+r]),c=e[r];if(t||(n=n.toUpperCase(),c=c.toUpperCase()),c===n)d.push(s+r);else break}if(d.length===e.length&&(i.result.push(d),i.result.length===b._searchResultLimit)){i.partial=!0,o(i);return}if(this._cancelled){this._cancelled=!1,i.partial=!0,o(i);return}if(Date.now()-l>b._interruptTime){setImmediate(this.normalTextSearch.bind(this),e,t,s,i,o);return}}o(i)}cancelSearch(){this._cancelled=!0}},x=b;x._searchResultLimit=1e5,x._interruptTime=100;var H=class{constructor(e){this._document=e}createNewRequest(){return this._request=new x(this._document),this._request}cancelRequest(){this._request!==void 0&&(this._request.cancelSearch(),this._request=void 0)}};var W=g(require("vscode")),T=class{static async getFileSize(e,t){var s;return e.scheme==="untitled"?(s=t==null?void 0:t.length)!=null?s:0:(await W.workspace.fs.stat(e)).size}static async readFile(e,t){return e.scheme==="untitled"?t!=null?t:new Uint8Array:W.workspace.fs.readFile(e)}};var E=g(require("vscode")),_=class{static async create(e){try{await E.workspace.fs.readFile(e)}catch(t){await E.workspace.fs.writeFile(e,Buffer.from("[]","utf-8"))}return new _(e)}constructor(e){this.tagFileName=e}async retrieveTags(){return JSON.parse((await E.workspace.fs.readFile(this.tagFileName)).toString())}async saveTags(e){await E.workspace.fs.writeFile(this.tagFileName,Buffer.from(JSON.stringify(e),"utf-8"))}};function V(a,e){if(a===void 0||e===void 0)return a===e;if(a.length!==e.length)return!1;for(let t=0;t<a.length;t++){let s=a[t],i=e[t];if(s.offset!==i.offset||s.oldValue!=i.oldValue||s.newValue!=i.newValue)return!1}return!0}var w=class extends A{constructor(e,t,s,i,o,l){super();this._edits=[];this._unsavedEdits=[];this.lastSave=Date.now();this._onDidDispose=this._register(new p.EventEmitter);this.onDidDispose=this._onDidDispose.event;this._onDidChangeDocument=this._register(new p.EventEmitter);this.onDidChangeContent=this._onDidChangeDocument.event;this._onDidChange=this._register(new p.EventEmitter);this.onDidChange=this._onDidChange.event;this._uri=e,this._documentData=t,this._bytesize=s,this._baseAddress=o,this._unsavedEdits=i,this._edits=Array.from(i),this.searchProvider=new H(this),this.tagsHandler=l}static async create(e,t){let s=t.backupId,i=typeof s=="string"?p.Uri.parse(s):e,o=typeof s=="string"?p.Uri.parse(s+".json"):void 0,l=await T.getFileSize(e,t.untitledDocumentData),d=w.parseQuery(e.query),r=d.baseAddress?w.parseHexOrDecInt(d.baseAddress):0,n,c=p.workspace.getConfiguration().get("hexeditor.maxFileSize")*1e6,y=[],O=await _.create(p.Uri.file(i.path+".tags"));if(l>c&&!s)n=new Uint8Array;else if(n=await T.readFile(i,t.untitledDocumentData),o){let z=await p.workspace.fs.readFile(o);y=JSON.parse(Buffer.from(z).toString("utf-8"))}return new w(e,n,l,y,r,O)}get uri(){return this._uri}get filesize(){let e=0;return this.unsavedEdits.flat().forEach(t=>{t.newValue!==void 0&&t.oldValue===void 0?e++:t.oldValue!==void 0&&t.newValue===void 0&&t.offset<this._bytesize&&e--}),this._bytesize+e}get baseAddress(){return this._baseAddress}get documentData(){return this._documentData}get documentDataWithEdits(){let e=Array.from(this.documentData),t=this._unsavedEdits.flat(),s=[];for(let i of t)i.oldValue!==void 0&&i.newValue!==void 0?e[i.offset]=i.newValue:i.oldValue===void 0&&i.newValue!==void 0?e.push(i.newValue):s.push(i.offset);s=s.sort((i,o)=>o-i);for(let i of s)e.splice(i,1);return e}dispose(){this._onDidDispose.fire(),super.dispose()}async openAnyways(){this._documentData=await p.workspace.fs.readFile(this.uri)}get unsavedEdits(){return this._unsavedEdits}makeEdit(e){e.forEach(t=>t.sameOnDisk=!1),this._edits.push(e),this._unsavedEdits.push(e),this._onDidChange.fire({undo:async()=>{let t=this._edits.pop();if(!t)return;let s=!1;V(this._unsavedEdits[this._unsavedEdits.length-1],t)&&(this._unsavedEdits.pop(),s=!0);let i=[];for(let o of t)o.sameOnDisk=o.oldValue!==void 0&&o.oldValue===this.documentData[o.offset]||!1,!o.sameOnDisk&&!s&&i.push({newValue:o.oldValue,oldValue:o.newValue,offset:o.offset,sameOnDisk:o.sameOnDisk});i.length!==0&&this._unsavedEdits.push(i),this._onDidChangeDocument.fire({fileSize:this.filesize,baseAddress:this.baseAddress,type:"undo",edits:t})},redo:async()=>{this._edits.push(e);let t=e;if(this._unsavedEdits[this._unsavedEdits.length-1]!==void 0){let i=this._unsavedEdits[this._unsavedEdits.length-1].slice(0);i=i.map(o=>(o.newValue===void 0&&o.oldValue!==void 0&&(o.newValue=o.oldValue,o.oldValue=void 0),o)),V(i,t)&&this._unsavedEdits.pop()}let s=[];for(let i of t)i.sameOnDisk=i.offset<this._bytesize&&i.newValue===this.documentData[i.offset]||!1,i.sameOnDisk||s.push(i);s.length!==0&&this._unsavedEdits.push(s),this._onDidChangeDocument.fire({fileSize:this.filesize,baseAddress:this.baseAddress,type:"redo",edits:t})}})}async save(e){await this.saveAs(this.uri,e)}async saveAs(e,t){this._documentData=new Uint8Array(this.documentDataWithEdits),this._bytesize=this.documentData.length;let s=this.documentData;t&&t.isCancellationRequested||(await p.workspace.fs.writeFile(e,s),this.lastSave=Date.now(),this._unsavedEdits=[])}async revert(e){let t=await p.workspace.fs.readFile(this.uri);this._bytesize=t.length,this._documentData=t,this._unsavedEdits=[],this._edits=[],this._onDidChangeDocument.fire({fileSize:this.filesize,baseAddress:this.baseAddress,type:"revert",edits:[]})}async backup(e,t){return await this.saveAs(e,t),await p.workspace.fs.writeFile(p.Uri.parse(e.path+".json"),Buffer.from(JSON.stringify(this.unsavedEdits),"utf-8")),{id:e.toString(),delete:async()=>{try{await p.workspace.fs.delete(e),await p.workspace.fs.delete(p.Uri.parse(e.path+".json"))}catch(s){}}}}replace(e,t,s){let i=[],o=this.documentDataWithEdits;for(let l of t){let d=[];for(let r=0;r<e.length&&r<l.length;r++){if(s){let n=String.fromCharCode(e[r]),c=String.fromCharCode(o[l[r]]);c.toUpperCase()===c&&c.toLowerCase()!=c?e[r]=n.toUpperCase().charCodeAt(0):c.toLowerCase()===c&&c.toUpperCase()!=c&&(e[r]=n.toLowerCase().charCodeAt(0))}if(e[r]!==o[l[r]]){let n={oldValue:o[l[r]],newValue:e[r],offset:l[r],sameOnDisk:!1};d.push(n),i.push(n)}}}return i.length!==0&&this.makeEdit(i),i}static parseQuery(e){let t={};if(e){let s=(e[0]==="?"?e.substr(1):e).split("&");for(let i of s){let o=i.split("="),l=o.shift();l&&(t[l]=o.join("="))}}return t}static parseHexOrDecInt(e){return e=e.toLowerCase(),e.startsWith("0x")?parseInt(e.substring(2),16):parseInt(e,10)}};var P=class{constructor(){this._webviews=new Set}*get(e){let t=e.toString();for(let s of this._webviews)s.resource===t&&(yield s.webviewPanel)}add(e,t){let s={resource:e.toString(),webviewPanel:t};this._webviews.add(s),t.onDidDispose(()=>{this._webviews.delete(s)})}};var R=class{constructor(e,t,s,i){this.from=e,this.to=t,this.color=s,this.caption=i}};var h=class{constructor(e,t){this._context=e;this._dataInspectorView=t;this.webviews=new P;this._onDidChangeCustomDocument=new u.EventEmitter;this.onDidChangeCustomDocument=this._onDidChangeCustomDocument.event;this._requestId=1;this._callbacks=new Map}static register(e,t){return u.window.registerCustomEditorProvider(h.viewType,new h(e,t),{supportsMultipleEditorsPerDocument:!1})}async openCustomDocument(e,t,s){let i=await w.create(e,t),o=[];o.push(i.onDidChange(d=>{this._onDidChangeCustomDocument.fire({document:i,...d})})),o.push(i.onDidChangeContent(d=>{for(let r of this.webviews.get(i.uri))this.postMessage(r,"update",{fileSize:d.fileSize,baseAddress:d.baseAddress,type:d.type,edits:d.edits})}));let l=u.workspace.createFileSystemWatcher(e.fsPath);return o.push(l),o.push(l.onDidChange(d=>{if(d.fsPath===e.fsPath)if(i.unsavedEdits.length>0){let r="This file has changed on disk, but you have unsaved changes. Saving now will overwrite the file on disk with your changes.";u.window.showWarningMessage(r,"Overwrite","Revert").then(n=>{n==="Overwrite"?u.commands.executeCommand("workbench.action.files.save"):n==="Revert"&&u.commands.executeCommand("workbench.action.files.revert")})}else Date.now()-i.lastSave<500||i.revert()})),o.push(l.onDidDelete(d=>{d.toString()===e.toString()&&u.window.showWarningMessage("This file has been deleted! Saving now will create a new file on disk.","Overwrite","Close Editor").then(r=>{r==="Overwrite"?u.commands.executeCommand("workbench.action.files.save"):r==="Close Editor"&&u.commands.executeCommand("workbench.action.closeActiveEditor")})})),i.onDidDispose(()=>{u.commands.executeCommand("setContext","hexEditor:openEditor",!1),U(o)}),i}async resolveCustomEditor(e,t,s){this.webviews.add(e.uri,t),h.currentWebview=t.webview,u.commands.executeCommand("setContext","hexEditor:openEditor",!0),this._dataInspectorView.show({autoReveal:!0}),t.webview.options={enableScripts:!0},t.webview.html=this.getHtmlForWebview(t.webview),t.onDidChangeViewState(i=>{u.commands.executeCommand("setContext","hexEditor:openEditor",i.webviewPanel.visible),i.webviewPanel.visible?(h.currentWebview=i.webviewPanel.webview,this._dataInspectorView.show({autoReveal:!0,forceFocus:!0})):h.currentWebview=void 0}),t.webview.onDidReceiveMessage(i=>this.onMessage(t,e,i)),t.webview.onDidReceiveMessage(i=>{i.type==="ready"&&this.postMessage(t,"init",{fileSize:e.filesize,editorFontSize:u.workspace.getConfiguration("editor").get("fontSize"),baseAddress:e.baseAddress,html:e.documentData.length===e.filesize||e.unsavedEdits.length!=0?this.getBodyHTML():void 0})}),t.webview.onDidReceiveMessage(async i=>{i.type=="open-anyways"&&(await e.openAnyways(),this.postMessage(t,"init",{fileSize:e.filesize,editorFontSize:u.workspace.getConfiguration("editor").get("fontSize"),baseAddress:e.baseAddress,html:this.getBodyHTML()}))})}saveCustomDocument(e,t){for(let s of this.webviews.get(e.uri))this.postMessage(s,"save",{});return e.save(t)}saveCustomDocumentAs(e,t,s){return e.saveAs(t,s)}revertCustomDocument(e,t){return e.revert(t)}backupCustomDocument(e,t,s){return e.backup(t.destination,s)}getHtmlForWebview(e){let t=e.asWebviewUri(u.Uri.joinPath(this._context.extensionUri,"dist","editor.js")),s=e.asWebviewUri(u.Uri.joinPath(this._context.extensionUri,"dist","hexEdit.css")),i=e.asWebviewUri(u.Uri.joinPath(this._context.extensionUri,"node_modules","@vscode","codicons","dist","codicon.css")),o=k();return`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${e.cspSource} blob:; font-src ${e.cspSource}; style-src ${e.cspSource}; script-src 'nonce-${o}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${s}" rel="stylesheet" />
				<link href="${i}" rel="stylesheet" />
				<script nonce="${o}" src="${t}" defer><\/script>

				<title>Hex Editor</title>
			</head>
			<body>
			</body>
			</html>`}getBodyHTML(){return`
		<div class="column left">
			<div class="header" aria-hidden="true">00000000</div>
			<div class="rowwrapper" id="hexaddr">
			</div>
		</div>
		<div id="editor-container">
			<div class="column middle">
				<div class="header">
					<span>00</span><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span><span>09</span><span>0A</span><span>0B</span><span>0C</span><span>0D</span><span>0E</span><span>0F</span>
				</div>
				<div class="rowwrapper" id="hexbody">
				</div>
			</div>
			<div class="column right">
				<div class="header">DECODED TEXT</div>
				<div class="rowwrapper" id="ascii">
				</div>
			</div>
			<div id="scrollbar">
				<div role="scrollbar" id="scroll-thumb">
				</div>
			</div>
		</div>
		<div id="search-container">
		</div>
		`}postMessageWithResponse(e,t,s){let i=this._requestId++,o=new Promise(l=>this._callbacks.set(i,l));return e.webview.postMessage({type:t,requestId:i,body:s}),o}postMessage(e,t,s){e.webview.postMessage({type:t,body:s})}async onMessage(e,t,s){switch(s.type){case"packet":let i=s.body,o=Array.from(t.documentData.slice(i.initialOffset,i.initialOffset+i.numElements)),l=[];t.unsavedEdits.flat().forEach(c=>{c.offset>=i.initialOffset&&c.offset<i.initialOffset+i.numElements&&(l.push(c),c.oldValue===void 0&&c.newValue!==void 0&&o.push(c.newValue))}),h.globalTags=await t.tagsHandler.retrieveTags(),e.webview.postMessage({type:"packet",requestId:s.requestId,body:{fileSize:t.filesize,baseAddress:t.baseAddress,data:o,offset:i.initialOffset,edits:l,tags:h.globalTags}});return;case"addTagToFile":let d=await t.tagsHandler.retrieveTags();d.push(new R(s.body.from,s.body.to,s.body.color,s.body.caption)),await t.tagsHandler.saveTags(d),await e.webview.postMessage({type:"addTagToFile",requestId:s.requestId,body:{}}),await e.webview.postMessage({type:"update",body:{type:"redraw"}});return;case"rewriteTagsInFile":await t.tagsHandler.saveTags(s.body.tags),await e.webview.postMessage({type:"addTagToFile",requestId:s.requestId,body:{}}),await e.webview.postMessage({type:"update",body:{type:"redraw"}});return;case"edit":t.makeEdit(s.body),e.webview.postMessage({type:"edit",requestId:s.requestId,body:{fileSize:t.filesize,baseAddress:t.baseAddress}});return;case"search":if(s.body.cancel){t.searchProvider.cancelRequest();return}let r;s.body.type==="ascii"?r=await t.searchProvider.createNewRequest().textSearch(s.body.query,s.body.options):r=await t.searchProvider.createNewRequest().hexSearch(s.body.query),r!==void 0&&e.webview.postMessage({type:"search",requestId:s.requestId,body:{results:r}});return;case"replace":let n=t.replace(s.body.query,s.body.offsets,s.body.preserveCase);e.webview.postMessage({type:"replace",requestId:s.requestId,body:{edits:n}});return;case"dataInspector":this._dataInspectorView.handleEditorMessage(s.body);return}}},v=h;v.viewType="hexEditor.hexedit";function J(a){let e=new D(a.extensionUri);a.subscriptions.push(f.window.registerWebviewViewProvider(D.viewType,e));let t=f.commands.registerTextEditorCommand("hexEditor.openFile",n=>{f.commands.executeCommand("vscode.openWith",n.document.uri,"hexEditor.hexedit")}),s=f.commands.registerCommand("hexEditor.goToOffset",async()=>{let n=await F();n&&v.currentWebview&&v.currentWebview.postMessage({type:"goToOffset",body:{offset:n}})}),i=f.commands.registerCommand("hexEditor.goToTag",async()=>{let n=await f.window.showQuickPick(v.globalTags.map(c=>c.caption),{placeHolder:"Select a tag"});n&&v.currentWebview&&v.currentWebview.postMessage({type:"goToTag",body:{caption:n}})}),o=f.commands.registerCommand("hexEditor.addTag",async()=>{let n=await f.window.showInputBox({placeHolder:"Caption"}),c=await f.window.showQuickPick(["red","orange","yellow","lime","green","aqua","blue","purple","pink","Custom CSS color"],{canPickMany:!1,placeHolder:"Pick a color"});c=="Custom CSS color"&&(c=await f.window.showInputBox({placeHolder:"CSS Color"})),c&&n&&v.currentWebview&&v.currentWebview.postMessage({type:"addTag",body:{color:c,caption:n}})}),l=f.commands.registerCommand("hexEditor.removeTagAtSelection",async()=>{v.currentWebview&&v.currentWebview.postMessage({type:"removeTagAtSelection"})}),d=f.commands.registerCommand("hexEditor.removeTag",async()=>{let n=await f.window.showQuickPick(v.globalTags.map(c=>c.caption),{placeHolder:"Select a tag"});n&&v.currentWebview&&v.currentWebview.postMessage({type:"removeTag",body:{caption:n}})}),r=f.commands.registerCommand("hexEditor.removeAllTags",async()=>{v.currentWebview&&v.currentWebview.postMessage({type:"removeAllTags",body:{}})});a.subscriptions.push(s),a.subscriptions.push(t),a.subscriptions.push(o),a.subscriptions.push(i),a.subscriptions.push(l),a.subscriptions.push(d),a.subscriptions.push(r),a.subscriptions.push(v.register(a,e))}
