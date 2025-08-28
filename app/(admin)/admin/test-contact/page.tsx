'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';

export default function ContactTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testContactAPI = async () => {
    setLoading(true);
    setTestResult('');

    try {
      // Test POST (create contact)
      const postResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'API Test Message',
          message: 'This is a test message to verify the contact API functionality.'
        }),
      });

      const postData = await postResponse.json();
      
      if (postResponse.ok) {
        setTestResult(prev => prev + '✅ POST /api/contact - SUCCESS\n');
        setTestResult(prev => prev + `Created contact with ID: ${postData.id}\n\n`);

        // Test GET (fetch contacts)
        const getResponse = await fetch('/api/contact');
        const getData = await getResponse.json();

        if (getResponse.ok) {
          setTestResult(prev => prev + '✅ GET /api/contact - SUCCESS\n');
          setTestResult(prev => prev + `Found ${getData.length} contact messages\n\n`);
        } else {
          setTestResult(prev => prev + '❌ GET /api/contact - FAILED\n');
          setTestResult(prev => prev + `Error: ${getData.error}\n\n`);
        }
      } else {
        setTestResult(prev => prev + '❌ POST /api/contact - FAILED\n');
        setTestResult(prev => prev + `Error: ${postData.error}\n\n`);
      }
    } catch (error) {
      setTestResult(prev => prev + '❌ NETWORK ERROR\n');
      setTestResult(prev => prev + `Error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Heading level={1} className="mb-8">Contact API Test Page</Heading>
        
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test Contact Functionality</h2>
              <p className="text-gray-600 mb-6">
                This page tests the contact form API endpoints. Make sure you&apos;ve run the database migration first.
              </p>
              
              <Button 
                onClick={testContactAPI} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? 'Testing...' : 'Test Contact API'}
              </Button>

              {testResult && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Test Results:</h3>
                  <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-green-600">✅ Environment Variables</h3>
                  <p>Make sure these are set in your .env.local file:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                    <li>SUPABASE_SERVICE_ROLE_KEY</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600">📋 Database Migration</h3>
                  <p>Run the contacts migration in your Supabase SQL editor:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to your Supabase dashboard</li>
                    <li>Navigate to SQL Editor</li>
                    <li>Copy content from supabase-contacts-migration.sql</li>
                    <li>Execute the migration</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-600">🔗 Navigation</h3>
                  <p>Once everything is working:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><a href="/" className="text-blue-600 hover:underline">Portfolio Home</a> - Test the contact form</li>
                    <li><a href="/admin/messages" className="text-blue-600 hover:underline">Admin Messages</a> - View submitted messages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
