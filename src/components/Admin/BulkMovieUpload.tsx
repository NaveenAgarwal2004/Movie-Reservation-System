import React, { useState } from 'react';
import { CloudArrowUpIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

interface MovieCSVData {
  title: string;
  description: string;
  genre: string;
  duration: number;
  rating: string;
  releaseDate: string;
  poster: string;
  director: string;
  language: string;
  country: string;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

const BulkMovieUpload: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [preview, setPreview] = useState<MovieCSVData[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      parseCSV(droppedFile);
    } else {
      toast.error('Please upload a CSV file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (csvFile: File) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const movies = results.data as MovieCSVData[];
        setPreview(movies.slice(0, 5)); // Show first 5 for preview
      },
      error: (error) => {
        toast.error('Error parsing CSV: ' + error.message);
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const movies = results.data as MovieCSVData[];
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const movie of movies) {
          try {
            // Transform genre string to array
            const movieData = {
              ...movie,
              genre: movie.genre.split(',').map(g => g.trim()),
              duration: parseInt(movie.duration.toString()),
            };

            const response = await fetch('/api/admin/movies', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(movieData)
            });

            if (response.ok) {
              success++;
            } else {
              failed++;
              const errorData = await response.json();
              errors.push(`${movie.title}: ${errorData.message}`);
            }
          } catch (error: any) {
            failed++;
            errors.push(`${movie.title}: ${error.message}`);
          }
        }

        setUploadResult({ success, failed, errors });
        setIsUploading(false);
        
        if (success > 0) {
          toast.success(`Successfully uploaded ${success} movies!`);
          onSuccess();
        }
      },
      error: (error) => {
        toast.error('Error parsing CSV: ' + error.message);
        setIsUploading(false);
      }
    });
  };

  const downloadTemplate = () => {
    const template = `title,description,genre,duration,rating,releaseDate,poster,director,language,country
The Dark Knight,Batman faces the Joker,"Action,Crime,Drama",152,PG-13,2008-07-18,https://example.com/poster.jpg,Christopher Nolan,English,USA
Inception,A thief enters dreams,"Action,Sci-Fi,Thriller",148,PG-13,2010-07-16,https://example.com/poster2.jpg,Christopher Nolan,English,USA`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie-upload-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Bulk Movie Upload</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!uploadResult ? (
            <>
              {/* Instructions */}
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">Instructions:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>1. Download the CSV template</li>
                  <li>2. Fill in your movie data</li>
                  <li>3. Upload the completed CSV file</li>
                  <li>4. Review the preview and confirm upload</li>
                </ul>
                <button
                  onClick={downloadTemplate}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Download CSV Template →
                </button>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  {file ? file.name : 'Drag and drop your CSV file here'}
                </p>
                <p className="text-gray-400 text-sm mb-4">or</p>
                <label className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview */}
              {preview.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Preview (First 5 rows)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                            Title
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                            Genre
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                            Duration
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                            Rating
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                            Director
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {preview.map((movie, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-white">{movie.title}</td>
                            <td className="px-4 py-2 text-sm text-gray-400">{movie.genre}</td>
                            <td className="px-4 py-2 text-sm text-gray-400">{movie.duration} min</td>
                            <td className="px-4 py-2 text-sm text-gray-400">{movie.rating}</td>
                            <td className="px-4 py-2 text-sm text-gray-400">{movie.director}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Movies'
                  )}
                </button>
              </div>
            </>
          ) : (
            // Upload Results
            <div>
              <div className="text-center mb-6">
                {uploadResult.failed === 0 ? (
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                )}
                <h3 className="text-2xl font-bold text-white mb-2">Upload Complete</h3>
                <p className="text-gray-400">
                  {uploadResult.success} movies uploaded successfully
                  {uploadResult.failed > 0 && `, ${uploadResult.failed} failed`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-400">{uploadResult.success}</p>
                  <p className="text-sm text-gray-400">Successful</p>
                </div>
                <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-400">{uploadResult.failed}</p>
                  <p className="text-sm text-gray-400">Failed</p>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
                  <h4 className="text-white font-semibold mb-2">Errors:</h4>
                  <ul className="text-sm text-red-400 space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setUploadResult(null);
                    setFile(null);
                    setPreview([]);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Upload More
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BulkMovieUpload;