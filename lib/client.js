/**
 * dsh-shenhai-skin — browser half.
 *
 * Mounts a looping <video> as a fixed wallpaper behind the Web shell, tints the
 * shell with one translucent surface so the video shows through, and exposes a
 * small glass control for enable / opacity / blur / dim. No React: the module
 * is a self-contained client plugin that uses only the client theme service.
 */
window.__ModuleLoader__.load({
  id: "dsh-shenhai-skin",
  factory: function () {
    "use strict";

    var NAME = "dsh-shenhai-skin";
    var STYLE_ID = "dsh-shenhai-skin-style";
    var ROOT_ID = "dsh-shenhai-skin-root";
    var LAUNCHER_ID = "dsh-shenhai-skin-launcher";
    var STORAGE_KEY = "dsh.shenhai-skin.v1";
    var LEGACY_STORAGE_KEY = "dsh.dynamic-skin.v1";
    var VIDEO_PATH = "dsh-shenhai-skin/video.mp4";
    var LOGO_PATH = "dsh-shenhai-skin/logo.png";
    var PROMO_PATH = "dsh-shenhai-skin/promo.jpg";
    var MUSIC_PATHS = [
      "dsh-shenhai-skin/music/fuguang.mp3",
      "dsh-shenhai-skin/music/linguang.mp3",
    ];
    var STEAM_URL = "https://store.steampowered.com/app/3222720?utm_source=DSH&utm_campaign=store_page_release&utm_medium=0";

    var DEFAULTS = {
      enabled: true,
      opacity: 0.72,
      blur: 0,
      dim: 0.18,
      darkGlass: true,
      palette: "tide",
      paletteVersion: 3,
      musicEnabled: false,
      musicVolume: 0.35,
      musicTrack: 0,
      musicMode: "playlist",
      accountHidden: false,
      lang: "",
    };
    // Scheme C · Coral Night. Each entry is [light, dark]; applied only while the skin is on.
    var CORAL_PALETTE = {
      "--dsw-alias-bg-layer-1": ["#EAF4F9", "#172130"],
      "--dsw-alias-bg-layer-2": ["#DFEDF4", "#1D2B3D"],
      "--dsw-alias-bg-layer-3": ["#D4E7F0", "#24364B"],
      "--dsw-alias-bg-overlay": ["#FFFFFF", "#2A4058"],
      "--dsw-alias-bg-module-platform": ["#E4F1F6", "#1B2B3D"],
      "--dsw-alias-bg-skeleton": ["rgba(30,70,95,0.08)", "rgba(160,200,235,0.10)"],
      "--dsw-alias-bg-document-preview": ["#F4FBFD", "#141C2A"],
      "--dsw-alias-bg-document-selection": ["rgba(178,58,110,0.20)", "rgba(95,239,255,0.26)"],
      "--dsw-specific-input-major": ["rgba(252,247,250,0.88)", "rgba(23,33,48,0.88)"],
      "--dsw-specific-menu": ["rgba(255,252,253,0.94)", "rgba(23,33,48,0.92)"],
      "--dsw-menu-surface-fill": ["rgba(255,252,253,0.94)", "rgba(23,33,48,0.92)"],
      "--dsw-alias-menu-group-header-fill": ["rgba(255,252,253,0.96)", "rgba(23,33,48,0.95)"],
      "--dsw-specific-bubble": ["#E8DDE6", "#2B3A52"],
      "--dsw-specific-bubble-highlight": ["#DCCBD8", "#3A4D68"],
      "--dsw-alias-card-fill": ["#F6FBFD", "#1B2838"],
      "--dsw-alias-card-fill-hover": ["#EDF6FA", "#22344A"],
      "--dsw-alias-card-tile-fill": ["rgba(14,147,184,0.06)", "rgba(95,239,255,0.06)"],
      "--dsw-alias-hovercard-bg": ["#FFFFFF", "#202F42"],
      "--dsw-specific-tip": ["#6A8496", "#6E8499"],
      "--dsw-specific-sidebar-nav-item-active": ["rgba(14,147,184,0.12)", "rgba(95,239,255,0.10)"],
      "--dsw-specific-sidebar-nav-item-active-accent": ["#CDEFF7", "#1B3A4A"],
      "--dsw-specific-sidebar-right-flash": ["#0E93B8", "#5FEFFF"],
      "--dsw-alias-tooltip-bg": ["#10202C", "#263A50"],
      "--dsw-alias-tooltip-key-bg": ["#244C5F", "#35506A"],
      "--dsw-alias-toast-bg": ["#10202C", "#263A50"],
      "--dsw-alias-label-primary": ["#10202C", "#F6F9FF"],
      "--dsw-alias-label-secondary": ["#3A5A6E", "#C3D2E2"],
      "--dsw-alias-label-tertiary": ["#6A8496", "#94A8BC"],
      "--dsw-alias-label-dimmed": ["#A9BCC8", "#667A8E"],
      "--dsw-alias-label-caption": ["#5F7C8E", "#7C93A8"],
      "--dsw-alias-label-primary-bluish": ["#0E3D52", "#E2F7FF"],
      "--dsw-alias-label-primary-dimmed": ["#2B566B", "#CFE4F2"],
      "--dsw-alias-label-primary-foreground": ["#FFFFFF", "#0B0F18"],
      "--dsw-alias-label-primary-inverted": ["#F6F9FF", "#121826"],
      "--dsw-alias-label-on-color": ["#FFFFFF", "#1A0B12"],
      "--dsw-alias-label-shimmer": ["rgba(255,255,255,0.40)", "rgba(255,255,255,0.30)"],
      "--dsw-alias-label-deep-diving": ["#0E7FA0", "#7FE5FF"],
      "--dsw-alias-label-deep-diving-shimmer": ["#4AC6E4", "#B8F4FF"],
      "--dsw-alias-hovercard-label-primary": ["#10202C", "#F6F9FF"],
      "--dsw-alias-hovercard-label-secondary": ["#3A5A6E", "#C3D2E2"],
      "--dsw-alias-hovercard-label-tertiary": ["#6A8496", "#94A8BC"],
      "--dsw-alias-tooltip-label": ["#FFFFFF", "#F6F9FF"],
      "--dsw-alias-toast-label": ["#FFFFFF", "#F6F9FF"],
      "--dsw-alias-toast-action": ["#7FE5FF", "#5FEFFF"],
      "--dsw-alias-border-l1": ["rgba(30,70,95,0.12)", "rgba(160,200,235,0.12)"],
      "--dsw-alias-border-l2": ["rgba(30,70,95,0.18)", "rgba(160,200,235,0.20)"],
      "--dsw-alias-border-l3": ["rgba(30,70,95,0.26)", "rgba(160,200,235,0.30)"],
      "--dsw-alias-border-l4": ["rgba(30,70,95,0.34)", "rgba(160,200,235,0.40)"],
      "--dsw-alias-border-l2-darkmode-thin": ["rgba(30,70,95,0.14)", "rgba(160,200,235,0.14)"],
      "--dsw-alias-border-selected": ["#B23A6E", "#5FEFFF"],
      "--dsw-alias-border-inverted": ["rgba(0,0,0,0.12)", "rgba(255,255,255,0.10)"],
      "--dsw-alias-border-inverted2": ["rgba(0,0,0,0.08)", "rgba(255,255,255,0.14)"],
      "--dsw-alias-brand-primary": ["#10202C", "#F6F9FF"],
      "--dsw-alias-brand-text": ["#10202C", "#F6F9FF"],
      "--dsw-alias-brand-primary-invert": ["#F6F9FF", "#121826"],
      "--dsw-alias-state-business-primary": ["#B23A6E", "#E86AA6"],
      "--dsw-alias-state-business-tertiary": ["#F6DCE8", "#3A2130"],
      "--dsw-alias-link": ["#0B7EA8", "#7DE6FF"],
      "--dsw-focus-ring-color": ["#B23A6E", "#5FEFFF"],
      "--dsw-alias-trajectory-accent": ["#B23A6E", "#5FEFFF"],
      "--dsw-alias-chart-messages": ["#0E93B8", "#5FEFFF"],
      "--dsw-alias-chart-system": ["#6A8496", "#94A8BC"],
      "--dsw-alias-chart-tools": ["#A23A72", "#F07DB4"],
      "--dsw-alias-button-primary-fill": ["#B23A6E", "#E86AA6"],
      "--dsw-alias-button-primary-hover": ["#C94A7D", "#F584B8"],
      "--dsw-alias-button-primary-dimmed": ["#F0D3DF", "#4A2A3A"],
      "--dsw-alias-button-contrast-fill": ["#10202C", "#F6F9FF"],
      "--dsw-alias-button-elevated-fill": ["#D4E7F0", "#243447"],
      "--dsw-alias-button-floating-fill": ["#EAF4F9", "#1D2B3D"],
      "--dsw-alias-button-floating-hover": ["#DFEDF4", "#243447"],
      "--dsw-alias-button-info-fill": ["#B23A6E", "#E86AA6"],
      "--dsw-alias-button-info-hover": ["#C94A7D", "#F584B8"],
      "--dsw-alias-button-ghost-active-fill": ["rgba(178,58,110,0.12)", "rgba(232,106,166,0.14)"],
      "--dsw-alias-button-ghost-active-hover": ["rgba(178,58,110,0.18)", "rgba(232,106,166,0.20)"],
      "--dsw-alias-button-ghost-active-border": ["#B23A6E", "#E86AA6"],
      "--dsw-alias-interactive-bg-hover": ["rgba(178,58,110,0.07)", "rgba(232,106,166,0.08)"],
      "--dsw-alias-interactive-bg-active": ["rgba(178,58,110,0.13)", "rgba(232,106,166,0.14)"],
      "--dsw-alias-interactive-bg-hover-solid": ["#D4E7F0", "#243447"],
      "--dsw-alias-interactive-bg-hover-accent": ["rgba(14,147,184,0.16)", "rgba(95,239,255,0.16)"],
      "--dsw-alias-interactive-bg-hover-danger": ["rgba(194,74,99,0.14)", "rgba(255,150,168,0.16)"],
      "--dsw-alias-markdown-code-block": ["#F0F7FA", "#131C2A"],
      "--dsw-alias-markdown-code-block-banner": ["#E4F1F6", "#1A2738"],
      "--dsw-alias-markdown-code-segment-selected": ["#D4E7F0", "#24364B"],
      "--dsw-alias-markdown-code-segment-unselected": ["#E8F3F7", "#1A2738"],
      "--dsw-alias-markdown-inline-code": ["#E8F2F7", "#243247"],
      "--dsw-alias-markdown-placeholder": ["#A9BCC8", "#354A60"],
      "--dsw-alias-markdown-tag": ["#E6F0F5", "#2B3E54"],
      "--dsw-alias-markdown-citation": ["#F6DCE8", "#233A4A"],
      "--dsw-alias-state-success-primary": ["#1F8F72", "#5FE3BF"],
      "--dsw-alias-state-success-secondary": ["#2AA383", "#3FC9A4"],
      "--dsw-alias-state-success-tertiary": ["#D9F4EA", "#123A34"],
      "--dsw-alias-state-error-primary": ["#C24A63", "#FF96A8"],
      "--dsw-alias-state-error-secondary": ["#D45B74", "#E8748C"],
      "--dsw-alias-state-warn-primary": ["#A67A12", "#F0C96A"],
      "--dsw-alias-state-warn-secondary": ["#B88A1E", "#D9B34E"],
      "--dsw-alias-state-warn-label": ["#8A6410", "#F7E1A0"],
      "--dsw-alias-state-warn-tertiary": ["#F8EDD2", "#3B3218"],
      "--dsw-alias-state-done-primary": ["#A23A72", "#F07DB4"],
      "--dsw-alias-state-idle-primary": ["#8FA7B4", "#5B7386"],
      "--dsw-alias-switch-thumb": ["#FFFFFF", "#D8F7FF"],
      "--dsw-alias-scrollbar-bg-l1": ["#C7DEE8", "#3A4D62"],
      "--dsw-alias-scrollbar-bg-l2": ["#D2E8F0", "#33465C"],
      "--dsw-alias-scrollbar-hover-l1": ["#9BBCCB", "#5A7188"],
      "--dsw-alias-scrollbar-hover-l2": ["#A7C8D5", "#4E657C"],
      "--dsw-alias-json-tree-string": ["#B23A56", "#FFB3C4"],
      "--dsw-alias-json-tree-number": ["#0B7EA8", "#7FE5FF"],
      "--dsw-alias-json-tree-keyword": ["#6B4BC9", "#D8C6FF"],
      "--dsw-alias-json-tree-property": ["#0B7EA8", "#7DE6FF"],
      "--dsw-alias-json-tree-punctuation": ["#35506A", "#C3D2E2"],
      "--dsw-alias-json-tree-icon": ["#6A8496", "#94A8BC"],
      "--dsw-alias-json-tree-hover": ["rgba(14,147,184,0.08)", "rgba(95,239,255,0.08)"],
      "--dsw-alias-hovercard-state-done": ["#A23A72", "#F07DB4"],
      "--dsw-alias-hovercard-state-error": ["#C24A63", "#FF96A8"],
      "--dsw-alias-label-document-preview": ["#3A5A6E", "#C3D2E2"],
      "--dsw-alias-menu-icon": ["#3A5A6E", "#C3D2E2"],
      "--dsw-specific-selector": ["#D4E7F0", "#2B4058"],
    };
    // Scheme · Deep Sea Aurora. Each entry is [light, dark]; applied only while the skin is on.
    var AURORA_PALETTE = {
      "--dsw-alias-bg-layer-1": ["#E9F5F9", "#101B27"],
      "--dsw-alias-bg-layer-2": ["#DDEEF4", "#142333"],
      "--dsw-alias-bg-layer-3": ["#D2E8F0", "#192C3F"],
      "--dsw-alias-bg-overlay": ["#FFFFFF", "#1D3446"],
      "--dsw-alias-bg-module-platform": ["#E1F0F5", "#132231"],
      "--dsw-alias-bg-skeleton": ["rgba(14,70,90,0.08)", "rgba(120,200,230,0.10)"],
      "--dsw-alias-bg-document-preview": ["#F4FBFD", "#0A141E"],
      "--dsw-alias-bg-document-selection": ["rgba(27,159,201,0.22)", "rgba(74,234,243,0.26)"],
      "--dsw-specific-input-major": ["rgba(247,253,255,0.88)", "rgba(13,25,36,0.88)"],
      "--dsw-specific-menu": ["rgba(252,254,255,0.94)", "rgba(13,24,34,0.92)"],
      "--dsw-menu-surface-fill": ["rgba(252,254,255,0.94)", "rgba(13,24,34,0.92)"],
      "--dsw-alias-menu-group-header-fill": ["rgba(252,254,255,0.96)", "rgba(13,24,34,0.95)"],
      "--dsw-specific-bubble": ["#D6EDF5", "#17384C"],
      "--dsw-specific-bubble-highlight": ["#C4E5F0", "#1F4E68"],
      "--dsw-alias-card-fill": ["#E9F5F9", "#12212F"],
      "--dsw-alias-card-fill-hover": ["#DDEEF4", "#182D3D"],
      "--dsw-alias-card-tile-fill": ["rgba(22,119,156,0.06)", "rgba(74,234,243,0.06)"],
      "--dsw-alias-hovercard-bg": ["#FFFFFF", "#142838"],
      "--dsw-specific-tip": ["#6B8A9C", "#567487"],
      "--dsw-specific-sidebar-nav-item-active": ["rgba(22,119,156,0.12)", "rgba(74,234,243,0.10)"],
      "--dsw-specific-sidebar-nav-item-active-accent": ["#CDEFF7", "#123B4C"],
      "--dsw-specific-sidebar-right-flash": ["#16779C", "#4AEAF3"],
      "--dsw-alias-tooltip-bg": ["#0C2431", "#1B3446"],
      "--dsw-alias-tooltip-key-bg": ["#244C5F", "#2A4A5E"],
      "--dsw-alias-toast-bg": ["#0C2431", "#1B3446"],
      "--dsw-alias-label-primary": ["#0C2431", "#E8F6FC"],
      "--dsw-alias-label-secondary": ["#356074", "#A8C3D6"],
      "--dsw-alias-label-tertiary": ["#5C7E90", "#7E9AAF"],
      "--dsw-alias-label-dimmed": ["#A7BCC7", "#4E677A"],
      "--dsw-alias-label-caption": ["#6B8A9C", "#6F8CA1"],
      "--dsw-alias-label-primary-bluish": ["#0F3D52", "#DDF6FF"],
      "--dsw-alias-label-primary-dimmed": ["#244C5F", "#C4DDEB"],
      "--dsw-alias-label-primary-foreground": ["#FFFFFF", "#06121A"],
      "--dsw-alias-label-primary-inverted": ["#F6F9FF", "#0B1118"],
      "--dsw-alias-label-on-color": ["#FFFFFF", "#F2FBFF"],
      "--dsw-alias-label-shimmer": ["rgba(255,255,255,0.40)", "rgba(255,255,255,0.30)"],
      "--dsw-alias-label-deep-diving": ["#0E7FA0", "#7FE5FF"],
      "--dsw-alias-label-deep-diving-shimmer": ["#4AC6E4", "#B8F4FF"],
      "--dsw-alias-hovercard-label-primary": ["#0C2431", "#E8F6FC"],
      "--dsw-alias-hovercard-label-secondary": ["#356074", "#A8C3D6"],
      "--dsw-alias-hovercard-label-tertiary": ["#5C7E90", "#7E9AAF"],
      "--dsw-alias-tooltip-label": ["#FFFFFF", "#E8F6FC"],
      "--dsw-alias-toast-label": ["#FFFFFF", "#E8F6FC"],
      "--dsw-alias-toast-action": ["#7FE5FF", "#4AEAF3"],
      "--dsw-alias-border-l1": ["rgba(14,70,90,0.10)", "rgba(120,200,230,0.10)"],
      "--dsw-alias-border-l2": ["rgba(14,70,90,0.16)", "rgba(120,200,230,0.16)"],
      "--dsw-alias-border-l3": ["rgba(14,70,90,0.24)", "rgba(120,200,230,0.24)"],
      "--dsw-alias-border-l4": ["rgba(14,70,90,0.32)", "rgba(120,200,230,0.32)"],
      "--dsw-alias-border-l2-darkmode-thin": ["rgba(14,70,90,0.12)", "rgba(120,200,230,0.12)"],
      "--dsw-alias-border-selected": ["#1B9FC9", "#4AEAF3"],
      "--dsw-alias-border-inverted": ["rgba(0,0,0,0.12)", "rgba(255,255,255,0.10)"],
      "--dsw-alias-border-inverted2": ["rgba(0,0,0,0.08)", "rgba(255,255,255,0.14)"],
      "--dsw-alias-brand-primary": ["#0C2431", "#E8F6FC"],
      "--dsw-alias-brand-text": ["#0C2431", "#E8F6FC"],
      "--dsw-alias-brand-primary-invert": ["#F6F9FF", "#0B1118"],
      "--dsw-alias-state-business-primary": ["#16779C", "#1B759C"],
      "--dsw-alias-state-business-tertiary": ["#CDEFF7", "#0F3445"],
      "--dsw-alias-link": ["#0B7EA8", "#5FD8FF"],
      "--dsw-focus-ring-color": ["#0E93B8", "#4AEAF3"],
      "--dsw-alias-trajectory-accent": ["#16779C", "#4AEAF3"],
      "--dsw-alias-chart-messages": ["#16779C", "#4AEAF3"],
      "--dsw-alias-chart-system": ["#5C7E90", "#7E9AAF"],
      "--dsw-alias-chart-tools": ["#A23A72", "#C95197"],
      "--dsw-alias-button-primary-fill": ["#16779C", "#1B759C"],
      "--dsw-alias-button-primary-hover": ["#0F6385", "#2493BF"],
      "--dsw-alias-button-primary-dimmed": ["#BFE3EE", "#14384A"],
      "--dsw-alias-button-contrast-fill": ["#0C2431", "#E8F6FC"],
      "--dsw-alias-button-elevated-fill": ["#D7EAF1", "#1B3143"],
      "--dsw-alias-button-floating-fill": ["#E9F5F9", "#142333"],
      "--dsw-alias-button-floating-hover": ["#DDEEF4", "#1B3143"],
      "--dsw-alias-button-info-fill": ["#16779C", "#1B759C"],
      "--dsw-alias-button-info-hover": ["#0F6385", "#2493BF"],
      "--dsw-alias-button-ghost-active-fill": ["rgba(22,119,156,0.12)", "rgba(74,234,243,0.12)"],
      "--dsw-alias-button-ghost-active-hover": ["rgba(22,119,156,0.18)", "rgba(74,234,243,0.18)"],
      "--dsw-alias-button-ghost-active-border": ["#16779C", "#4AEAF3"],
      "--dsw-alias-interactive-bg-hover": ["rgba(22,119,156,0.07)", "rgba(74,234,243,0.07)"],
      "--dsw-alias-interactive-bg-active": ["rgba(22,119,156,0.13)", "rgba(74,234,243,0.13)"],
      "--dsw-alias-interactive-bg-hover-solid": ["#D7EAF1", "#1B3143"],
      "--dsw-alias-interactive-bg-hover-accent": ["rgba(14,147,184,0.16)", "rgba(74,234,243,0.18)"],
      "--dsw-alias-interactive-bg-hover-danger": ["rgba(194,74,99,0.14)", "rgba(255,143,163,0.16)"],
      "--dsw-alias-markdown-code-block": ["#E8F3F7", "#0C1722"],
      "--dsw-alias-markdown-code-block-banner": ["#DCEBF1", "#10202E"],
      "--dsw-alias-markdown-code-segment-selected": ["#D2E8F0", "#1E3A4E"],
      "--dsw-alias-markdown-code-segment-unselected": ["#E8F3F7", "#10202E"],
      "--dsw-alias-markdown-inline-code": ["#DCECF2", "#172B3B"],
      "--dsw-alias-markdown-placeholder": ["#A7BCC7", "#243D50"],
      "--dsw-alias-markdown-tag": ["#D6EDF5", "#1A3448"],
      "--dsw-alias-markdown-citation": ["#CDEFF7", "#12303F"],
      "--dsw-alias-state-success-primary": ["#1F8F72", "#4FD8B4"],
      "--dsw-alias-state-success-secondary": ["#2AA383", "#34B896"],
      "--dsw-alias-state-success-tertiary": ["#D9F4EA", "#0E3A33"],
      "--dsw-alias-state-error-primary": ["#C24A63", "#FF8FA3"],
      "--dsw-alias-state-error-secondary": ["#D45B74", "#E66C83"],
      "--dsw-alias-state-warn-primary": ["#A67A12", "#E8C55A"],
      "--dsw-alias-state-warn-secondary": ["#B88A1E", "#CDAE4A"],
      "--dsw-alias-state-warn-label": ["#8A6410", "#F5DE94"],
      "--dsw-alias-state-warn-tertiary": ["#F8EDD2", "#3B3013"],
      "--dsw-alias-state-done-primary": ["#A23A72", "#DE6FAE"],
      "--dsw-alias-state-idle-primary": ["#8FA7B4", "#476478"],
      "--dsw-alias-switch-thumb": ["#FFFFFF", "#BFF3FF"],
      "--dsw-alias-scrollbar-bg-l1": ["#C7DEE8", "#223B4E"],
      "--dsw-alias-scrollbar-bg-l2": ["#D2E8F0", "#1E3548"],
      "--dsw-alias-scrollbar-hover-l1": ["#9BBCCB", "#35637C"],
      "--dsw-alias-scrollbar-hover-l2": ["#A7C8D5", "#2C566C"],
      "--dsw-alias-json-tree-string": ["#B23A56", "#FFB3C4"],
      "--dsw-alias-json-tree-number": ["#0B7EA8", "#7FE5FF"],
      "--dsw-alias-json-tree-keyword": ["#6B4BC9", "#D8C6FF"],
      "--dsw-alias-json-tree-property": ["#0B7EA8", "#5FD8FF"],
      "--dsw-alias-json-tree-punctuation": ["#35506A", "#B9D2E3"],
      "--dsw-alias-json-tree-icon": ["#5C7E90", "#7E9AAF"],
      "--dsw-alias-json-tree-hover": ["rgba(22,119,156,0.08)", "rgba(74,234,243,0.08)"],
      "--dsw-alias-hovercard-state-done": ["#A23A72", "#DE6FAE"],
      "--dsw-alias-hovercard-state-error": ["#C24A63", "#FF8FA3"],
      "--dsw-alias-label-document-preview": ["#356074", "#A8C3D6"],
      "--dsw-alias-menu-icon": ["#356074", "#A8C3D6"],
      "--dsw-specific-selector": ["#D2E8F0", "#1F3448"],
    };
    // Aurora Tide: dark-mode overrides layered on Deep Sea Aurora; light values stay the sea-glass set.
    var TIDE_DARK = {
      "--dsw-alias-bg-layer-1": "#0F1D29",
      "--dsw-alias-bg-layer-2": "#142837",
      "--dsw-alias-bg-layer-3": "#1A3547",
      "--dsw-alias-bg-overlay": "#214257",
      "--dsw-alias-bg-module-platform": "#122534",
      "--dsw-alias-bg-skeleton": "rgba(110,235,255,0.10)",
      "--dsw-alias-bg-document-preview": "#091620",
      "--dsw-alias-bg-document-selection": "rgba(110,235,255,0.26)",
      "--dsw-specific-input-major": "rgba(12,29,41,0.88)",
      "--dsw-specific-menu": "rgba(13,30,42,0.92)",
      "--dsw-menu-surface-fill": "rgba(13,30,42,0.92)",
      "--dsw-alias-menu-group-header-fill": "rgba(12,24,34,0.95)",
      "--dsw-specific-bubble": "#164A5E",
      "--dsw-specific-bubble-highlight": "#1F657C",
      "--dsw-alias-card-fill": "#10202E",
      "--dsw-alias-card-fill-hover": "#152838",
      "--dsw-alias-card-tile-fill": "rgba(110,235,255,0.06)",
      "--dsw-alias-hovercard-bg": "#122838",
      "--dsw-specific-tip": "#5F7F91",
      "--dsw-specific-sidebar-nav-item-active": "rgba(110,235,255,0.12)",
      "--dsw-specific-sidebar-nav-item-active-accent": "#123A4A",
      "--dsw-specific-sidebar-right-flash": "#6FF7FF",
      "--dsw-alias-tooltip-bg": "#1B3E50",
      "--dsw-alias-tooltip-key-bg": "#2A5A70",
      "--dsw-alias-toast-bg": "#1B3E50",
      "--dsw-alias-label-primary": "#F4FEFF",
      "--dsw-alias-label-secondary": "#BDE6F2",
      "--dsw-alias-label-tertiary": "#8FB5C6",
      "--dsw-alias-label-dimmed": "#5F7F91",
      "--dsw-alias-label-caption": "#7D9CAE",
      "--dsw-alias-label-primary-bluish": "#E6FAFF",
      "--dsw-alias-label-primary-dimmed": "#D2F1FA",
      "--dsw-alias-label-primary-foreground": "#04141C",
      "--dsw-alias-label-primary-inverted": "#0F1D29",
      "--dsw-alias-label-on-color": "#04141C",
      "--dsw-alias-label-shimmer": "rgba(255,255,255,0.30)",
      "--dsw-alias-label-deep-diving": "#8CF7FF",
      "--dsw-alias-label-deep-diving-shimmer": "#C6FBFF",
      "--dsw-alias-hovercard-label-primary": "#F4FEFF",
      "--dsw-alias-hovercard-label-secondary": "#BDE6F2",
      "--dsw-alias-hovercard-label-tertiary": "#8FB5C6",
      "--dsw-alias-tooltip-label": "#F4FEFF",
      "--dsw-alias-toast-label": "#F4FEFF",
      "--dsw-alias-toast-action": "#6FF7FF",
      "--dsw-alias-border-l1": "rgba(110,235,255,0.14)",
      "--dsw-alias-border-l2": "rgba(110,235,255,0.22)",
      "--dsw-alias-border-l3": "rgba(110,235,255,0.32)",
      "--dsw-alias-border-l4": "rgba(110,235,255,0.42)",
      "--dsw-alias-border-l2-darkmode-thin": "rgba(110,235,255,0.14)",
      "--dsw-alias-border-selected": "#6FF7FF",
      "--dsw-alias-border-inverted": "rgba(255,255,255,0.10)",
      "--dsw-alias-border-inverted2": "rgba(255,255,255,0.14)",
      "--dsw-alias-brand-primary": "#F4FEFF",
      "--dsw-alias-brand-text": "#F4FEFF",
      "--dsw-alias-brand-primary-invert": "#0F1D29",
      "--dsw-alias-state-business-primary": "#22B8D9",
      "--dsw-alias-state-business-tertiary": "#0F3A4A",
      "--dsw-alias-link": "#7DF0FF",
      "--dsw-focus-ring-color": "#6FF7FF",
      "--dsw-alias-trajectory-accent": "#6FF7FF",
      "--dsw-alias-chart-messages": "#6FF7FF",
      "--dsw-alias-chart-system": "#8FB5C6",
      "--dsw-alias-chart-tools": "#E47FAE",
      "--dsw-alias-button-primary-fill": "#22B8D9",
      "--dsw-alias-button-primary-hover": "#3AD2EE",
      "--dsw-alias-button-primary-dimmed": "#123A4A",
      "--dsw-alias-button-contrast-fill": "#F4FEFF",
      "--dsw-alias-button-elevated-fill": "#1A3547",
      "--dsw-alias-button-floating-fill": "#142837",
      "--dsw-alias-button-floating-hover": "#1A3547",
      "--dsw-alias-button-info-fill": "#22B8D9",
      "--dsw-alias-button-info-hover": "#3AD2EE",
      "--dsw-alias-button-ghost-active-fill": "rgba(110,235,255,0.14)",
      "--dsw-alias-button-ghost-active-hover": "rgba(110,235,255,0.20)",
      "--dsw-alias-button-ghost-active-border": "#6FF7FF",
      "--dsw-alias-interactive-bg-hover": "rgba(110,235,255,0.08)",
      "--dsw-alias-interactive-bg-active": "rgba(110,235,255,0.14)",
      "--dsw-alias-interactive-bg-hover-solid": "#1A3547",
      "--dsw-alias-interactive-bg-hover-accent": "rgba(110,235,255,0.20)",
      "--dsw-alias-interactive-bg-hover-danger": "rgba(255,156,176,0.16)",
      "--dsw-alias-markdown-code-block": "#0B1B27",
      "--dsw-alias-markdown-code-block-banner": "#102B3A",
      "--dsw-alias-markdown-code-segment-selected": "#173848",
      "--dsw-alias-markdown-code-segment-unselected": "#102B3A",
      "--dsw-alias-markdown-inline-code": "#173848",
      "--dsw-alias-markdown-placeholder": "#2A4A5E",
      "--dsw-alias-markdown-tag": "#1A3E50",
      "--dsw-alias-markdown-citation": "#123A4A",
      "--dsw-alias-state-success-primary": "#64F0CF",
      "--dsw-alias-state-success-secondary": "#4FD8B4",
      "--dsw-alias-state-success-tertiary": "#0F3A36",
      "--dsw-alias-state-error-primary": "#FF9CB0",
      "--dsw-alias-state-error-secondary": "#E47F96",
      "--dsw-alias-state-warn-primary": "#E8D27A",
      "--dsw-alias-state-warn-secondary": "#CDB45E",
      "--dsw-alias-state-warn-label": "#F7E6A8",
      "--dsw-alias-state-warn-tertiary": "#3B3418",
      "--dsw-alias-state-done-primary": "#F49AC4",
      "--dsw-alias-state-idle-primary": "#4F7185",
      "--dsw-alias-switch-thumb": "#D8FBFF",
      "--dsw-alias-scrollbar-bg-l1": "#28536A",
      "--dsw-alias-scrollbar-bg-l2": "#24506A",
      "--dsw-alias-scrollbar-hover-l1": "#3B809A",
      "--dsw-alias-scrollbar-hover-l2": "#35748C",
      "--dsw-alias-json-tree-string": "#FFB3D0",
      "--dsw-alias-json-tree-number": "#7DF0FF",
      "--dsw-alias-json-tree-keyword": "#D8C6FF",
      "--dsw-alias-json-tree-property": "#7DF0FF",
      "--dsw-alias-json-tree-punctuation": "#BDE6F2",
      "--dsw-alias-json-tree-icon": "#8FB5C6",
      "--dsw-alias-json-tree-hover": "rgba(110,235,255,0.08)",
      "--dsw-alias-hovercard-state-done": "#F49AC4",
      "--dsw-alias-hovercard-state-error": "#FF9CB0",
      "--dsw-alias-label-document-preview": "#BDE6F2",
      "--dsw-alias-menu-icon": "#BDE6F2",
      "--dsw-specific-selector": "#1B3547",
    };
    var TIDE_PALETTE = Object.assign({}, AURORA_PALETTE);
    for (var tideName in TIDE_DARK) {
      if (TIDE_PALETTE[tideName]) TIDE_PALETTE[tideName] = [TIDE_PALETTE[tideName][0], TIDE_DARK[tideName]];
    }

    var ZH = {
      title: "动态皮肤",
      enable: "启用皮肤",
      darkGlass: "深色玻璃",
      palette: "配色方案",
      paletteDefault: "原始配色",
      paletteAurora: "深海极光",
      paletteTide: "极光潮汐",
      paletteCoral: "夜光珊瑚",
      paletteNote: "夜光珊瑚 · 深海极光 · 极光潮汐 · 原始配色",
      opacity: "界面不透明度",
      blur: "背景虚化",
      dim: "画面压暗",
      music: "背景音乐",
      track: "曲目",
      trackOne: "浮光",
      trackTwo: "粼光缓动",
      musicMode: "播放模式",
      modeSingle: "单曲循环",
      modePlaylist: "双曲循环",
      musicVolume: "音乐音量",
      language: "语言",
      hideAccount: "隐藏账号信息",
      showAccount: "显示账号信息",
      replay: "重新播放",
      reset: "恢复默认",
      unavailable: "视频不可用，已恢复默认界面",
      promoText: "感谢支持蜃海，可在 Steam 搜索蜃海或点击链接体验游玩",
      promoLink: "《蜃海》Steam页面",
    };
    var EN = {
      title: "Dynamic skin",
      enable: "Enable skin",
      darkGlass: "Dark glass",
      palette: "Color scheme",
      paletteDefault: "Original",
      paletteAurora: "Deep Sea Aurora",
      paletteTide: "Aurora Tide",
      paletteCoral: "Coral Night",
      paletteNote: "Coral Night · Deep Sea Aurora · Aurora Tide · Original",
      opacity: "Surface opacity",
      blur: "Background blur",
      dim: "Video dim",
      music: "Background music",
      track: "Track",
      trackOne: "Floating Light",
      trackTwo: "Glimmer Drift",
      musicMode: "Playback",
      modeSingle: "Repeat one",
      modePlaylist: "Loop both",
      musicVolume: "Music volume",
      language: "Language",
      hideAccount: "Hide account details",
      showAccount: "Show account details",
      replay: "Replay",
      reset: "Reset",
      unavailable: "Video unavailable — default surface restored",
      promoText: "Thanks for supporting Dawn of the Abyss. Search for Dawn of the Abyss on Steam or click the link to play.",
      promoLink: "Dawn of the Abyss on Steam",
    };
    var copy = /^zh/i.test(String(navigator.language || "")) ? ZH : EN;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function readStore() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
          if (raw) window.localStorage.setItem(STORAGE_KEY, raw);
        }
        if (!raw) return {};
        var parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (error) {
        return {};
      }
    }

    function normalize(input) {
      var settings = Object.assign({}, DEFAULTS, input || {});
      settings.enabled = settings.enabled !== false;
      settings.darkGlass = settings.darkGlass !== false;
      if (input && typeof input === "object" && input.palette === undefined && input.coralPalette === false) {
        settings.palette = "default";
      }
      if (settings.palette !== "aurora" && settings.palette !== "tide" && settings.palette !== "coral" && settings.palette !== "default") {
        settings.palette = DEFAULTS.palette;
      }
      if (input && input.palette !== undefined) {
        // v2 shipped Coral Night as the default. Move that old default to the
        // new Aurora Tide default once; later explicit choices use version 3.
        if (input.palette === "coral" && input.paletteVersion === 2) {
          settings.palette = "tide";
        }
        settings.paletteVersion = 3;
      } else if (!input || input.paletteVersion !== 3) {
        settings.palette = input && input.coralPalette === false ? "default" : "tide";
        settings.paletteVersion = 3;
      }
      delete settings.coralPalette;
      settings.themeBefore = typeof settings.themeBefore === "string" ? settings.themeBefore : "";
      settings.opacity = clamp(Number(settings.opacity) || DEFAULTS.opacity, 0.3, 1);
      settings.blur = clamp(Number(settings.blur) || 0, 0, 24);
      settings.dim = clamp(Number(settings.dim) || 0, 0, 0.6);
      settings.musicEnabled = settings.musicEnabled === true;
      var musicVolume = Number(settings.musicVolume);
      settings.musicVolume = Number.isFinite(musicVolume) ? clamp(musicVolume, 0, 1) : DEFAULTS.musicVolume;
      settings.musicTrack = settings.musicTrack === 1 ? 1 : 0;
      settings.musicMode = settings.musicMode === "single" ? "single" : "playlist";
      settings.accountHidden = settings.accountHidden === true;
      if (settings.lang !== "zh" && settings.lang !== "en") {
        settings.lang = /^zh/i.test(String(navigator.language || "")) ? "zh" : "en";
      }
      return settings;
    }

    function saveStore(settings) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        /* private mode or full quota: the skin still works for this page */
      }
    }

    function route(path) {
      try {
        return new URL(path, document.baseURI).href;
      } catch (error) {
        return "/" + path;
      }
    }

    var storedSettings = readStore();
    var state = {
      settings: normalize(storedSettings),
      initialStored: Object.keys(storedSettings).length > 0,
      configApplied: false,
      mounted: false,
      layer: null,
      video: null,
      launcher: null,
      panel: null,
      fab: null,
      accountToggle: null,
      accountEyeOffset: null,
      accountRaf: 0,
      accountWatcher: null,
      accountResize: null,
      accountResizeTargets: null,
      setPanel: null,
      toggle: null,
      opacityInput: null,
      blurInput: null,
      dimInput: null,
      musicToggle: null,
      trackSelect: null,
      modeSelect: null,
      musicVolumeInput: null,
      langSelect: null,
      audio: null,
      trackIndex: 0,
      valueOutputs: {},
      themeObserver: null,
      theme: null,
      darkToggle: null,
      paletteSelect: null,
      paletteDisposer: null,
      cleanup: [],
      failed: false,
      srcSet: false,
      frame: 0,
    };
    copy = state.settings.lang === "en" ? EN : ZH;

    var styleText = [
      "html[data-dsh-skin='on'],",
      "html[data-dsh-skin='on'] body { background: transparent !important; }",
      "html[data-dsh-skin='on'] body {",
      "  --dsw-alias-bg-base: transparent !important;",
      "  --dsw-specific-sidebar-fill: transparent !important;",
      "}",
      "html[data-dsh-skin='on'] #root { position: relative; z-index: 1; }",
      "#dsh-shenhai-skin-root .dsh-skin-tint {",
      "  position: absolute;",
      "  inset: 0;",
      "  background-color: color-mix(in srgb, var(--dsh-skin-base, #ffffff) var(--dsh-skin-alpha, 72%), transparent);",
      "  background-image: linear-gradient(90deg, rgba(0,0,0,0.10), rgba(0,0,0,0) 28%);",
      "  transition: background-color 200ms ease;",
      "}",
      "#dsh-shenhai-skin-root {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 0;",
      "  overflow: hidden;",
      "  pointer-events: none;",
      "  background: #05060a;",
      "  contain: layout paint style;",
      "}",
      "html[data-platform='darwin'] body > #dsh-shenhai-skin-root { -webkit-app-region: initial !important; }",
      "html.dsh-skin-account-hidden button[aria-haspopup='menu'][data-collapsed][data-signed-out='false'] > span { display: none !important; }",
      "#dsh-shenhai-skin-root video {",
      "  position: absolute;",
      "  inset: 0;",
      "  width: 100%;",
      "  height: 100%;",
      "  object-fit: cover;",
      "  transform: scale(1.06);",
      "  opacity: 0;",
      "  transition: opacity 900ms ease;",
      "  filter: blur(var(--dsh-skin-blur, 0px)) saturate(1.04) brightness(0.8);",
      "}",
      "body[data-ds-dark-theme] #dsh-shenhai-skin-root video {",
      "  filter: blur(var(--dsh-skin-blur, 0px)) saturate(1.04) brightness(0.98);",
      "}",
      "#dsh-shenhai-skin-root[data-ready='1'] video { opacity: 1; }",
      "#dsh-shenhai-skin-root .dsh-skin-scrim {",
      "  position: absolute;",
      "  inset: 0;",
      "  background:",
      "    radial-gradient(130% 100% at 50% 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.42) 100%),",
      "    linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.34));",
      "  opacity: var(--dsh-skin-dim, 0.18);",
      "  transition: opacity 200ms ease;",
      "}",
      "#dsh-shenhai-skin-root[data-failed='1'] { display: none; }",
      ".dsh-skin-launcher {",
      "  position: fixed;",
      "  right: 16px;",
      "  bottom: 16px;",
      "  z-index: 60;",
      "  display: flex;",
      "  flex-direction: column;",
      "  align-items: flex-end;",
      "  gap: 8px;",
      "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;",
      "}",
      ".dsh-skin-fab {",
      "  width: 108px;",
      "  height: 56px;",
      "  box-sizing: border-box;",
      "  border-radius: 0;",
      "  border: 1px solid rgba(95,239,255,0.35);",
      "  background: rgba(9,17,25,0.86);",
      "  color: #f4feff;",
      "  box-shadow: 0 10px 30px rgba(0,0,0,0.38), 0 0 0 1px rgba(0,0,0,0.18);",
      "  backdrop-filter: blur(18px) saturate(150%);",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  padding: 2px;",
      "  cursor: pointer;",
      "  opacity: 0.9;",
      "  transition: opacity 160ms ease, transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;",
      "}",
      ".dsh-skin-fab:hover, .dsh-skin-fab:focus-visible { opacity: 1; transform: translateY(-1px); border-color: rgba(110,235,255,0.78); box-shadow: 0 0 0 1px rgba(110,235,255,0.30), 0 12px 34px rgba(0,0,0,0.46); }",
      ".dsh-skin-fab img { width: 97px; height: 50px; object-fit: contain; display: block; pointer-events: none; filter: drop-shadow(0 0 8px rgba(95,239,255,0.18)); }",
      ".dsh-skin-fab-fallback { font-size: 24px; line-height: 1; color: #f4feff; pointer-events: none; }",
      ".dsh-skin-account-toggle {",
      "  position: fixed;",
      "  z-index: 60;",
      "  box-sizing: border-box;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  width: 22px;",
      "  height: 22px;",
      "  margin: 0;",
      "  padding: 0;",
      "  border: 0;",
      "  border-radius: 0;",
      "  background: transparent;",
      "  box-shadow: none;",
      "  color: var(--dsw-alias-label-secondary, rgba(255,255,255,0.72));",
      "  cursor: pointer;",
      "  opacity: 0.9;",
      "  pointer-events: auto;",
      "  -webkit-appearance: none;",
      "  appearance: none;",
      "  transition: color 140ms ease, opacity 140ms ease;",
      "}",
      ".dsh-skin-account-toggle:hover, .dsh-skin-account-toggle:focus-visible { color: var(--dsw-alias-label-primary, #f6f9ff); opacity: 1; }",
      ".dsh-skin-account-toggle:focus-visible { outline: 1px solid var(--dsw-focus-ring-color, rgba(95,239,255,0.7)); outline-offset: 1px; }",
      ".dsh-skin-account-toggle svg { display: block; width: 16px; height: 16px; pointer-events: none; }",
      ".dsh-skin-account-toggle[hidden] { display: none !important; }",
      ".dsh-skin-account-toggle .dsh-skin-eye-off { display: none; }",
      ".dsh-skin-account-toggle[data-hidden='1'] .dsh-skin-eye-on { display: none; }",
      ".dsh-skin-account-toggle[data-hidden='1'] .dsh-skin-eye-off { display: block; }",
      ".dsh-skin-panel {",
      "  width: 252px;",
      "  box-sizing: border-box;",
      "  max-height: calc(100vh - 100px);",
      "  overflow-y: auto;",
      "  scrollbar-width: thin;",
      "  padding: 14px;",
      "  border-radius: 16px;",
      "  border: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.14));",
      "  background: var(--dsw-specific-menu, rgba(22,22,26,0.88));",
      "  color: var(--dsw-alias-label-primary, #f2f3f5);",
      "  box-shadow: 0 18px 48px rgba(0,0,0,0.34);",
      "  backdrop-filter: blur(28px) saturate(150%);",
      "  font-size: 12.5px;",
      "  line-height: 1.5;",
      "}",
      ".dsh-skin-panel[hidden] { display: none; }",
      ".dsh-skin-panel .dsh-skin-note { font-size: 10.5px; color: var(--dsw-alias-label-tertiary, rgba(255,255,255,0.5)); margin: -2px 0 8px; }",
      ".dsh-skin-panel .dsh-skin-promo { width: 100%; height: auto; display: block; border-radius: 11px; margin: 0 0 10px; border: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.14)); object-fit: cover; }",
      ".dsh-skin-panel .dsh-skin-promo-text { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.14)); font-size: 11px; line-height: 1.6; color: var(--dsw-alias-label-tertiary, rgba(255,255,255,0.5)); }",
      ".dsh-skin-panel .dsh-skin-promo-text a { color: var(--dsw-alias-link, #5fd8ff); text-decoration: underline; text-underline-offset: 2px; }",
      ".dsh-skin-row { display: grid; gap: 6px; margin: 9px 0; }",
      ".dsh-skin-row .dsh-skin-label { display: flex; justify-content: space-between; gap: 8px; }",
      ".dsh-skin-row output { font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-secondary, rgba(255,255,255,0.66)); }",
      ".dsh-skin-row input[type='range'] { width: 100%; margin: 0; accent-color: var(--dsw-alias-state-business-primary, #4d6bfe); }",
      ".dsh-skin-select { width: 100%; height: 28px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.16)); background: var(--dsw-alias-bg-layer-2, rgba(20,35,51,0.9)); color: var(--dsw-alias-label-primary, #f2f3f5); font: inherit; padding: 0 8px; }",
      ".dsh-skin-select option { background: var(--dsw-alias-bg-layer-2, #142333); color: var(--dsw-alias-label-primary, #f2f3f5); }",
      ".dsh-skin-duo { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0; }",
      ".dsh-skin-duo-item { display: grid; gap: 4px; min-width: 0; }",
      ".dsh-skin-duo-label { font-size: 10.5px; color: var(--dsw-alias-label-tertiary, rgba(255,255,255,0.5)); }",
      ".dsh-skin-duo .dsh-skin-select { height: 26px; padding: 0 6px; font-size: 11.5px; }",
      ".dsh-skin-switch { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 2px 0 8px; }",
      ".dsh-skin-switch input { width: 16px; height: 16px; accent-color: var(--dsw-alias-state-business-primary, #4d6bfe); }",
      ".dsh-skin-actions { display: flex; gap: 8px; margin-top: 12px; }",
      ".dsh-skin-actions button {",
      "  flex: 1;",
      "  height: 28px;",
      "  border-radius: 9px;",
      "  border: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.16));",
      "  background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,0.1));",
      "  color: inherit;",
      "  font: inherit;",
      "  cursor: pointer;",
      "}",
      ".dsh-skin-actions button:hover { background: var(--dsw-alias-interactive-bg-active, rgba(255,255,255,0.16)); }",
      ".dsh-skin-error { color: var(--dsw-alias-state-warn-primary, #e0a03a); font-size: 11.5px; margin-top: 8px; }",
      ".dsh-skin-error[hidden] { display: none; }",
      "@media (prefers-reduced-motion: reduce) {",
      "  #dsh-shenhai-skin-root video { transition: none; }",
      "  .dsh-skin-fab { transition: none; }",
      "}",
      "@media (max-width: 640px) {",
      "  .dsh-skin-panel { width: 228px; }",
      "  .dsh-skin-fab { width: 86px; height: 45px; }",
      "  .dsh-skin-fab img { width: 76px; height: 39px; }",
      "  .dsh-skin-launcher { right: 10px; bottom: 10px; }",
      "}",
    ].join("\n");

    function readBaseColor() {
      var html = document.documentElement;
      var had = html.hasAttribute("data-dsh-skin");
      if (had) html.removeAttribute("data-dsh-skin");
      var computed = window.getComputedStyle(document.body || html);
      var value = computed.getPropertyValue("--dsw-alias-bg-base").trim();
      if (had) html.setAttribute("data-dsh-skin", "on");
      if (value) return value;
      var dark = document.body && document.body.hasAttribute("data-ds-dark-theme");
      return dark ? "#151517" : "#ffffff";
    }

    function refreshBaseColor() {
      document.documentElement.style.setProperty("--dsh-skin-base", readBaseColor());
    }

    function applySurface() {
      var root = document.documentElement;
      root.style.setProperty("--dsh-skin-alpha", String(Math.round(state.settings.opacity * 100)) + "%");
      root.style.setProperty("--dsh-skin-blur", String(state.settings.blur) + "px");
      root.style.setProperty("--dsh-skin-dim", String(state.settings.dim));
      refreshBaseColor();
    }

    function applyAccountHidden() {
      var hidden = state.settings.enabled === true && state.settings.accountHidden === true && !state.failed;
      document.documentElement.classList.toggle("dsh-skin-account-hidden", hidden);
      if (!state.accountToggle) return;
      var label = hidden ? copy.showAccount : copy.hideAccount;
      state.accountToggle.setAttribute("data-hidden", hidden ? "1" : "0");
      state.accountToggle.setAttribute("aria-pressed", hidden ? "true" : "false");
      state.accountToggle.setAttribute("aria-label", label);
      state.accountToggle.title = label;
    }

    function accountTriggerElement() {
      return document.querySelector("button[aria-haspopup='menu'][data-collapsed][data-signed-out]");
    }

    function accountLabelElement(trigger, avatar) {
      var children = trigger.children;
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (child !== avatar && child.tagName === "SPAN" && child.textContent && child.textContent.replace(/\s+/g, "") !== "") {
          return child;
        }
      }
      return null;
    }

    function ensureAccountResize(trigger, label) {
      if (typeof window.ResizeObserver !== "function") return;
      var targets = state.accountResizeTargets;
      if (state.accountResize && targets && targets[0] === trigger && targets[1] === (label || null)) return;
      if (state.accountResize) {
        try { state.accountResize.disconnect(); } catch (error) { /* noop */ }
      }
      var observer = new window.ResizeObserver(function () { scheduleAccountPosition(); });
      observer.observe(trigger);
      if (label) observer.observe(label);
      state.accountResize = observer;
      state.accountResizeTargets = [trigger, label || null];
    }

    function positionAccountToggle() {
      var eye = state.accountToggle;
      if (!eye) return;
      var trigger = accountTriggerElement();
      if (!trigger || trigger.getAttribute("data-signed-out") === "true") {
        eye.hidden = true;
        return;
      }
      var triggerRect = trigger.getBoundingClientRect();
      if (triggerRect.width < 11 || triggerRect.height < 11) {
        eye.hidden = true;
        return;
      }
      eye.hidden = false;
      var avatar = trigger.querySelector("span[data-avatar-status]");
      if (!avatar) {
        for (var si = 0; si < trigger.children.length; si++) {
          if (trigger.children[si].tagName === "SPAN") { avatar = trigger.children[si]; break; }
        }
      }
      var label = accountLabelElement(trigger, avatar);
      var labelRect = label ? label.getBoundingClientRect() : null;
      var avatarRect = avatar ? avatar.getBoundingClientRect() : null;
      var labelVisible = labelRect !== null && labelRect.width > 1 && labelRect.height > 1;
      var collapsed = trigger.getAttribute("data-collapsed") === "true";
      var left;
      var centerY;
      if (labelVisible) {
        left = labelRect.right + 6;
        centerY = labelRect.top + labelRect.height / 2;
      } else if (collapsed) {
        var collapsedAnchor = avatarRect && avatarRect.width > 1 ? avatarRect.right : triggerRect.right;
        left = collapsedAnchor + 6;
        centerY = avatarRect && avatarRect.width > 1 ? avatarRect.top + avatarRect.height / 2 : triggerRect.top + triggerRect.height / 2;
      } else if (state.accountEyeOffset !== null) {
        left = triggerRect.right - state.accountEyeOffset;
        centerY = triggerRect.top + triggerRect.height / 2;
      } else {
        left = triggerRect.left + 38;
        centerY = triggerRect.top + triggerRect.height / 2;
      }
      ensureAccountResize(trigger, label);
      left = Math.max(4, Math.min(window.innerWidth - 26, left));
      centerY = Math.max(15, Math.min(window.innerHeight - 15, centerY));
      if (labelVisible) state.accountEyeOffset = triggerRect.right - left;
      eye.style.left = Math.round(left) + "px";
      eye.style.top = Math.round(centerY - 11) + "px";
    }

    function scheduleAccountPosition() {
      if (state.accountRaf) return;
      if (typeof window.requestAnimationFrame !== "function") {
        positionAccountToggle();
        return;
      }
      state.accountRaf = window.requestAnimationFrame(function () {
        state.accountRaf = 0;
        positionAccountToggle();
      });
    }

    function watchAccountRow() {
      if (state.accountWatcher) return;
      function kick() { scheduleAccountPosition(); }
      window.addEventListener("resize", kick);
      state.cleanup.push(function () { window.removeEventListener("resize", kick); });
      if (typeof MutationObserver === "function") {
        var observer = new MutationObserver(function () { scheduleAccountPosition(); });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["data-collapsed", "data-signed-out"],
        });
        state.accountWatcher = observer;
        state.cleanup.push(function () {
          observer.disconnect();
          state.accountWatcher = null;
        });
      }
      scheduleAccountPosition();
    }

    function stopVideo() {
      if (state.video) {
        try { state.video.pause(); } catch (error) { /* noop */ }
      }
    }

    function startVideo() {
      if (!state.video || !state.settings.enabled || state.failed) return;
      var video = state.video;
      if (!state.srcSet) {
        state.srcSet = true;
        video.src = route(VIDEO_PATH);
        video.load();
        // A slow software decoder must not leave the wallpaper invisible: reveal
        // the layer after a short grace period even if no media event arrives.
        window.setTimeout(function () {
          if (state.layer && state.settings.enabled && !state.failed) {
            state.layer.setAttribute("data-ready", "1");
          }
        }, 1400);
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") attempt.catch(function () { /* autoplay may be blocked; the first frame stays */ });
    }

    function paletteTokens(source) {
      var tokens = {};
      for (var name in source) {
        var pair = source[name];
        if (!pair) continue;
        tokens[name] = { light: pair[0], dark: pair[1] };
      }
      return tokens;
    }

    function paletteForSetting() {
      if (state.settings.palette === "coral") return CORAL_PALETTE;
      if (state.settings.palette === "aurora") return AURORA_PALETTE;
      if (state.settings.palette === "tide") return TIDE_PALETTE;
      return null;
    }

    function applyPalette() {
      clearPalette();
      var theme = state.theme;
      if (!theme || !state.settings.enabled) return;
      var source = paletteForSetting();
      if (!source) return;
      try {
        state.paletteDisposer = theme.overrideTokens("dsh-shenhai-skin", paletteTokens(source));
      } catch (error) {
        state.paletteDisposer = null;
      }
    }

    function clearPalette() {
      if (!state.paletteDisposer) return;
      var dispose = state.paletteDisposer;
      state.paletteDisposer = null;
      try { dispose(); } catch (error) { /* the theme service may already be gone */ }
    }

    function ensureAudio() {
      if (state.audio) return state.audio;
      var audio = document.createElement("audio");
      audio.preload = "auto";
      audio.volume = state.settings.musicVolume;
      audio.loop = state.settings.musicMode === "single";
      audio.addEventListener("ended", function () {
        if (!state.settings.enabled || !state.settings.musicEnabled) return;
        if (state.settings.musicMode === "single") {
          try { audio.currentTime = 0; } catch (error) { /* noop */ }
          playAudio();
          return;
        }
        state.trackIndex = (state.trackIndex + 1) % MUSIC_PATHS.length;
        audio.src = route(MUSIC_PATHS[state.trackIndex]);
        playAudio();
      });
      audio.addEventListener("error", function () {
        state.settings.musicEnabled = false;
        saveStore(state.settings);
        if (state.musicToggle) state.musicToggle.checked = false;
      });
      audio.style.display = "none";
      document.body.appendChild(audio);
      state.audio = audio;
      return audio;
    }

    function playAudio() {
      var audio = ensureAudio();
      audio.volume = state.settings.musicVolume;
      var attempt = audio.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () { /* autoplay blocked until the next user gesture */ });
      }
    }

    function startMusic() {
      if (!state.settings.enabled || !state.settings.musicEnabled) return;
      state.trackIndex = state.settings.musicTrack;
      var audio = ensureAudio();
      audio.loop = state.settings.musicMode === "single";
      var src = route(MUSIC_PATHS[state.trackIndex]);
      if (audio.src !== src) audio.src = src;
      playAudio();
    }

    function selectTrack(index) {
      var safe = index === 1 ? 1 : 0;
      state.settings.musicTrack = safe;
      state.trackIndex = safe;
      var audio = ensureAudio();
      audio.loop = state.settings.musicMode === "single";
      audio.src = route(MUSIC_PATHS[safe]);
      if (state.settings.enabled && state.settings.musicEnabled) playAudio();
      saveStore(state.settings);
      syncControls();
    }

    function setMusicMode(mode) {
      state.settings.musicMode = mode === "single" ? "single" : "playlist";
      if (state.audio) state.audio.loop = state.settings.musicMode === "single";
      saveStore(state.settings);
      syncControls();
    }

    function stopMusic() {
      if (!state.audio) return;
      try { state.audio.pause(); } catch (error) { /* noop */ }
    }

    function ensureTheme() {
      var theme = state.theme;
      if (!theme || !state.settings.enabled || !state.settings.darkGlass) return;
      var snapshot = theme.getTheme();
      var activeId = snapshot && snapshot.active ? snapshot.active.id : "";
      if (activeId === "dark") return;
      if (!state.settings.themeBefore) {
        state.settings.themeBefore = snapshot && snapshot.preference ? snapshot.preference : "system";
        saveStore(state.settings);
      }
      try { theme.setTheme("dark"); } catch (error) { /* theme service unavailable */ }
    }

    function restoreTheme() {
      var theme = state.theme;
      if (!theme || !state.settings.themeBefore) return;
      var before = state.settings.themeBefore;
      state.settings.themeBefore = "";
      saveStore(state.settings);
      try { theme.setTheme(before); } catch (error) { /* theme service unavailable */ }
    }

    function setEnabled(enabled) {
      state.settings.enabled = enabled;
      if (enabled && !state.failed) {
        document.documentElement.setAttribute("data-dsh-skin", "on");
        startVideo();
        ensureTheme();
        applyPalette();
        if (state.settings.musicEnabled) startMusic(); else stopMusic();
      } else {
        document.documentElement.removeAttribute("data-dsh-skin");
        stopVideo();
        stopMusic();
        clearPalette();
        restoreTheme();
      }
      if (state.toggle) state.toggle.checked = enabled;
      applyAccountHidden();
      saveStore(state.settings);
    }

    function updateSettings(patch) {
      Object.assign(state.settings, patch);
      applySurface();
      if (state.settings.enabled) startVideo();
      if (state.audio) state.audio.volume = state.settings.musicVolume;
      saveStore(state.settings);
      syncControls();
    }

    function syncControls() {
      if (state.toggle) state.toggle.checked = state.settings.enabled;
      if (state.darkToggle) state.darkToggle.checked = state.settings.darkGlass;
      if (state.paletteSelect) state.paletteSelect.value = state.settings.palette;
      if (state.musicToggle) state.musicToggle.checked = state.settings.musicEnabled;
      if (state.trackSelect) state.trackSelect.value = String(state.settings.musicTrack);
      if (state.modeSelect) state.modeSelect.value = state.settings.musicMode;
      if (state.langSelect) state.langSelect.value = state.settings.lang;
      if (state.opacityInput) {
        state.opacityInput.value = String(Math.round(state.settings.opacity * 100));
        state.valueOutputs.opacity.textContent = Math.round(state.settings.opacity * 100) + "%";
      }
      if (state.blurInput) {
        state.blurInput.value = String(state.settings.blur);
        state.valueOutputs.blur.textContent = String(state.settings.blur) + "px";
      }
      if (state.dimInput) {
        state.dimInput.value = String(Math.round(state.settings.dim * 100));
        state.valueOutputs.dim.textContent = Math.round(state.settings.dim * 100) + "%";
      }
      if (state.musicVolumeInput) {
        state.musicVolumeInput.value = String(Math.round(state.settings.musicVolume * 100));
        state.valueOutputs.musicVolume.textContent = Math.round(state.settings.musicVolume * 100) + "%";
      }
      applyAccountHidden();
      scheduleAccountPosition();
    }

    function showFailure(message) {
      state.failed = true;
      document.documentElement.removeAttribute("data-dsh-skin");
      applyAccountHidden();
      if (state.layer) state.layer.setAttribute("data-failed", "1");
      if (state.error) {
        state.error.textContent = message || copy.unavailable;
        state.error.hidden = false;
      }
      stopVideo();
    }

    function buildLayer() {
      var layer = document.createElement("div");
      layer.id = ROOT_ID;
      layer.setAttribute("aria-hidden", "true");
      var video = document.createElement("video");
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("disablepictureinpicture", "");
      video.setAttribute("disableremoteplayback", "");
      video.oncontextmenu = function (event) { event.preventDefault(); };
      video.addEventListener("loadeddata", function () {
        layer.setAttribute("data-ready", "1");
      });
      video.addEventListener("canplay", function () {
        layer.setAttribute("data-ready", "1");
      });
      video.addEventListener("playing", function () {
        layer.setAttribute("data-ready", "1");
      });
      video.addEventListener("error", function () {
        if (state.failed) return;
        showFailure(copy.unavailable);
      });
      video.addEventListener("stalled", function () {
        /* keep the last frame; looping retries on its own */
      });
      var scrim = document.createElement("div");
      scrim.className = "dsh-skin-scrim";
      var tint = document.createElement("div");
      tint.className = "dsh-skin-tint";
      layer.appendChild(video);
      layer.appendChild(scrim);
      layer.appendChild(tint);
      return { layer: layer, video: video };
    }

    function buildLauncher() {
      var launcher = document.createElement("div");
      launcher.id = LAUNCHER_ID;
      launcher.className = "dsh-skin-launcher";

      var panel = document.createElement("div");
      panel.className = "dsh-skin-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", copy.title);
      panel.hidden = true;

      var promoImage = document.createElement("img");
      promoImage.className = "dsh-skin-promo";
      promoImage.src = route(PROMO_PATH);
      promoImage.alt = "Dawn of the Abyss";
      promoImage.draggable = false;
      promoImage.addEventListener("error", function () {
        promoImage.style.display = "none";
      });
      panel.appendChild(promoImage);

      var toggleRow = document.createElement("label");
      toggleRow.className = "dsh-skin-switch";
      var toggleLabel = document.createElement("span");
      toggleLabel.textContent = copy.enable;
      var toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggleRow.appendChild(toggleLabel);
      toggleRow.appendChild(toggle);
      panel.appendChild(toggleRow);

      var darkRow = document.createElement("label");
      darkRow.className = "dsh-skin-switch";
      var darkLabel = document.createElement("span");
      darkLabel.textContent = copy.darkGlass;
      var darkToggle = document.createElement("input");
      darkToggle.type = "checkbox";
      darkRow.appendChild(darkLabel);
      darkRow.appendChild(darkToggle);
      panel.appendChild(darkRow);

      var paletteRow = document.createElement("div");
      paletteRow.className = "dsh-skin-row";
      var paletteLabelRow = document.createElement("div");
      paletteLabelRow.className = "dsh-skin-label";
      var paletteLabel = document.createElement("span");
      paletteLabel.textContent = copy.palette;
      paletteLabelRow.appendChild(paletteLabel);
      paletteRow.appendChild(paletteLabelRow);
      var paletteSelect = document.createElement("select");
      paletteSelect.className = "dsh-skin-select";
      function addPaletteOption(value, label) {
        var option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        paletteSelect.appendChild(option);
      }
      addPaletteOption("coral", copy.paletteCoral);
      addPaletteOption("aurora", copy.paletteAurora);
      addPaletteOption("tide", copy.paletteTide);
      addPaletteOption("default", copy.paletteDefault);
      paletteRow.appendChild(paletteSelect);
      panel.appendChild(paletteRow);
      var paletteNote = document.createElement("div");
      paletteNote.className = "dsh-skin-note";
      paletteNote.textContent = copy.paletteNote;
      panel.appendChild(paletteNote);

      function rangeRow(key, label, min, max) {
        var row = document.createElement("div");
        row.className = "dsh-skin-row";
        var labelRow = document.createElement("div");
        labelRow.className = "dsh-skin-label";
        var name = document.createElement("span");
        name.textContent = label;
        var output = document.createElement("output");
        labelRow.appendChild(name);
        labelRow.appendChild(output);
        var input = document.createElement("input");
        input.type = "range";
        input.min = String(min);
        input.max = String(max);
        input.step = "1";
        row.appendChild(labelRow);
        row.appendChild(input);
        panel.appendChild(row);
        state.valueOutputs[key] = output;
        return input;
      }

      var opacityInput = rangeRow("opacity", copy.opacity, 30, 100);
      var blurInput = rangeRow("blur", copy.blur, 0, 24);
      var dimInput = rangeRow("dim", copy.dim, 0, 60);

      var musicRow = document.createElement("label");
      musicRow.className = "dsh-skin-switch";
      var musicLabel = document.createElement("span");
      musicLabel.textContent = copy.music;
      var musicToggle = document.createElement("input");
      musicToggle.type = "checkbox";
      musicRow.appendChild(musicLabel);
      musicRow.appendChild(musicToggle);
      panel.appendChild(musicRow);

      var musicDuo = document.createElement("div");
      musicDuo.className = "dsh-skin-duo";

      var trackSelect = document.createElement("select");
      trackSelect.className = "dsh-skin-select";
      var trackOne = document.createElement("option");
      trackOne.value = "0";
      trackOne.textContent = copy.trackOne;
      trackSelect.appendChild(trackOne);
      var trackTwo = document.createElement("option");
      trackTwo.value = "1";
      trackTwo.textContent = copy.trackTwo;
      trackSelect.appendChild(trackTwo);
      var trackItem = document.createElement("label");
      trackItem.className = "dsh-skin-duo-item";
      var trackLabel = document.createElement("span");
      trackLabel.className = "dsh-skin-duo-label";
      trackLabel.textContent = copy.track;
      trackItem.appendChild(trackLabel);
      trackItem.appendChild(trackSelect);

      var modeSelect = document.createElement("select");
      modeSelect.className = "dsh-skin-select";
      var modeSingle = document.createElement("option");
      modeSingle.value = "single";
      modeSingle.textContent = copy.modeSingle;
      modeSelect.appendChild(modeSingle);
      var modePlaylist = document.createElement("option");
      modePlaylist.value = "playlist";
      modePlaylist.textContent = copy.modePlaylist;
      modeSelect.appendChild(modePlaylist);
      var modeItem = document.createElement("label");
      modeItem.className = "dsh-skin-duo-item";
      var modeLabel = document.createElement("span");
      modeLabel.className = "dsh-skin-duo-label";
      modeLabel.textContent = copy.musicMode;
      modeItem.appendChild(modeLabel);
      modeItem.appendChild(modeSelect);

      musicDuo.appendChild(trackItem);
      musicDuo.appendChild(modeItem);
      panel.appendChild(musicDuo);

      var musicVolumeInput = rangeRow("musicVolume", copy.musicVolume, 0, 100);

      var langRow = document.createElement("div");
      langRow.className = "dsh-skin-row";
      var langLabelRow = document.createElement("div");
      langLabelRow.className = "dsh-skin-label";
      var langLabel = document.createElement("span");
      langLabel.textContent = copy.language;
      langLabelRow.appendChild(langLabel);
      langRow.appendChild(langLabelRow);
      var langSelect = document.createElement("select");
      langSelect.className = "dsh-skin-select";
      var langZh = document.createElement("option");
      langZh.value = "zh";
      langZh.textContent = "中文";
      var langEn = document.createElement("option");
      langEn.value = "en";
      langEn.textContent = "English";
      langSelect.appendChild(langZh);
      langSelect.appendChild(langEn);
      langRow.appendChild(langSelect);
      panel.appendChild(langRow);

      var actions = document.createElement("div");
      actions.className = "dsh-skin-actions";
      var replay = document.createElement("button");
      replay.type = "button";
      replay.textContent = copy.replay;
      var reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = copy.reset;
      actions.appendChild(replay);
      actions.appendChild(reset);
      panel.appendChild(actions);

      var error = document.createElement("div");
      error.className = "dsh-skin-error";
      error.hidden = true;
      panel.appendChild(error);

      var promoText = document.createElement("div");
      promoText.className = "dsh-skin-promo-text";
      var promoLink = document.createElement("a");
      promoLink.href = STEAM_URL;
      promoLink.target = "_blank";
      promoLink.rel = "noopener noreferrer";
      promoLink.textContent = copy.promoLink;
      promoText.appendChild(document.createTextNode(copy.promoText + " "));
      promoText.appendChild(promoLink);
      panel.appendChild(promoText);

      function eyeIcon(off) {
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "18");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.8");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("class", off ? "dsh-skin-eye-off" : "dsh-skin-eye-on");
        function addPath(d) {
          var path = document.createElementNS(ns, "path");
          path.setAttribute("d", d);
          svg.appendChild(path);
        }
        if (off) {
          addPath("M3 3l18 18");
          addPath("M10.6 6.4A10.7 10.7 0 0 1 12 6.2c6.4 0 9.8 5.8 9.8 5.8a17.6 17.6 0 0 1-3.1 3.8M6.5 6.7C3.7 8.6 2.2 12 2.2 12s3.4 5.8 9.8 5.8c1.3 0 2.5-.2 3.6-.7");
        } else {
          addPath("M2.2 12S5.6 6.2 12 6.2 21.8 12 21.8 12 18.4 17.8 12 17.8 2.2 12 2.2 12Z");
          var circle = document.createElementNS(ns, "circle");
          circle.setAttribute("cx", "12");
          circle.setAttribute("cy", "12");
          circle.setAttribute("r", "2.9");
          svg.appendChild(circle);
        }
        return svg;
      }

      var accountToggle = document.createElement("button");
      accountToggle.type = "button";
      accountToggle.className = "dsh-skin-account-toggle";
      accountToggle.style.left = "-9999px";
      accountToggle.style.top = "-9999px";
      accountToggle.setAttribute("aria-pressed", "false");
      accountToggle.appendChild(eyeIcon(false));
      accountToggle.appendChild(eyeIcon(true));
      accountToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        updateSettings({ accountHidden: !state.settings.accountHidden });
      });

      var fab = document.createElement("button");
      fab.type = "button";
      fab.className = "dsh-skin-fab";
      fab.title = copy.title;
      fab.setAttribute("aria-label", copy.title);
      fab.setAttribute("aria-expanded", "false");
      var logoImage = document.createElement("img");
      logoImage.src = route(LOGO_PATH);
      logoImage.alt = "";
      logoImage.draggable = false;
      logoImage.addEventListener("error", function () {
        if (!logoImage.parentNode) return;
        logoImage.remove();
        var fallback = document.createElement("span");
        fallback.className = "dsh-skin-fab-fallback";
        fallback.textContent = "⚙";
        fab.appendChild(fallback);
      });
      fab.appendChild(logoImage);

      launcher.appendChild(panel);
      launcher.appendChild(accountToggle);
      launcher.appendChild(fab);

      function setPanel(open) {
        panel.hidden = !open;
        fab.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) syncControls();
      }
      state.setPanel = setPanel;
      state.fab = fab;

      fab.addEventListener("click", function (event) {
        event.stopPropagation();
        setPanel(panel.hidden);
      });
      panel.addEventListener("click", function (event) {
        event.stopPropagation();
      });
      toggle.addEventListener("change", function () {
        setEnabled(toggle.checked);
        if (toggle.checked) startVideo();
      });
      darkToggle.addEventListener("change", function () {
        state.settings.darkGlass = darkToggle.checked;
        if (state.settings.darkGlass) ensureTheme();
        else restoreTheme();
        saveStore(state.settings);
      });
      paletteSelect.addEventListener("change", function () {
        state.settings.palette = paletteSelect.value;
        applyPalette();
        saveStore(state.settings);
      });
      opacityInput.addEventListener("input", function () {
        updateSettings({ opacity: Number(opacityInput.value) / 100 });
      });
      blurInput.addEventListener("input", function () {
        updateSettings({ blur: Number(blurInput.value) });
      });
      dimInput.addEventListener("input", function () {
        updateSettings({ dim: Number(dimInput.value) / 100 });
      });
      musicToggle.addEventListener("change", function () {
        state.settings.musicEnabled = musicToggle.checked;
        if (musicToggle.checked) startMusic();
        else stopMusic();
        saveStore(state.settings);
      });
      trackSelect.addEventListener("change", function () {
        selectTrack(trackSelect.value === "1" ? 1 : 0);
      });
      modeSelect.addEventListener("change", function () {
        setMusicMode(modeSelect.value);
      });
      musicVolumeInput.addEventListener("input", function () {
        updateSettings({ musicVolume: Number(musicVolumeInput.value) / 100 });
      });
      langSelect.addEventListener("change", function () {
        state.settings.lang = langSelect.value === "en" ? "en" : "zh";
        copy = state.settings.lang === "en" ? EN : ZH;
        saveStore(state.settings);
        rebuildLauncher(true);
      });
      replay.addEventListener("click", function () {
        if (!state.settings.enabled) setEnabled(true);
        if (state.video) {
          try { state.video.currentTime = 0; } catch (error) { /* noop */ }
          startVideo();
        }
      });
      reset.addEventListener("click", function () {
        state.failed = false;
        state.srcSet = false;
        if (state.layer) state.layer.removeAttribute("data-failed");
        if (state.video) {
          state.video.removeAttribute("src");
          try { state.video.load(); } catch (error) { /* noop */ }
        }
        var previousTheme = state.settings.themeBefore;
        var previousLang = state.settings.lang;
        state.settings = normalize(DEFAULTS);
        state.settings.themeBefore = previousTheme;
        state.settings.lang = previousLang;
        copy = state.settings.lang === "en" ? EN : ZH;
        state.trackIndex = state.settings.musicTrack;
        if (state.audio) {
          state.audio.volume = state.settings.musicVolume;
          state.audio.loop = state.settings.musicMode === "single";
        }
        applySurface();
        setEnabled(state.settings.enabled);
        syncControls();
        if (state.error) state.error.hidden = true;
      });

      return {
        launcher: launcher,
        panel: panel,
        fab: fab,
        accountToggle: accountToggle,
        toggle: toggle,
        darkToggle: darkToggle,
        paletteSelect: paletteSelect,
        opacityInput: opacityInput,
        blurInput: blurInput,
        dimInput: dimInput,
        musicToggle: musicToggle,
        trackSelect: trackSelect,
        modeSelect: modeSelect,
        musicVolumeInput: musicVolumeInput,
        langSelect: langSelect,
        error: error,
      };
    }

    function fetchConfigDefaults() {
      if (state.initialStored || state.configApplied) return;
      fetch(route("dsh-shenhai-skin/config.json"), { cache: "no-store" })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (document_) {
          if (!state.mounted || state.configApplied || state.initialStored) return;
          if (!document_ || !document_.defaults) return;
          state.configApplied = true;
          state.settings = normalize(Object.assign({}, state.settings, document_.defaults));
          applySurface();
          syncControls();
          saveStore(state.settings);
          if (state.settings.enabled) startVideo();
        })
        .catch(function () { /* the built-in defaults are already applied */ });
    }

    function rebuildLauncher(keepOpen) {
      var wasOpen = keepOpen === true || (state.panel !== null && !state.panel.hidden);
      if (state.launcher && state.launcher.parentNode) state.launcher.parentNode.removeChild(state.launcher);
      state.valueOutputs = {};
      var controls = buildLauncher();
      state.launcher = controls.launcher;
      state.panel = controls.panel;
      state.toggle = controls.toggle;
      state.darkToggle = controls.darkToggle;
      state.paletteSelect = controls.paletteSelect;
      state.opacityInput = controls.opacityInput;
      state.blurInput = controls.blurInput;
      state.dimInput = controls.dimInput;
      state.musicToggle = controls.musicToggle;
      state.trackSelect = controls.trackSelect;
      state.modeSelect = controls.modeSelect;
      state.musicVolumeInput = controls.musicVolumeInput;
      state.langSelect = controls.langSelect;
      state.error = controls.error;
      state.accountToggle = controls.accountToggle;
      document.body.appendChild(controls.launcher);
      syncControls();
      if (wasOpen && state.setPanel) state.setPanel(true);
    }

    function mount() {
      if (state.mounted) return;
      state.mounted = true;
      state.accountEyeOffset = null;

      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = styleText;
      (document.head || document.documentElement).appendChild(style);

      var built = buildLayer();
      state.layer = built.layer;
      state.video = built.video;
      document.body.appendChild(built.layer);

      var controls = buildLauncher();
      state.launcher = controls.launcher;
      state.panel = controls.panel;
      state.toggle = controls.toggle;
      state.darkToggle = controls.darkToggle;
      state.paletteSelect = controls.paletteSelect;
      state.opacityInput = controls.opacityInput;
      state.blurInput = controls.blurInput;
      state.dimInput = controls.dimInput;
      state.musicToggle = controls.musicToggle;
      state.trackSelect = controls.trackSelect;
      state.modeSelect = controls.modeSelect;
      state.musicVolumeInput = controls.musicVolumeInput;
      state.langSelect = controls.langSelect;
      state.error = controls.error;
      state.accountToggle = controls.accountToggle;
      document.body.appendChild(controls.launcher);
      watchAccountRow();

      var onDocumentClick = function () {
        if (state.panel && !state.panel.hidden && state.setPanel) state.setPanel(false);
      };
      var onDocumentKey = function (event) {
        if (event.key === "Escape" && state.panel && !state.panel.hidden && state.setPanel) state.setPanel(false);
      };
      document.addEventListener("click", onDocumentClick);
      document.addEventListener("keydown", onDocumentKey);
      state.cleanup.push(function () {
        document.removeEventListener("click", onDocumentClick);
        document.removeEventListener("keydown", onDocumentKey);
      });

      applySurface();
      syncControls();
      if (state.settings.enabled) setEnabled(true);
      fetchConfigDefaults();

      var observer = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          if (records[i].attributeName === "data-ds-dark-theme") {
            applySurface();
            break;
          }
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
      state.themeObserver = observer;

      var onVisibility = function () {
        if (document.hidden) stopVideo();
        else if (state.settings.enabled) startVideo();
      };
      document.addEventListener("visibilitychange", onVisibility);
      state.cleanup.push(function () {
        document.removeEventListener("visibilitychange", onVisibility);
      });
    }

    function teardown() {
      if (state.frame) {
        window.cancelAnimationFrame(state.frame);
        state.frame = 0;
      }
      stopVideo();
      stopMusic();
      if (state.audio && state.audio.parentNode) state.audio.parentNode.removeChild(state.audio);
      state.audio = null;
      clearPalette();
      if (state.accountRaf) {
        window.cancelAnimationFrame(state.accountRaf);
        state.accountRaf = 0;
      }
      if (state.accountResize) {
        state.accountResize.disconnect();
        state.accountResize = null;
        state.accountResizeTargets = null;
      }
      if (state.themeObserver) state.themeObserver.disconnect();
      if (state.layer && state.layer.parentNode) state.layer.parentNode.removeChild(state.layer);
      if (state.launcher && state.launcher.parentNode) state.launcher.parentNode.removeChild(state.launcher);
      var style = document.getElementById(STYLE_ID);
      if (style && style.parentNode) style.parentNode.removeChild(style);
      document.documentElement.removeAttribute("data-dsh-skin");
      document.documentElement.classList.remove("dsh-skin-account-hidden");
      document.documentElement.style.removeProperty("--dsh-skin-alpha");
      document.documentElement.style.removeProperty("--dsh-skin-blur");
      document.documentElement.style.removeProperty("--dsh-skin-dim");
      document.documentElement.style.removeProperty("--dsh-skin-base");
      for (var i = 0; i < state.cleanup.length; i++) {
        try { state.cleanup[i](); } catch (error) { /* noop */ }
      }
      state.cleanup = [];
      state.mounted = false;
    }

    function apply(ctx) {
      state.theme = ctx && ctx.theme ? ctx.theme : null;
      ctx.effect(function () {
        if (document.body) {
          mount();
        } else {
          document.addEventListener("DOMContentLoaded", mount, { once: true });
        }
        return teardown;
      }, "shenhai-skin: video wallpaper");
    }

    return {
      name: NAME,
      inject: ["theme"],
      apply: apply,
    };
  },
});
