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
    rust-analyzer
    wakatime # https://matthewrhone.dev/nixos-wakatime-vscode

    # Utilities
    wineWowPackages.waylandFull
    microsoft-edge-dev
    github-desktop
    gparted

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
  ];

  programs.firefox = {
    enable = true;
    package = pkgs.firefox.override {
      cfg = {
        enableGnomeExtensions = true;
        enableTridactylNative = true;
      };
    };
    profiles.default = {
      bookmarks = [
        { name = "NixOS Registery"; url = "https://search.nixos.org/packages"; }
        { name = "Home Manager options"; url = "https://rycee.gitlab.io/home-manager/options.html"; }
      ];
    };
  };

  # Home Manager is pretty good at managing dotfiles. The primary way to manage
  # plain files is through 'home.file'.
  home.file = {
    # # Building this configuration will create a copy of 'dotfiles/screenrc' in
    # # the Nix store. Activating the configuration will then make '~/.screenrc' a
    # # symlink to the Nix store copy.
    # ".screenrc".source = dotfiles/screenrc;

    # # You can also set the file content immediately.
    # ".gradle/gradle.properties".text = ''
    #   org.gradle.console=verbose
    #   org.gradle.daemon.idletimeout=3600000
    # '';
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
