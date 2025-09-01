import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import nodemailer from 'nodemailer';

// Rate limiting configuration
const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS_PER_WINDOW: 5, // 5 requests per 15 minutes
  CLEANUP_INTERVAL_MS: 5 * 60 * 1000, // Clean up every 5 minutes
};

// In-memory store for rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMITS.CLEANUP_INTERVAL_MS);

// Rate limiting function
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMITS.WINDOW_MS;

  let entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + RATE_LIMITS.WINDOW_MS,
      lastRequest: now,
    };
    rateLimitStore.set(ip, entry);
  }

  // Clean up very old entries (older than 2x window)
  if (entry.lastRequest < windowStart - RATE_LIMITS.WINDOW_MS) {
    entry.count = 0;
  }

  entry.lastRequest = now;

  if (entry.count >= RATE_LIMITS.MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  entry.count++;
  const remaining = Math.max(0, RATE_LIMITS.MAX_REQUESTS_PER_WINDOW - entry.count);

  return {
    allowed: true,
    remaining,
    resetTime: entry.resetTime,
  };
}

export async function GET() {
  try {
    const contacts = await dbOperations.getContactMessages();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Sophisticated IP-based rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Skip rate limiting for unknown IPs (though this is rare)
    if (clientIP !== 'unknown') {
      const rateLimitResult = checkRateLimit(clientIP);

      if (!rateLimitResult.allowed) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`);
        return NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
              'X-RateLimit-Limit': RATE_LIMITS.MAX_REQUESTS_PER_WINDOW.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            },
          }
        );
      }
    }

    console.log(`Contact form submission from IP: ${clientIP}`);

    // Honeypot check for spam prevention
    if (website) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Sanitize and validate input lengths
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedSubject = subject.trim();
    const sanitizedMessage = message.trim();

    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (sanitizedSubject.length < 5 || sanitizedSubject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Enhanced spam detection - less aggressive patterns
    const spamPatterns = [
      /\b(?:viagra|casino|lottery|winner|prize|bullshit|nonsense)\b/i,
      /\b(?:http|https|www\.)\S+/i, // URLs
      /\b\d{15,}\b/, // Very long numbers (15+ digits, more specific)
      /(.)\1{20,}/, // Excessive repeated characters (20+ instead of 10)
      /\b(?:asdf|qwerty|aaaaa|bbbbb)\b/i, // Common test or random inputs
      /[A-Z]{15,}/, // Excessive uppercase (15+ characters instead of 5)
    ];

    const isSpam = spamPatterns.some(pattern => pattern.test(sanitizedMessage) || pattern.test(sanitizedSubject));
    if (isSpam) {
      return NextResponse.json(
        { error: 'Message contains suspicious or inappropriate content. Please revise and try again.' },
        { status: 400 }
      );
    }

    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'yopmail.com'
    ];
    const emailDomain = sanitizedEmail.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a permanent email address.' },
        { status: 400 }
      );
    }

    // Enhanced email validation (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create contact message
    const contact = await dbOperations.createContactMessage({
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      status: 'unread'
    });

    // Send email notification using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // send to yourself
        subject: `Portfolio Contact: ${sanitizedSubject}`,
        text: `You received a new contact message from your portfolio website.\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nSubject: ${sanitizedSubject}\nMessage: ${sanitizedMessage}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
            <div style="background: #5856d6; color: #fff; padding: 24px 32px;">
              <h2 style="margin: 0;">New Contact Message</h2>
            </div>
            <div style="padding: 24px 32px;">
              <p style="font-size: 16px; color: #333;"><strong>Name:</strong> ${sanitizedName}</p>
              <p style="font-size: 16px; color: #333;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #5856d6;">${sanitizedEmail}</a></p>
              <p style="font-size: 16px; color: #333;"><strong>Subject:</strong> ${sanitizedSubject}</p>
              <div style="margin-top: 20px; padding: 16px; background: #fff; border-left: 4px solid #5856d6;">
                <strong>Message:</strong>
                <div style="margin-top: 8px; color: #444;">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div style="background: #f1f1f1; color: #888; padding: 16px 32px; font-size: 12px;">
              Sent from your portfolio contact form • ${new Date().toLocaleString()}
            </div>
          </div>
        `,
        replyTo: sanitizedEmail,
      };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully:', info.messageId);
    } catch (mailError) {
      console.error('Error sending contact email:', mailError);
      // Log the error but don't fail the request - the contact message is still saved
    }

    // Create response with rate limit headers
    const response = NextResponse.json(
      {
        message: 'Contact message sent successfully',
        id: contact.id,
      },
      { status: 201 }
    );

    // Add rate limit headers if we have rate limit info
    if (clientIP !== 'unknown') {
      const rateLimitResult = checkRateLimit(clientIP);
      response.headers.set('X-RateLimit-Limit', RATE_LIMITS.MAX_REQUESTS_PER_WINDOW.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());
    }

    return response;
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}