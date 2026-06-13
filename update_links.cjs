const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/onboarding.json', 'utf8'));

data.forEach(day => {
  day.tasks.forEach(task => {
    const titleLower = task.title.toLowerCase();
    const descLower = task.description ? task.description.toLowerCase() : '';
    const text = titleLower + " " + descLower;
    
    // GLMS
    if (text.includes('glms')) {
      task.portalId = 'glms';
    }
    
    // Salary and investment -> HGS
    if (titleLower.includes('salary') || titleLower.includes('investment') || descLower.includes('salary') || descLower.includes('investment')) {
      task.portalId = 'hgs';
    }
    
    // HR mail link
    if (
      titleLower.includes(' hr ') || descLower.includes(' hr ') ||
      titleLower.includes('hr portal') || descLower.includes('hr portal') ||
      titleLower.includes('hr point of contact') || descLower.includes('hr point of contact') ||
      titleLower.includes('hr induction') ||
      task.category === 'HR Portal' ||
      titleLower.includes('hr team') || descLower.includes('hr team')
    ) {
      task.contactId = 'hr';
    }
  });
});

fs.writeFileSync('./src/data/onboarding.json', JSON.stringify(data, null, 2));
console.log('Done');
