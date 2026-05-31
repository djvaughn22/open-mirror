type LeadFormProps = {
  page: string;
  placeholder: string;
};

export default function LeadForm({ page, placeholder }: LeadFormProps) {
  return (
    <form
      action="https://formsubmit.co/ask@openmirrorllc.com"
      method="POST"
      className="mx-auto mt-10 flex max-w-2xl flex-col gap-4"
    >
      <input
        type="hidden"
        name="_subject"
        value={`New Open Mirror lead: ${page}`}
      />

      <input type="hidden" name="Page" value={page} />
      <input type="hidden" name="_captcha" value="false" />

      <input
        name="email"
        type="email"
        required
        className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
        placeholder="Email address"
      />

      <input
        name="message"
        required
        className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
        placeholder={placeholder}
      />

      <button
        type="submit"
        className="rounded-full bg-white px-8 py-3 font-semibold text-black"
      >
        Join Early Access
      </button>
    </form>
  );
}