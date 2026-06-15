import React, { useState } from 'react';
import { Briefcase, User, Mail, Users, Calendar, Award, Key, Shield, Heart, GraduationCap } from 'lucide-react';
import kpmgLogo from '../assets/kpmg-logo.svg';
import managersData from '../data/managers.json';

const ROLES = [
  { id: 'employee', label: 'Employee', icon: User },
  { id: 'buddy', label: 'Buddy', icon: Heart },
  { id: 'leader', label: 'Leader', icon: GraduationCap },
  { id: 'manager', label: 'Manager', icon: Shield },
];

const Welcome = ({ onSaveProfile }) => {
  const [activeRole, setActiveRole] = useState('employee');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    team: 'Development',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeRole === 'manager') {
      const validManager = managersData.find(
        m => m.username === formData.username && m.password === formData.password && m.role === 'manager'
      );
      if (validManager) {
        onSaveProfile({ 
          role: 'manager', 
          username: validManager.username,
          fullName: validManager.username.charAt(0).toUpperCase() + validManager.username.slice(1)
        });
      } else {
        alert('Invalid Manager Username or Password!');
      }
    } else if (activeRole === 'buddy') {
      const validBuddy = managersData.find(
        m => m.username === formData.username && m.password === formData.password && m.role === 'buddy'
      );
      if (validBuddy) {
        onSaveProfile({ 
          role: 'buddy', 
          username: validBuddy.username,
          fullName: validBuddy.username.charAt(0).toUpperCase() + validBuddy.username.slice(1)
        });
      } else {
        alert('Invalid Buddy Username or Password!');
      }
    } else if (activeRole === 'leader') {
      const validLeader = managersData.find(
        m => m.username === formData.username && m.password === formData.password && m.role === 'leader'
      );
      if (validLeader) {
        onSaveProfile({ 
          role: 'leader', 
          username: validLeader.username,
          fullName: validLeader.username.charAt(0).toUpperCase() + validLeader.username.slice(1)
        });
      } else {
        alert('Invalid Leader Username or Password!');
      }
    } else {
      onSaveProfile({ ...formData, role: 'employee' });
    }
  };

  const isCredentialMode = activeRole === 'manager' || activeRole === 'buddy' || activeRole === 'leader';

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-xl p-8 card bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl relative overflow-hidden">
        
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8 mt-4">
            <img src={kpmgLogo} alt="KPMG Logo" className="h-12 mx-auto mb-6" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              {activeRole === 'manager' ? 'Manager Portal' : activeRole === 'buddy' ? 'Buddy Portal' : 'Welcome Aboard!'}
            </h1>
            <p className="text-slate-500 mt-2">
              {activeRole === 'manager' 
                ? 'Login to manage team onboarding progress.' 
                : activeRole === 'buddy' 
                  ? 'Login to track your new joiner support tasks.'
                  : "Let's setup your 30-day onboarding journey."}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl mb-8">
            {ROLES.map(role => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                    activeRole === role.id
                      ? 'bg-white text-primary-700 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {role.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {isCredentialMode ? (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-500" /> Username
                    </label>
                    <input type="text" name="username" required onChange={handleChange} value={formData.username || ''} className="input-field bg-white/50 backdrop-blur-sm" placeholder={activeRole === 'buddy' ? 'e.g. buddy1' : 'e.g. admin'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary-500" /> Password
                    </label>
                    <input type="password" name="password" required onChange={handleChange} value={formData.password || ''} className="input-field bg-white/50 backdrop-blur-sm" placeholder="••••••••" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-500" /> Full Name
                    </label>
                    <input type="text" name="fullName" required onChange={handleChange} value={formData.fullName} className="input-field bg-white/50 backdrop-blur-sm" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary-500" /> Email ID
                    </label>
                    <input type="email" name="email" required onChange={handleChange} value={formData.email} className="input-field bg-white/50 backdrop-blur-sm" placeholder="john@kpmg.com" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-500" /> Team
                    </label>
                    <select name="team" onChange={handleChange} value={formData.team} className="input-field bg-white/50 backdrop-blur-sm">
                      <option value="Development">Development</option>
                      <option value="QA">QA</option>
                      <option value="Design">Design</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" /> Joining Date
                    </label>
                    <input type="date" name="joiningDate" required onChange={handleChange} value={formData.joiningDate} className="input-field bg-white/50 backdrop-blur-sm" />
                  </div>
                </>
              )}
            </div>
            
            <button type="submit" className="w-full btn-primary mt-8 py-3 text-lg font-medium shadow-primary-500/25 hover:shadow-primary-500/40 relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {activeRole === 'manager' ? 'Login as Manager' : activeRole === 'buddy' ? 'Login as Buddy' : 'Start My Journey'}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
