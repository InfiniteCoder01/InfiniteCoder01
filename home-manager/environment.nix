{ config, pkgs, ... }:

{
  programs.zsh = {
    enable = true;
    enableAutosuggestions = true;
    enableCompletion = true;
    syntaxHighlighting.enable = true;
    defaultKeymap = "emacs";
    history.ignoreAllDups = true;
    shellAliases = {
      newshell = ''
        new_shell_from https://gist.githubusercontent.com/InfiniteCoder01/2ff515dd1656e451ea5fb7126bac2f21/raw/ee67d5fe0ee768e86aab245f92efe2cc88de8720/shell.nix
      '';
      newshell_raylib = ''
        new_shell_from https://gist.githubusercontent.com/InfiniteCoder01/ac47b17f31fab65005ff4abbbbaf870e/raw/1e0292c68ae01bdd1d1c4a9f404d347d7f73d013/shell.nix
      '';
      shell = "nix-shell --run zsh";
    };
    initExtra = ''
      # Keybindings
      bindkey -e
      bindkey "^[[3~" delete-char
      bindkey "^[[H" beginning-of-line
      bindkey "^[[F" end-of-line
      bindkey "^[[1;5D" backward-word
      bindkey "^[[1;5C" forward-word
      bindkey "^H" backward-kill-word
      bindkey "^[[3;5~" forward-kill-word
      bindkey "^[[3;5~" kill-word

      # Shell Integrations
      eval "$(starship init zsh)"
      eval "$(direnv hook zsh)"
      export DIRENV_LOG_FORMAT=

      path=('/home/infinitecoder/.cargo/bin' $path)
      export PATH

      # New Shell
      new_shell_from () {
        wget $@ -O shell.nix -q
        echo "use nix" >> .envrc
        echo ".direnv" >> .gitignore
        direnv allow
      }
    '';
  };

  programs.rofi = {
    enable = true;
    plugins = with pkgs; [ rofi-emoji rofi-calc ];
    theme = "custom.rasi";
    extraConfig = {
      modes = "emoji,calc,drun,run";
      show-icons = true;
      kb-remove-word-forward = "Control+Alt+d,Control+Delete";
      matching = "glob";
    };
  };
  home.file = {
    ".config/rofi/themes/custom.rasi".source = ./theme.rasi;
  };

  # Gnome
  home.packages = with pkgs; [
    gnome.gnome-tweaks
    gnomeExtensions.pop-shell
  ];
  dconf.settings = {
    "org/gnome/shell" = {
      enabled-extensions = [
        "yakuake-extension@kde.org"
      ];
    };
    "org/gnome/desktop/interface" = {
      clock-show-weekday = true;
      color-scheme = "prefer-dark";
      enable-hot-corners = false;
      font-antialiasing = "grayscale";
      font-hinting = "slight";
      gtk-theme = "Nordic";
      toolkit-accessibility = true;
    };
    "org/gnome/desktop/peripherals/touchpad" = {
      tap-to-click = true;
      two-finger-scrolling-enabled = true;
    };
    "org/gnome/settings-daemon/plugins/media-keys".custom-keybindings = [
      "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/"
      "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1/"
    ];
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0" = {
      name = "Rofi DRun";
      command = "rofi -normal-window -show calc -calc-command \"echo '{result}' | xclip -selection clipboard\"";
      binding = "<Super>r";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1" = {
      name = "Open Nautilus";
      command = "nautilus";
      binding = "<Super>e";
    };
  };
}
