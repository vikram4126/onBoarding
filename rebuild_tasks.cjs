const fs = require('fs');

const data = [];

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

// --- DAY 1 ---
// Checklist
addTask("Day 1", "Confirm receipt of the employment contract", "If you have not received your contract, please contact your HR point of contact. Meet with your Buddy and the team.", "Kommence");
addTask("Day 1", "Submit new joiner kit forms", "Submit contract and 2 passport sized photographs.", "HR Portal");
addTask("Day 1", "Submit form for access card", "Submit as instructed by the local administration team and you will receive your access card on day one/two. Your customized access card will be ready within 4-5 working days.", "General");
addTask("Day 1", "Collect your laptop and login ID", "Collect from the IT helpdesk. If not done so on day one, ensure to do it on day two. In case of any difficulty please contact the local IT team.", "IT Setup");
addTask("Day 1", "Finalize salary account bank", "Finalize on the bank that you would like to have your salary account with.", "Salary & Investment");
// Ganesh
addTask("Day 1", "Received Office ID card and Building ID card from reception", "", "Kommence");
addTask("Day 1", "Team building", "Intro to each other and some team building activities", "Kommence");
addTask("Day 1", "Intro to KPMG and Values", "", "Training");
addTask("Day 1", "HR Induction", "", "Training");
addTask("Day 1", "Admin Induction", "", "Training");
addTask("Day 1", "Finance Induction", "", "Training");

// --- DAY 2 ---
// Checklist
addTask("Day 2", "Check reporting office/team", "Check with your Buddy or HR point of contact on your reporting office/ team from day two/three onwards.", "General");
addTask("Day 2", "Review 'Welcome to KPMG' e-mail", "Review the welcome e-mail which you would have received from the HR team.", "HR Portal");
addTask("Day 2", "Visit the 'My Onboarding' page", "Visit the page on the HR intranet (KPMG intranet home page > Human resources > My onboarding) to familiarize yourself with the Firm.", "General");
addTask("Day 2", "Set up your e-mail signature", "Set up your e-mail signature using the guidelines provided in the welcome mail.", "IT Setup");
addTask("Day 2", "Get Skype set up", "Go through the 'Instant Messenger Policy Training' on the intranet. Once completed write to IN-FM IT Training to get access.", "IT Setup");
// Ganesh
addTask("Day 2", "Update details in K-Pass (for ID card)", "", "General");
addTask("Day 2", "Received ID card", "", "General");
addTask("Day 2", "Document submission process", "Update details and upload documents related to education, experience, AADHAAR, PAN etc. in Pichainlabs portal.", "HR Portal");
addTask("Day 2", "TalentKonnect - personal details update", "", "HR Portal");
addTask("Day 2", "Update your Bank Account details under TalentKonnect", "", "HR Portal");
addTask("Day 2", "Update your Mobile phone number, Home phone number and address on TalentKonnect", "", "HR Portal");

// --- DAY 3 --- (Including Ganesh Day 4)
// Ganesh
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
addTask("Day 3", "Employee Nomination Form", "Update Nominees (Term Life Insurance, Personal Accident Insurance, Heath Insurance claims/Reimbursement if any, Full and Final Settlement, Any other legitimate due(s))", "HR Portal");
addTask("Day 3", "UK Email ID password change and AVD setup", "", "IT Setup");

// --- WEEK 1 ---
// Checklist
addTask("Week 1", "Complete Risk Management trainings", "Complete trainings mentioned under Risk Management tab in the Welcome email. Independence training is required within 14 days of joining.", "Mandatory Training");
addTask("Week 1", "Meet with your Performance manager", "Initial meeting with your Performance manager.", "General");
addTask("Week 1", "Update Intellego details", "Update your personal details and KPMG resume on Intellego.", "HR Portal");
addTask("Week 1", "Understand the Open PD process", "Intranet > Human resources > Open Performance Development.", "HR Portal");
addTask("Week 1", "Order business cards & stationery", "Order business cards through the KPMG Intranet portal and stationery on KPMG Support Central.", "General");
addTask("Week 1", "Submit Form 2 (revised) and EPFO form", "Submit to the Finance team. Please also attach a copy of your PAN card with these forms.", "Statutory Compliance");

// --- WEEK 2 ---
// Ganesh (Week 2 & 3 combined into Week 2)
addTask("Week 2", "New Joiner Orientation on Systems, PF, Policies & Online", "45 Min via Teams", "Training");
addTask("Week 2", "Brand Training", "(1 hour) given by Kubendran", "Training");
addTask("Week 2", "Internal PPT assignment", "", "Training");
addTask("Week 2", "Insurance details update", "", "HR Portal");

// --- FIRST MONTH ---
// Checklist (formerly Week 4)
addTask("First Month", "Finalise your goals on the system", "Meet with your performance manager and finalise your goals on the system.", "General");
addTask("First Month", "Submit New Joiner Independence Confirmation Affidavit", "Complete the risk trainings as per timelines and submit the affidavit within 30 days of joining.", "Mandatory Training");
addTask("First Month", "Ensure you have gone through the staff manual", "Ensure you have gone through the staff manual and the Onboarding page.", "General");
addTask("First Month", "Attend the KPMG Induction", "Attend the KPMG Induction at your location if not done when you joined.", "Mandatory Training");
addTask("First Month", "Understand your development journey", "Go through the KPMG Business School page and understand your development journey.", "Training");

// --- SECOND MONTH ---
// Dummy Data
addTask("Second Month", "Check in with your Buddy", "Schedule a quick coffee chat with your buddy to review your first month.", "General");
addTask("Second Month", "Complete advanced role-specific training", "Enroll and complete any secondary learning modules required for your team.", "Training");
addTask("Second Month", "Participate in team-building event", "Join your department's quarterly team building or townhall.", "General");

fs.writeFileSync('./src/data/onboarding.json', JSON.stringify(data, null, 2));

console.log("Done");
