# Garuda-like fish config, written by kp-themes desktop/linux/install.sh on a
# system that has none of its own (WSL, a bare Arch). Garuda keeps its own.
# Colours live in conf.d/kp-colors.fish, which apply.sh writes per theme.

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
# WSL only: open the current folder in Windows Explorer
type -q explorer.exe; and alias explorer 'explorer.exe .'

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
