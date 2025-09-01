'use client';

import { useState, useEffect } from 'react';
import { BlockedIP } from '@/lib/types';
import { Heading } from '@/components/ui/Heading';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldXIcon, TrashIcon, PlusIcon, AlertTriangleIcon } from 'lucide-react';

export default function BlockedIPsPage() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newReason, setNewReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const addBlockedIP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newIP.trim()) {
      alert('Please enter an IP address');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/blocked-ips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip: newIP.trim(),
          reason: newReason.trim() || undefined
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setBlockedIPs([result.blockedIP, ...blockedIPs]);
        setNewIP('');
        setNewReason('');
        setShowAddForm(false);
      } else {
        const error = await response.json();
        alert(`Failed to block IP: ${error.error}`);
      }
    } catch (error) {
      console.error('Error blocking IP:', error);
      alert('Failed to block IP address');
    } finally {
      setSubmitting(false);
    }
  };

  const removeBlockedIP = async (id: string, ip: string) => {
    if (!confirm(`Are you sure you want to unblock IP ${ip}?`)) return;

    try {
      const response = await fetch(`/api/blocked-ips/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlockedIPs(blockedIPs.filter(blocked => blocked.id !== id));
      } else {
        alert('Failed to unblock IP address');
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
      alert('Failed to unblock IP address');
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
        <Heading level={1}>Blocked IP Addresses</Heading>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Block New IP
        </Button>
      </div>

      {/* Add IP Form */}
      {showAddForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={addBlockedIP} className="space-y-4">
              <div>
                <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-1">
                  IP Address *
                </label>
                <Input
                  id="ip"
                  type="text"
                  placeholder="192.168.1.1"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <Input
                  id="reason"
                  type="text"
                  placeholder="Reason for blocking"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Blocking...' : 'Block IP'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewIP('');
                    setNewReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShieldXIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{blockedIPs.length}</p>
                <p className="text-sm text-gray-600">Blocked IPs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocked IPs List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked IP Addresses</h3>

          {blockedIPs.length === 0 ? (
            <div className="text-center py-8">
              <ShieldXIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No IP addresses are currently blocked</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedIPs.map((blockedIP) => (
                <div
                  key={blockedIP.id}
                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <AlertTriangleIcon className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{blockedIP.ip}</p>
                      {blockedIP.reason && (
                        <p className="text-sm text-gray-600">{blockedIP.reason}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Blocked on {formatDate(blockedIP.blocked_at)} by {blockedIP.blocked_by}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeBlockedIP(blockedIP.id, blockedIP.ip)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
