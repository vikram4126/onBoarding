const fs = require('fs');
const path = './src/data/onboarding.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const getPortalId = (task) => {
  const title = task.title.toLowerCase();
  if (title.includes('id card') || title.includes('reception')) return undefined;
  
  switch(task.category) {
    case 'Mandatory Training':
    case 'Required Training':
      return 'glms';
    case 'IT Setup':
      return 'kites';
    case 'Salary & Investment':
      return 'hgs';
    case 'HR Portal':
      return 'talentKonnect';
    case 'Kommence':
      return 'rekonnect';
    case 'General':
      return 'jobTrack';
    case 'Statutory Compliance':
      return 'glms'; // just adding some random
    case 'Affidavit':
      return 'rekonnect'; 
    default:
      return undefined;
  }
};

data.forEach(day => {
  day.tasks.forEach(task => {
    const portalId = getPortalId(task);
    if (portalId) {
      task.portalId = portalId;
    } else {
      // make sure to delete if it was incorrectly mapped before, though it wasn't
      delete task.portalId;
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Done updating onboarding.json');
