const playwright = require('playwright');

async function scrapeIndeed() {
  console.log('Lancement du scraping d\'Indeed...');
  let browser = null;
  try {
    // Lancement du navigateur avec des options pour les environnements cloud
    browser = await playwright.chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    console.log('Navigation vers la page d\'Indeed France...');
    await page.goto('https://fr.indeed.com/jobs?q=d%C3%A9veloppeur&l=France', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Page chargée. Attente des sélecteurs...');

    // Attendre que les cartes d'offres soient bien présentes
    await page.waitForSelector('.job_seen_beacon', { timeout: 30000 });
    console.log('Cartes d\'offres trouvées.');

    const jobs = await page.evaluate(() => {
      const jobCards = Array.from(document.querySelectorAll('.job_seen_beacon'));
      const jobData = [];

      jobCards.slice(0, 15).forEach(card => {
        const title = card.querySelector('h2.jobTitle a span')?.innerText;
        const company = card.querySelector('span.companyName')?.innerText;
        const location = card.querySelector('div.companyLocation')?.innerText;
        const url = 'https://fr.indeed.com' + card.querySelector('h2.jobTitle a')?.getAttribute('href');

        if (title && company && location && url) {
          jobData.push({
            title,
            company,
            location,
            country: 'France',
            source: 'Indeed France',
            url,
            description: '', // La description sera récupérée plus tard
            posted_at: new Date().toISOString().split('T')[0] // Date du jour
          });
        }
      });
      return jobData;
    });

    console.log(`Scraping terminé. ${jobs.length} offres trouvées.`);
    await browser.close();
    return jobs;

  } catch (error) {
    console.error('ERREUR MAJEURE PENDANT LE SCRAPING:', error);
    if (browser) {
      await browser.close();
    }
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

module.exports = { scrapeIndeed };
