
import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface RegistrationFormStatusProps {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

const RegistrationFormStatus: React.FC<RegistrationFormStatusProps> = ({ status, message }) => {
  if (status === 'idle') return null;

  return (
    <div className={`mt-4 p-4 rounded-lg flex items-center ${
      status === 'submitting' ? 'bg-muted/30' :
      status === 'success' ? 'bg-success/20' :
      'bg-destructive/20'
    }`}>
      {status === 'submitting' && (
        <Loader2 className="h-5 w-5 text-white animate-spin mr-2" />
      )}

      {status === 'success' && (
        <CheckCircle className="h-5 w-5 text-success mr-2" />
      )}

      {status === 'error' && (
        <AlertCircle className="h-5 w-5 text-destructive mr-2" />
      )}

      <span className={`${
        status === 'success' ? 'text-success' :
        status === 'error' ? 'text-destructive' :
        'text-white'
      }`}>
        {message || 
          (status === 'submitting' ? 'Submitting your registration...' :
          status === 'success' ? 'Registration submitted successfully!' :
          'There was an error submitting your registration.')
        }
      </span>
    </div>
  );
};

export default RegistrationFormStatus;
