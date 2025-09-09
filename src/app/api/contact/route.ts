import { ContactFormData, sendContactEmail } from '@/lib/mails';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map();

const rateLimit = (ip: string, limit = 5, windowMs = 60 * 60 * 1000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip).filter((time: number) => time > windowStart);
  
  if (requests.length >= limit) {
    return false;
  }
  
  requests.push(now);
  rateLimitMap.set(ip, requests);
  return true;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const ip = Array.isArray(clientIp) ? clientIp[0] : clientIp;

    // Apply rate limiting
    if (!rateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required.'
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid email address.'
        },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100 || message.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Field length exceeded. Please shorten your input.'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const contactData: ContactFormData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message)
    };

    // Send emails
    await Promise.all([
      sendContactEmail(contactData),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Contact API is working. Use POST method to submit contact form.'
    },
    { status: 200 }
  );
}