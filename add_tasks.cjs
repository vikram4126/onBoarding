const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/onboarding.json', 'utf8'));

// Helper to push tasks safely
const addTask = (dayStr, title, description, category) => {
  let dayEntry = data.find(d => d.day === dayStr);
  if (!dayEntry) {
    dayEntry = { day: dayStr, tasks: [] };
    data.push(dayEntry);
  }
  dayEntry.tasks.push({
    id: `onb_${dayStr.replace(/\s+/g, '').toLowerCase()}_${dayEntry.tasks.length + 1}`,
    title,
    description,
    category,
    status: 'pending'
  });
};

// Day 1
addTask("Day 1", "Received Office ID card and Building ID card from reception", "", "Kommence");
addTask("Day 1", "Team building", "Intro to each other and some team building activities", "Kommence");
addTask("Day 1", "Intro to KPMG and Values", "", "Training");
addTask("Day 1", "HR Induction", "", "Training");
addTask("Day 1", "Admin Induction", "", "Training");
addTask("Day 1", "Finance Induction", "", "Training");

// Day 2
addTask("Day 2", "Update details in K-Pass (for ID card)", "", "General");
addTask("Day 2", "Received ID card", "", "General");
addTask("Day 2", "Document submission process", "Update details and upload documents related to education, experience, AADHAAR, PAN etc. in Pichainlabs portal.", "HR Portal");
addTask("Day 2", "TalentKonnect - personal details update", "", "HR Portal");
addTask("Day 2", "Update your Bank Account details under TalentKonnect", "", "HR Portal");
addTask("Day 2", "Update your Mobile phone number, Home phone number and address on TalentKonnect", "", "HR Portal");

// Day 3
addTask("Day 3", "Sign employement contract via AADHAAR based digital sign", "Received email from Pichainlabs to sign employement contract via AADHAAR based digital sign", "HR Portal");
addTask("Day 3", "Salary structure and Investment declaration", "NEW JOINER KIT-HGS Portal login", "Salary & Investment");
addTask("Day 3", "Mandatory - Statutory Compliance Portal", "Received an email from IN-FM Power Platform to update PF Form-11, LWF/ESIC", "Statutory Compliance");
addTask("Day 3", "New Joiner Independence Training", "Personal Independence 2024/25 India (GLMS Portal)", "Mandatory Training");
addTask("Day 3", "Building Public Trust - Independence and Conflicts of Interest", "Client Facing (GLMS Portal)", "Mandatory Training");
addTask("Day 3", "Building Public Trust - Our Code", "(GLMS Portal)", "Mandatory Training");
addTask("Day 3", "GBH_KGS_Financial Crime_2025", "(GLMS Portal)", "Mandatory Training");
addTask("Day 3", "GBH_KGS_Protecting Information_2025", "(GLMS Portal)", "Mandatory Training");
addTask("Day 3", "New Joiner Mandatory Risk Trainings", "Due in 28 days (KGS) (GLMS Portal)", "Mandatory Training");
addTask("Day 3", "Information Protection and Data Privacy Fundamentals 2025 Global Training", "(GLMS Portal)", "Mandatory Training");
addTask("Day 3", "Prevention of Sexual Harassment at Workplace - 2025", "(GLMS Portal)", "Mandatory Training");
addTask("Day 3", "Complying with Sanctions", "(GLMS Portal)", "Mandatory Training");
addTask("Day 3", "Essential HR policy and guidelines", "(GLMS Portal)", "Training");
addTask("Day 3", "Inclusion, Diversity and Equity at KGS", "(GLMS Portal)", "Training");
addTask("Day 3", "KGS BCP Training", "(GLMS Portal)", "Training");
addTask("Day 3", "KGS Risk and Data Management", "(GLMS Portal)", "Training");
addTask("Day 3", "Our Workplace Facilities and Policies", "(GLMS Portal)", "Training");
addTask("Day 3", "Corporate Social Responsibility", "(GLMS Portal)", "Training");
addTask("Day 3", "ESG 101 - Foundations - Now is the time (Module 1)", "(GLMS Portal)", "Training");
addTask("Day 3", "ESG 101 - Foundations - Time for Impact (Module 2)", "(GLMS Portal)", "Training");

// Day 4
addTask("Day 4", "Employee Nomination Form", "Update Nominees (Term Life Insurance, Personal Accident Insurance, Heath Insurance claims/Reimbursement if any, Full and Final Settlement, Any other legitimate due(s))", "HR Portal");
addTask("Day 4", "UK Email ID password change and AVD setup", "", "IT Setup");

// Week 2
addTask("Week 2", "New Joiner Orientation on Systems, PF, Policies & Online", "45 Min via Teams", "Training");
addTask("Week 2", "Brand Training", "(1 hour) given by Kubendran", "Training");
addTask("Week 2", "Internal PPT assignment", "", "Training");

// Week 3
addTask("Week 3", "Insurance details update", "", "HR Portal");

// Sort days so they're in order: Day 1, Day 2, Day 3, Day 4, Week 1, Week 2, Week 3, Week 4
const getPeriodSortIndex = (periodStr) => {
  if (periodStr === 'Day 1') return 1;
  if (periodStr === 'Day 2') return 2;
  if (periodStr === 'Day 3') return 3;
  if (periodStr === 'Day 4') return 4;
  if (periodStr === 'Week 1') return 5;
  if (periodStr === 'Week 2') return 6;
  if (periodStr === 'Week 3') return 7;
  if (periodStr === 'Week 4') return 8;
  return 99;
};

data.sort((a, b) => getPeriodSortIndex(a.day) - getPeriodSortIndex(b.day));

fs.writeFileSync('./src/data/onboarding.json', JSON.stringify(data, null, 2));

console.log("Done");
