{ inputs, outputs, lib, config, pkgs, ... }:

let
  overlays = import ./pkgs/overlays.nix { inherit inputs; };
in {
  imports = [
    ./vscode.nix
    ./environment.nix
    ./pkgs/packages.nix
  ];

  nixpkgs = {
    overlays = [
      overlays.additions
      overlays.modifications
    ];
    config = {
      allowUnfree = true;
      allowUnfreePredicate = (_: true);
      permittedInsecurePackages = [
        "openssl-1.1.1w"
        "python-2.7.18.6"
      ];
    };
  };

  home = {
    username = "infinitecoder";
    homeDirectory = "/home/infinitecoder";
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
