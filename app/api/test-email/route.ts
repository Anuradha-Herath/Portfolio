import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing email configuration...');
    
    // Check if environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      return NextResponse.json(
        { error: 'Gmail credentials not configured' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Test email configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown verification error';
      return NextResponse.json(
        { error: 'SMTP configuration invalid', details: errorMessage },
        { status: 500 }
      );
    }

    // Send test email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Portfolio Contact Form - Test Email',
      text: 'This is a test email to verify your contact form email notifications are working correctly.',
      html: `
        <h2>Portfolio Contact Form Test</h2>
        <p>This is a test email to verify your contact form email notifications are working correctly.</p>
        <p><strong>If you receive this email, your Nodemailer setup is working!</strong></p>
        <hr>
        <p>Sent from your portfolio contact form test endpoint.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      recipient: process.env.GMAIL_USER
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
