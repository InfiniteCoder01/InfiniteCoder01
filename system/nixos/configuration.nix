{ config, pkgs, ... }:

{
  imports =
    [
      ./hardware-configuration.nix
    ];

  # Enable flakes
  # nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix = {
    package = pkgs.nixFlakes;
    extraOptions = ''
      experimental-features = nix-command flakes
    '';
  };

  # Bootloader
  boot.loader.systemd-boot.enable = false;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.loader.efi.efiSysMountPoint = "/boot/efi";
  boot.loader.grub = {
    enable = true;
    device = "nodev";
    efiSupport = true;
    useOSProber = true;
    configurationLimit = 5;
  };
  boot.kernelPackages = pkgs.linuxPackages_latest;
  boot.supportedFilesystems = [ "ntfs" ];

  networking.hostName = "infinitecoder"; # Define your hostname.
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "Europe/Minsk";
  i18n.defaultLocale = "en_US.UTF-8";
  i18n.extraLocaleSettings = {
    LC_TIME = "en_GB.UTF-8";
  };

  # Enable the X11 windowing system.
  services.xserver.enable = true;
  services.xserver.videoDrivers = [ "nvidia" ];

  # Enable the GNOME Desktop Environment.
  # services.xserver.displayManager.gdm.enable = true;
  # services.xserver.displayManager.gdm.wayland = true;
  # services.xserver.desktopManager.gnome.enable = true;

  # Enable SDDM with Hyprland
  services.xserver.displayManager.sddm.enable = true;
  environment.sessionVariables = {
    # If your cursor becomes invisible
    WLR_NO_HARDWARE_CURSORS = "1";
    # Hint electron apps to use wayland
    NIXOS_OZONE_WL = "1";
  };

  # Virtualization
  virtualisation.libvirtd.enable = true;
  virtualisation.spiceUSBRedirection.enable = true;
  programs.dconf.enable = true; # virt-manager requires dconf to remember settings

  # Configure keymap in X11
  services.xserver = {
    layout = "us,ru";
    xkbVariant = "winkeys";
    xkbOptions = "grp:win_space_toggle";
  };

  # Enable CUPS to print documents.
  services.printing.enable = true;
  services.devmon.enable = true;
  services.gvfs.enable = true;
  services.udisks2.enable = true;

  # Enable sound with pipewire.
  sound.enable = true;
  hardware.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
  };

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.infinitecoder = {
    isNormalUser = true;
    description = "InfiniteCoder";
    extraGroups = [ "networkmanager" "wheel" "libvirtd" ];
    packages = with pkgs; [ home-manager ];
  };

  programs.zsh.enable = true;
  users.defaultUserShell = pkgs.zsh;
  environment.shells = with pkgs; [ zsh ];

  # Enable automatic login for the user.
  services.xserver.displayManager.autoLogin.enable = true;
  services.xserver.displayManager.autoLogin.user = "infinitecoder";

  # Workaround for GNOME autologin: https://github.com/NixOS/nixpkgs/issues/103746#issuecomment-945091229
  systemd.services."getty@tty1".enable = false;
  systemd.services."autovt@tty1".enable = false;

  # Allow unfree packages
  nixpkgs.config.allowUnfree = true;
  environment.systemPackages = with pkgs; [
    vim
    helix
    wget
    bat
    virt-manager
  ];

  hardware.opengl = {
    enable = true;
    driSupport = true;
    driSupport32Bit = true;
    extraPackages = [ pkgs.mesa.drivers ];
  };

  hardware.nvidia = {
    modesetting.enable = true;
    open = false;
    nvidiaSettings = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  services.dbus.packages = [ pkgs.gnome3.gnome-keyring pkgs.gcr ];

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It‘s perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "23.05"; # Did you read the comment?
}
