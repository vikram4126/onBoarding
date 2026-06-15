import React, { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Send, X, User } from 'lucide-react';

const CommentsList = ({ comments = [], onAdd, onEdit, onDelete, readOnly = false, authorName = 'User' }) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (!newComment.trim()) return;
    onAdd(newComment.trim(), authorName);
    setNewComment('');
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    onEdit(id, editText.trim());
    setEditingId(null);
    setEditText('');
  };

  // Support old string format just in case
  const normalizedComments = Array.isArray(comments) 
    ? comments 
    : (typeof comments === 'string' && comments.trim() ? [{ id: 'legacy', text: comments, author: 'User', timestamp: new Date().toISOString() }] : []);

  if (readOnly && normalizedComments.length === 0) return null;

  return (
    <div className="mt-3 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      {/* Comments Area */}
      {normalizedComments.length > 0 && (
        <div className="p-3 space-y-3 max-h-[250px] overflow-y-auto">
          {normalizedComments.map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm relative group">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className="text-[10px] font-bold text-slate-700">{comment.author || 'User'}</span>
                  <span className="text-[9px] text-slate-400">{new Date(comment.timestamp || Date.now()).toLocaleDateString()} {new Date(comment.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                
                {editingId === comment.id ? (
                  <div className="mt-1">
                    <textarea 
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
                      rows={2}
                    />
                    <div className="flex gap-2 mt-1.5 justify-end">
                      <button onClick={() => setEditingId(null)} className="text-[10px] text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                      <button onClick={() => handleSaveEdit(comment.id)} className="text-[10px] text-indigo-600 font-bold hover:text-indigo-800">Save</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                )}

                {/* Actions */}
                {!readOnly && comment.author === authorName && editingId !== comment.id && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 bg-white pl-2">
                    <button onClick={() => handleEdit(comment.id, comment.text)} className="text-slate-400 hover:text-indigo-500">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => onDelete(comment.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      {!readOnly && (
        <div className="p-2 border-t border-slate-200 bg-white flex gap-2 items-end">
          <textarea 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 outline-none min-h-[40px] max-h-[100px]"
            rows={newComment.split('\n').length > 1 ? 2 : 1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <button 
            onClick={handleAdd}
            disabled={!newComment.trim()}
            className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 hover:bg-primary-700 transition-colors mb-1"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
