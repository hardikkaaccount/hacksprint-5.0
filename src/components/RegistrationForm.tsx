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
      // Check if file type is allowed (PDF only)
      const allowedTypes = [
        'application/pdf'
      ];
      
      // Check file size (limit to 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type) || !file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only",
          variant: "destructive",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else if (file.size > maxSizeInBytes) {
        toast({
          title: "File too large",
          description: "Please upload a PDF file smaller than 10MB",
          variant: "destructive",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        // File is valid, set it
        console.log(`File selected: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        setSelectedFile(file);
        // Set the file in the form
        form.setValue('pptFile', file);
        
        // Feedback for successful file selection
        toast({
          title: "File selected",
          description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) ready to upload`,
          variant: "default",
        });
      }
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
          
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Register Your Team
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team Name */}
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Lead Name */}
                <FormField
                  control={form.control}
                  name="leadName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Lead's Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter team lead's email id" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lead Phone */}
                <FormField
                  control={form.control}
                  name="leadPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter contact number" 
                          type="tel" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* College Name */}
                <FormField
                  control={form.control}
                  name="collegeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Hackathon Domain */}
              <FormField
                control={form.control}
                name="hackathonDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Software Development">Software Development</SelectItem>
                        <SelectItem value="Hardware Development">Hardware Development</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Team Members */}
              <div className="space-y-3">
                <h3 className="font-medium">Team Members</h3>
                
                {/* Member 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="member1Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 1 Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter member name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="member1USN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 1 USN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter USN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Member 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="member2Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 2 Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter member name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="member2USN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 2 USN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter USN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Member 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="member3Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 3 Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter member name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="member3USN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 3 USN (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter USN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Member 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="member4Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 4 Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter member name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="member4USN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member 4 USN (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter USN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* PPT Upload Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="pptFile">📎 PDF Project Proposal (In pdf format)</FormLabel>
                  <a 
                    href="https://drive.google.com/drive/folders/1NHNXRBMk1gtzMSTHOYmDaUomQzZQfLop?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Download template
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-dashed border-2 border-white/20 hover:border-white/30"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose PDF File
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    id="pptFile"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <span className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-xs">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </div>
              </div>
              
              {/* Form Status */}
              <RegistrationFormStatus status={formStatus} message={statusMessage} />
              
              {/* Registration Fee Note */}
              <div className="text-amber-400 text-sm p-3 border border-amber-400/30 rounded-md bg-amber-400/10">
                <p className="font-medium">Note: A registration fee of ₹250 per member of the team will be collected if the idea gets selected. Wishing you all the best! The results will be announced in the WhatsApp group. You will find the group link after submission — do join!</p>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-[1.02] mt-4"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? (
                  <Rocket className="mr-2 h-4 w-4 animate-bounce" />
                ) : (
                  <Rocket className="mr-2 h-4 w-4" />
                )}
                Submit Registration
              </Button>
            </form>
          </Form>
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
