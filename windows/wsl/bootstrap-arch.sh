#!/usr/bin/env bash
# Turns a fresh Arch Linux WSL distro into a Garuda-like dev shell:
# Chaotic-AUR and paru, fish with Garuda's aliases, Starship, and the CLI
# tools a Garuda install ships. Run as root, once, from windows/wsl/setup-wsl.ps1:
#
#   wsl -d archlinux -u root --cd <this folder> -- bash ./bootstrap-arch.sh <user>
#
# Safe to run again: steps check before they change anything, and an
# existing config.fish is kept as config.fish.bak-<timestamp>.
set -euo pipefail

USERNAME="${1:-kenny}"
say() { printf '\n\033[1;35m==>\033[0m \033[1m%s\033[0m\n' "$*"; }

if [ "$(id -u)" -ne 0 ]; then
    echo "run as root (wsl -u root)" >&2
    exit 1
fi

say "pacman: keyring, colour, parallel downloads"
pacman-key --init >/dev/null 2>&1 || true
pacman-key --populate archlinux >/dev/null
sed -i 's/^#Color/Color/; s/^#\?ParallelDownloads.*/ParallelDownloads = 8/' /etc/pacman.conf
grep -q '^ILoveCandy' /etc/pacman.conf || sed -i '/^Color/a ILoveCandy' /etc/pacman.conf
pacman -Syu --noconfirm

say "base tools"
pacman -S --needed --noconfirm \
    base-devel git github-cli openssh sudo man-db man-pages less which wget curl unzip zip \
    fish starship eza bat expac fastfetch ripgrep fd zoxide fzf btop micro neovim tealdeer \
    python python-pip nodejs npm rustup

say "locale"
sed -i 's/^#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
locale-gen >/dev/null
echo 'LANG=en_US.UTF-8' >/etc/locale.conf

say "Chaotic-AUR (the repo Garuda builds on)"
if ! grep -q '^\[chaotic-aur\]' /etc/pacman.conf; then
    pacman-key --recv-key 3056513887B78AEB --keyserver keyserver.ubuntu.com
    pacman-key --lsign-key 3056513887B78AEB
    pacman -U --noconfirm \
        'https://cdn-mirror.chaotic.cx/chaotic-aur/chaotic-keyring.pkg.tar.zst' \
        'https://cdn-mirror.chaotic.cx/chaotic-aur/chaotic-mirrorlist.pkg.tar.zst'
    printf '\n[chaotic-aur]\nInclude = /etc/pacman.d/chaotic-mirrorlist\n' >>/etc/pacman.conf
fi
pacman -Syu --noconfirm
pacman -S --needed --noconfirm paru
pacman -S --needed --noconfirm fnm || echo "fnm not found; install a Node manager later with paru"

say "user $USERNAME"
if ! id -u "$USERNAME" >/dev/null 2>&1; then
    useradd -m -G wheel -s /usr/bin/fish "$USERNAME"
    echo "Choose a Linux password for $USERNAME (used by sudo):"
    passwd "$USERNAME"
else
    usermod -aG wheel -s /usr/bin/fish "$USERNAME"
fi
echo '%wheel ALL=(ALL:ALL) ALL' >/etc/sudoers.d/10-wheel
chmod 440 /etc/sudoers.d/10-wheel

say "/etc/wsl.conf: systemd, default user"
cat >/etc/wsl.conf <<EOF
[boot]
systemd=true

[user]
default=$USERNAME

[interop]
appendWindowsPath=true
EOF

say "fish, Garuda-style"
HOME_DIR="$(getent passwd "$USERNAME" | cut -d: -f6)"
install -d -o "$USERNAME" -g "$USERNAME" "$HOME_DIR/.config" "$HOME_DIR/.config/fish" "$HOME_DIR/.config/fish/conf.d"
[ -f "$HOME_DIR/.config/fish/config.fish" ] && cp "$HOME_DIR/.config/fish/config.fish" "$HOME_DIR/.config/fish/config.fish.bak-$(date +%Y%m%d-%H%M%S)"
cat >"$HOME_DIR/.config/fish/config.fish" <<'EOF'
# Garuda-like fish config, written by kp-themes windows/wsl/bootstrap-arch.sh.
# Colours live in conf.d/kp-colors.fish (windows/apply.ps1 writes it per theme).

set -gx EDITOR micro
set -gx VISUAL micro
set -gx MANPAGER "sh -c 'col -bx | bat -l man -p'"
set -gx MANROFFOPT "-c"
fish_add_path ~/.local/bin ~/.cargo/bin

function fish_greeting
    fastfetch
end

if status is-interactive
    starship init fish | source
    zoxide init fish | source
    type -q fnm; and fnm env --use-on-cd --shell fish | source
end

# The aliases Garuda's fish config ships
alias ls 'eza -al --color=always --group-directories-first --icons'
alias la 'eza -a --color=always --group-directories-first --icons'
alias ll 'eza -l --color=always --group-directories-first --icons'
alias lt 'eza -aT --color=always --group-directories-first --icons'
alias l. 'eza -ald --color=always --group-directories-first --icons .*'
alias cat 'bat --style header,snip,changes'
alias grep 'grep --color=auto'
alias ip 'ip -color'
alias .. 'cd ..'
alias ... 'cd ../..'
alias .... 'cd ../../..'
alias upd 'paru -Syu'
alias cleanup 'sudo pacman -Rns (pacman -Qtdq)'
alias jctl 'journalctl -p 3 -xb'
alias rip 'expac --timefmt="%Y-%m-%d %T" "%l\t%n %v" | sort | tail -200 | nl'
alias big 'expac -H M "%m\t%n" | sort -h | nl'
alias explorer 'explorer.exe .'

# !! and !$ like bash
function __history_previous_command
    switch (commandline -t)
        case "!"
            commandline -t $history[1]; commandline -f repaint
        case "*"
            commandline -i !
    end
end
function __history_previous_command_arguments
    switch (commandline -t)
        case "!"
            commandline -t ""
            commandline -f history-token-search-backward
        case "*"
            commandline -i '$'
    end
end
bind ! __history_previous_command
bind '$' __history_previous_command_arguments
EOF
chown -R "$USERNAME:$USERNAME" "$HOME_DIR/.config"

say "done"
echo "Close this window, or run 'wsl --terminate archlinux' from Windows, so the default user and systemd take effect."
