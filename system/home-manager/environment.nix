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
      newflake = ''
        wget https://gist.githubusercontent.com/InfiniteCoder01/e3b8f14405114a7cff1618d807612545/raw/2bd7baaeb9d0d9226aadcd555375acf3370c6073/flake.nix -O flake.nix -q
        echo "use flake" >> .envrc
        echo ".direnv" >> .gitignore
        direnv allow
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
