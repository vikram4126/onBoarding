const fs = require('fs');
const onboardingData = JSON.parse(fs.readFileSync('./src/data/onboarding.json', 'utf8'));

let rows = [];

onboardingData.forEach(day => {
  day.tasks.forEach(task => {
    rows.push(`    { Day: '${day.day}', Title: '${task.title.replace(/'/g, "\\'")}', Description: '${(task.description || '').replace(/'/g, "\\'")}', Category: '${task.category || 'General'}', Link: '${task.url || ''}', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '${task.contactId || ''}', PortalId: '${task.portalId || ''}' }`);
  });
});

console.log('  Common: [');
console.log(rows.join(',\n'));
console.log('  ],');
