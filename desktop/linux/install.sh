#!/usr/bin/env bash
# One-time setup of the kp-themes desktop on Garuda, Arch, or Arch in WSL.
# Run it as yourself from the clone (it uses sudo only for missing packages):
#
#   ~/Projects/kp-themes/desktop/linux/install.sh            set up, then apply the current theme
#   ~/Projects/kp-themes/desktop/linux/install.sh --theme lapis
#   ~/Projects/kp-themes/desktop/linux/install.sh --build-only
#
# What it does, each step safe to run again:
#   packages   fish, starship and the CLI tools the fish config uses; the build tools
#   build      fonts as TrueType and wallpapers as PNG (npm run build:desktop without npm)
#   fonts      the theme fonts into ~/.local/share/fonts/kp-themes
#   fish       Garuda's own fish config is kept; a system without one (WSL, bare Arch)
#              gets desktop/linux/fish/config.fish
#   konsole    a KP profile, copied from your current default profile, made the default
#   command    ~/.local/bin/kp-theme, so `kp-theme lapis` switches the whole desktop
#   theme      applies --theme, or the last one applied, or asks
#
# --build-only stops after the build: desktop/windows/install.ps1 uses it to
# build the Windows kit in the WSL clone.
set -euo pipefail

HERE="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
DESK="$REPO/desktop"
STATE="${XDG_CONFIG_HOME:-$HOME/.config}/kp-themes"
DATA="${XDG_DATA_HOME:-$HOME/.local/share}"
STAMP="$(date +%Y%m%d-%H%M%S)"

say() { printf '\n\033[1;35m==>\033[0m \033[1m%s\033[0m\n' "$*"; }
note() { printf '    %s\n' "$*"; }
has() { command -v "$1" >/dev/null 2>&1; }

THEME="" BUILD_ONLY=0
while [ $# -gt 0 ]; do
    case "$1" in
        --theme) THEME="$2"; shift ;;
        --build-only) BUILD_ONLY=1 ;;
        -h | --help) sed -n '2,/^set -euo/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
        *) echo "unknown option $1 (see --help)" >&2; exit 1 ;;
    esac
    shift
done

[ "$(id -u)" -ne 0 ] || { echo "run as yourself, not root: the theme lands in your home" >&2; exit 1; }
WSL=0
grep -qi microsoft /proc/version 2>/dev/null && WSL=1

# --- packages ------------------------------------------------------------------------
say "packages"
want=(fish starship eza bat zoxide fzf fastfetch micro git nodejs python-fonttools python-brotli librsvg)
if has pacman; then
    # pacman -T prints the ones that are not installed.
    mapfile -t missing < <(pacman -T "${want[@]}" || true)
    if [ ${#missing[@]} -gt 0 ]; then
        note "installing: ${missing[*]}"
        sudo pacman -S --needed --noconfirm "${missing[@]}"
    else
        note "all there"
    fi
else
    note "no pacman: install ${want[*]} yourself"
fi

# --- build ---------------------------------------------------------------------------
# The generated text is committed; fonts and PNGs are not, so they are built here.
say "build: fonts and wallpapers"
node "$REPO/gates/generate-desktop.mjs" --check >/dev/null || {
    note "desktop/ was out of date with the tokens; regenerating"
    node "$REPO/gates/generate-desktop.mjs" >/dev/null
}
python3 "$REPO/gates/desktop-fonts.py" | sed 's/^/    /'
node "$REPO/gates/render-wallpapers.mjs" >/dev/null && note "wallpapers rendered"
[ "$BUILD_ONLY" = 1 ] && { say "build done"; exit 0; }

# --- fonts ---------------------------------------------------------------------------
say "fonts"
mkdir -p "$DATA/fonts/kp-themes"
cp -u "$DESK/shared/fonts/"*.ttf "$DATA/fonts/kp-themes/"
fc-cache -f "$DATA/fonts/kp-themes" >/dev/null 2>&1 || true
note "$(find "$DATA/fonts/kp-themes" -name '*.ttf' | wc -l) faces in $DATA/fonts/kp-themes"

# --- fish ----------------------------------------------------------------------------
say "fish"
config="$HOME/.config/fish/config.fish"
mkdir -p "$HOME/.config/fish/conf.d"
if [ "$WSL" = 1 ] || [ ! -s "$config" ]; then
    if [ -f "$config" ] && ! cmp -s "$DESK/linux/fish/config.fish" "$config"; then cp -p "$config" "$config.kp-backup-$STAMP"; fi
    cp "$DESK/linux/fish/config.fish" "$config"
    note "Garuda-like config.fish written"
else
    note "keeping your config.fish"
    # Garuda's config starts Starship itself; a config that does not gets it from conf.d.
    if ! grep -rqs 'starship init' "$HOME/.config/fish/"; then
        printf '# Written by kp-themes desktop/linux/install.sh.\nstatus is-interactive; and starship init fish | source\n' >"$HOME/.config/fish/conf.d/kp-starship.fish"
        note "Starship added in conf.d/kp-starship.fish"
    fi
fi
if has fish && [ "$(getent passwd "$(id -un)" | cut -d: -f7)" != "$(command -v fish)" ]; then
    note "your login shell is not fish; change it with: chsh -s $(command -v fish)"
fi

# --- konsole -------------------------------------------------------------------------
if has konsole; then
    say "konsole"
    profile="$DATA/konsole/KP.profile"
    mkdir -p "$DATA/konsole"
    if [ ! -f "$profile" ]; then
        # Start from the profile you use now, so its font and size stay.
        current="$(awk -F= '/^DefaultProfile=/{print $2}' "$HOME/.config/konsolerc" 2>/dev/null || true)"
        if [ -n "$current" ] && [ -f "$DATA/konsole/$current" ]; then
            sed -e 's/^Name=.*/Name=KP/' "$DATA/konsole/$current" >"$profile"
            note "KP profile copied from $current"
        else
            printf '[General]\nName=KP\nParent=FALLBACK/\n\n[Appearance]\nColorScheme=\n' >"$profile"
            note "KP profile created"
        fi
    fi
    if has kwriteconfig6; then
        kwriteconfig6 --file konsolerc --group 'Desktop Entry' --key DefaultProfile KP.profile
        note "KP is Konsole's default profile"
    fi
fi

# --- command -------------------------------------------------------------------------
say "kp-theme command"
mkdir -p "$HOME/.local/bin"
ln -sf "$DESK/linux/apply.sh" "$HOME/.local/bin/kp-theme"
note "$HOME/.local/bin/kp-theme -> desktop/linux/apply.sh"

# --- theme ---------------------------------------------------------------------------
[ -n "$THEME" ] || THEME="$(cat "$STATE/current" 2>/dev/null || true)"
say "theme"
if [ -n "$THEME" ]; then
    "$DESK/linux/apply.sh" "$THEME"
else
    "$DESK/linux/apply.sh"
fi
