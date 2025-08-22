"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { DataCard } from '@/components/(admin)/DataCard';
import { CertificationForm } from '@/components/(admin)/CertificationForm';
import { Certification } from '@/lib/types';

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [courseCertifications, setCourseCertifications] = useState<Certification[]>([]);
  const [competitionCertifications, setCompetitionCertifications] = useState<Certification[]>([]);
  const [activeTab, setActiveTab] = useState<'course' | 'competition'>('course');
  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    // Filter certifications by category
    setCourseCertifications(certifications.filter(cert => cert.category === 'course'));
    setCompetitionCertifications(certifications.filter(cert => cert.category === 'competition'));
  }, [certifications]);

  const fetchCertifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/certifications');
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      } else {
        console.error('Failed to fetch certifications');
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const url = '/api/certifications';
      const method = editingCertification ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        await fetchCertifications();
        setShowForm(false);
        setEditingCertification(null);
      } else {
        const error = await response.json();
        console.error('Failed to save certification:', error);
        alert('Failed to save certification: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      alert('Error saving certification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/certifications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCertifications();
      } else {
        const error = await response.json();
        console.error('Failed to delete certification:', error);
        alert('Failed to delete certification');
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Error deleting certification');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCertification(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const currentCertifications = activeTab === 'course' ? courseCertifications : competitionCertifications;

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading level={1}>
            {editingCertification ? 'Edit' : 'Add'} Certification
          </Heading>
        </div>
        <CertificationForm
          certification={editingCertification || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={1}>Certifications</Heading>
        <Button onClick={() => setShowForm(true)}>
          Add Certification
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('course')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'course'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Course Certifications ({courseCertifications.length})
        </button>
        <button
          onClick={() => setActiveTab('competition')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'competition'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Competition Certificates ({competitionCertifications.length})
        </button>
      </div>

      {/* Certifications Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading certifications...</p>
        </div>
      ) : currentCertifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No {activeTab} certifications found.</p>
          <Button 
            onClick={() => setShowForm(true)}
            variant="secondary"
            className="mt-4"
          >
            Add Your First {activeTab === 'course' ? 'Course Certification' : 'Competition Certificate'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCertifications.map((certification) => (
            <DataCard
              key={certification.id}
              title={certification.title}
              onEdit={() => handleEdit(certification)}
              onDelete={() => handleDelete(certification.id)}
            >
              <div className="space-y-2">
                {certification.image_url && (
                  <div className="mb-3">
                    <img 
                      src={certification.image_url} 
                      alt={`${certification.title} certificate`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {certification.issuer}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {formatDate(certification.date)}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Category:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    certification.category === 'course' 
                      ? 'bg-blue-900/80 text-blue-100 border border-blue-700' 
                      : 'bg-green-900/80 text-green-100 border border-green-700'
                  }`}>
                    {certification.category === 'course' ? 'Course' : 'Competition'}
                  </span>
                </p>
                {certification.credential_id && (
                  <p className="text-sm text-gray-600">
                    <strong>ID:</strong> {certification.credential_id}
                  </p>
                )}
                {certification.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {certification.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {certification.url && (
                    <a
                      href={certification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-800/80 text-blue-100 px-2 py-1 rounded hover:bg-blue-900 border border-blue-700 transition-colors"
                    >
                      Verify
                    </a>
                  )}
                  {certification.certificate_file_url && (
                    <a
                      href={certification.certificate_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-800/80 text-green-100 px-2 py-1 rounded hover:bg-green-900 border border-green-700 transition-colors"
                    >
                      View Certificate
                    </a>
                  )}
                  {certification.image_url && (
                    <a
                      href={certification.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-purple-800/80 text-purple-100 px-2 py-1 rounded hover:bg-purple-900 border border-purple-700 transition-colors"
                    >
                      View Image
                    </a>
                  )}
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{courseCertifications.length}</div>
            <div className="text-sm text-gray-600">Course Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{competitionCertifications.length}</div>
            <div className="text-sm text-gray-600">Competition Certificates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{certifications.length}</div>
            <div className="text-sm text-gray-600">Total Certifications</div>
          </div>
        </div>
      </div>
    </div>
  );
}