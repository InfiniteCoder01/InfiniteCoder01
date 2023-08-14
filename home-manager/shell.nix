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
        wget https://gist.githubusercontent.com/InfiniteCoder01/2ff515dd1656e451ea5fb7126bac2f21/raw/bb5e006af06278e2c7a4cff0eac0021a57a9dcf2/shell.nix -q
        echo "use nix" >> .envrc
        direnv allow
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
    '';
  };

  programs.rofi = {
    enable = true;
    plugins = with pkgs; [ rofi-emoji rofi-calc ];
    theme = "custom.rasi";
    extraConfig = {
      modes = "run,drun,emoji,calc";
      show-icons = true;
      kb-remove-word-forward = "Control+Alt+d,Control+Delete";
      matching = "glob";
    };
  };
  home.file = {
    ".config/rofi/themes/custom.rasi".source = ./theme.rasi;
  };

  # Gnome
  home.packages = [ pkgs.gnome.gnome-tweaks ];
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
      command = "rofi -normal-window -show drun";
      binding = "<Super>r";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1" = {
      name = "Open Nautilus";
      command = "nautilus";
      binding = "<Super>e";
    };
  };
}
