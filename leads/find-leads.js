/**
 * Braylen Digital — Lead Finder
 * Uses Apify Google Maps Scraper to find local businesses in the
 * Plainfield / Indianapolis, IN area that may need web design services.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { ApifyClient } = require('apify-client');
const fs = require('fs');
const path = require('path');

const APIFY_API_KEY = process.env.APIFY_API_KEY;

if (!APIFY_API_KEY) {
  console.error('Missing APIFY_API_KEY. Copy .env and fill it in.');
  process.exit(1);
}

const client = new ApifyClient({ token: APIFY_API_KEY });

// Business categories likely to need a new/better website
const SEARCH_QUERIES = [
  'restaurants in Plainfield Indiana',
  'salons in Plainfield Indiana',
  'auto repair Plainfield Indiana',
  'landscaping Plainfield Indiana',
  'plumbers Plainfield Indiana',
  'electricians Plainfield Indiana',
  'dentists Plainfield Indiana',
  'real estate agents Plainfield Indiana',
  'gyms Plainfield Indiana',
  'contractors Plainfield Indiana',
];

const MAX_RESULTS_PER_QUERY = 20;

async function findLeads() {
  console.log('Starting Apify Google Maps Scraper run...\n');

  const { defaultDatasetId, id: runId } = await client.actor('compass/crawler-google-places').call({
    searchStringsArray: SEARCH_QUERIES,
    maxCrawledPlacesPerSearch: MAX_RESULTS_PER_QUERY,
    language: 'en',
    exportPlaceUrls: false,
    additionalInfo: false,
    includeWebResults: true,
  });

  console.log(`Run ID: ${runId}`);
  console.log(`Dataset ID: ${defaultDatasetId}\n`);

  // Fetch results
  const { items } = await client.dataset(defaultDatasetId).listItems();
  console.log(`Total places scraped: ${items.length}\n`);

  // Filter and score leads
  const leads = items
    .filter(place => place.title && place.phone)
    .map(place => ({
      name: place.title,
      category: place.categoryName || '',
      address: place.address || '',
      phone: place.phone || '',
      website: place.website || null,
      rating: place.totalScore || null,
      reviewCount: place.reviewsCount || 0,
      googleMapsUrl: place.url || '',
      // Priority: no website = hot lead; has website = warm lead for redesign
      priority: !place.website ? 'HOT — No website' : 'WARM — Has website (redesign candidate)',
    }))
    .sort((a, b) => {
      // Sort hot leads first, then by review count (more reviews = more established)
      if (a.priority.startsWith('HOT') && !b.priority.startsWith('HOT')) return -1;
      if (!a.priority.startsWith('HOT') && b.priority.startsWith('HOT')) return 1;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

  const hotLeads = leads.filter(l => l.priority.startsWith('HOT'));
  const warmLeads = leads.filter(l => l.priority.startsWith('WARM'));

  console.log(`HOT leads (no website): ${hotLeads.length}`);
  console.log(`WARM leads (has website): ${warmLeads.length}\n`);

  // Save to CSV
  const csvPath = path.join(__dirname, 'leads.csv');
  const csvHeader = 'Priority,Name,Category,Phone,Address,Website,Rating,Reviews,Google Maps\n';
  const csvRows = leads.map(l =>
    [
      l.priority,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      l.phone,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      l.website || '',
      l.rating || '',
      l.reviewCount,
      l.googleMapsUrl,
    ].join(',')
  ).join('\n');

  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`Leads saved to: ${csvPath}`);

  // Print preview of hot leads
  if (hotLeads.length > 0) {
    console.log('\n--- TOP HOT LEADS (no website) ---');
    hotLeads.slice(0, 10).forEach((l, i) => {
      console.log(`\n${i + 1}. ${l.name}`);
      console.log(`   Category : ${l.category}`);
      console.log(`   Phone    : ${l.phone}`);
      console.log(`   Address  : ${l.address}`);
      console.log(`   Reviews  : ${l.reviewCount} (${l.rating || 'N/A'} stars)`);
    });
  }
}

findLeads().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
