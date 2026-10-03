#!/usr/bin/env bash
# Counts, per candidate element, how many of the 22 registers carry a rule for it.
# Selector mode (S): lines that match the pattern AND end in "{" or "," (a selector line, not a comment).
# Property mode (P): any declaration line matching the pattern (e.g. "cursor:").
# Output: candidate | registers with >=1 hit | total hit lines | themes without one
cd "$(dirname "$0")/../.."
themes=$(python3 -c "import json;print(' '.join(json.load(open('themes/order.json'))))")
row() { # name mode pattern
  local name=$1 mode=$2 pat=$3 n=0 total=0 missing=""
  for t in $themes; do
    f=css/$t-register.css
    if [ "$mode" = S ]; then c=$(command grep -E "$pat" "$f" | command grep -cE '[{,][[:space:]]*$')
    else c=$(command grep -cE "$pat" "$f"); fi
    total=$((total+c)); if [ "$c" -gt 0 ]; then n=$((n+1)); else missing="$missing $t"; fi
  done
  printf '%-22s | %2d/22 | %4d | %s\n' "$name" "$n" "$total" "${missing:- -}"
}
echo "candidate              | regs  | lines | registers without a rule"
row progress            S 'kp-progress'
row spinner             S 'kp-spinner'
row skeleton            S 'kp-skeleton'
row switch              S 'kp-switch'
row checkbox            S "checkbox|kp-field--check"
row radio               S "radio"
row range-slider        S "type=.range.|range-thumb|slider-thumb|range-track"
row focus-ring          S 'focus-visible'
row toast               S 'kp-toast'
row alert               S 'kp-alert'
row dialog              S 'kp-dialog|dialog'
row dialog-backdrop     S '::backdrop'
row tooltip             S 'kp-tooltip'
row divider             S 'data-kp-divider|(^|[[:space:]])hr([[:space:],:{]|$)'
row badge               S 'kp-badge'
row tag                 S 'kp-tag'
row pagination          S 'kp-pagination'
row wizard-stepper      S 'kp-wizard'
row tabs                S 'kp-tab([^l-]|$)'
row accordion           S 'kp-accordion|details|summary'
row empty-state         S 'kp-empty'
row breadcrumb          S 'kp-breadcrumb'
row timeline            S 'kp-timeline'
row to-top              S 'kp-to-top'
row scrollbar           P 'scrollbar'
row selection           S '::selection'
row link                S "(^|[[:space:]])a(:hover|:link|:visited|\\[|[[:space:]]*[,{])|kp-link"
row text-mark           S '(^|[[:space:]])mark'
row page-reveal         S 'data-kp-reveal'
row arrival             P '--kp-arrival'
row cursor              P '(^|[[:space:]])cursor:'
row caret               P 'caret-color'
row placeholder         S '::placeholder'
row kbd                 S '(^|[[:space:]])kbd'
row blockquote          S 'blockquote'
row table-row-hover     S 'kp-table.*(tr|row).*:hover|kp-datatable.*:hover'
row card-hover          S 'kp-card[^,{]*:hover'
