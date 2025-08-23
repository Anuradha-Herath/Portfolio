import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import nodemailer from 'nodemailer';

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
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create contact message
    const contact = await dbOperations.createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
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
        subject: `Portfolio Contact: ${subject}`,
        text: `You received a new contact message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
            <div style="background: #5856d6; color: #fff; padding: 24px 32px;">
              <h2 style="margin: 0;">New Contact Message</h2>
            </div>
            <div style="padding: 24px 32px;">
              <p style="font-size: 16px; color: #333;"><strong>Name:</strong> ${name}</p>
              <p style="font-size: 16px; color: #333;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #5856d6;">${email}</a></p>
              <p style="font-size: 16px; color: #333;"><strong>Subject:</strong> ${subject}</p>
              <div style="margin-top: 20px; padding: 16px; background: #fff; border-left: 4px solid #5856d6;">
                <strong>Message:</strong>
                <div style="margin-top: 8px; color: #444;">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div style="background: #f1f1f1; color: #888; padding: 16px 32px; font-size: 12px;">
              Sent from your portfolio contact form • ${new Date().toLocaleString()}
            </div>
          </div>
        `,
        replyTo: email,
      };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully:', info.messageId);
    } catch (mailError) {
      console.error('Error sending contact email:', mailError);
      // Log the error but don't fail the request - the contact message is still saved
    }

    return NextResponse.json(
      {
        message: 'Contact message sent successfully',
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}