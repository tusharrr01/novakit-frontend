import type { EmailTemplate } from '@/src/lib/email-templates-content';

export function isEmailTemplateDirty(draft: EmailTemplate, remote: EmailTemplate): boolean {
  return (
    draft.subject !== remote.subject ||
    draft.heading !== remote.heading ||
    draft.body !== remote.body ||
    draft.ctaLabel !== remote.ctaLabel ||
    draft.ctaUrl !== remote.ctaUrl ||
    draft.preheader !== remote.preheader ||
    draft.footerNote !== remote.footerNote
  );
}

export function buildEmailPreviewHtml(template: EmailTemplate): string {
  // Returns a styled static preview wrapper
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-bottom: 16px;">${template.heading || 'Notification'}</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.6; white-space: pre-wrap;">${template.body || ''}</p>
      ${
        template.ctaLabel
          ? `<div style="margin-top: 24px;"><a href="${template.ctaUrl || '#'}" style="background-color: #4f46e5; color: #ffffff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">${template.ctaLabel}</a></div>`
          : ''
      }
      ${
        template.footerNote
          ? `<div style="margin-top: 24px; border-t: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8;">${template.footerNote}</div>`
          : ''
      }
    </div>
  `;
}
