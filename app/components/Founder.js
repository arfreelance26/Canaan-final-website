import Image from "next/image";

export default function FounderSection() {
  return (
    <section className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3">

      {/* ── FOUNDER CARD ── */}
      <div className="mx-auto w-full max-w-4xl">
      <div className="relative rounded-2xl overflow-hidden bg-white grid grid-cols-1 sm:grid-cols-2 min-h-[560px]">

        {/* ── LEFT — Photo ── */}
        <div className="relative min-h-[320px] sm:min-h-0">
          <Image
            src="/Arun.png"
            alt="Arun Samuel Alfred, Founder of Canaan Global International"
            fill
            className="object-cover object-top"
          />
          {/* Subtle right-edge fade into content panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />

          {/* Bottom-left name tag */}
          <div className="absolute bottom-0 left-0 bg-[#f5f4f0] px-5 py-3 rounded-tr-2xl z-10">
            <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
              Founder &amp; CEO
            </span>
          </div>
        </div>

        {/* ── RIGHT — Content ── */}
        <div className="bg-[#f5f4f0] flex flex-col justify-between">

          {/* Top label */}
          
          {/* Body */}
          <div className="flex flex-col gap-5 px-7 py-6 flex-1">

            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400 mb-2">
                The person behind the mission
              </p>
              <h2 className="text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900">
                Arun <span className="italic font-normal text-neutral-500">Samuel Alfred</span>
              </h2>
            </div>

            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-neutral-500 border-l-2 border-neutral-200 pl-3">
              Founder &amp; Managing Director · Est. 2009
            </div>

            <hr className="border-neutral-200" />

            <p className="text-[14px] text-neutral-500 leading-relaxed">
              With over two decades of experience in international trade and freight
              forwarding, Arun founded Canaan Global International with a single
              conviction — that moving goods across borders should feel effortless
              for businesses of any size.
            </p>

            <p className="text-[14px] text-neutral-500 leading-relaxed">
              Starting from a small freight desk in 2009, he grew the company into
              a trusted network spanning 30+ countries, built on personal
              relationships, deep customs expertise, and an obsession with
              reliability.
            </p>

            {/* Pull quote */}
            <div className="bg-white rounded-xl px-5 py-4">
              <span className="font-serif text-5xl leading-none text-neutral-200 float-left mr-2 mt-1">&ldquo;</span>
              <p className="font-serif italic text-[15px] text-neutral-700 leading-relaxed">
                Every shipment represents someone&apos;s livelihood. We treat it that way.
              </p>
            </div>

            <div className="bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-neutral-900">15+ years of logistics expertise</span>
              <span className="text-[11px] text-neutral-400">50,000+ shipments · 30+ countries</span>
            </div>
            {/* <button className="flex items-center gap-2 bg-neutral-900 text-white text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors">
              Meet the team <ArrowRight size={13} />
            </button> */}
          </div>
          </div>

          {/* Bottom strip */}
          

        </div>
      </div>
      </div>

    </section>
  );
}