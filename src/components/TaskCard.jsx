import React, { useState } from 'react';
import { Check, MessageSquare, Tag, Folder, Hash, Clock, Phone, Trash2, Edit2, ExternalLink, CheckCircle2 } from 'lucide-react';
import contactsData from '../data/contacts.json';

const CATEGORY_URLS = {
  'Kommence': 'https://kommence.kpmg.com',
  'IT Setup': 'https://itsupport.kpmg.com',
  'General': 'https://home.kpmg.com',
  'HR Portal': 'https://talentkonnect.kpmg.in',
  'Mandatory Training': 'https://glms.kpmg.com',
  'Statutory Compliance': 'https://compliance.kpmg.in',
  'Salary & Investment': 'https://hgs.kpmg.in',
  'Affidavit': 'https://askyourrisk.kpmg.com'
};

const TaskCard = ({ task, toggleTask, note, saveNote, onDeleteTask, onEditTask }) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const initialNoteText = note || task.remark || '';
  const [noteText, setNoteText] = useState(initialNoteText);

  const handleSaveNote = () => {
    saveNote(task.id, noteText);
    setIsNoteOpen(false);
  };

  const isCompleted = task.status === 'completed';

  // Find a related contact randomly or by logic
  const contact = contactsData[task.title.length % contactsData.length];

  const currentNote = note !== undefined ? note : task.remark;

  return (
    <div className={`card p-4 transition-all duration-300 bg-white border border-slate-200/80 rounded-xl relative hover:shadow-md`}>
      <div className="flex gap-3">
        {/* Checkbox */}
        <button 
          onClick={() => toggleTask(task.id)}
          className={`mt-1 w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0
            ${isCompleted 
              ? 'bg-green-600 border-green-600 text-white shadow-sm' 
              : 'border-slate-300 hover:border-green-500 bg-white'}`}
        >
          {isCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex justify-between items-start gap-3 mb-1">
            <h4 className="text-base font-semibold text-slate-800 leading-snug">
              {task.title}
            </h4>
            <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
              {/* Category Badge */}
              {task.category && (() => {
                const categoryLink = task.url || CATEGORY_URLS[task.category];
                const BadgeContent = (
                  <span className="px-3 py-1 rounded-full bg-[#e6ebfc] text-[#3b5bd9] text-xs font-semibold border border-[#d1d9f5] whitespace-nowrap">
                    {task.category}
                  </span>
                );

                return categoryLink ? (
                  <a
                    href={categoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="hover:opacity-80 transition-opacity cursor-pointer inline-flex"
                    title={`Open ${task.category}`}
                  >
                    {BadgeContent}
                  </a>
                ) : BadgeContent;
              })()}
              
              <button 
                onClick={() => setIsNoteOpen(!isNoteOpen)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                title="Add or edit remark"
              >
                <MessageSquare className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
          
          {/* Description */}
          {task.description && (
            <p className="text-slate-600 text-sm mb-2.5 leading-relaxed pr-6">
              {task.description}
            </p>
          )}

          {/* Note Area */}
          {(isNoteOpen || currentNote) && (
            <div className="mb-3 mt-1.5">
              {isNoteOpen ? (
                <div className="flex gap-2">
                  <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add remarks or issues..."
                    className="input-field text-sm py-2 px-3 min-h-[80px]"
                    autoFocus
                  />
                  <div className="flex flex-col gap-1.5">
                    <button onClick={handleSaveNote} className="btn-primary py-1.5 px-3 text-xs font-medium">Save</button>
                    <button onClick={() => setIsNoteOpen(false)} className="py-1.5 px-3 text-xs text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#ffebe0] text-[#331100] p-3 pr-4 rounded-r-lg border-l-[4px] border-[#ffb38e] flex items-start gap-3 shadow-sm">
                  <div className="bg-[#8b4513] text-white p-1 rounded-md shadow-sm mt-0.5 flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <p className="italic text-sm font-medium leading-relaxed">
                    "{currentNote}"
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Action Row (Custom Tasks) */}
          {task.type === 'custom' && !isCompleted && (
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => onEditTask(task)}
                className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Custom Task
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}

          {/* Footer Row */}
          <div className="flex items-center justify-between pt-3 mt-1.5">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <>
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Completed</span>
                  </div>
                </>
              ) : (
                <span className="text-sm font-medium text-slate-400"></span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Project Codes */}
              {(task.projectCode || task.taskCode) && (
                <div className="flex items-center gap-2 mr-2">
                  {task.projectCode && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Proj: {task.projectCode}</span>
                  )}
                  {task.taskCode && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Task: {task.taskCode}</span>
                  )}
                </div>
              )}
              
              {/* Contact Info */}
              {contact && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group">
                  <Phone className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-colors" strokeWidth={2} />
                  <span className="text-sm font-medium">{contact.team}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
