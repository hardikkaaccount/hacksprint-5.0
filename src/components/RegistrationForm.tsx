import React, { useState, useRef } from 'react';
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
import { Upload, Rocket, X, CheckCircle2, AlertCircle } from 'lucide-react';
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

const RegistrationForm = ({ onClose }: { onClose?: () => void }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [hasJoinedGroup, setHasJoinedGroup] = useState<boolean>(false);
  
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
      // Check if file type is allowed
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, PPT, or PPTX file",
          variant: "destructive",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setSelectedFile(file);
        // Set the file in the form
        form.setValue('pptFile', file);
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
        setStatusMessage('❌ Please upload your PPT file to complete the registration.');
        toast({
          title: "Missing File",
          description: "Your PPT presentation is required for registration",
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
        setFormStatus('success');
        setStatusMessage(result.message);
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

  // Handle WhatsApp group join
  const handleJoinGroup = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
      setHasJoinedGroup(true);
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
      <DialogTitle className="sr-only">Registration Form</DialogTitle>
      
      {onClose && (
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 z-10 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Register Your Team
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="space-y-4">
            <h3 className="font-medium">Team Members</h3>
            
            {/* Member 1 */}
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
            <FormLabel htmlFor="pptFile">📎 PPT Upload Field</FormLabel>
            <div className="flex items-center gap-4">
              <Button 
                type="button"
                variant="outline"
                className="border-dashed border-2 border-white/20 hover:border-white/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              
              <input
                ref={fileInputRef}
                id="pptFile"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <span className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </div>
          
          {/* Form Status */}
          <RegistrationFormStatus status={formStatus} message={statusMessage} />
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-[1.02] mt-6"
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
      
      {formStatus === 'success' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0D1117] p-8 rounded-xl border border-white/10 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-center mb-4 text-white">
              Join Our WhatsApp Group
            </h3>
            <p className="text-white/80 text-center mb-6">
              To complete your registration, please join our WhatsApp group for important updates and communication.
            </p>
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleJoinGroup}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={hasJoinedGroup}
              >
                {hasJoinedGroup ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Joined Group
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Join WhatsApp Group
                  </>
                )}
              </Button>
              {!hasJoinedGroup && (
                <p className="text-red-400 text-sm text-center">
                  * Joining the WhatsApp group is mandatory to complete registration
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
