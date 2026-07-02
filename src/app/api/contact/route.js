import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, company, industry, plan, message, source, token } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // Server-side Google reCAPTCHA v3 verification.
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      if (!token) {
        return NextResponse.json({ error: "Google reCAPTCHA token is required." }, { status: 400 });
      }

      try {
        const verifyRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`,
          { method: "POST" }
        );
        const verifyData = await verifyRes.json();

        if (!verifyData.success || verifyData.action !== "contact_form" || verifyData.score < 0.5) {
          return NextResponse.json({ error: "Google reCAPTCHA validation failed." }, { status: 400 });
        }
      } catch (err) {
        console.error("reCAPTCHA validation error:", err);
        return NextResponse.json({ error: "Google reCAPTCHA validation failed." }, { status: 502 });
      }
    }


    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const fromEmail = process.env.MAILJET_FROM_EMAIL;
    const toEmail = process.env.MAILJET_TO_EMAIL;

    if (!apiKey || !apiSecret || !fromEmail || !toEmail) {
      console.error("Missing Mailjet configuration environment variables.");
      return NextResponse.json(
        { error: "Email configuration is not complete on the server." },
        { status: 500 }
      );
    }

    const mailjetPayload = {
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: "BillNode Website Form"
          },
          To: [
            {
              Email: toEmail,
              Name: "BillNode Administrator"
            }
          ],
          Subject: `New Lead Request from ${name || email} (${source || "General"})`,
          TextPart: `New submission received:\n\n- Name: ${name || "N/A"}\n- Email: ${email}\n- Phone: ${phone || "N/A"}\n- Company: ${company || "N/A"}\n- Industry Type: ${industry || "N/A"}\n- Plan Interested: ${plan || "N/A"}\n- Source Page: ${source || "N/A"}\n- Message Details:\n${message || "N/A"}`,
          HTMLPart: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f4ef; padding: 40px 20px; color: #14130f; margin: 0; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e3d9; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
                <!-- Logo Header Banner -->
                <div style="background-color: #14130f; padding: 24px; text-align: center; border-bottom: 4px solid #fe330a;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                    BillNode<span style="color: #fe330a; font-size: 16px; vertical-align: super;">®</span>
                  </h1>
                  <span style="color: rgba(255, 255, 255, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-top: 4px;">
                    New Lead Submission
                  </span>
                </div>

                <!-- Main Content Body -->
                <div style="padding: 32px 24px;">
                  <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; color: #5c5a54; text-align: center;">
                    A visitor has submitted the contact form on your website. Here are the request details:
                  </p>

                  <!-- Grid of Fields -->
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <!-- Row 1: Name & Email -->
                    <tr>
                      <td style="width: 50%; padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Contact Name</span>
                        <span style="font-size: 15px; font-weight: 600; color: #14130f;">${name || "N/A"}</span>
                      </td>
                      <td style="width: 50%; padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Email Address</span>
                        <a href="mailto:${email}" style="font-size: 15px; font-weight: 600; color: #fe330a; text-decoration: none;">${email}</a>
                      </td>
                    </tr>
                    <!-- Row 2: Phone & Company -->
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Phone Number</span>
                        <span style="font-size: 15px; font-weight: 600; color: #14130f;">${phone || "N/A"}</span>
                      </td>
                      <td style="padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Company</span>
                        <span style="font-size: 15px; font-weight: 600; color: #14130f;">${company || "N/A"}</span>
                      </td>
                    </tr>
                    <!-- Row 3: Industry & Plan -->
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Industry Type</span>
                        <span style="font-size: 15px; font-weight: 600; color: #14130f;">${industry || "N/A"}</span>
                      </td>
                      <td style="padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Plan Interested</span>
                        <span style="background-color: #ffeae6; color: #fe330a; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: inline-block;">
                          ${plan || "N/A"}
                        </span>
                      </td>
                    </tr>
                    <!-- Row 4: Source Page -->
                    <tr>
                      <td colspan="2" style="padding: 12px; border-bottom: 1px solid #f0eee6; vertical-align: top;">
                        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 4px;">Source Web Page</span>
                        <span style="font-size: 14px; font-weight: 500; color: #5c5a54;">${source || "N/A"}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Message block -->
                  <div style="background-color: #fcfbfa; border-left: 4px solid #fe330a; border-radius: 4px; padding: 16px 20px; margin-top: 24px;">
                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8e8b82; display: block; margin-bottom: 8px;">Message Details</span>
                    <div style="font-size: 15px; color: #14130f; white-space: pre-wrap; line-height: 1.6; font-style: italic;">"${(message || "N/A").replace(/\n/g, "<br />")}"</div>
                  </div>
                </div>

                <!-- Light Footer Signature -->
                <div style="background-color: #fcfbfa; padding: 20px; text-align: center; border-top: 1px solid #e5e3d9; font-size: 12px; color: #8e8b82;">
                  <span>© 2026 BillNode. Built with Next.js & Mailjet.</span>
                </div>
              </div>
            </div>
          `
        }
      ]
    };


    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`
      },
      body: JSON.stringify(mailjetPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Mailjet response error: ${errorText}`);
      return NextResponse.json(
        { error: "Failed to dispatch email via Mailjet." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact API routing error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
