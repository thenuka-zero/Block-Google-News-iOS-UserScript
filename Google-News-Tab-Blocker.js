// ==UserScript==
// @name         Block Google News Search (iOS)
// @description  Blocks Google News searches with a styled blocking page
// @match        *://www.google.com/*
// @match        *://google.com/*
// @match        *://www.google.co.uk/*
// @match        *://www.google.ca/*
// @match        *://www.google.com.au/*
// @inject-into  content
// ==/UserScript==

function createBlockerOverlay() {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: '#2563eb', // Nice blue color
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '999999'
    });

    // Create "BLOCKED" text
    const text = document.createElement('div');
    Object.assign(text.style, {
        color: 'white',
        fontSize: '48px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontWeight: '300', // Light weight for smoothness
        marginBottom: '30px',
        textTransform: 'uppercase',
        letterSpacing: '4px'
    });
    text.textContent = 'blocked';

    // Create "Go Back" button
    const button = document.createElement('button');
    Object.assign(button.style, {
        backgroundColor: 'white',
        color: '#2563eb',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontWeight: '500',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease'
    });
    button.textContent = 'Go Back';

    // Add hover effect
    button.onmouseover = () => {
        button.style.transform = 'scale(1.05)';
    };
    button.onmouseout = () => {
        button.style.transform = 'scale(1)';
    };

    // Add click handler
    button.onclick = () => {
        window.history.back();
    };

    overlay.appendChild(text);
    overlay.appendChild(button);
    document.documentElement.appendChild(overlay);
}

function blockNewsSearch() {
    // Get current URL
    const url = new URL(window.location.href);
    
    // Check if it's a search page
    if (!url.pathname.includes('/search')) {
        return;
    }
    
    // Check for news search indicators
    const tbm = url.searchParams.get('tbm');
    const tbs = url.searchParams.get('tbs');
    const isNewsSearch = tbm === 'nws' || 
                        (tbs && tbs.includes('cdr:1')) || 
                        url.pathname.includes('/news');
    
    if (isNewsSearch) {
        // Hide the entire body content
        document.body.style.visibility = 'hidden';
        
        // Show blocker overlay
        createBlockerOverlay();
    }
}

// Run as early as possible
if (document.readyState === 'loading') {
    // Add inline style to hide content immediately
    const style = document.createElement('style');
    style.textContent = 'body { visibility: hidden !important; }';
    document.documentElement.appendChild(style);
    
    document.addEventListener('DOMContentLoaded', blockNewsSearch);
} else {
    blockNewsSearch();
}
