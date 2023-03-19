"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tidy_1 = require("./tidy");
function lintActiveTextDocument(loggingChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode.window.activeTextEditor === undefined) {
            return { document: undefined, diagnostics: [] };
        }
        return {
            document: vscode.window.activeTextEditor.document,
            diagnostics: yield lintTextDocument(vscode.window.activeTextEditor.document, loggingChannel, false),
        };
    });
}
exports.lintActiveTextDocument = lintActiveTextDocument;
function isBlacklisted(file) {
    const blacklist = vscode.workspace
        .getConfiguration("clang-tidy")
        .get("blacklist");
    const relativeFilename = vscode.workspace.asRelativePath(file.fileName);
    for (let i = 0; i < blacklist.length; i++) {
        const regex = new RegExp(blacklist[i]);
        if (regex.test(relativeFilename)) {
            return true;
        }
    }
}
function lintTextDocument(file, loggingChannel, fixErrors) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!["cpp", "c"].includes(file.languageId)) {
            return [];
        }
        if (file.uri.scheme !== "file") {
            return [];
        }
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(file.uri);
        if (!workspaceFolder) {
            return [];
        }
        if (isBlacklisted(file)) {
            return [];
        }
        const clangTidyOut = yield tidy_1.runClangTidy([file.uri.fsPath], workspaceFolder.uri.fsPath, loggingChannel, fixErrors);
        return tidy_1.collectDiagnostics(clangTidyOut, file);
    });
}
exports.lintTextDocument = lintTextDocument;
//# sourceMappingURL=lint.js.map