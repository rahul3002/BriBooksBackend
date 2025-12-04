/**
 * Email Service
 * Handles sending emails (basic implementation with console logging)
 */

export interface EmailOptions {
    to: string;
    subject: string;
    body: string;
    html?: string;
}

export class EmailService {
    /**
     * Send email (currently logs to console, can be integrated with SendGrid/Nodemailer later)
     */
    async sendEmail(options: EmailOptions): Promise<void> {
        console.log('📧 Email sent:');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.body}`);

        // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
        // For now, just log to console
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'Welcome to BriBooks!',
            body: `Hi ${firstName},\n\nWelcome to BriBooks! We're excited to have you join our community of children's book authors.\n\nBest regards,\nThe BriBooks Team`,
        });
    }

    /**
     * Send book published notification email
     */
    async sendBookPublishedEmail(to: string, firstName: string, bookTitle: string): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'Your book has been published!',
            body: `Hi ${firstName},\n\nCongratulations! Your book "${bookTitle}" has been successfully published on BriBooks.\n\nBest regards,\nThe BriBooks Team`,
        });
    }

    /**
     * Send new review notification email
     */
    async sendNewReviewEmail(to: string, firstName: string, bookTitle: string): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'New review on your book',
            body: `Hi ${firstName},\n\nYou have received a new review on your book "${bookTitle}".\n\nBest regards,\nThe BriBooks Team`,
        });
    }
}

export const emailService = new EmailService();
