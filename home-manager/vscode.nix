{ config, pkgs, ... }:

{
  programs.vscode = {
    enable = true;
    package = pkgs.vscode;
    enableUpdateCheck = true;
    enableExtensionUpdateCheck = true;
    extensions = with pkgs.vscode-extensions; [
      # Langs
      # mkhl.direnv
      jnoortheen.nix-ide
      a5huynh.vscode-ron
      llvm-vs-code-extensions.vscode-clangd
      rust-lang.rust-analyzer
      serayuzgur.crates
      # slevesque.shader
      tamasfe.even-better-toml

      # Comments, Text & TODOs
      # aaron-bond.better-comments
      # mdw.vscode-todo-plus-plus
      shardulm94.trailing-spaces
      usernamehw.errorlens
      # zfzackfrost.commentbars

      # Files & Git
      # chrisbibby.hide-git-ignored
      mhutchie.git-graph
      # patbenatar.advanced-new-file
      # sleistner.vscode-fileutils

      # Runners
      # swellaby.vscode-rust-test-adapter
      # searKing.preview-vscode
      vadimcn.vscode-lldb

      # Others
      # PKief.material-icon-theme
      WakaTime.vscode-wakatime
    ];

    userSettings = {
      editor.smoothScrolling = true;
      workbench.list.smoothScrolling = true;
      editor.mouseWheelScrollSensitivity = 1.3;
      #
      #           ---USEFUL---
      #
      files.insertFinalNewline = true;
      editor.maxTokenizationLineLength = 1000;
      editor.quickSuggestionsDelay = 0;
      files.autoSave = "off";
      security.workspace.trust.untrustedFiles = "open";
      #
      #           ---THEME---
      #
      workbench.iconTheme = "material-icon-theme";
      terminal.integrated.defaultProfile.linux = "zsh";
      #
      #           ---CLANGD---
      #
      clangd.arguments = [
        "--background-index"
        "--all-scopes-completion"
        "-header-insertion=never"
      ];
      "[cpp]" = {
        editor.defaultFormatter = "llvm-vs-code-extensions.vscode-clangd";
      };
      #
      #           ---RUST---
      #
      rust-analyzer.inlayHints.bindingModeHints.enable = true;
      rust-analyzer.assist.emitMustUse = true;
      rust-analyzer.assist.expressionFillDefault = "default";
      #
      #           ---MISC---
      #
      explorer.excludeGitIgnore = true;
      editor.inlayHints.enabled = "off";
      window.titleBarStyle = "custom";
      window.commandCenter = true;
      commentbars.commentDelimsUser = {
        rust = {
          start = "// * ";
          end = " * //";
        };
      };
      commentbars.quickPresets = [
        {
          label = "Half";
          fillChar = "-";
          width = 90;
          thickness = 1;
          seamlessFill = true;
        }
        {
          label = "Full";
          fillChar = "-";
          width = 180;
          thickness = 1;
          seamlessFill = true;
        }
      ];
      terminal.integrated.scrollback = 10000;
      editor.wordBasedSuggestions = false;
      rust-analyzer.check.command = "clippy";
      errorLens.gutterIconsEnabled = true;
      errorLens.statusBarColorsEnabled = true;
      errorLens.statusBarIconsEnabled = true;
      editor.minimap.enabled = false;
      git.enableSmartCommit = true;
      git.confirmSync = false;
      files.associations = {
        "*.ldtk" = "json";
      };
    };
    keybindings = [
      {
        key = "ctrl+t";
        command = "editor.action.formatDocument";
        when = "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor";
      }
      {
        key = "f4";
        command = "workbench.action.terminal.toggleTerminal";
        when = "terminal.active";
      }
      {
        key = "ctrl+n";
        command = "extension.advancedNewFile";
      }
      {
        key = "ctrl+alt+n";
        command = "workbench.action.files.newUntitledFile";
      }
    ];
  };
}
