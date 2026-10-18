import { chromium } from 'playwright';

async function launchConfinedBrowser() {
    // Headless mode is mandatory for GitHub Actions environments
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Intercept outbound network requests
    await page.route('**/*', async (route) => {
        const request = route.request();
        console.log(`[Network Monitor] Request intercepted to URL: ${request.url()}`);
        return route.continue();
    });

    console.log('[*] Navigating sandbox browser to verification target...');
    // Replace with the specific URL endpoint you are authorized to test
    await page.goto('https://example.com'); 

    console.log('[+] Evaluation run completed successfully.');
    await browser.close();
    process.exit(0);
}

launchConfinedBrowser().catch(err => {
    console.error('[-] Sandbox script failed:', err);
    process.exit(1);
});
