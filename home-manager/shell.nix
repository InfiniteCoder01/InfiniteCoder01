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

      # Starship
      eval "$(starship init zsh)"
    '';
  };

  programs.rofi = {
    enable = true;
    plugins = with pkgs; [ rofi-emoji rofi-calc ];
    theme = "custom.rasi";
    extraConfig = {
      modes = "window,drun,emoji,calc";
      show-icons = true;
      kb-remove-word-forward = "Control+Alt+d,Control+Delete";
      matching = "fuzzy";
    };
  };
  home.file = {
    ".config/rofi/themes/custom.rasi".source = ./theme.rasi;
  };

  # Gnome
  home.packages = [ pkgs.gnome.gnome-tweaks ];
  dconf.settings = {
    "org/gnome/shell" = {
      # enabled-extensions = [
      # "native-window-placement@gnome-shell-extensions.gcampax.github.com"
      # "pop-shell@system76.com"
      # "caffeine@patapon.info"
      # "hidetopbar@mathieu.bidon.ca"
      # "gsconnect@andyholmes.github.io"
      # ];
    };
    # "org/gnome/shell/extensions/hidetopbar" = {
    #   enable-active-window = false;
    #   enable-intellihide = false; 
    # };
    # "org/gnome/desktop/interface" = {
    #   clock-show-seconds = true;
    #   clock-show-weekday = true;
    #   color-scheme = "prefer-dark";
    #   enable-hot-corners = false;
    #   font-antialiasing = "grayscale";
    #   font-hinting = "slight";
    #   gtk-theme = "Nordic";
    #   toolkit-accessibility = true;
    # };
    # "org/gnome/desktop/wm/preferences" = {
    #   button-layout = "close,minimize,maximize:appmenu";
    #   num-workspaces = 10;
    # };
    # "org/gnome/shell/extensions/pop-shell" = {
    #   focus-right = "disabled";
    #   tile-by-default = true;
    #   tile-enter = "disabled";
    # };
    # "org/gnome/desktop/peripherals/touchpad" = {
    #   tap-to-click = true;
    #   two-finger-scrolling-enabled = true;
    # };
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
