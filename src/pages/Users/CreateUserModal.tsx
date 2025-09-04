import React, { useState } from 'react';
import { Modal } from '../../components/Common/Modal';
import { Button } from '../../components/Common/Button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

interface PasswordValidation {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'member' as 'admin' | 'manager' | 'member'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    isValid: false,
    requirements: {
      minLength: false,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false
    }
  });

  const validatePassword = (password: string): PasswordValidation => {
    const minLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    
    return {
      isValid: minLength && hasLower && hasUpper && hasNumber && hasSpecial,
      requirements: {
        minLength,
        hasLower,
        hasUpper,
        hasNumber,
        hasSpecial
      }
    };
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordValidation(validatePassword(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    setLoading(true);
    try {
      const result = await userService.createUser(formData);
      
      if (result.success) {
        toast.success(`User "${formData.displayName}" created successfully!`);
        onUserCreated();
        onClose();
        setFormData({
          email: '',
          password: '',
          displayName: '',
          role: 'member'
        });
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Display Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
              placeholder="Enter secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Requirements */}
          <div className="mt-2 space-y-1">
            <div className="text-xs text-slate-400">Password must contain:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-1 ${passwordValidation.requirements.minLength ? 'text-green-400' : 'text-slate-500'}`}>
                <span>{passwordValidation.requirements.minLength ? '✓' : '○'}</span>
                8+ characters
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.requirements.hasUpper ? 'text-green-400' : 'text-slate-500'}`}>
                <span>{passwordValidation.requirements.hasUpper ? '✓' : '○'}</span>
                Uppercase letter
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.requirements.hasLower ? 'text-green-400' : 'text-slate-500'}`}>
                <span>{passwordValidation.requirements.hasLower ? '✓' : '○'}</span>
                Lowercase letter
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.requirements.hasNumber ? 'text-green-400' : 'text-slate-500'}`}>
                <span>{passwordValidation.requirements.hasNumber ? '✓' : '○'}</span>
                Number
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.requirements.hasSpecial ? 'text-green-400' : 'text-slate-500'}`}>
                <span>{passwordValidation.requirements.hasSpecial ? '✓' : '○'}</span>
                Special char (@$!%*?&)
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'manager' | 'member' })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <div className="mt-1 text-xs text-slate-400">
            {formData.role === 'admin' && 'Full system access including user management'}
            {formData.role === 'manager' && 'Import, inventory, streams, and reports access'}
            {formData.role === 'member' && 'Limited access to core functions'}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            disabled={!passwordValidation.isValid || !formData.email || !formData.displayName}
            className="flex-1"
          >
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}