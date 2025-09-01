'use client';

import { useState, useEffect } from 'react';
import { ContactMessage } from '@/lib/types';
import { Heading } from '@/components/ui/Heading';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MailIcon, MailOpenIcon, ReplyIcon, TrashIcon, ClockIcon, BanIcon, CheckCircleIcon } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchBlockedIPs();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedIPs = async () => {
    try {
      const response = await fetch('/api/blocked-ips');
      if (response.ok) {
        const data = await response.json();
        setBlockedIPs(data.map((item: any) => item.ip));
      }
    } catch (error) {
      console.error('Error fetching blocked IPs:', error);
    }
  };

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status } : msg
        ));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const blockIP = async (ip: string) => {
    if (!confirm(`Are you sure you want to block IP ${ip}?`)) return;

    try {
      const response = await fetch('/api/blocked-ips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip, reason: 'Blocked from admin panel' }),
      });

      if (response.ok) {
        setBlockedIPs([...blockedIPs, ip]);
      }
    } catch (error) {
      console.error('Error blocking IP:', error);
    }
  };

  const unblockIP = async (ip: string) => {
    if (!confirm(`Are you sure you want to unblock IP ${ip}?`)) return;

    try {
      const response = await fetch(`/api/blocked-ips/${ip}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlockedIPs(blockedIPs.filter(blockedIP => blockedIP !== ip));
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const getStatusIcon = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread':
        return <MailIcon className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <MailOpenIcon className="w-4 h-4 text-green-500" />;
      case 'replied':
        return <ReplyIcon className="w-4 h-4 text-purple-500" />;
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'replied':
        return 'bg-purple-100 text-purple-800';
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
        <Heading level={1}>Contact Messages</Heading>
        <div className="text-sm text-gray-600">
          {messages.length} total messages
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'unread', 'read', 'replied'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                filter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status} ({status === 'all' ? messages.length : messages.filter(m => m.status === status).length})
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-gray-900">Messages</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`cursor-pointer transition-colors rounded-lg ${
                  selectedMessage?.id === message.id
                    ? 'ring-2 ring-blue-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === 'unread') {
                    updateMessageStatus(message.id, 'read');
                  }
                }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(message.status)}
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {message.name}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {message.subject}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <ClockIcon className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">
                            {formatDate(message.created_at)}
                          </p>
                          {message.ip && (
                            <>
                              <span>•</span>
                              <p className="text-xs text-gray-400">
                                IP: {message.ip}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedMessage.subject}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>From: {selectedMessage.name}</span>
                        <span>•</span>
                        <span>{selectedMessage.email}</span>
                        <span>•</span>
                        <span>{formatDate(selectedMessage.created_at)}</span>
                        {selectedMessage.ip && (
                          <>
                            <span>•</span>
                            <span>IP: {selectedMessage.ip}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      disabled={selectedMessage.status === 'read'}
                      variant="outline"
                      size="sm"
                    >
                      <MailOpenIcon className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      disabled={selectedMessage.status === 'replied'}
                      variant="outline"
                      size="sm"
                    >
                      <ReplyIcon className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </Button>
                    <Button
                      onClick={() => {
                        const subject = `Re: ${selectedMessage.subject}`;
                        const body = `Hello ${selectedMessage.name},\n\nThank you for your message. \n\nBest regards,`;
                        window.open(`mailto:${selectedMessage.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                      }}
                      size="sm"
                    >
                      <ReplyIcon className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    {selectedMessage.ip && (
                      <>
                        {blockedIPs.includes(selectedMessage.ip) ? (
                          <Button
                            onClick={() => unblockIP(selectedMessage.ip!)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Unblock IP
                          </Button>
                        ) : (
                          <Button
                            onClick={() => blockIP(selectedMessage.ip!)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            <BanIcon className="w-4 h-4 mr-2" />
                            Block IP
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <MailIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p>Select a message to view its details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
