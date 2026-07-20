# Device Request Operations

How to run the Build Machine device-request workflow, start to finish.
One rule above all: **everything about one device stays tied to one request
number** (format `OM-DEV-XXXXXX`). Use it in every email subject, the Novo
invoice, the shipping instructions, and your notes.

## 1. Review a request

Every submission arrives as an email to the address in
`DEVICE_REQUEST_NOTIFY_EMAIL` with the subject
`[Device request] OM-DEV-XXXXXX — <type> — <manufacturer>`.
Reply-to is already set to the customer.

Check, in order:
1. Device is personally owned — no school/employer/government/leased device.
2. No BIOS/firmware password or organizational lock mentioned.
3. Meets the pilot requirements on the product page (RAM, storage, condition).
4. No swollen/damaged battery (laptops) or unsafe condition (desktops).
5. The intended use is something the service actually delivers.

Decide: **Accept**, **Need more info**, or **Decline**. Reply within a few
days — the customer was told review happens person to person, not instantly.

## 2. Response templates

**Accepted**
> Subject: Open Mirror request OM-DEV-XXXXXX — accepted
>
> Good news — your [manufacturer model] is accepted for the Build Machine
> conversion pilot. The price for your machine is $___ plus $___ inbound
> shipping. A secure Novo invoice will arrive by separate email; it lists the
> payment methods you can use. Please do not ship anything yet — shipping
> instructions come after payment is confirmed.

**More information needed**
> Subject: Open Mirror request OM-DEV-XXXXXX — one more question
>
> Thanks for your request. Before deciding, I need to know: [question].
> Nothing is owed, and please do not ship anything.

**Declined**
> Subject: Open Mirror request OM-DEV-XXXXXX — not a fit
>
> Thanks for the details. This machine isn't a fit for the pilot because
> [plain reason]. Nothing is owed. If you have a different computer, you're
> welcome to submit a new request.

## 3. Create the Novo invoice

The owner notification email ends with a **copy-ready Novo invoice block**.
In Novo: Invoices → New invoice → paste/fill:
- Customer name and email (from the block)
- Line item: `Build Machine conversion — <device> — reference OM-DEV-XXXXXX`
- The approved price you quoted, plus inbound shipping if being invoiced
- **The request number must appear on the invoice** (line item or memo)

Send the invoice from Novo. Never ask for payment any other way — no
Friends and Family, no personal handles, no typed amounts.

## 4. Confirm payment

Wait for Novo (or PayPal, for PayPal-funded payments) to show the invoice as
**paid**. Confirm inside Novo/PayPal itself — not from a customer screenshot
or a "payment sent" email.

## 5. Send shipping instructions

Only after confirmed payment, email the customer:
- The exact ship-to address
- Packing requirements (sturdy box, computer-safe padding, charger/power
  cable if requested, no peripherals)
- **Write OM-DEV-XXXXXX on a note inside the box**
- Reminder: back up first; the drive will be erased

## 6. Document arrival and condition

When the device arrives: photograph the box and device, note the serial
number and condition, and reply to the customer that it arrived — all under
the same request number.

## 7. If the received device differs materially

Different model, undisclosed damage, a firmware lock, a swollen battery:
**stop work immediately.** Email the customer under the request number,
describe the difference plainly, and agree in writing on what happens next
(proceed at an adjusted scope, or return the device) before touching it
again.

## 8. Record-keeping

One email thread (or folder) per request number, containing: the original
notification, your decision, the invoice, the payment confirmation, shipping
instructions, arrival photos, and the returned-device test report. That
thread is the system of record — there is no database behind the form.
