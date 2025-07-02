import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, Copy, Download, Smartphone, Image as ImageIcon, ExpandIcon, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCallScreen, downloadImage, copyImageToClipboard } from "@/lib/canvas-utils";

export default function CallScreenGenerator() {
  const [formData, setFormData] = useState({
    companyName: "",
    personName: "",
    profileImage: null as string | null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, profileImage: result }));
      setShowImagePreview(true);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleGenerate = async () => {
    if (!formData.companyName.trim() || !formData.personName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both company name and caller name.",
        variant: "destructive",
      });
      return;
    }

    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      const imageDataUrl = await generateCallScreen(canvasRef.current, formData);
      setGeneratedImage(imageDataUrl);
      toast({
        title: "Success!",
        description: "Call screen generated successfully.",
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating the call screen. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedImage) return;

    setCopyStatus('copying');
    try {
      await copyImageToClipboard(generatedImage);
      setCopyStatus('copied');
      toast({
        title: "Copied!",
        description: "Image copied to clipboard successfully.",
      });
      
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    } catch (error) {
      setCopyStatus('idle');
      console.error('Copy failed:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy image to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const filename = `fake-call-${formData.personName.replace(/\s+/g, '-').toLowerCase()}.png`;
    downloadImage(generatedImage, filename);
    toast({
      title: "Downloaded!",
      description: "Image saved to your device.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Call Details</h2>
          
          <div className="space-y-6">
            {/* Company Name Input */}
            <div>
              <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="e.g., Mail0, Apple Inc."
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>

            {/* Person Name Input */}
            <div>
              <Label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-2">
                Caller Name
              </Label>
              <Input
                id="personName"
                type="text"
                placeholder="e.g., Nizzy, John Smith"
                value={formData.personName}
                onChange={(e) => handleInputChange('personName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>

            {/* Profile Picture Upload */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture (Optional)
              </Label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                {!showImagePreview ? (
                  <div>
                    <CloudUpload className="mx-auto text-4xl text-gray-400 mb-4" size={48} />
                    <p className="text-lg font-medium text-gray-600 mb-2">Drop image here or click to browse</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                ) : (
                  <div>
                    <img 
                      src={formData.profileImage!} 
                      alt="Profile preview" 
                      className="w-24 h-24 rounded-full mx-auto object-cover mb-2" 
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Call Screen'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <div className="flex space-x-2">
              <Button
                onClick={handleCopy}
                disabled={!generatedImage || copyStatus === 'copying'}
                variant="outline"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copyStatus === 'copying' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : copyStatus === 'copied' ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!generatedImage}
                className="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
            {!generatedImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <Smartphone className="text-6xl mb-4" size={64} />
                <p className="text-lg font-medium mb-2">Call Screen Preview</p>
                <p className="text-sm text-center px-4">Fill in the details above and click "Generate" to see your fake call screen</p>
              </div>
            ) : (
              <img 
                src={generatedImage} 
                alt="Generated call screen" 
                className="w-full h-full object-contain"
              />
            )}
            <canvas
              ref={canvasRef}
              className="hidden"
              width={1080}
              height={1920}
            />
          </div>

          {/* Call Screen Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ImageIcon className="mr-2" size={16} />
              <span>Format: PNG</span>
            </div>
            <div className="flex items-center">
              <ExpandIcon className="mr-2" size={16} />
              <span>Dimensions: 1080x1920</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
