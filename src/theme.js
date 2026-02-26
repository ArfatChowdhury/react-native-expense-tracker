// ─────────────────────────────────────────────────────────────
//  Wallety Design System – Dark Glassmorphism Theme
// ─────────────────────────────────────────────────────────────

export const COLORS = {
    // Backgrounds
    bg: '#0a0a14',
    bgCard: 'rgba(255,255,255,0.05)',
    bgCardBorder: 'rgba(255,255,255,0.10)',
    bgCardStrong: 'rgba(255,255,255,0.09)',

    // Accent
    accent: '#00f59b',        // electric green
    accentDim: 'rgba(0,245,155,0.15)',
    accentBorder: 'rgba(0,245,155,0.4)',

    // Red (expenses)
    danger: '#ff5a5a',
    dangerDim: 'rgba(255,90,90,0.15)',
    dangerBorder: 'rgba(255,90,90,0.4)',

    // Blue (edit)
    blue: '#60a5fa',
    blueDim: 'rgba(96,165,250,0.15)',

    // Text
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#475569',

    // Gradient stops
    gradBg: ['#0a0a14', '#0d1320'],
    gradGreen: ['#052e16', '#064e3b'],
    gradRed: ['#3b0000', '#450a0a'],
    gradBalance: ['#0f2027', '#1a1a2e', '#0f3460'],
    gradAccent: ['#00f59b', '#00d4aa'],
    gradBlue: ['#1e1b4b', '#312e81'],
}

export const GLASS = {
    card: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 20,
    },
    cardSmall: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 14,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 14,
        color: '#f1f5f9',
    },
    inputFocused: {
        borderColor: '#00f59b',
    },
}

export const SHADOW = {
    glow: {
        shadowColor: '#00f59b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
}
