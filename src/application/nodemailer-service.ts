import nodemailer from "nodemailer";


export const nodemailerService = {
    async sendEmail(email: string, code: string, template: (code: string) => string): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        let info = await transporter.sendMail({
            from: 'SonicBitService <process.env.EMAIL>',
            to: email,
            subject: "Verification code for PreTurboRich lobby",
            html: template(code),
        });

        return !!info;
    }
}