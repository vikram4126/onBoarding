import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, CheckCircle2, AlertTriangle, FileSpreadsheet, Info } from 'lucide-react';
import { setStorage, STORAGE_KEYS } from '../utils/storage';

const DEPARTMENTS = ['Common', 'Development', 'HR', 'Finance', 'QA', 'Design', 'IT Support', 'Marketing'];

const COLUMNS = ['Day', 'Title', 'Description', 'Category', 'Link', 'ProjectCode', 'TaskCode', 'DeadlineDay'];

const SAMPLE_DATA = {
  Common: [
    { Day: 1, Title: 'Received Office ID card from reception', Description: '', Category: 'Kommence', Link: 'https://kommence.kpmg.com', ProjectCode: '1197827', TaskCode: '01', DeadlineDay: '' },
    { Day: 1, Title: 'Team building', Description: 'Intro to each other and team activities', Category: 'Kommence', Link: 'https://kommence.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 1, Title: 'HR Induction', Description: '', Category: 'Kommence', Link: 'https://kommence.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 1, Title: 'IT Induction (Received Laptop)', Description: 'Receive laptop and complete hardware checklist', Category: 'IT Setup', Link: 'https://itsupport.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 2, Title: 'Complete Insurance Form', Description: 'Fill and submit the Group Mediclaim form', Category: 'HR Portal', Link: 'https://talentkonnect.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: 5 },
    { Day: 2, Title: 'Setup Corporate Email & Teams', Description: 'Configure your KPMG email and Microsoft Teams', Category: 'IT Setup', Link: 'https://itsupport.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 2, Title: 'Submit Salary & Investment Declarations', Description: 'Fill investment proofs and salary structure in HGS', Category: 'Salary & Investment', Link: 'https://hgs.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: 5 },
    { Day: 3, Title: 'KPMG Code of Conduct Training', Description: 'Complete mandatory ethics training on GLMS', Category: 'Mandatory Training', Link: 'https://glms.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: 7 },
    { Day: 3, Title: 'Complete Statutory Compliance', Description: 'Submit PF, ESIC and other statutory forms', Category: 'Statutory Compliance', Link: 'https://compliance.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: 7 },
    { Day: 4, Title: 'Submit Affidavit Form', Description: 'Complete and submit the required affidavit', Category: 'Affidavit', Link: 'https://askyourrisk.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: 10 },
  ],
  Development: [
    { Day: 1, Title: 'Access GitHub Organization', Description: 'Request access to KPMG GitHub org from tech lead', Category: 'IT Setup', Link: 'https://github.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 2, Title: 'Setup Local Dev Environment', Description: 'Install required tools: Node.js, VS Code, Docker', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: 3 },
    { Day: 3, Title: 'Complete Code Review Training', Description: 'Review team coding standards and PR process', Category: 'Mandatory Training', Link: 'https://glms.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
  ],
  HR: [
    { Day: 1, Title: 'Review HR Policies Document', Description: 'Go through the HR handbook on SharePoint', Category: 'HR Portal', Link: 'https://talentkonnect.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 2, Title: 'Setup Payroll Details', Description: 'Submit bank account and tax details in HR portal', Category: 'Salary & Investment', Link: 'https://hgs.kpmg.in', ProjectCode: '', TaskCode: '', DeadlineDay: 3 },
  ],
  Finance: [
    { Day: 1, Title: 'Finance Systems Access Request', Description: 'Request SAP and reporting tool access from IT', Category: 'IT Setup', Link: 'https://itsupport.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 2, Title: 'Expense Reporting Training', Description: 'Complete training on expense submission process', Category: 'Mandatory Training', Link: 'https://glms.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: 5 },
  ],
  QA: [
    { Day: 1, Title: 'Access JIRA & TestRail', Description: 'Get access to QA tools from team lead', Category: 'IT Setup', Link: '', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
    { Day: 2, Title: 'Review QA Processes', Description: 'Read through test strategy and QA handbook', Category: 'General', Link: 'https://home.kpmg.com', ProjectCode: '', TaskCode: '', DeadlineDay: '' },
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
        { Day: 1, Title: `Sample ${dept} Task`, Description: 'Task description here', Category: 'General', ProjectCode: '', TaskCode: '', DeadlineDay: '' }
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
              id: `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${row.Day}_${idx}`,
              day: parseInt(row.Day) || 1,
              title: String(row.Title).trim(),
              description: row.Description ? String(row.Description).trim() : '',
              category: row.Category ? String(row.Category).trim() : 'General',
              projectCode: row.ProjectCode ? String(row.ProjectCode).trim() : '',
              taskCode: row.TaskCode ? String(row.TaskCode).trim() : '',
              deadlineDay: row.DeadlineDay ? parseInt(row.DeadlineDay) : null,
              url: row.Link ? String(row.Link).trim() : '',
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
