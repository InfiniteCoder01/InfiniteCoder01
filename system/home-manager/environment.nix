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
      flake-rebuild = "nixos-rebuild --flake ~/system#infinitecoder";
      flake-manager = "home-manager --flake ~/system#infinitecoder@infinitecoder";
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

  wayland.windowManager.hyprland = {
    enable = true;
    enableNvidiaPatches = true;
    systemdIntegration = false;
    extraConfig = (builtins.readFile ./dotfiles/hyprland.conf);
  };

  services.mako = {
    enable = true;
    extraConfig = (builtins.readFile ./dotfiles/mako.conf);
  };

  programs.waybar = {
    enable = true;
    package = (pkgs.waybar.overrideAttrs (oldAttrs: {
      mesonFlags = oldAttrs.mesonFlags ++ [ "-Dexperimental=true" ];
    }));
  };

  programs.rofi = {
    enable = true;
    plugins = with pkgs; [ rofi-emoji rofi-calc ];
    theme = "theme.rasi";
    extraConfig = {
      modes = "emoji,calc,drun,run";
      show-icons = true;
      kb-remove-word-forward = "Control+Alt+d,Control+Delete";
      matching = "glob";
    };
  };
  home.file = {
    ".config/waybar/" = {
      source = ./dotfiles/waybar;
      recursive = true;
    };
    ".config/rofi/themes/theme.rasi".source = ./dotfiles/theme.rasi;
  };

  home.packages = with pkgs; [
    alacritty
    gnome.nautilus

    swappy
    grim
    slurp
    pamixer
    brightnessctl
    bluez
    lxappearance

    # Fonts
    (nerdfonts.override { fonts = [ "JetBrainsMono" ]; })
    noto-fonts-emoji
  ];
}