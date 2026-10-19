// research/gap-diff-view: the sample changes the demo draws. Mock data in the shape of the homelab dashboard's edit plan
// (stacks jellyfin, sonarr, traefik and the monitoring rules); nothing here is read from a real host.

/**
 * One hunk from its rows. A row is one sign and then the line: " " kept, "-" removed, "+" added. The numbers, the lengths
 * and the `@@` ranges are counted, the way git counts them.
 * @param {number} oldStart @param {number} newStart @param {string} context @param {string[]} rows
 * @returns {import('../../js/diff.js').DiffHunk}
 */
export function hunk(oldStart, newStart, context, rows) {
    let oldNo = oldStart;
    let newNo = newStart;
    /** @type {import('../../js/diff.js').DiffLine[]} */
    const lines = [];
    for (const row of rows) {
        const sign = row[0];
        const text = row.slice(1);
        if (sign === '-') lines.push({ kind: 'removed', no: oldNo++, text });
        else if (sign === '+') lines.push({ kind: 'added', no: newNo++, text });
        else {
            lines.push({ kind: 'same', no: newNo++, text });
            oldNo += 1;
        }
    }
    return { oldStart, oldLen: oldNo - oldStart, newStart, newLen: newNo - newStart, context, lines };
}

const COMPOSE = hunk(3, 3, 'services:', [
    ' services:',
    '   jellyfin:',
    '-    image: jellyfin/jellyfin:10.11.11',
    '+    image: jellyfin/jellyfin:12.1.0',
    '     container_name: jellyfin',
    '     restart: unless-stopped',
    '     user: 1000:1000',
    '     ports:',
    '       - "8096:8096"',
    '     environment:',
    '       - TZ=Europe/Brussels',
    '       - JELLYFIN_PublishedServerUrl=https://jellyfin.kp-soft.dev',
    '     volumes:',
    '       - /srv/media/jellyfin/config:/config',
    '       - /srv/media/jellyfin/cache:/cache',
    '+      - /srv/media/jellyfin/transcode:/transcode',
    '       - /srv/media/library:/media:ro',
    '     devices:',
    '       - /dev/dri:/dev/dri',
    '     group_add:',
    '       - "105"',
    '     healthcheck:',
    '       test: ["CMD", "curl", "-f", "http://localhost:8096/health"]',
    '-      interval: 30s',
    '+      interval: 60s',
    '       timeout: 5s',
    '       retries: 3',
    '     labels:',
    '       - traefik.enable=true',
    '       - traefik.http.routers.jellyfin.rule=Host(`jellyfin.kp-soft.dev`)',
    '       - traefik.http.services.jellyfin.loadbalancer.server.port=8096',
    '   sonarr:',
    '-    image: lscr.io/linuxserver/sonarr:4.0.9',
    '+    image: lscr.io/linuxserver/sonarr:4.0.14',
    '     container_name: sonarr',
    '     restart: unless-stopped',
    '     env_file: sonarr.env',
    '     volumes:',
    '       - /srv/media/sonarr/config:/config',
    '       - /srv/media/library/tv:/tv',
    '       - /srv/media/downloads:/downloads',
    '     depends_on:',
    '       - jellyfin',
]);

const TRAEFIK_ROUTE = hunk(11, 11, 'http:', [
    '   routers:',
    '     jellyfin:',
    '       entryPoints: [websecure]',
    '-      rule: "Host(`jellyfin.kp-soft.dev`)"',
    '+      rule: "Host(`jellyfin.kp-soft.dev`) && !PathPrefix(`/metrics`)"',
    '       service: jellyfin',
    '-      middlewares: [secure-headers]',
    '+      middlewares: [secure-headers, rate-limit-media]',
    '       tls: {}',
]);

const SONARR_ENV = hunk(1, 1, '', [
    ' PUID=1000',
    ' PGID=1000',
    ' TZ=Europe/Brussels',
    '-SONARR__LOG__LEVEL=info',
    '+SONARR__LOG__LEVEL=debug',
    ' SONARR__AUTH__METHOD=External',
]);

const BACKUP = hunk(0, 1, '', [
    '+#!/bin/sh',
    '+# Back up the media stack\'s config before an update.',
    '+set -eu',
    '+stamp=$(date +%Y%m%d-%H%M)',
    '+dest=/srv/backup/media/$stamp',
    '+mkdir -p "$dest"',
    '+for app in jellyfin sonarr radarr; do',
    '+  tar -czf "$dest/$app.tar.gz" -C /srv/media/$app config',
    '+done',
    '+echo "backup written to $dest"',
]);

