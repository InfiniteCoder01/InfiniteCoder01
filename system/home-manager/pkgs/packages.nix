{ inputs, config, pkgs, ... }:

{
  home.packages = with pkgs; [
    # CLI tools
    starship
    termius
    hello
    sl
    git
    gh
    curl
    whois
    file
    zip
    unzip
    neofetch
    usbutils
    bat
    ripgrep
    fd
    btop

    # DevTools
    gcc
    rustup
    nixpkgs-fmt
    rnix-lsp
    wakatime # https://matthewrhone.dev/nixos-wakatime-vscode

    # Libs
    qt6.qtwayland
    libsForQt5.qt5.qtwayland
    libsForQt5.kglobalaccel
    wineWowPackages.waylandFull
    winetricks
    gnome.gnome-keyring
    bottles
    xclip

    # Utilities
    filezilla
    rpi-imager
    gnome.gnome-disk-utility
    pass-wayland
    microsoft-edge-dev
    qbittorrent
    github-desktop
    gparted
    ghidra
    konsole
    yakuake

    # Social
    tdesktop
    viber
    discord
    steam

    # Virtualization
    virt-manager
    qemu

    # Media
    gimp
    krita
    pinta
    inkscape
    aseprite-unfree
    libreoffice-qt
    libsForQt5.kdenlive
    obs-studio
    vlc

    pavucontrol
    audacity
    reaper
    dexed

    blender
    freecad

    inputs.orca-slicer.packages.x86_64-linux.orca-slicer
    cura
    # (appimageTools.wrapType2 {
    #   name = "freecad";
    #   src = fetchurl {
    #     url = "https://github.com/realthunder/FreeCAD/releases/download/Tip/FreeCAD-Link-Tip-Linux-x86_64-py3.11-20230811.AppImage";
    #     hash = "sha256-jOCO9N/njGSajC1UK2aMcwy4uxaMBndNE13RhOx0hB8=";
    #   };
    #   extraPkgs = pkgs: with pkgs; [ pciutils ];
    # })

    # arduino
    (appimageTools.wrapType2 {
      name = "arduino";
      src = fetchurl {
        url = "https://downloads.arduino.cc/arduino-ide/arduino-ide_2.1.1_Linux_64bit.AppImage";
        hash = "sha256-2i4Tr2TgpNk3UzowMFvwSH6uPkgCH5jiP93xB52YNlM=";
      };
      extraPkgs = pkgs: with pkgs; [ libsecret xorg.libxkbfile ];
    })
  ];

  programs.direnv = {
    enable = true;
    enableZshIntegration = true;
    nix-direnv.enable = true;
  };

  programs.eza = {
    enable = true;
    enableAliases = true;
    icons = true;
    extraOptions = [ "--group-directories-first" "--header" ];
    git = true;
  };

  programs.firefox = {
    enable = true;
    package = pkgs.firefox.override {
      cfg = {
        enableGnomeExtensions = true;
        enableTridactylNative = true;
      };
    };
    profiles.default = {
      name = "Default";
      bookmarks = [{
        name = "Toolbar";
        toolbar = true;
        bookmarks = [
          { name = "NixOS Registery"; url = "https://search.nixos.org/packages"; }
          { name = "Home Manager options"; url = "https://rycee.gitlab.io/home-manager/options.html"; }
          { name = "Crates.io"; url = "https://crates.io"; }
          { name = "Watch later - YouTube"; url = "https://www.youtube.com/playlist?list=WL"; }
          { name = "Chiptone"; url = "https://sfbgames.itch.io/chiptone"; }
        ];
      }];
    };
  };

  programs.java = {
    enable = true;
  };
  home.sessionVariables = {
    _JAVA_OPTIONS = "-Dawt.useSystemAAFontSettings=lcd";
  };
}
