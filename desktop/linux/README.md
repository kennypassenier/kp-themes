# desktop/linux/

A kp-themes theme on Garuda or Arch Linux (KDE Plasma 6), and the shell half of
Arch in WSL.

| File                     | What                                                                              |
| ------------------------ | --------------------------------------------------------------------------------- |
| `install.sh`             | once: packages, fonts, fish, a KP Konsole profile, the `kp-theme` command         |
| `apply.sh`               | a theme switch; `~/.local/bin/kp-theme` points here                               |
| `fish/config.fish`       | a Garuda-like fish config, for a system without one (WSL, a bare Arch)            |
| `themes/<theme>/`        | generated: `kde.colors` (Plasma) and `konsole.colorscheme`                        |
| `wsl/bootstrap-arch.sh`  | root, once, in a fresh WSL Arch: pacman, Chaotic-AUR, paru, tools, user, wsl.conf |
| `wsl/clone-kp-themes.sh` | as you: clones this repo into `~/Projects/kp-themes`, then runs `install.sh`      |

## On Garuda

```sh
cd ~/Projects/kp-themes
desktop/linux/install.sh --theme lapis
kp-theme                 # the list; kp-theme cyberpunk switches
```

`apply.sh` steps: `shell` (Starship, fish colours), `konsole`, `plasma`
(colour scheme and accent), `wallpaper`, `lockscreen`, `firedragon`. A step
whose program is missing skips itself, which is how WSL gets the shell only.
`--only` and `--skip` take a comma list, `--dry-run` writes nothing.

Garuda's own `config.fish` is kept; `install.sh` only adds Starship in
`conf.d/` if nothing starts it. Every file `apply.sh` replaces that kp-themes
did not write is kept once as `<file>.kp-backup-<timestamp>`.

Not reached: the SDDM login screen (root's), and the Kvantum or window
decoration theme Garuda ships; the colour scheme recolours Breeze and the Qt
apps, Kvantum draws its own.
