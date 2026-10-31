import { createApp } from '../server/app.js';
import { db } from '../server/database/db.js';

async function testBackend() {
  console.log('--- Testing Uzhavan Hub Backend & Relational Database ---');
  const app = await createApp();
  console.log('App created successfully!');

  // Test database queries
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  console.log('Seeded Users in DB:', userCount.count);

  const plots = await db.query('SELECT * FROM land_plots');
  console.log('Seeded Land Plots in DB:', plots.rowCount);
  plots.rows.forEach(p => {
    console.log(` - Plot: ${p.plot_name} (${p.area_acres} ac, ${p.soil_type}, Current: ${p.current_crop})`);
  });

  const posts = await db.query('SELECT * FROM community_posts');
  console.log('Community Posts in DB:', posts.rowCount);

  console.log('All backend checks passed cleanly!');
  process.exit(0);
}

testBackend().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
