import { site } from '../data/site';

export function Footer() {
  return (
    <footer className="border-t border-purple/10 bg-white">
      <div className="wide-shell flex flex-col gap-3 py-8 text-sm text-slatecopy md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-purple">{site.name}</p>
        <p className="font-semibold text-orange">2020 至今，版权归竞赛队所有。</p>
        <div className="grid gap-1 md:text-right">
          <p className="font-semibold text-purple">开发：陈靖邦</p>
        </div>
      </div>
    </footer>
  );
}
