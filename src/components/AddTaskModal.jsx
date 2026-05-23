import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddTaskModal = ({ onClose, onAdd, defaultDay = 'Custom', initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData ? initialData.title : '',
    description: initialData ? initialData.description : '',
    day: initialData ? initialData.day : defaultDay,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{isEdit ? 'Edit Custom Task' : 'Add Custom Task'}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Task Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="input-field" 
              placeholder="e.g., Setup external monitor" 
              autoFocus
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input-field min-h-[100px] resize-none" 
              placeholder="Add some details about this task..."
            />
          </div>
          
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {isEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
