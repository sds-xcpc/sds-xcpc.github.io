import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { CtaLink } from '../components/CtaLink';
import { site } from '../data/site';

export function Join() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <div className="max-w-none">
          <p className="orange-marker text-sm font-semibold uppercase tracking-normal text-purple">Join</p>
          <h1 className="mt-3 whitespace-nowrap text-[clamp(0.85rem,3.6vw,3rem)] font-black leading-tight text-purple">
            欢迎加入香港中文大学（深圳）程序设计竞赛队！
          </h1>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[
            ['开放加入', '竞赛队向全校同学开放加入的机会。'],
            ['本年度队员', '本年度，代表大学参赛的队员来自多个学院，横跨四个年级。'],
          ].map(([title, body]) => (
            <article key={title} className="rounded border border-purple/10 bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-black text-purple">{title}</h2>
              <p className="mt-4 text-base leading-8 text-slatecopy">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded border border-purple/10 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black text-purple">联系方式</h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-slatecopy">
              <p className="flex gap-3">
                <Mail className="mt-1 shrink-0 text-orange" size={20} />
                招生咨询邮箱：{site.email}
              </p>
              <p className="flex gap-3">
                <MessageCircle className="mt-1 shrink-0 text-orange" size={20} />
                数据科学学院招生交流 QQ 群：{site.qqGroup}
              </p>
              <p className="flex gap-3">
                <MapPin className="mt-1 shrink-0 text-orange" size={20} />
                {site.address}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <CtaLink to="/contests">查看竞赛与训练</CtaLink>
              <CtaLink to={site.website} variant="ghost">
                数据科学学院官网
              </CtaLink>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['数据科学学院微信公众号', 'images/contact/wechat-public-qr.png'],
              ['数据科学学院刊物', 'images/contact/booklet-qr.png'],
              ['数据科学学院官网', 'images/contact/site-qr.png'],
              ['数据科学学院招生交流 QQ 群', 'images/contact/qq-group-qr.png'],
            ].map(([label, image]) => (
              <article key={label} className="grid place-items-center rounded border border-purple/10 bg-white p-5 text-center shadow-sm">
                <img src={`${import.meta.env.BASE_URL}${image}`} alt={label} className="h-40 w-40 object-contain" />
                <p className="mt-3 text-base font-bold text-purple">{label}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
