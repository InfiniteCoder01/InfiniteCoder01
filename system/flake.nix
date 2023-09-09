{
  description = "flake for InfiniteCoder";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    hyprland.url = "github:hyprwm/Hyprland";
  };

  outputs = { self, nixpkgs, home-manager, hyprland, ... }@inputs:
    let
      inherit (self) outputs;
      forAllSystems = nixpkgs.lib.genAttrs [
        "aarch64-linux"
        "i686-linux"
        "x86_64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];
    in
    rec {
      nixosConfigurations = {
        infinitecoder = nixpkgs.lib.nixosSystem {
          specialArgs = { inherit inputs outputs; };
          modules = [
            hyprland.nixosModules.default
            { programs.hyprland.enable = true; }
            ./nixos/configuration.nix
          ];
        };
      };
      homeConfigurations = {
        "infinitecoder@infinitecoder" = home-manager.lib.homeManagerConfiguration {
          pkgs = nixpkgs.legacyPackages.x86_64-linux; # Home-manager requires 'pkgs' instance
          extraSpecialArgs = { inherit inputs outputs; };
          modules = [
            hyprland.homeManagerModules.default
            { wayland.windowManager.hyprland.enable = true; }
            ./home-manager/home.nix
          ];
        };
      };
    };
}