const WATCHTOWER = hunk(1, 0, '', [
    '-services:',
    '-  watchtower:',
    '-    image: containrrr/watchtower:1.7.1',
    '-    restart: unless-stopped',
    '-    volumes:',
    '-      - /var/run/docker.sock:/var/run/docker.sock',
    '-    command: --schedule "0 0 4 * * *" --cleanup',
]);

/** The edit plan of the media stack: seven files, every status the header can show. @type {import('../../js/diff.js').DiffFile[]} */
export const MEDIA_PLAN = [
    { path: 'stacks/media/compose.yml', status: 'modified', hunks: [COMPOSE] },
    { path: 'stacks/traefik/dynamic/media.yml', status: 'modified', hunks: [TRAEFIK_ROUTE] },
    { path: 'stacks/media/sonarr.env', oldPath: 'stacks/sonarr/sonarr.env', status: 'renamed', hunks: [SONARR_ENV] },
    { path: 'stacks/media/backup.sh', status: 'added', hunks: [BACKUP] },
    { path: 'stacks/media/watchtower.yml', status: 'removed', hunks: [WATCHTOWER] },
    { path: 'stacks/media/artwork/poster-default.png', status: 'binary', added: 0, removed: 0, hunks: [] },
    { path: 'stacks/media/README.md', oldPath: 'stacks/media/NOTES.md', status: 'renamed', added: 0, removed: 0, hunks: [] },
];

const STATIC_CONFIG = hunk(1, 1, '', [
    ' # Traefik static configuration for the platform stack',
    ' global:',
    '   checkNewVersion: false',
    '   sendAnonymousUsage: false',
    ' ',
    ' api:',
    '   dashboard: true',
    '   insecure: false',
    ' ',
    ' log:',
    '-  level: INFO',
    '+  level: DEBUG',
    '   format: json',
    ' accessLog:',
    '   filePath: /var/log/traefik/access.log',
    '   bufferingSize: 100',
    '   filters:',
    '     statusCodes: ["400-599"]',
    ' entryPoints:',
    '   web:',
    '     address: ":80"',
    '     http:',
    '       redirections:',
    '         entryPoint:',
    '           to: websecure',
    '           scheme: https',
    '   websecure:',
    '     address: ":443"',
    '     http:',
    '       tls:',
    '         certResolver: cloudflare',
    '         domains:',
    '           - main: kp-soft.dev',
    '             sans: ["*.kp-soft.dev"]',
    ' certificatesResolvers:',
    '   cloudflare:',
    '     acme:',
    '       email: admin@kp-soft.dev',
    '       storage: /letsencrypt/acme.json',
    '       dnsChallenge:',
    '         provider: cloudflare',
    '         resolvers: ["1.1.1.1:53", "1.0.0.1:53"]',
    ' providers:',
    '   docker:',
    '     exposedByDefault: false',
    '     network: proxy',
    '   file:',
    '     directory: /etc/traefik/dynamic',
    '     watch: true',
    ' metrics:',
    '   prometheus:',
    '     entryPoint: metrics',
    '+    addRoutersLabels: true',
    '     addServicesLabels: true',
    ' tracing: {}',
    ' ping: {}',
    ' serversTransport:',
    '   insecureSkipVerify: false',
    ' experimental: {}',
]);

const LOKI_COMPOSE = hunk(0, 1, '', [
    '+services:',
    '+  loki:',
    '+    image: grafana/loki:3.2.1',
    '+    container_name: loki',
    '+    restart: unless-stopped',
    '+    command: -config.file=/etc/loki/config.yml',
    '+    volumes:',
    '+      - ./config.yml:/etc/loki/config.yml:ro',
    '+      - /srv/monitoring/loki:/loki',
    '+    networks: [monitoring]',
    '+networks:',
    '+  monitoring:',
    '+    external: true',
]);

/** @type {Record<string, import('../../js/diff.js').DiffFile[]>} */
export const CONTEXT_SAMPLES = {
    config: [{ path: 'stacks/traefik/traefik.yml', status: 'modified', hunks: [STATIC_CONFIG] }],
    newfile: [{ path: 'stacks/monitoring/loki/compose.yml', status: 'added', hunks: [LOKI_COMPOSE] }],
};

