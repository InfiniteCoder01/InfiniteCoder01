{ config, pkgs, ... }:

{
  imports = [
    ./vscode.nix
    ./shell.nix
  ];

  home.username = "infinitecoder";
  home.homeDirectory = "/home/infinitecoder";
  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.allowUnfreePredicate = (_: true);
  nixpkgs.config.permittedInsecurePackages = [
    "openssl-1.1.1v"
    "python-2.7.18.6"
  ];

  home.packages = with pkgs; [
    # CLI tools
    starship
    hello
    sl
    git
    gh
    curl
    whois
    zip
    unzip
    neofetch
    exa
    bat
    ripgrep
    fd

    # DevTools
    nixpkgs-fmt
    rnix-lsp
    rustup
    wakatime # https://matthewrhone.dev/nixos-wakatime-vscode

    # Libs
    libsForQt5.kglobalaccel
    xclip

    # Utilities
    wineWowPackages.waylandFull
    microsoft-edge-dev
    github-desktop
    gparted
    konsole
    yakuake

    # Social
    tdesktop
    viber
    discord
    steam

    # Media
    super-slicer-latest
    obs-studio
    inkscape
    aseprite-unfree
    gimp
    reaper
    dexed
  ];

  programs.direnv = {
    enable = true;
    enableZshIntegration = true;
    nix-direnv.enable = true;
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
        ];
      }];
    };
  };

  home.sessionVariables = {
    # EDITOR = "emacs";
  };

  programs.home-manager.enable = true;

  # This value determines the Home Manager release that your configuration is
  # compatible with. This helps avoid breakage when a new Home Manager release
  # introduces backwards incompatible changes.
  #
  # You should not change this value, even if you update Home Manager. If you do
  # want to update the value, then make sure to first check the Home Manager
  # release notes.
  home.stateVersion = "22.11"; # Please read the comment before changing.
}
