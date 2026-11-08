// Contact form endpoint. Validates the submission, drops spam caught by the hidden field, and emails the
// message to the site owner through Cloudflare's email binding (Email Routing, verified recipient).
// Needs CONTACT_FROM (an address on a domain with Email Routing) and CONTACT_TO (a verified address).

import type { APIRoute } from 'astro'

export const prerender = false

const MAX = { name: 200, email: 320, message: 10_000 }

// Header values must not contain line breaks (they could inject extra headers)
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()

// RFC 2047 encoding, so names and subjects with accents (Žižka) survive
const encodeHeader = (value: string) => `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(value)))}?=`

const base64Lines = (value: string) =>
    btoa(String.fromCharCode(...new TextEncoder().encode(value)))
        .match(/.{1,76}/g)!
        .join('\r\n')

function rawEmail({ from, to, replyTo, subject, body }: { from: string; to: string; replyTo: string; subject: string; body: string }) {
    const domain = from.split('@')[1] ?? 'localhost'
    return [
        `From: History Reconsidered <${from}>`,
        `To: ${to}`,
        `Reply-To: ${replyTo}`,
        `Subject: ${encodeHeader(subject)}`,
        `Date: ${new Date().toUTCString()}`,
        `Message-ID: <${crypto.randomUUID()}@${domain}>`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        base64Lines(body),
    ].join('\r\n')
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
    const form = await request.formData()
    const field = (name: string) => String(form.get(name) ?? '').trim()

    // Bots fill in the hidden field; pretend it worked so they don't retry
    if (field('bot-field')) return redirect('/contact/thanks/', 303)

    const name = oneLine(field('name'))
    const email = oneLine(field('email'))
    const message = field('message')
    const valid =
        name && name.length <= MAX.name &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX.email &&
        message && message.length <= MAX.message
    if (!valid) return redirect('/contact/?status=invalid', 303)

    const env = locals.runtime?.env
    if (!env?.CONTACT_EMAIL || !env.CONTACT_FROM || !env.CONTACT_TO) return redirect('/contact/?status=unavailable', 303)

    try {
        const { EmailMessage } = await import('cloudflare:email')
        const raw = rawEmail({
            from: env.CONTACT_FROM,
            to: env.CONTACT_TO,
            replyTo: email,
            subject: `Website message from ${name}`,
            body: `${message}\n\n— ${name} <${email}>\nSent from the contact form on History Reconsidered`,
        })
        await env.CONTACT_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, raw))
    } catch (error) {
        console.error('Contact form: sending failed', error)
        return redirect('/contact/?status=error', 303)
    }

    return redirect('/contact/thanks/', 303)
}
