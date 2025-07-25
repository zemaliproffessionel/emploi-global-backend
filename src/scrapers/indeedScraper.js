const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeIndeed() {
  console.log('[Scraper Léger] Lancement du scraping d\'Indeed...');
  try {
    const url = 'https://fr.indeed.com/jobs?q=d%C3%A9veloppeur&l=France';
        
    // Utiliser axios pour télécharger le HTML de la page
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log('[Scraper Léger] Page HTML téléchargée.');

    // Utiliser cheerio pour "lire" le HTML
    const $ = cheerio.load(data);
    const jobData = [];

    // La structure d'Indeed est complexe, on cible les scripts qui contiennent les données
    const scripts = $('script[type="text/javascript"]');
    let jobResults = null;

    scripts.each((i, el) => {
      const scriptContent = $(el).html();
      if (scriptContent && scriptContent.includes('jobsearch.mosaic.provider.jobcards.mosaic-provider-jobcards')) {
        const match = scriptContent.match(/window.mosaic.providerData\["mosaic-provider-jobcards"\]\s*=\s*({.+});/);
        if (match && match[1]) {
          jobResults = JSON.parse(match[1]);
        }
      }
    });

    if (jobResults && jobResults.results) {
        console.log(`[Scraper Léger] Données JSON trouvées. Traitement de ${jobResults.results.length} offres.`);
        jobResults.results.forEach(job => {
            jobData.push({
                title: job.title,
                company: job.company,
                location: job.location,
                country: 'France',
                source: 'Indeed France',
                url: `https://fr.indeed.com/voir-emploi?jk=${job.jobkey}`,
                description: job.snippet?.replace(/<[^>]*>/g, '') || '', // Nettoyer le snippet
                posted_at: new Date().toISOString().split('T')[0]
            });
        });
    } else {
        console.log('[Scraper Léger] Impossible de trouver les données JSON des offres.');
    }

    console.log(`[Scraper Léger] Scraping terminé. ${jobData.length} offres trouvées.`);
    return jobData;

  } catch (error) {
    console.error('[Scraper Léger] ERREUR MAJEURE:', error.message);
    return [];
  }
}

module.exports = { scrapeIndeed };
