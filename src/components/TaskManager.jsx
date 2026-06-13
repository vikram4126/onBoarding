import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, CheckCircle2, AlertTriangle, FileSpreadsheet, Info } from 'lucide-react';
import { setStorage, STORAGE_KEYS } from '../utils/storage';

const DEPARTMENTS = ['Common', 'Development', 'HR', 'Finance', 'QA', 'Design', 'IT Support', 'Marketing'];

const COLUMNS = ['Day', 'Title', 'Description', 'Category', 'Link', 'ProjectCode', 'TaskCode', 'DeadlineDay', 'ContactId', 'PortalId'];

const SAMPLE_DATA = {
    Common: [
    { Day: 'Day 1', Title: 'Confirm receipt of the employment contract', Description: 'If you have not received your contract, please contact your HR point of contact. Meet with your Buddy and the team.', Category: 'Kommence', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 1', Title: 'Submit new joiner kit forms', Description: 'Submit contract and 2 passport sized photographs.', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 1', Title: 'Submit form for access card', Description: 'Submit as instructed by the local administration team and you will receive your access card on day one/two. Your customized access card will be ready within 4-5 working days.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 1', Title: 'Collect your laptop and login ID', Description: 'Collect from the IT helpdesk. If not done so on day one, ensure to do it on day two. In case of any difficulty please contact the local IT team.', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 1', Title: 'Finalize salary account bank', Description: 'Finalize on the bank that you would like to have your salary account with.', Category: 'Salary & Investment', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'hgs' },
    { Day: 'Day 1', Title: 'Received Office ID card and Building ID card from reception', Description: '', Category: 'Kommence', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 1', Title: 'Team building', Description: 'Intro to each other and some team building activities', Category: 'Kommence', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 1', Title: 'Intro to KPMG and Values', Description: '', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 1', Title: 'HR Induction', Description: '', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 1', Title: 'Admin Induction', Description: '', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 1', Title: 'Finance Induction', Description: '', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 2', Title: 'Check reporting office/team', Description: 'Check with your Buddy or HR point of contact on your reporting office/ team from day two/three onwards.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 2', Title: 'Review \'Welcome to KPMG\' e-mail', Description: 'Review the welcome e-mail which you would have received from the HR team.', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 2', Title: 'Visit the \'My Onboarding\' page', Description: 'Visit the page on the HR intranet (KPMG intranet home page > Human resources > My onboarding) to familiarize yourself with the Firm.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 2', Title: 'Set up your e-mail signature', Description: 'Set up your e-mail signature using the guidelines provided in the welcome mail.', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 2', Title: 'Get Skype set up', Description: 'Go through the \'Instant Messenger Policy Training\' on the intranet. Once completed write to IN-FM IT Training to get access.', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 2', Title: 'Update details in K-Pass (for ID card)', Description: '', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 2', Title: 'Received ID card', Description: '', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 2', Title: 'Document submission process', Description: 'Update details and upload documents related to education, experience, AADHAAR, PAN etc. in Pichainlabs portal.', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 2', Title: 'TalentKonnect - personal details update', Description: '', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 2', Title: 'Update your Bank Account details under TalentKonnect', Description: '', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 2', Title: 'Update your Mobile phone number, Home phone number and address on TalentKonnect', Description: '', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 3', Title: 'Sign employement contract via AADHAAR based digital sign', Description: 'Received email from Pichainlabs to sign employement contract via AADHAAR based digital sign', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 3', Title: 'Salary structure and Investment declaration', Description: 'NEW JOINER KIT-HGS Portal login', Category: 'Salary & Investment', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'hgs' },
    { Day: 'Day 3', Title: 'Mandatory - Statutory Compliance Portal', Description: 'Received an email from IN-FM Power Platform to update PF Form-11, LWF/ESIC', Category: 'Statutory Compliance', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Day 3', Title: 'New Joiner Independence Training', Description: 'Personal Independence 2024/25 India (GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Building Public Trust - Independence and Conflicts of Interest', Description: 'Client Facing (GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Building Public Trust - Our Code', Description: '(GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'GBH_KGS_Financial Crime_2025', Description: '(GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'GBH_KGS_Protecting Information_2025', Description: '(GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'New Joiner Mandatory Risk Trainings', Description: 'Due in 28 days (KGS) (GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Information Protection and Data Privacy Fundamentals 2025 Global Training', Description: '(GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Prevention of Sexual Harassment at Workplace - 2025', Description: '(GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Complying with Sanctions', Description: '(GLMS Portal)', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Essential HR policy and guidelines', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Inclusion, Diversity and Equity at KGS', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'KGS BCP Training', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'KGS Risk and Data Management', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Our Workplace Facilities and Policies', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Corporate Social Responsibility', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'ESG 101 - Foundations - Now is the time (Module 1)', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'ESG 101 - Foundations - Time for Impact (Module 2)', Description: '(GLMS Portal)', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: 'glms' },
    { Day: 'Day 3', Title: 'Employee Nomination Form', Description: 'Update Nominees (Term Life Insurance, Personal Accident Insurance, Heath Insurance claims/Reimbursement if any, Full and Final Settlement, Any other legitimate due(s))', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Day 3', Title: 'UK Email ID password change and AVD setup', Description: '', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 1', Title: 'Complete Risk Management trainings', Description: 'Complete trainings mentioned under Risk Management tab in the Welcome email. Independence training is required within 14 days of joining.', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 1', Title: 'Meet with your Performance manager', Description: 'Initial meeting with your Performance manager.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 1', Title: 'Update Intellego details', Description: 'Update your personal details and KPMG resume on Intellego.', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Week 1', Title: 'Understand the Open PD process', Description: 'Intranet > Human resources > Open Performance Development.', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'Week 1', Title: 'Order business cards & stationery', Description: 'Order business cards through the KPMG Intranet portal and stationery on KPMG Support Central.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 1', Title: 'Submit Form 2 (revised) and EPFO form', Description: 'Submit to the Finance team. Please also attach a copy of your PAN card with these forms.', Category: 'Statutory Compliance', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 2', Title: 'New Joiner Orientation on Systems, PF, Policies & Online', Description: '45 Min via Teams', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 2', Title: 'Brand Training', Description: '(1 hour) given by Kubendran', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 2', Title: 'Internal PPT assignment', Description: '', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Week 2', Title: 'Insurance details update', Description: '', Category: 'HR Portal', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr', PortalId: '' },
    { Day: 'First Month', Title: 'Finalise your goals on the system', Description: 'Meet with your performance manager and finalise your goals on the system.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'First Month', Title: 'Submit New Joiner Independence Confirmation Affidavit', Description: 'Complete the risk trainings as per timelines and submit the affidavit within 30 days of joining.', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'First Month', Title: 'Ensure you have gone through the staff manual', Description: 'Ensure you have gone through the staff manual and the Onboarding page.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'First Month', Title: 'Attend the KPMG Induction', Description: 'Attend the KPMG Induction at your location if not done when you joined.', Category: 'Mandatory Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'First Month', Title: 'Understand your development journey', Description: 'Go through the KPMG Business School page and understand your development journey.', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Second Month', Title: 'Check in with your Buddy', Description: 'Schedule a quick coffee chat with your buddy to review your first month.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Second Month', Title: 'Complete advanced role-specific training', Description: 'Enroll and complete any secondary learning modules required for your team.', Category: 'Training', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' },
    { Day: 'Second Month', Title: 'Participate in team-building event', Description: 'Join your department\'s quarterly team building or townhall.', Category: 'General', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '', PortalId: '' }
  ],
  Development: [
    { Day: 'Day 1', Title: 'Access GitHub Organization', Description: 'Request access to KPMG GitHub org from tech lead', Category: 'IT Setup', Link: 'https://github.com', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'it' },
    { Day: 'Week 1', Title: 'Setup Local Dev Environment', Description: 'Install required tools: Node.js, VS Code, Docker', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'it' },
    { Day: 'Week 2', Title: 'Complete Code Review Training', Description: 'Review team coding standards and PR process', Category: 'Mandatory Training', Link: 'https://glms.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'training' },
  ],
  HR: [
    { Day: 'Day 1', Title: 'Review HR Policies Document', Description: 'Go through the HR handbook on SharePoint', Category: 'HR Portal', Link: 'https://talentkonnect.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr' },
    { Day: 'Week 1', Title: 'Setup Payroll Details', Description: 'Submit bank account and tax details in HR portal', Category: 'Salary & Investment', Link: 'https://hgs.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'hr' },
  ],
  Finance: [
    { Day: 'Day 1', Title: 'Finance Systems Access Request', Description: 'Request SAP and reporting tool access from IT', Category: 'IT Setup', Link: 'https://itsupport.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'it' },
    { Day: 'Week 1', Title: 'Expense Reporting Training', Description: 'Complete training on expense submission process', Category: 'Mandatory Training', Link: 'https://glms.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'finance' },
  ],
  QA: [
    { Day: 'Day 1', Title: 'Access JIRA & TestRail', Description: 'Get access to QA tools from team lead', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: 'it' },
    { Day: 'Week 1', Title: 'Review QA Processes', Description: 'Read through test strategy and QA handbook', Category: 'General', Link: 'https://home.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '' },
  ],
};

const TaskManager = () => {
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'success' | 'error'
  const [uploadMessage, setUploadMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    DEPARTMENTS.forEach(dept => {
      const rows = SAMPLE_DATA[dept] || [
        { Day: 'Day 1', Title: `Sample ${dept} Task`, Description: 'Task description here', Category: 'General', ProjectCode: '', TaskCode: '', DeadlineDay: '' }
      ];
      const ws = XLSX.utils.json_to_sheet(rows, { header: COLUMNS });
      // Style header row
      XLSX.utils.book_append_sheet(wb, ws, dept);
    });
    XLSX.writeFile(wb, 'KPMG_Onboarding_Tasks_Template.xlsx');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const wb = XLSX.read(event.target.result, { type: 'array' });
        const taskTemplate = {};
        let totalTasks = 0;

        wb.SheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

          if (rows.length === 0) return;

          const tasks = rows
            .filter(row => row.Day && row.Title)
            .map((row, idx) => ({
              id: `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${String(row.Day).replace(/\s+/g, '')}_${idx}`,
              day: String(row.Day).trim(),
              title: String(row.Title).trim(),
              description: row.Description ? String(row.Description).trim() : '',
              category: row.Category ? String(row.Category).trim() : 'General',
              projectCode: row.ProjectCode ? String(row.ProjectCode).trim() : '',
              taskCode: row.TaskCode ? String(row.TaskCode).trim() : '',
              deadlineDay: row.DeadlineDay ? parseInt(row.DeadlineDay) : null,
              url: row.Link ? String(row.Link).trim() : '',
              contactId: row.ContactId ? String(row.ContactId).trim() : '',
              portalId: row.PortalId ? String(row.PortalId).trim() : '',
              status: 'pending',
            }));

          if (tasks.length > 0) {
            taskTemplate[sheetName] = tasks;
            totalTasks += tasks.length;
          }
        });

        if (Object.keys(taskTemplate).length === 0) {
          setUploadStatus('error');
          setUploadMessage('No valid tasks found. Please check your file format.');
          return;
        }

        // Save to localStorage
        setStorage(STORAGE_KEYS.TASK_TEMPLATE, taskTemplate);

        setPreview(taskTemplate);
        setUploadStatus('success');
        setUploadMessage(`Successfully loaded ${totalTasks} tasks across ${Object.keys(taskTemplate).length} sheets (${Object.keys(taskTemplate).join(', ')}).`);

        e.target.value = null;
      } catch (err) {
        setUploadStatus('error');
        setUploadMessage('Error reading file. Please upload a valid .xlsx file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold mb-1">How it works</p>
          <ul className="space-y-1 text-blue-600">
            <li>• <strong>Common</strong> sheet → Tasks for ALL employees</li>
            <li>• <strong>Department sheets</strong> → Extra tasks for that team only</li>
            <li>• Employee gets: <strong>Common + their Department</strong> tasks merged</li>
          </ul>
        </div>
      </div>

      {/* Download Template */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Step 1: Download Template
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Download the Excel template with sample data. Edit it with your tasks and upload below.
              Sheets included: <span className="font-medium text-slate-700">{DEPARTMENTS.join(', ')}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Excel Template
        </button>
      </div>

      {/* Upload Tasks */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary-500" />
          Step 2: Upload Updated Tasks
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Upload your filled Excel file. Tasks will be applied to all new employee logins based on their team.
        </p>

        <input type="file" accept=".xlsx,.xls" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 btn-primary text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Excel File (.xlsx)
        </button>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
            uploadStatus === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {uploadStatus === 'success'
              ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            <p>{uploadMessage}</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800">Uploaded Task Preview</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(preview).map(([sheet, tasks]) => (
              <div key={sheet} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    sheet === 'Common' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-100 text-primary-700'
                  }`}>
                    {sheet} — {tasks.length} tasks
                  </span>
                </div>
                <div className="space-y-1">
                  {tasks.slice(0, 3).map((task, i) => (
                    <p key={i} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {task.day}
                      </span>
                      {task.title}
                    </p>
                  ))}
                  {tasks.length > 3 && (
                    <p className="text-xs text-slate-400 pl-7">+{tasks.length - 3} more tasks...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
