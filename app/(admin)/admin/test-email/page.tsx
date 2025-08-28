'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        data,
        status: response.status
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({
        success: false,
        data: { error: 'Network error', details: errorMessage },
        status: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Email Configuration Test</h1>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">
            Click the button below to test your email configuration. This will send a test email to your configured Gmail address.
          </p>
          
          <Button 
            onClick={testEmail}
            disabled={isLoading}
            className="mb-4"
          >
            {isLoading ? 'Sending Test Email...' : 'Send Test Email'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✅ Success!' : '❌ Error'}
              </h3>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📧 Current Email Configuration:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Service: Gmail</li>
              <li>• From: {process.env.NEXT_PUBLIC_GMAIL_USER || 'Check environment variables'}</li>
              <li>• The test will send an email to your own address</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Make sure your Gmail account has 2-factor authentication enabled</li>
              <li>• Use an App Password, not your regular Gmail password</li>
              <li>• Check your spam folder if you don&apos;t receive the email</li>
              <li>• Ensure GMAIL_USER and GMAIL_PASS are set in your .env.local file</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
