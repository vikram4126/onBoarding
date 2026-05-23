import React, { useState } from 'react';
import { Check, MessageSquare, Tag, Folder, Hash, Clock, Phone, Trash2, Edit2, ExternalLink } from 'lucide-react';
import contactsData from '../data/contacts.json';

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
    <div className={`card p-3 transition-all duration-300 ${isCompleted ? 'bg-slate-50 border-slate-200' : 'hover:border-primary-200 hover:shadow-md bg-white border-slate-200/60'}`}>
      <div className="flex gap-3">
        <button 
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 flex-shrink-0
            ${isCompleted 
              ? 'bg-primary-500 border-primary-500 text-white' 
              : 'border-slate-300 hover:border-primary-400 bg-white'}`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-0.5 gap-2">
            <h4 className={`text-sm font-semibold truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`} title={task.title}>
              {task.title}
            </h4>
            <div className="flex gap-1.5 items-center flex-shrink-0 flex-wrap justify-end">
              {task.type === 'custom' && (
                <div className="flex items-center gap-1 mr-1">
                  <button 
                    onClick={() => onEditTask(task)}
                    className="text-slate-400 hover:text-primary-500 transition-colors"
                    title="Edit custom task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete custom task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {task.url && (
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 text-[10px] font-medium border border-primary-100 whitespace-nowrap hover:bg-primary-100 transition-colors"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> Open
                </a>
              )}
              {task.category && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium border border-blue-100 whitespace-nowrap">
                  <Folder className="w-2.5 h-2.5" /> {task.category}
                </span>
              )}
              {task.type === 'team' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-medium whitespace-nowrap">
                  <Tag className="w-2.5 h-2.5" /> Team
                </span>
              )}
              <button 
                onClick={() => setIsNoteOpen(!isNoteOpen)}
                className="text-[10px] font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors ml-1"
                title="Add or edit remark"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Description */}
          {task.description && (
            <p className={`text-xs mb-1.5 line-clamp-2 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`} title={task.description}>
              {task.description}
            </p>
          )}

          {/* Meta Row */}
          {(task.projectCode || task.taskCode || task.hours !== undefined || (!isCompleted && contact)) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1">
              {task.projectCode && (
                <a 
                  href="https://reconnect.kpmg.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 px-1.5 py-0.5 rounded border border-slate-200 hover:border-primary-200 transition-colors"
                  title="Log time in Reconnect"
                >
                  <Hash className="w-3 h-3 text-slate-400 group-hover:text-primary-500" /> Proj: {task.projectCode}
                </a>
              )}
              {task.taskCode && (
                <a 
                  href="https://reconnect.kpmg.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 px-1.5 py-0.5 rounded border border-slate-200 hover:border-primary-200 transition-colors"
                  title="Log time in Reconnect"
                >
                  <Hash className="w-3 h-3 text-slate-400 group-hover:text-primary-500" /> Task: {task.taskCode}
                </a>
              )}
              {task.hours !== undefined && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" /> {task.hours} hrs
                </span>
              )}
              {!isCompleted && contact && (
                <a href={`mailto:${contact.email}`} className="text-[11px] text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors group ml-auto">
                  <Phone className="w-3 h-3 group-hover:text-primary-500" /> {contact.team}
                </a>
              )}
            </div>
          )}

          {/* Note Area */}
          {(isNoteOpen || currentNote) && (
            <div className={`mt-2 ${!isNoteOpen && currentNote ? 'opacity-90' : ''}`}>
              {isNoteOpen ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add remarks or issues..."
                    className="input-field text-xs py-1 px-2 h-7"
                    autoFocus
                  />
                  <button onClick={handleSaveNote} className="btn-primary py-1 px-2 h-7 text-xs flex items-center">Save</button>
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-800 text-xs p-2 rounded border border-amber-100 flex items-start gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 mt-px text-amber-500 flex-shrink-0" />
                  <p className="leading-snug">{currentNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
