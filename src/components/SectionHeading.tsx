export function SectionHeading({
  eyebrow,
  title,
  summary,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className="orange-marker text-sm font-semibold uppercase tracking-normal text-purple">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 break-words text-3xl font-black leading-tight text-purple sm:text-5xl">
        {title}
      </h2>
      {summary && <p className="mt-4 text-base leading-8 text-slatecopy sm:text-lg">{summary}</p>}
    </div>
  );
}
