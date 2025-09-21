// fc-lc.xyz Redirect Content Script
// Works on fc-lc.xyz domain

interface RedirectScript {
    REDIRECT_URL: string;
    MIN_DWELL_MS: number;
    MIN_SCORE: number;
    REQ_TYPES: number;
}

interface ProgressElements {
    prog: HTMLElement | null;
    status: HTMLElement | null;
}

(function(): void {
    function bypassRedirect(): void {
        // Get progress elements
        const elements: ProgressElements = {
            prog: document.getElementById('prog'),
            status: document.getElementById('status')
        };

        // Log current progress
        if (elements.prog) {
            console.log('Current progress:', elements.prog.style.width);
        }
        if (elements.status) {
            console.log('Current status:', elements.status.textContent);
        }

        // Extract redirect URL from script
        const scripts: NodeListOf<HTMLScriptElement> = document.querySelectorAll('script');
        let redirectUrl: string = '';

        scripts.forEach((script: HTMLScriptElement) => {
            if (script.textContent?.includes('REDIRECT_URL')) {
                const match: RegExpMatchArray | null = script.textContent.match(/REDIRECT_URL\s*=\s*"([^"]+)"/);
                if (match && match[1]) {
                    redirectUrl = match[1];
                }
            }
        });

        if (!redirectUrl) {
            console.error('Redirect URL not found in scripts');
            return;
        }

        console.log('Final redirect URL:', redirectUrl);
        console.log('Bypassing redirect mechanism...');

        // Redirect immediately
        window.location.replace(redirectUrl);
    }

    // Run the bypass
    bypassRedirect();
})();
