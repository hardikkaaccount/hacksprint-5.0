import React, { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Rocket, X, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { submitRegistrationToGoogleSheets, RegistrationData } from '@/utils/googleSheets';
import RegistrationFormStatus from './RegistrationFormStatus';
import { DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Create form schema with validation
const formSchema = z.object({
  teamName: z.string().min(2, { message: 'Team name is required' }),
  leadName: z.string().min(2, { message: 'Team lead email is required' }),
  leadPhone: z.string().min(10, { message: 'Valid phone number is required' }),
  collegeName: z.string().min(2, { message: 'College name is required' }),
  hackathonDomain: z.string().min(1, { message: 'Please select a domain' }),
  member1Name: z.string().min(2, { message: 'Member 1 name is required (Leader)' }),
  member1USN: z.string().min(2, { message: 'Member 1 USN is required' }),
  member2Name: z.string().min(2, { message: 'Member 2 name is required' }),
  member2USN: z.string().min(2, { message: 'Member 2 USN is required' }),
  member3Name: z.string().optional(),
  member3USN: z.string().optional(),
  member4Name: z.string().optional(),
  member4USN: z.string().optional(),
  pptFile: z.any().refine((file) => file !== null, { message: 'PPT file is required' }),
});

type FormValues = z.infer<typeof formSchema>;

// Create a standalone success popup component
const SuccessPopup = ({ 
  teamName, 
  whatsappLink, 
  onClose, 
  hasJoinedGroup, 
  setHasJoinedGroup 
}: { 
  teamName: string; 
  whatsappLink: string; 
  onClose: () => void; 
  hasJoinedGroup: boolean; 
  setHasJoinedGroup: (joined: boolean) => void; 
}) => {
  // Handle WhatsApp group join
  const handleJoinGroup = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
      setHasJoinedGroup(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-md">
      <div className="bg-gradient-to-b from-[#0D1117] to-[#161b22] p-6 md:p-8 rounded-xl border border-purple-500/30 w-full max-w-md mx-auto shadow-lg shadow-purple-500/20 relative">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-center mb-2 text-white">
            Registration Successful!
          </h3>
          <p className="text-lg font-medium text-center text-white">
            Congratulations {teamName}!
          </p>
          <p className="text-white/80 text-center mt-4">
            Welcome to Hacksprint 5.0! Get ready for an exciting journey of innovation and creativity.
          </p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <p className="text-white/90 text-center font-medium">
            Join our WhatsApp group for important updates and to connect with other participants
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleJoinGroup}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-lg"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Join WhatsApp Group
          </Button>
          
          <Button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            Close
          </Button>
          
          {!hasJoinedGroup && (
            <p className="text-amber-400 text-sm text-center mt-3 font-medium">
              * Joining the WhatsApp group is required to complete registration
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const RegistrationForm = ({ onClose }: { onClose?: () => void }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [hasJoinedGroup, setHasJoinedGroup] = useState<boolean>(false);
  const [registeredTeamName, setRegisteredTeamName] = useState<string>('');
  const [showRegistrationForm, setShowRegistrationForm] = useState<boolean>(true);
  
  // Global state for the popup
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  
  // Explicitly manage popup state
  useEffect(() => {
    if (formStatus === 'success') {
      setShowRegistrationForm(false);
      setShowSuccessPopup(true);
    }
  }, [formStatus]);
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: '',
      leadName: '',
      leadPhone: '',
      collegeName: '',
      hackathonDomain: '',
      member1Name: '',
      member1USN: '',
      member2Name: '',
      member2USN: '',
      member3Name: '',
      member3USN: '',
      member4Name: '',
      member4USN: '',
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      console.log(`File selected: ${file.name}, Type: ${file.type}, Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      
      // Check if file type is allowed (PDF only)
      const allowedTypes = [
        'application/pdf'
      ];
      
      // Validate file type thoroughly
      const isPdf = 
        allowedTypes.includes(file.type) || 
        file.name.toLowerCase().endsWith('.pdf');
      
      if (!isPdf) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only (.pdf extension)",
          variant: "destructive",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      // File is valid, set it
      console.log(`File validated: ${file.name}, Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      setSelectedFile(file);
      // Set the file in the form
      form.setValue('pptFile', file);
      
      // Feedback for successful file selection
      toast({
        title: "File selected",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB) ready to upload`,
        variant: "default",
      });
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setFormStatus('submitting');
    setStatusMessage('🚀 Processing your registration...\n\n⏳ Please wait while we set up your team for Hacksprint 5.0!');
    
    try {
      // Ensure the file is set
      if (!selectedFile) {
        setFormStatus('error');
        setStatusMessage('❌ Please upload your PDF project proposal to complete the registration.');
        toast({
          title: "Missing File",
          description: "Your PDF project proposal is required for registration",
          variant: "destructive",
        });
        return;
      }
      
      // Convert form values to RegistrationData type
      const registrationData: RegistrationData = {
        teamName: values.teamName,
        leadName: values.leadName,
        leadPhone: values.leadPhone,
        collegeName: values.collegeName,
        hackathonDomain: values.hackathonDomain,
        member1Name: values.member1Name,
        member1USN: values.member1USN,
        member2Name: values.member2Name,
        member2USN: values.member2USN,
        member3Name: values.member3Name || "",
        member3USN: values.member3USN || "",
        member4Name: values.member4Name || "",
        member4USN: values.member4USN || "",
        pptFile: selectedFile,
      };
      
      // Submit to Google Sheets
      const result = await submitRegistrationToGoogleSheets(registrationData);
      
      if (result.success) {
        setRegisteredTeamName(values.teamName);
        setFormStatus('success');
        setStatusMessage(`🎉 Congratulations ${values.teamName}! Your registration is successful! 🎉`);
        setWhatsappLink(result.whatsappLink || '');
        setHasJoinedGroup(false);
        form.reset();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        toast({
          title: "🎉 Registration Successful!",
          description: "Please join our WhatsApp group to complete your registration",
        });
      } else {
        setFormStatus('error');
        setStatusMessage(result.message);
        
        toast({
          title: "❌ Registration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormStatus('error');
      setStatusMessage(`❌ An unexpected error occurred. Please try again later.`);
      
      toast({
        title: "❌ Registration Error",
        description: "Failed to submit your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Close success popup
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Registration Form */}
      {showRegistrationForm && (
        <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10 max-h-[90vh] overflow-y-auto w-full">
          <DialogTitle className="sr-only">Registration Form</DialogTitle>
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-red-500">
              Registration Closed
            </h2>
            <p className="text-white/80 text-lg">
              Thank you for your interest in HackSprint 5.0. Registration period has ended.
            </p>
            <div className="mt-6 space-y-4">
              <p className="text-white/90 text-lg">Don't miss out on future opportunities! Join our vibrant community of innovators and tech enthusiasts.</p>
              <p className="text-white/80 text-sm">Get exclusive updates about upcoming hackathons, workshops, and tech events at PESCE!</p>
              <a 
                href="https://chat.whatsapp.com/G1uQtzYAYQg003BeBNq2qD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors transform hover:scale-105 duration-300 font-semibold shadow-lg hover:shadow-green-500/20"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join Our Tech Community
              </a>
            </div>
            <Button 
              onClick={onClose}
              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      {/* Render the success popup as a completely separate component */}
      {showSuccessPopup && (
        <SuccessPopup 
          teamName={registeredTeamName}
          whatsappLink={whatsappLink}
          onClose={handleCloseSuccessPopup}
          hasJoinedGroup={hasJoinedGroup}
          setHasJoinedGroup={setHasJoinedGroup}
        />
      )}
    </>
  );
};

export default RegistrationForm;
