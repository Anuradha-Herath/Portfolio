'use client';

import { useState, useEffect } from 'react';
import { BlockedIP } from '@/lib/types';
import { Heading } from '@/components/ui/Heading';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldIcon,
  PlusIcon,
  TrashIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BanIcon
} from 'lucide-react';

export default function BlockedIPsPage() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIP, setNewIP] = useState('');
  const [newReason, setNewReason] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  const fetchBlockedIPs = async () => {
    try {
      const response = await fetch('/api/blocked-ips');
      if (response.ok) {
        const data = await response.json();
        setBlockedIPs(data);
      }
    } catch (error) {
      console.error('Error fetching blocked IPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBlockedIP = async () => {
    if (!newIP.trim()) {
      alert('Please enter an IP address');
      return;
    }

    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(newIP.trim())) {
      alert('Please enter a valid IP address');
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/blocked-ips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip: newIP.trim(),
          reason: newReason.trim() || 'Blocked from admin panel'
        }),
      });

      if (response.ok) {
        const newBlockedIP = await response.json();
        setBlockedIPs([newBlockedIP, ...blockedIPs]);
        setNewIP('');
        setNewReason('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to block IP');
      }
    } catch (error) {
      console.error('Error blocking IP:', error);
      alert('Failed to block IP');
    } finally {
      setIsAdding(false);
    }
  };

  const unblockIP = async (ip: string) => {
    if (!confirm(`Are you sure you want to unblock IP ${ip}?`)) return;

    try {
      const response = await fetch(`/api/blocked-ips/${encodeURIComponent(ip)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlockedIPs(blockedIPs.filter(blockedIP => blockedIP.ip !== ip));
      } else {
        alert('Failed to unblock IP');
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
      alert('Failed to unblock IP');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading level={1} className="flex items-center">
            <ShieldIcon className="w-8 h-8 mr-3 text-red-500" />
            Blocked IP Addresses
          </Heading>
          <p className="text-gray-600 mt-2">
            Manage IP addresses that are blocked from submitting contact forms
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {blockedIPs.length} blocked IP{blockedIPs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Add New Blocked IP */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center text-red-700 dark:text-red-300">
            <PlusIcon className="w-5 h-5 mr-2" />
            Block New IP Address
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IP Address *
              </label>
              <Input
                type="text"
                placeholder="192.168.1.1"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason (Optional)
              </label>
              <Input
                type="text"
                placeholder="Spam, abuse, etc."
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addBlockedIP}
                disabled={isAdding}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Blocking...
                  </>
                ) : (
                  <>
                    <BanIcon className="w-4 h-4 mr-2" />
                    Block IP
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blocked IPs List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <ShieldIcon className="w-5 h-5 mr-2 text-red-500" />
            Blocked IP Addresses
          </h3>
        </CardHeader>
        <CardContent>
          {blockedIPs.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Blocked IPs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All IP addresses are currently allowed to submit contact forms.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedIPs.map((blockedIP) => (
                <div
                  key={blockedIP.id}
                  className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <AlertTriangleIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {blockedIP.ip}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Blocked
                        </span>
                      </div>
                      {blockedIP.reason && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Reason: {blockedIP.reason}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          Blocked: {formatDate(blockedIP.blocked_at)}
                        </span>
                        <span>By: {blockedIP.blocked_by}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => unblockIP(blockedIP.ip)}
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Unblock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <BanIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Blocked
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {blockedIPs.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <ShieldIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Protection Active
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {blockedIPs.length > 0 ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {blockedIPs.length > 0
                    ? formatDate(Math.max(...blockedIPs.map(ip => new Date(ip.blocked_at).getTime())).toString())
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
