const { chromium } = require('playwright');

const scrapeIndeed = async () => {
  console.log('Lancement du scraping pour Indeed.fr...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const searchUrl = 'https://fr.indeed.com/jobs?q=d%C3%A9veloppeur&l=France&from=searchOnHP';
    await page.goto(searchUrl, { waitUntil: 'networkidle' } ); // On attend que la page soit bien chargée
    console.log(`Page ${searchUrl} chargée.`);

    // Gérer la pop-up de consentement aux cookies si elle apparaît
    const cookiePopupSelector = '#onetrust-accept-btn-handler';
    if (await page.isVisible(cookiePopupSelector)) {
      console.log('Pop-up de cookies détectée. Clic sur Accepter.');
      await page.click(cookiePopupSelector);
      // Attendre un peu que la pop-up disparaisse
      await page.waitForTimeout(2000); 
    }

    // On attend que la liste des offres soit bien présente sur la page
    await page.waitForSelector('ul.jobsearch-ResultsList');

    // On récupère toutes les "cartes" d'offres d'emploi
    const jobCards = await page.$$('div.job_seen_beacon');
    console.log(`${jobCards.length} offres trouvées sur la page.`);

    const scrapedJobs = [];

    // On boucle sur chaque carte pour extraire les informations
    for (const card of jobCards) {
      let title = null, company = null, location = null, url = null;

      // Utiliser .evaluate pour éviter les problèmes de contexte
      const jobData = await card.evaluate(node => {
        const titleEl = node.querySelector('h2.jobTitle > a');
        const companyEl = node.querySelector('span[data-testid="company-name"]');
        const locationEl = node.querySelector('div[data-testid="text-location"]');
        
        return {
          title: titleEl ? titleEl.innerText : null,
          company: companyEl ? companyEl.innerText : null,
          location: locationEl ? locationEl.innerText : null,
          url: titleEl ? titleEl.href : null,
        };
      });

      // On ajoute les données extraites à notre tableau, si le titre existe
      if (jobData.title) {
        scrapedJobs.push({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          url: jobData.url,
          source: 'Indeed France',
          country: 'France'
        });
      }
    }
    
    console.log(`${scrapedJobs.length} offres extraites avec succès.`);
    return scrapedJobs;

  } catch (error) {
    console.error('Une erreur est survenue durant le scraping :', error);
    return [];
  } finally {
    await browser.close();
    console.log('Navigateur fermé. Scraping terminé pour Indeed.fr.');
  }
};

module.exports = {
  scrapeIndeed,
};
