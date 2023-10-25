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
      flake-rebuild = "sudo nixos-rebuild --flake ~/system#infinitecoder";
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

  programs.waybar = {
    enable = true;
    package = (pkgs.waybar.overrideAttrs (oldAttrs: {
      mesonFlags = oldAttrs.mesonFlags ++ [ "-Dexperimental=true" ];
    }));
  };

  programs.wofi.enable = true;
  home.file = {
    ".config/waybar/" = {
      source = ./dotfiles/waybar;
      recursive = true;
    };
    ".config/wofi/" = {
      source = ./dotfiles/wofi;
      recursive = true;
    };
    ".config/swaync/" = {
      source = ./dotfiles/swaync;
      recursive = true;
    };
    ".config/eww/" = {
      source = ./dotfiles/eww;
      recursive = true;
    };
  };

  home.pointerCursor =
    let
      getFrom = url: hash: name: {
        gtk.enable = true;
        x11.enable = true;
        name = name;
        size = 48;
        package =
          pkgs.runCommand "moveUp" { } ''
            mkdir -p $out/share/icons
            ln -s ${builtins.fetchTarball {
              url = url;
              sha256 = hash;
            }} $out/share/icons/${name}
          '';
      };
    in
    getFrom
      "https://github.com/ful1e5/Bibata_Cursor/releases/download/v2.0.4/Bibata-Modern-Classic.tar.xz"
      "sha256-YEH6nA8A6KWuGQ6MPBCIEc4iTyllKwp/OLubD3m06Js="
      "Bibata-Modern-Classic";

  dconf.settings = {
    "org/virt-manager/virt-manager/connections" = {
      autoconnect = [ "qemu:///system" ];
      uris = [ "qemu:///system" ];
    };
  };

  fonts.fontconfig.enable = true;
  qt = {
    enable = true;
    platformTheme = "qtct";
  };
  home.packages = with pkgs; [
    # wofi-emoji
    libsForQt5.dolphin
    libsForQt5.kdegraphics-thumbnailers
    libsForQt5.breeze-icons
    libsForQt5.qt5ct

    onagre
    alacritty
    gnome.file-roller
    gnome.seahorse

    swappy
    grim
    slurp

    swaynotificationcenter
    libnotify
    brightnessctl
    light
    eww-wayland
    pamixer

    networkmanagerapplet
    xdg-desktop-portal-wlr
    wl-clip-persist

    # Fonts
    (nerdfonts.override { fonts = [ "JetBrainsMono" ]; })
  ];
}
