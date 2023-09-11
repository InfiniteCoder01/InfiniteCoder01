#!/usr/bin/env bash
window="bar-menu"
current_info=$(eww windows | grep "$window")

if [[ $current_info == "*$window" ]]; then
	eww close $window
else
	eww open $window
fi
