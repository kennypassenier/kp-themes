# windows/

The themes as a Windows desktop. One folder per theme, generated from
`themes/<name>/tokens.json` and the VS Code themes by
`gates/generate-windows.mjs`; `npm run check:windows` refuses a copy that has
drifted.

| File                         | Read by                     | Where `apply.ps1` puts it                                   |
| ---------------------------- | --------------------------- | ----------------------------------------------------------- |
| `terminal.json`              | Windows Terminal            | merged into `settings.json`: scheme, window theme, defaults |
| `yasb-styles.css`            | YASB (the top bar)          | `~/.config/yasb/styles.css`                                 |
| `firedragon/userChrome.css`  | FireDragon / Firefox        | `<profile>/chrome/userChrome.css`                           |
| `firedragon/userContent.css` | FireDragon / Firefox        | `<profile>/chrome/userContent.css`                          |
| `mica-settings.json`         | Mica For Everyone           | its `LocalState/settings.json`                              |
| `accent.reg`                 | Windows                     | imported: accent colour, dark or light mode, transparency   |
| `wallpaper.svg`              | `npm run render:wallpapers` | rendered to `wallpaper.png` (ignored by git), then set      |
| `starship.toml`              | Starship in WSL             | `~/.config/starship.toml` inside the distro                 |
| `kp-colors.fish`             | fish in WSL                 | `~/.config/fish/conf.d/kp-colors.fish` inside the distro    |

Hand-written, beside the output:

- `apply.ps1`: puts one theme's files in place. Every file it changes is kept
  as `<file>.kp-backup-<timestamp>`. No step needs administrator rights.
- `templates/yasb.css`: the YASB layout the colours are poured into. Edit this,
  not a theme's `yasb-styles.css`.
- `firedragon-user.js`: the prefs `apply.ps1` appends to each profile's
  `user.js` (between `kp-themes: begin` and `kp-themes: end`).
- `wsl/`: Arch Linux in WSL, set up like Garuda (see below).

## Put a theme on the desktop

```powershell
npm run generate:windows
npm run render:wallpapers -- synthwave
powershell -ExecutionPolicy Bypass -File .\windows\apply.ps1 -Theme synthwave
```

`-Skip accent,wallpaper` leaves steps out, `-DryRun` shows what would change,
`-RestartExplorer` makes the accent colour show everywhere at once.

## Arch in WSL, Garuda-style

```powershell
powershell -ExecutionPolicy Bypass -File .\windows\wsl\setup-wsl.ps1 -Theme synthwave
```

The first run installs the WSL platform if it is missing (it asks for
administrator rights; reboot afterwards and run it again). The second run
installs Arch Linux, then `wsl/bootstrap-arch.sh` adds Chaotic-AUR and paru,
fish with Garuda's aliases, Starship, and the CLI tools a Garuda install
ships. It asks once for a Linux password. Last, it applies the theme's
prompt and colours and makes Arch the default tab in Windows Terminal. If
Terminal has not seen the new distro yet, open and close Terminal once and run
`apply.ps1 -Skip yasb,mica,firedragon,vscode,accent,wallpaper` again.

## What a theme cannot reach

File Explorer, menus and window chrome are drawn from a `.msstyles` visual
style, which is not CSS and is not generated here. Mica For Everyone gives the
backdrop and dark or light title bars; the accent colour covers the rest.
