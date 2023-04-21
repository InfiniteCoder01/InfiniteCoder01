'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const request = require("request-promise-native");
const opn = require('opn');
function activate(context) {
    const searchBySelection = vscode.commands.registerCommand('extension.stackoverflow-search-selection', () => __awaiter(this, void 0, void 0, function* () {
        const searchTerm = getSelectedText();
        yield executeSearch(searchTerm);
    }));
    const searchWithPrompt = vscode.commands.registerCommand('extension.stackoverflow-search', () => __awaiter(this, void 0, void 0, function* () {
        const selectedText = getSelectedText();
        const searchTerm = yield vscode.window.showInputBox({
            ignoreFocusOut: selectedText === '',
            placeHolder: 'Enter your Stackoverflow search query',
            // prompt: 'search for tooltip',
            value: selectedText,
            valueSelection: [0, selectedText.length + 1],
        });
        yield executeSearch(searchTerm);
    }));
    context.subscriptions.push(searchBySelection);
    context.subscriptions.push(searchWithPrompt);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function executeSearch(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!searchTerm || searchTerm.trim() === '') {
            return;
        }
        searchTerm = searchTerm.trim();
        console.log(`User initiated a stackoverflow search with [${searchTerm}] search term`);
        // process tags
        const tags = [];
        const regex = /\[(.+?)\]/gm;
        let tagsMatch;
        let updatedSearchTerm = searchTerm;
        while ((tagsMatch = regex.exec(updatedSearchTerm)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (tagsMatch.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            tagsMatch.forEach((match, groupIndex) => {
                if (groupIndex === 0) { // full match without group for replace
                    updatedSearchTerm = updatedSearchTerm.replace(match, "").trim();
                }
                else if (groupIndex === 1) { // not a full match
                    tags.push(match);
                }
            });
        }
        const stackoverflowApiKey = 'wGskWEriO20ZNc69IRfE0w((';
        const encodedTagsString = encodeURIComponent(tags.join(';'));
        const encodedAPISearchTerm = encodeURIComponent(updatedSearchTerm);
        const encodedWebSearchTerm = encodeURIComponent(searchTerm);
        const apiSearchUrl = `https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle=${encodedAPISearchTerm}&tagged=${encodedTagsString}&site=stackoverflow&key=${stackoverflowApiKey}`;
        const stackoverflowSearchUrl = `https://stackoverflow.com/search?q=${encodedWebSearchTerm}`;
        const googleSearchUrl = `https://www.google.com/search?q=${encodedWebSearchTerm}`;
        const uriOptions = {
            uri: apiSearchUrl,
            json: true,
            gzip: true,
        };
        const questionsMeta = [
            { title: `🌐 🔎 Search Stackoverflow: ${searchTerm}`, url: stackoverflowSearchUrl },
            { title: `🕸️ 🔎 Search Google: ${searchTerm}`, url: googleSearchUrl },
        ];
        try {
            const searchResponse = yield request.get(uriOptions);
            if (searchResponse.items && searchResponse.items.length > 0) {
                searchResponse.items.forEach((q, i) => {
                    questionsMeta.push({
                        title: `${i}: ${q.is_answered ? '✅' : '🤔'} ${q.score}🔺 ${q.answer_count}❗ ➡️ ${decodeURIComponent(q.title)} 🏷️ ${q.tags.join(',')} 👩‍💻 by ${q.owner.display_name}`,
                        url: q.link
                    });
                });
            }
        }
        catch (error) {
            console.error(error);
        }
        const questions = questionsMeta.map(q => q.title);
        const selectedTitle = yield vscode.window.showQuickPick(questions, { canPickMany: false });
        const selectedQuestionMeta = questionsMeta.find(q => q.title === selectedTitle);
        const selectedQuestionUrl = selectedQuestionMeta ? selectedQuestionMeta.url : stackoverflowSearchUrl;
        if (selectedQuestionUrl) {
            opn(selectedQuestionUrl);
        }
    });
}
function getSelectedText() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return '';
    }
    const document = editor.document;
    const eol = document.eol === 1 ? '\n' : '\r\n';
    let result = '';
    const selectedTextLines = editor.selections.map((selection) => {
        if (selection.start.line === selection.end.line && selection.start.character === selection.end.character) {
            const range = document.lineAt(selection.start).range;
            const text = editor.document.getText(range);
            return `${text}${eol}`;
        }
        return editor.document.getText(selection);
    });
    if (selectedTextLines.length > 0) {
        result = selectedTextLines[0];
    }
    result = result.trim();
    return result;
}
//# sourceMappingURL=extension.js.map