/** @type {Record<string, import('../../js/diff.js').DiffFile[]>} */
export const WORD_SAMPLES = {
    images: [
        {
            path: 'stacks/media/compose.yml',
            status: 'modified',
            hunks: [
                hunk(3, 3, 'services:', [
                    '   jellyfin:',
                    '-    image: jellyfin/jellyfin:10.11.11',
                    '+    image: jellyfin/jellyfin:12.1.0',
                    '     container_name: jellyfin',
                    '   sonarr:',
                    '-    image: lscr.io/linuxserver/sonarr:4.0.9',
                    '+    image: lscr.io/linuxserver/sonarr:4.0.14',
                    '     container_name: sonarr',
                    '   traefik:',
                    '-    image: traefik:v3.1.2',
                    '+    image: traefik:v3.2.0',
                    '     container_name: traefik',
                ]),
            ],
        },
    ],
    settings: [
        {
            path: 'stacks/media/compose.yml',
            status: 'modified',
            hunks: [
                hunk(14, 14, 'jellyfin:', [
                    '     ports:',
                    '-      - "8096:8096"',
                    '+      - "8097:8096"',
                    '     environment:',
                    '-      - JELLYFIN_LOG_LEVEL=info',
                    '+      - JELLYFIN_LOG_LEVEL=debug',
                    '     restart: unless-stopped',
                    '-    mem_limit: 512m',
                    '+    mem_limit: 1g',
                ]),
            ],
        },
    ],
    logs: [
        {
            path: 'sonarr/startup.log',
            status: 'modified',
            hunks: [
                hunk(1, 1, '', [
                    '-2026-10-18 08:12:41.482|Info|Bootstrap|Starting Sonarr - /app/sonarr/bin/Sonarr - Version 4.0.9.2244',
                    '+2026-10-19 08:12:39.107|Info|Bootstrap|Starting Sonarr - /app/sonarr/bin/Sonarr - Version 4.0.14.2939',
                    ' 2026-10-19 08:12:39.210|Info|AppFolderInfo|Data directory is being overridden to [/config]',
                    '-2026-10-18 08:12:44.019|Info|Migration|Migrating data source=/config/sonarr.db',
                    '+2026-10-19 08:12:41.633|Info|Migration|Migrating data source=/config/sonarr.db',
                    '-2026-10-18 08:12:46.774|Warn|DownloadClientCheck|Unable to communicate with qBittorrent: Connection refused',
                    '+2026-10-19 08:12:44.502|Info|Microsoft.Hosting.Lifetime|Application started. Press Ctrl+C to shut down.',
                ]),
            ],
        },
    ],
    rewrite: [
        {
            path: 'stacks/media/compose.yml',
            status: 'modified',
            hunks: [
                hunk(40, 40, 'radarr:', [
                    '     container_name: radarr',
                    '-    command: ["--serve", "--port=8080"]',
                    '+    entrypoint: /usr/local/bin/start-radarr.sh',
                    '     restart: unless-stopped',
                    '-    network_mode: host',
                    '+    network_mode: "service:gluetun"',
                ]),
            ],
        },
    ],
};

/** @type {Record<string, import('../../js/diff.js').DiffFile[]>} */
export const STATE_SAMPLES = {
    ready: MEDIA_PLAN.slice(0, 3),
};

/** A long file: the alert rules of the monitoring stack, one rule at a time, added whole. @returns {import('../../js/diff.js').DiffFile[]} */
export function longFile() {
    const stacks = ['jellyfin', 'sonarr', 'radarr', 'traefik', 'loki', 'grafana', 'prometheus', 'home-assistant', 'gluetun', 'qbittorrent'];
    const kinds = [
        ['Down', 'up{job="%s"} == 0', '2m', 'critical', '%s has been down for 2 minutes'],
        ['HighMemory', 'container_memory_working_set_bytes{name="%s"} / container_spec_memory_limit_bytes{name="%s"} > 0.9', '10m', 'warning', '%s uses more than 90% of its memory limit'],
        ['Restarting', 'increase(container_restart_count{name="%s"}[1h]) > 3', '0m', 'warning', '%s restarted more than 3 times in an hour'],
        ['SlowResponses', 'histogram_quantile(0.95, rate(traefik_service_request_duration_seconds_bucket{service="%s@docker"}[5m])) > 2', '10m', 'warning', '95%% of %s requests take longer than 2 seconds'],
        ['LogErrors', 'sum(rate({container="%s"} |= "error" [5m])) > 5', '5m', 'warning', '%s logs more than 5 errors a minute'],
    ];
    /** @type {string[]} */
    const rows = ['+groups:', '+  - name: homelab-stacks', '+    rules:'];
    for (const stack of stacks)
        for (const [name, expr, wait, severity, text] of kinds) {
            const id = stack.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
            rows.push(
                `+      - alert: ${id}${name}`,
                `+        expr: ${expr.replaceAll('%s', stack).replaceAll('%%', '%')}`,
                `+        for: ${wait}`,
                '+        labels:',
                `+          severity: ${severity}`,
                `+          stack: ${stack}`,
                '+        annotations:',
                `+          summary: "${text.replaceAll('%s', stack).replaceAll('%%', '%')}"`,
                `+          runbook: https://wiki.kp-soft.dev/runbooks/${stack}`,
            );
        }
    return [{ path: 'stacks/monitoring/rules/homelab-alerts.yml', status: 'added', hunks: [hunk(0, 1, '', rows)] }];
}
