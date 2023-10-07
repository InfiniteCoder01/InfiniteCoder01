#! /usr/bin/env bash
pkill yakuake
pkill nm-applet
pkill waybar
pkill swaync
eww kill
pkill wl-clip-persist

sleep 0.1

hyprctl setcursor Bibata-Modern-Classic 25

yakuake &
nm-applet --indicator &
waybar &
swaync &
eww daemon
wl-clip-persist --clipboard both &
gnome-keyring-daemon -f -r &

sleep 1
pkill xdg-desktop-portal-hyprland
pkill xdg-desktop-portal-wlr
pkill xdg-desktop-portal
xdg-desktop-portal-hyprland &
sleep 2
xdg-desktop-portal &
