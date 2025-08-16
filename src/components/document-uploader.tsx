'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileUp } from 'lucide-react';
import { updateAppliance } from '@/lib/data';
import { uploadFile } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface DocumentUploaderProps {
  applianceId: string;
  documentType: 'receipt' | 'warranty';
  onUploadComplete: () => void;
}

export function DocumentUploader({ applianceId, documentType, onUploadComplete }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const url = await uploadFile(file, `appliances/${applianceId}/${documentType}/${file.name}`);

      const fieldToUpdate = documentType === 'receipt' ? 'receiptUrl' : 'warrantyUrl';
      await updateAppliance(applianceId, { [fieldToUpdate]: url });

      toast({
        title: 'Upload Successful',
        description: `${documentType === 'receipt' ? 'Receipt' : 'Warranty'} has been uploaded.`,
      });

      onUploadComplete();
      router.refresh();

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Button asChild variant="outline">
        <label htmlFor={`${documentType}-upload`} className="cursor-pointer w-full">
            {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <FileUp className="mr-2 h-4 w-4" />
            )}
            Upload {documentType === 'receipt' ? 'Receipt' : 'Warranty'}
            <Input
                id={`${documentType}-upload`}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </label>
      </Button>
    </div>
  );
}
