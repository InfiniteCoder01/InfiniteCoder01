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
const vscode_1 = require("vscode");
const lint_1 = require("./lint");
const tidy_1 = require("./tidy");
function activate(context) {
    let subscriptions = context.subscriptions;
    let diagnosticCollection = vscode.languages.createDiagnosticCollection();
    subscriptions.push(diagnosticCollection);
    let loggingChannel = vscode.window.createOutputChannel("Clang-Tidy");
    subscriptions.push(loggingChannel);
    function lintAndSetDiagnostics(file, fixErrors = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const diagnostics = yield lint_1.lintTextDocument(file, loggingChannel, fixErrors);
            diagnosticCollection.set(file.uri, diagnostics);
        });
    }
    function lintActiveDocAndSetDiagnostics() {
        return __awaiter(this, void 0, void 0, function* () {
            const diag = yield lint_1.lintActiveTextDocument(loggingChannel);
            if (diag.document) {
                diagnosticCollection.set(diag.document.uri, diag.diagnostics);
            }
        });
    }
    subscriptions.push(vscode_1.workspace.onDidSaveTextDocument((doc) => {
        if (vscode_1.workspace.getConfiguration("clang-tidy").get("lintOnSave")) {
            const fixErrors = vscode_1.workspace
                .getConfiguration("clang-tidy")
                .get("fixOnSave");
            lintAndSetDiagnostics(doc, fixErrors);
        }
    }));
    subscriptions.push(vscode_1.workspace.onDidOpenTextDocument(lintAndSetDiagnostics));
    subscriptions.push(vscode_1.workspace.onDidCloseTextDocument((doc) => diagnosticCollection.delete(doc.uri)));
    subscriptions.push(vscode_1.workspace.onWillSaveTextDocument(tidy_1.killClangTidy));
    subscriptions.push(vscode_1.workspace.onDidSaveTextDocument((doc) => {
        if (vscode_1.workspace.getConfiguration("clang-tidy").get("lintOnSave")) {
            if (doc.uri.scheme === "file" &&
                doc.uri.fsPath.endsWith(".clang-tidy")) {
                vscode_1.workspace.textDocuments.forEach((doc) => lintAndSetDiagnostics(doc));
            }
        }
    }));
    subscriptions.push(vscode_1.workspace.onDidChangeConfiguration((config) => {
        if (config.affectsConfiguration("clang-tidy")) {
            vscode_1.workspace.textDocuments.forEach((doc) => lintAndSetDiagnostics(doc));
        }
    }));
    subscriptions.push(vscode_1.commands.registerCommand("clang-tidy.lintFile", lintActiveDocAndSetDiagnostics));
    vscode_1.workspace.textDocuments.forEach((doc) => lintAndSetDiagnostics(doc));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map