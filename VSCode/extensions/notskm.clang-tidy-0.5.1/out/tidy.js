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
const child_process_1 = require("child_process");
const vscode = require("vscode");
const jsYaml = require("js-yaml");
function clangTidyArgs(files, fixErrors) {
    let args = [...files, "--export-fixes=-"];
    const checks = vscode.workspace
        .getConfiguration("clang-tidy")
        .get("checks");
    if (checks.length > 0) {
        args.push(`--checks=${checks.join(",")}`);
    }
    const compilerArgs = vscode.workspace
        .getConfiguration("clang-tidy")
        .get("compilerArgs");
    compilerArgs.forEach((arg) => {
        args.push(`--extra-arg=${arg}`);
    });
    const compilerArgsBefore = vscode.workspace
        .getConfiguration("clang-tidy")
        .get("compilerArgsBefore");
    compilerArgsBefore.forEach((arg) => {
        args.push(`--extra-arg-before=${arg}`);
    });
    const buildPath = vscode.workspace
        .getConfiguration("clang-tidy")
        .get("buildPath");
    if (buildPath.length > 0) {
        args.push(`-p=${buildPath}`);
    }
    if (fixErrors) {
        args.push("--fix");
    }
    return args;
}
function clangTidyExecutable() {
    return vscode.workspace
        .getConfiguration("clang-tidy")
        .get("executable");
}
class ChildProcessWithExitFlag {
    constructor(process) {
        this.process = process;
        this.exited = false;
        process.on("exit", () => (this.exited = true));
    }
}
let clangTidyProcess = undefined;
function killClangTidy() {
    if (clangTidyProcess === undefined ||
        clangTidyProcess.exited ||
        clangTidyProcess.process.killed) {
        return;
    }
    // process.kill() does not work on Windows for some reason.
    // We can use the taskkill command instead.
    if (process.platform === "win32") {
        const pid = clangTidyProcess.process.pid.toString();
        child_process_1.execFileSync("taskkill", ["/pid", pid, "/f", "/t"]);
        clangTidyProcess.process.killed = true;
    }
    else {
        clangTidyProcess.process.kill();
    }
}
exports.killClangTidy = killClangTidy;
function runClangTidy(files, workingDirectory, loggingChannel, fixErrors) {
    killClangTidy();
    const progressMessage = fixErrors
        ? "Linting and fixing current file (do not modify it in the meanwhile)..."
        : "Linting current file...";
    return new Promise((resolve) => {
        const clangTidy = clangTidyExecutable();
        const args = clangTidyArgs(files, fixErrors);
        loggingChannel.appendLine(`> ${clangTidy} ${args.join(" ")}`);
        loggingChannel.appendLine(`Working Directory: ${workingDirectory}`);
        vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, (progress) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ message: progressMessage });
            yield new Promise((res, rej) => {
                clangTidyProcess = new ChildProcessWithExitFlag(child_process_1.execFile(clangTidy, args, { cwd: workingDirectory }, (error, stdout, stderr) => {
                    loggingChannel.appendLine(stdout);
                    loggingChannel.appendLine(stderr);
                    resolve(stdout);
                    res();
                }));
            });
        }));
    });
}
exports.runClangTidy = runClangTidy;
function tidyOutputAsObject(clangTidyOutput) {
    const yamlIndex = clangTidyOutput.search(/^---$/m);
    if (yamlIndex < 0) {
        return { MainSourceFile: "", Diagnostics: [] };
    }
    const rawYaml = clangTidyOutput.substr(yamlIndex);
    const tidyResults = jsYaml.safeLoad(rawYaml);
    let structuredResults = {
        MainSourceFile: tidyResults.MainSourceFile,
        Diagnostics: [],
    };
    tidyResults.Diagnostics.forEach((diag) => {
        if (diag.DiagnosticMessage) {
            structuredResults.Diagnostics.push({
                DiagnosticName: diag.DiagnosticName,
                DiagnosticMessage: {
                    Message: diag.DiagnosticMessage.Message,
                    FilePath: diag.DiagnosticMessage.FilePath,
                    FileOffset: diag.DiagnosticMessage.FileOffset,
                    Replacements: diag.DiagnosticMessage.Replacements,
                    Severity: vscode.DiagnosticSeverity.Warning,
                },
            });
        }
        else if (diag.Message && diag.FilePath && diag.FileOffset) {
            structuredResults.Diagnostics.push({
                DiagnosticName: diag.DiagnosticName,
                DiagnosticMessage: {
                    Message: diag.Message,
                    FilePath: diag.FilePath,
                    FileOffset: diag.FileOffset,
                    Replacements: diag.Replacements ? diag.Replacements : [],
                    Severity: vscode.DiagnosticSeverity.Warning,
                },
            });
        }
    });
    let diagnostics = structuredResults.Diagnostics;
    const severities = collectDiagnosticSeverities(clangTidyOutput);
    for (let i = 0; i < diagnostics.length || i < severities.length; i++) {
        diagnostics[i].DiagnosticMessage.Severity = severities[i];
    }
    return structuredResults;
}
function collectDiagnostics(clangTidyOutput, document) {
    let results = [];
    const tidyResults = tidyOutputAsObject(clangTidyOutput);
    tidyResults.Diagnostics.forEach((diag) => {
        const diagnosticMessage = diag.DiagnosticMessage;
        // We make these paths relative before comparing them because
        // on Windows, the drive letter is lowercase for the document filename,
        // but uppercase for the diagnostic message file path. This caused the
        // comparison to fail when it shouldn't.
        if (vscode.workspace.asRelativePath(document.fileName) !==
            vscode.workspace.asRelativePath(diagnosticMessage.FilePath)) {
            return; // The message isn't related to current file
        }
        if (diagnosticMessage.Replacements.length > 0) {
            diagnosticMessage.Replacements.forEach((replacement) => {
                const beginPos = document.positionAt(replacement.Offset);
                const endPos = document.positionAt(replacement.Offset + replacement.Length);
                const diagnostic = {
                    range: new vscode.Range(beginPos, endPos),
                    severity: diagnosticMessage.Severity,
                    message: diagnosticMessage.Message,
                    code: diag.DiagnosticName,
                    source: "clang-tidy",
                };
                results.push(diagnostic);
            });
        }
        else {
            const line = document.positionAt(diagnosticMessage.FileOffset).line;
            results.push({
                range: new vscode.Range(line, 0, line, Number.MAX_VALUE),
                severity: diagnosticMessage.Severity,
                message: diagnosticMessage.Message,
                code: diag.DiagnosticName,
                source: "clang-tidy",
            });
        }
    });
    return results;
}
exports.collectDiagnostics = collectDiagnostics;
function collectDiagnosticSeverities(clangTidyOutput) {
    const data = clangTidyOutput.split("\n");
    const regex = /^.*:\d+:\d+:\s+(warning|error|info|hint):\s+.*$/;
    let severities = [];
    data.forEach((line) => {
        const matches = regex.exec(line);
        if (matches === null) {
            return;
        }
        switch (matches[1]) {
            case "error":
                severities.push(vscode.DiagnosticSeverity.Error);
                break;
            case "warning":
                severities.push(vscode.DiagnosticSeverity.Warning);
                break;
            case "info":
                severities.push(vscode.DiagnosticSeverity.Information);
                break;
            case "hint":
                severities.push(vscode.DiagnosticSeverity.Hint);
                break;
            default:
                severities.push(vscode.DiagnosticSeverity.Warning);
                break;
        }
    });
    return severities;
}
//# sourceMappingURL=tidy.js.map