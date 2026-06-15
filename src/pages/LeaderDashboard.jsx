import React, { useState } from 'react';
import { Users, LogOut, CheckCircle2, ChevronDown, ChevronUp, Plus, X, GraduationCap, Calendar, ClipboardCheck, Edit2, Trash2 } from 'lucide-react';
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage';
import { getWorkingDaysDifference } from '../utils/dateHelpers';
import kpmgLogo from '../assets/kpmg-logo.svg';
import leaderGatewaysData from '../data/leaderGateways.json';
import { generateGatewayPpt } from '../utils/generateGatewayPpt';

const LeaderDashboard = ({ onLogout }) => {
  const [employees, setEmployees] = useState(() => getStorage(STORAGE_KEYS.LEADER_EMPLOYEES, []));
  const [leaderData, setLeaderData] = useState(() => getStorage(STORAGE_KEYS.LEADER_DATA, {}));
  
  const leaderProfile = getStorage(STORAGE_KEYS.PROFILE);
  const leaderName = leaderProfile?.fullName || 'Leader';
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openGateways, setOpenGateways] = useState(['gateway_one']);
  
  const [toast, setToast] = useState(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({ fullName: '', email: '', joiningDate: new Date().toISOString().split('T')[0] });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', joiningDate: '' });
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState(null);
  const [pptLoading, setPptLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getInitialGatewayData = () => {
    const initial = {};
    leaderGatewaysData.forEach(gw => {
      initial[gw.id] = {
        checklist: {},
        assessment: {},
        scorecard: gw.id === 'gateway_three' ? [
          { id: 'g3_s1', date: '', assessment: 'a) Live project assessment', projectCrt: '', projectLead: '', dateCompleted: '', rightFirstTime: '', brandGovReview: '', qualityComments: '', passLevel: '', teamLeadSignOff: '', sentToOpsManager: '' },
          { id: 'g3_s2', date: '', assessment: 'b) Pass with development', projectCrt: '', projectLead: '', dateCompleted: '', rightFirstTime: '', brandGovReview: '', qualityComments: '', passLevel: '', teamLeadSignOff: '', sentToOpsManager: '' },
          { id: 'g3_s3', date: '', assessment: 'c) Assessment fail', projectCrt: '', projectLead: '', dateCompleted: '', rightFirstTime: '', brandGovReview: '', qualityComments: '', passLevel: '', teamLeadSignOff: '', sentToOpsManager: '' }
        ] : {
          date: '', assessor: '', formOfAssessment: '', requirementsMet: '',
          comments: '', sentToOpsManager: '', opsManagerChecks: '',
          opsManagerConfirmation: '', confirmedNextSteps: ''
        }
      };
      gw.checklist.forEach(task => {
        initial[gw.id].checklist[task.id] = { completionDate: '', notes: '' };
      });
      if (gw.assessment) {
        gw.assessment.forEach(task => {
          initial[gw.id].assessment[task.id] = { completionDate: '', notes: '' };
        });
      }
    });
    return initial;
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.fullName || !manualForm.email) {
      showToast('Name and Email are required.', 'error');
      return;
    }
    const email = manualForm.email.toLowerCase();
    if (employees.some(emp => emp.profile.email === email)) {
      showToast('A joiner with this email already exists.', 'error');
      return;
    }
    const dummyRecord = {
      profile: { fullName: manualForm.fullName, email: email, joiningDate: manualForm.joiningDate, team: 'TBD', designation: 'New Joiner', role: 'employee' }
    };
    const updatedEmployees = [...employees, dummyRecord];
    setEmployees(updatedEmployees);
    setStorage(STORAGE_KEYS.LEADER_EMPLOYEES, updatedEmployees);

    const updatedLeaderData = { ...leaderData };
    updatedLeaderData[email] = getInitialGatewayData();
    setLeaderData(updatedLeaderData);
    setStorage(STORAGE_KEYS.LEADER_DATA, updatedLeaderData);

    setShowManualModal(false);
    setManualForm({ fullName: '', email: '', joiningDate: new Date().toISOString().split('T')[0] });
    showToast(`✓ Added ${manualForm.fullName}.`);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const oldEmail = editingEmployee.profile.email;
    const newEmail = editForm.email.toLowerCase();
    const updatedEmployees = employees.map(emp =>
      emp.profile.email === oldEmail
        ? { ...emp, profile: { ...emp.profile, fullName: editForm.fullName, email: newEmail, joiningDate: editForm.joiningDate } }
        : emp
    );
    setEmployees(updatedEmployees);
    setStorage(STORAGE_KEYS.LEADER_EMPLOYEES, updatedEmployees);

    // If email changed, migrate data
    if (oldEmail !== newEmail) {
      const updatedData = { ...leaderData };
      updatedData[newEmail] = updatedData[oldEmail];
      delete updatedData[oldEmail];
      setLeaderData(updatedData);
      setStorage(STORAGE_KEYS.LEADER_DATA, updatedData);
    }

    if (selectedEmployee?.profile?.email === oldEmail) {
      setSelectedEmployee(updatedEmployees.find(emp => emp.profile.email === newEmail) || null);
    }
    setEditingEmployee(null);
    showToast(`✓ Updated ${editForm.fullName}.`);
  };

  const handleDelete = (email) => {
    const updatedEmployees = employees.filter(emp => emp.profile.email !== email);
    setEmployees(updatedEmployees);
    setStorage(STORAGE_KEYS.LEADER_EMPLOYEES, updatedEmployees);
    const updatedData = { ...leaderData };
    delete updatedData[email];
    setLeaderData(updatedData);
    setStorage(STORAGE_KEYS.LEADER_DATA, updatedData);
    if (selectedEmployee?.profile?.email === email) setSelectedEmployee(null);
    setConfirmDeleteEmail(null);
    showToast('Joiner removed.');
  };

  const updateListTask = (email, gatewayId, listType, taskId, field, value) => {
    const updated = { ...leaderData };
    if (!updated[email]) updated[email] = getInitialGatewayData();
    if (!updated[email][gatewayId][listType]) {
      updated[email][gatewayId][listType] = {};
    }
    if (!updated[email][gatewayId][listType][taskId]) {
      updated[email][gatewayId][listType][taskId] = { completionDate: '', notes: '' };
    }
    updated[email][gatewayId][listType][taskId][field] = value;
    setLeaderData(updated);
    setStorage(STORAGE_KEYS.LEADER_DATA, updated);
  };

  const updateScorecard = (email, gatewayId, field, value) => {
    const updated = { ...leaderData };
    if (!updated[email]) updated[email] = getInitialGatewayData();
    updated[email][gatewayId].scorecard[field] = value;
    setLeaderData(updated);
    setStorage(STORAGE_KEYS.LEADER_DATA, updated);
  };

  const updateGateway3Scorecard = (email, gatewayId, rowIndex, field, value) => {
    const updated = { ...leaderData };
    if (!updated[email]) updated[email] = getInitialGatewayData();
    if (!Array.isArray(updated[email][gatewayId].scorecard)) {
      updated[email][gatewayId].scorecard = getInitialGatewayData()[gatewayId].scorecard;
    }
    updated[email][gatewayId].scorecard[rowIndex][field] = value;
    setLeaderData(updated);
    setStorage(STORAGE_KEYS.LEADER_DATA, updated);
  };

  const toggleGateway = (gatewayId) => {
    setOpenGateways(prev => prev.includes(gatewayId) ? prev.filter(id => id !== gatewayId) : [...prev, gatewayId]);
  };

  // Week deadline map: last working-day index of that week (0 = joining day)
  const WEEK_END_DAYS = { 'Week 1': 6, 'Week 2': 11, 'Week 3': 16 };

  const getGatewayDeadlineStatus = (gateway, joiningDate) => {
    if (!joiningDate || !gateway.deadline) return null;
    const deadlineDay = WEEK_END_DAYS[gateway.deadline];
    if (deadlineDay === undefined) return null;
    const daysSince = getWorkingDaysDifference(joiningDate, new Date().toISOString().split('T')[0]);
    if (daysSince > deadlineDay) {
      return { text: 'Overdue', colorClass: 'bg-red-500 border-red-400', icon: '⚠️', isOverdue: true };
    } else if (daysSince >= deadlineDay - 1) {
      return { text: 'Due Soon', colorClass: 'bg-amber-400 border-amber-300', icon: '🕐', isOverdue: false };
    } else {
      return { text: 'On Track', colorClass: 'bg-emerald-500 border-emerald-400', icon: '✅', isOverdue: false };
    }
  };

  // Returns true if all checklist items have a completionDate, and scorecard has at least one key field filled
  const isGatewayComplete = (gateway, gwData) => {
    if (!gwData) return false;
    const allChecklistFilled = gateway.checklist.every(task => gwData.checklist?.[task.id]?.completionDate);
    const assessmentFilled = !gateway.assessment || gateway.assessment.every(task => gwData.assessment?.[task.id]?.completionDate);
    let scorecardFilled = false;
    if (gateway.id === 'gateway_three') {
      scorecardFilled = Array.isArray(gwData.scorecard) && gwData.scorecard.some(row => row.date || row.passLevel);
    } else {
      scorecardFilled = gwData.scorecard && (gwData.scorecard.date || gwData.scorecard.requirementsMet || gwData.scorecard.assessor);
    }
    return allChecklistFilled && assessmentFilled && scorecardFilled;
  };

  const handleExportPpt = async () => {
    if (!selectedEmployee || !activeJoinerData) return;
    setPptLoading(true);
    try {
      await generateGatewayPpt(selectedEmployee.profile, activeJoinerData, leaderGatewaysData);
      showToast('✓ PPT downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PPT. Please try again.', 'error');
    } finally {
      setPptLoading(false);
    }
  };

  const activeJoinerData = selectedEmployee ? leaderData[selectedEmployee.profile.email.toLowerCase()] : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-slide-down ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {toast.type === 'error' ? <X className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Edit Joiner</h2>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Joining Date</label>
                <input type="date" value={editForm.joiningDate} onChange={e => setEditForm({...editForm, joiningDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setEditingEmployee(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Remove Joiner?</h2>
            <p className="text-sm text-slate-500 mb-6">All gateway data for this joiner will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteEmail(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDeleteEmail)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add New Joiner</h2>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleManualAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={manualForm.fullName} onChange={e => setManualForm({...manualForm, fullName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input type="email" value={manualForm.email} onChange={e => setManualForm({...manualForm, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="john@kpmg.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Joining Date</label>
                <input type="date" value={manualForm.joiningDate} onChange={e => setManualForm({...manualForm, joiningDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-700">
                  <Plus className="w-4 h-4" /> Add Joiner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={kpmgLogo} alt="KPMG" className="h-6" />
            <div className="h-6 w-px bg-slate-200"></div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary-600" />
              Leader Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
                <GraduationCap className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{leaderName}</p>
                <p className="text-xs text-slate-500">Leader</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-6 flex gap-6 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Left Sidebar */}
        <div className="w-64 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                Your Joiners
              </h2>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                {employees.length}
              </span>
            </div>
            
            <div className="p-3">
              <button onClick={() => setShowManualModal(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                <Plus className="w-4 h-4" /> Add New Joiner
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 pt-0 space-y-2">
              {employees.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-800">No joiners yet</p>
                  <p className="text-xs text-slate-500 mt-1">Add a new joiner to start tracking.</p>
                </div>
              ) : (
                employees.map((emp, idx) => (
                  <div
                    key={idx}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedEmployee?.profile?.email === emp.profile.email
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm mb-1 truncate">{emp.profile.fullName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {emp.profile.joiningDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditingEmployee(emp); setEditForm({ fullName: emp.profile.fullName, email: emp.profile.email, joiningDate: emp.profile.joiningDate }); }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteEmail(emp.profile.email)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {selectedEmployee && activeJoinerData ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Gateways for {selectedEmployee.profile.fullName}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4" />
                    Complete the checklist and scorecard for each gateway below.
                  </p>
                </div>
                <button
                  onClick={handleExportPpt}
                  disabled={pptLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#00338D] text-white text-sm font-bold rounded-lg hover:bg-[#002266] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {pptLoading ? (
                    <>⏳ Generating...</>
                  ) : (
                    <>📊 Export PPT</>
                  )}
                </button>
              </div>

              <div className="p-6 space-y-6">
                {leaderGatewaysData.map((gateway) => {
                  const isOpen = openGateways.includes(gateway.id);
                  const email = selectedEmployee.profile.email.toLowerCase();
                  const gwData = activeJoinerData[gateway.id];
                  const rawStatus = getGatewayDeadlineStatus(gateway, selectedEmployee.profile.joiningDate);
                  const isComplete = isGatewayComplete(gateway, gwData);
                  // If gateway is complete, suppress overdue — it's done
                  const deadlineStatus = isComplete ? null : rawStatus;
                  const isOverdue = !isComplete && deadlineStatus?.isOverdue;
                  
                  return (
                    <div key={gateway.id} className={`rounded-xl overflow-hidden shadow-sm transition-all ${
                      isOverdue 
                        ? 'border-2 border-red-500 shadow-red-200 shadow-md' 
                        : 'border border-slate-200'
                    }`}>
                      <button
                        onClick={() => toggleGateway(gateway.id)}
                        className="w-full flex items-center justify-between p-4 bg-[#00338D] text-white hover:bg-[#002266] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{gateway.title}</h3>
                          {gateway.deadline && (
                            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">
                              📅 {gateway.deadline}
                            </span>
                          )}
                          {isComplete && (
                            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400">
                              ✅ Completed
                            </span>
                          )}
                          {!isComplete && deadlineStatus && (
                            <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full border ${deadlineStatus.colorClass}`}>
                              {deadlineStatus.icon} {deadlineStatus.text}
                            </span>
                          )}
                        </div>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                      </button>

                      {isOpen && (
                        <div className="p-6">
                          {/* Checklist Section */}
                          <div className="mb-8">
                            <h4 className="font-bold text-slate-800 mb-4 text-base border-b pb-2">Checklist</h4>
                            <div className="overflow-x-auto border rounded-lg">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-[#00338D] text-white">
                                  <tr>
                                    <th className="px-4 py-3 font-semibold">Task</th>
                                    <th className="px-4 py-3 font-semibold w-48">Completion date</th>
                                    <th className="px-4 py-3 font-semibold w-64">Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {gateway.checklist.map((task, index) => (
                                    <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-4 py-3 font-medium text-slate-700 align-top">
                                        <div className="font-bold">{task.task}</div>
                                        {task.description && (
                                          <div className="mt-1 text-xs text-slate-500 whitespace-pre-wrap font-normal leading-relaxed">{task.description}</div>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 align-top">
                                        <input 
                                          type="date"
                                          value={gwData?.checklist[task.id]?.completionDate || ''}
                                          onChange={(e) => updateListTask(email, gateway.id, 'checklist', task.id, 'completionDate', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                                        />
                                      </td>
                                      <td className="px-4 py-2 align-top">
                                        <textarea 
                                          placeholder="Add notes..."
                                          value={gwData?.checklist[task.id]?.notes || ''}
                                          onChange={(e) => updateListTask(email, gateway.id, 'checklist', task.id, 'notes', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[60px] resize-y"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Assessment Section (if present) */}
                          {gateway.assessment && (
                            <div className="mb-8">
                              <h4 className="font-bold text-slate-800 mb-4 text-base border-b pb-2">Assessment</h4>
                              <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-[#00338D] text-white">
                                    <tr>
                                      <th className="px-4 py-3 font-semibold">Task</th>
                                      <th className="px-4 py-3 font-semibold w-48">Completion date</th>
                                      <th className="px-4 py-3 font-semibold w-64">Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {gateway.assessment.map((task, index) => (
                                      <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="px-4 py-3 font-medium text-slate-700 whitespace-pre-wrap align-top">
                                          <div className="font-bold">{task.task}</div>
                                          {task.description && (
                                            <div className="mt-1 text-xs text-slate-500 whitespace-pre-wrap font-normal leading-relaxed">{task.description}</div>
                                          )}
                                        </td>
                                        <td className="px-4 py-2 align-top">
                                          <input 
                                            type="date"
                                            value={gwData?.assessment?.[task.id]?.completionDate || ''}
                                            onChange={(e) => updateListTask(email, gateway.id, 'assessment', task.id, 'completionDate', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                                          />
                                        </td>
                                        <td className="px-4 py-2 align-top">
                                          <textarea 
                                            placeholder="Add notes..."
                                            value={gwData?.assessment?.[task.id]?.notes || ''}
                                            onChange={(e) => updateListTask(email, gateway.id, 'assessment', task.id, 'notes', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500 min-h-[60px] resize-y"
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Scorecard Section */}
                          <div>
                            <h4 className="font-bold text-slate-800 mb-4 text-base border-b pb-2">Scorecard</h4>
                            <div className="overflow-x-auto border rounded-lg">
                              {gateway.id === 'gateway_three' ? (
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-[#00338D] text-white">
                                    <tr>
                                      <th className="px-3 py-2 font-semibold">Date</th>
                                      <th className="px-3 py-2 font-semibold min-w-[150px]">Assessment</th>
                                      <th className="px-3 py-2 font-semibold">Project (CRT) numbers</th>
                                      <th className="px-3 py-2 font-semibold">Project lead</th>
                                      <th className="px-3 py-2 font-semibold">Date completed</th>
                                      <th className="px-3 py-2 font-semibold w-24">Right first time</th>
                                      <th className="px-3 py-2 font-semibold">Brand Governance review</th>
                                      <th className="px-3 py-2 font-semibold min-w-[150px]">Quality Checks comments</th>
                                      <th className="px-3 py-2 font-semibold">Pass level</th>
                                      <th className="px-3 py-2 font-semibold">Team Lead sign off</th>
                                      <th className="px-3 py-2 font-semibold">Sent to Ops Manager</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(Array.isArray(gwData?.scorecard) ? gwData.scorecard : getInitialGatewayData()[gateway.id].scorecard).map((row, index) => (
                                      <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="p-2 align-top">
                                          <input type="date" value={row.date || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'date', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                        <td className="p-2 align-top text-xs font-medium text-slate-700 whitespace-pre-wrap">{row.assessment}</td>
                                        <td className="p-2 align-top">
                                          <input type="text" value={row.projectCrt || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'projectCrt', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                        <td className="p-2 align-top">
                                          <input type="text" value={row.projectLead || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'projectLead', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                        <td className="p-2 align-top">
                                          <input type="date" value={row.dateCompleted || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'dateCompleted', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                        <td className="p-2 align-top">
                                          <select value={row.rightFirstTime || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'rightFirstTime', e.target.value)} className="w-full p-1 border rounded text-xs bg-white">
                                            <option value="">--</option>
                                            <option value="Yes">Y</option>
                                            <option value="No">N</option>
                                          </select>
                                        </td>
                                        <td className="p-2 align-top">
                                          <input type="date" value={row.brandGovReview || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'brandGovReview', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                        <td className="p-2 align-top">
                                          <textarea placeholder="Comments" value={row.qualityComments || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'qualityComments', e.target.value)} className="w-full p-1 border rounded text-xs min-h-[60px] resize-y" />
                                        </td>
                                        <td className="p-2 align-top">
                                          <select value={row.passLevel || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'passLevel', e.target.value)} className="w-full p-1 border rounded text-xs bg-white">
                                            <option value="">--</option>
                                            <option value="Pass">Pass</option>
                                            <option value="Pass with Development">Pass with Development</option>
                                            <option value="Fail">Fail</option>
                                          </select>
                                        </td>
                                        <td className="p-2 align-top">
                                          <input type="text" placeholder="Sign off" value={row.teamLeadSignOff || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'teamLeadSignOff', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                        <td className="p-2 align-top">
                                          <input type="date" value={row.sentToOpsManager || ''} onChange={(e) => updateGateway3Scorecard(email, gateway.id, index, 'sentToOpsManager', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-[#00338D] text-white">
                                    <tr>
                                      <th className="px-3 py-2 font-semibold">Date</th>
                                      <th className="px-3 py-2 font-semibold">Assessor</th>
                                      <th className="px-3 py-2 font-semibold">Form of assessment</th>
                                      <th className="px-3 py-2 font-semibold w-24">Req. met (Y/N)</th>
                                      <th className="px-3 py-2 font-semibold min-w-[150px]">Comments</th>
                                      <th className="px-3 py-2 font-semibold">Sent to Ops Mgr</th>
                                      <th className="px-3 py-2 font-semibold">Ops Mgr checks</th>
                                      <th className="px-3 py-2 font-semibold">Ops Mgr confirm</th>
                                      <th className="px-3 py-2 font-semibold min-w-[150px]">Confirmed next steps</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="bg-white">
                                      <td className="p-2 align-top">
                                        <input type="date" value={gwData?.scorecard?.date || ''} onChange={(e) => updateScorecard(email, gateway.id, 'date', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <input type="text" placeholder="Name" value={gwData?.scorecard?.assessor || ''} onChange={(e) => updateScorecard(email, gateway.id, 'assessor', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <textarea placeholder="e.g. Face to face" value={gwData?.scorecard?.formOfAssessment || ''} onChange={(e) => updateScorecard(email, gateway.id, 'formOfAssessment', e.target.value)} className="w-full p-1 border rounded text-xs min-h-[60px] resize-y" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <select value={gwData?.scorecard?.requirementsMet || ''} onChange={(e) => updateScorecard(email, gateway.id, 'requirementsMet', e.target.value)} className="w-full p-1 border rounded text-xs bg-white">
                                          <option value="">--</option>
                                          <option value="Yes">Yes</option>
                                          <option value="No">No</option>
                                        </select>
                                      </td>
                                      <td className="p-2 align-top">
                                        <textarea placeholder="Comments" value={gwData?.scorecard?.comments || ''} onChange={(e) => updateScorecard(email, gateway.id, 'comments', e.target.value)} className="w-full p-1 border rounded text-xs min-h-[60px] resize-y" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <input type="date" value={gwData?.scorecard?.sentToOpsManager || ''} onChange={(e) => updateScorecard(email, gateway.id, 'sentToOpsManager', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <input type="date" value={gwData?.scorecard?.opsManagerChecks || ''} onChange={(e) => updateScorecard(email, gateway.id, 'opsManagerChecks', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <input type="date" value={gwData?.scorecard?.opsManagerConfirmation || ''} onChange={(e) => updateScorecard(email, gateway.id, 'opsManagerConfirmation', e.target.value)} className="w-full p-1 border rounded text-xs" />
                                      </td>
                                      <td className="p-2 align-top">
                                        <textarea placeholder="e.g. Progress to Gateway two" value={gwData?.scorecard?.confirmedNextSteps || ''} onChange={(e) => updateScorecard(email, gateway.id, 'confirmedNextSteps', e.target.value)} className="w-full p-1 border rounded text-xs min-h-[60px] resize-y" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Select a Joiner</h2>
              <p className="text-slate-500 max-w-md">
                Choose a new joiner from the sidebar to view and evaluate their gateways, or add a new joiner to start tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
