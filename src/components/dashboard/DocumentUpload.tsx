
import React, { useState } from "react";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Document = {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: Date;
  url: string;
};

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Consultation Agreement.pdf",
    size: "1.2 MB",
    type: "application/pdf",
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: "#",
  },
  {
    id: "doc-2",
    name: "Property Details.docx",
    size: "845 KB",
    type: "application/docx",
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    url: "#",
  },
  {
    id: "doc-3",
    name: "Financial Statement.xlsx",
    size: "1.5 MB",
    type: "application/xlsx",
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    url: "#",
  },
];

const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    // This would integrate with actual file upload in a real app
    const files = Array.from(e.dataTransfer.files);
    console.log("Files dropped:", files);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would integrate with actual file upload in a real app
    const files = e.target.files;
    if (files) {
      console.log("Files selected:", Array.from(files));
    }
  };
  
  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Upload area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging ? "border-legal-primary bg-legal-light" : "border-gray-200 hover:border-legal-primary"
        }`}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium">Drag documents here</h3>
        <p className="mt-1 text-xs text-gray-500">or click to browse</p>
        <input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
        />
        <Button 
          variant="outline"
          className="mt-3 text-xs h-8"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          Select Files
        </Button>
      </div>
      
      {/* Document list */}
      <div className="mt-4 flex-grow overflow-hidden">
        <h3 className="text-sm font-medium mb-2">Your Documents</h3>
        <ScrollArea className="h-[calc(100%-2rem)] pr-3">
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="border rounded-md p-2.5 flex items-center justify-between bg-white"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-legal-primary" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[160px]">
                        {doc.name}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{doc.size}</span>
                        <span className="text-xs text-gray-400 mx-1.5">•</span>
                        <span className="text-xs text-gray-500">
                          {doc.uploadDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      title="Delete"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                No documents uploaded
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DocumentUpload;
