import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { CtaLink } from '../components/CtaLink';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../data/site';

export function Join() {
  return (
    <main className="slide-bg ppt-track">
      <section className="wide-shell section-y">
        <SectionHeading
          eyebrow="Join"
          title="欢迎加入香港中文大学（深圳）程序设计竞赛队"
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            ['开放加入', '竞赛队向全校同学开放加入的机会。'],
            ['本年度队员', '本年度，代表大学参赛的队员来自多个学院，横跨四个年级。'],
            ['欢迎加入', '欢迎加入香港中文大学（深圳）程序设计竞赛队！'],
          ].map(([title, body]) => (
            <article key={title} className="rounded border border-purple/10 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-purple">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slatecopy">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded border border-purple/10 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black text-purple">联系方式</h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slatecopy">
              <p className="flex gap-3">
                <Mail className="mt-1 shrink-0 text-orange" size={18} />
                招生咨询邮箱：{site.email}
              </p>
              <p className="flex gap-3">
                <MessageCircle className="mt-1 shrink-0 text-orange" size={18} />
                学院招生交流 QQ 群：{site.qqGroup}
              </p>
              <p className="flex gap-3">
                <MapPin className="mt-1 shrink-0 text-orange" size={18} />
                {site.address}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <CtaLink to="/contests">查看竞赛与训练</CtaLink>
              <CtaLink to={site.website} variant="ghost">
                学院官网
              </CtaLink>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['学院微信公众号', 'images/contact/wechat-public-qr.png'],
              ['学院刊物', 'images/contact/booklet-qr.png'],
              ['学院官网', 'images/contact/site-qr.png'],
              ['学院招生交流 QQ 群', 'images/contact/qq-group-qr.png'],
            ].map(([label, image]) => (
              <article key={label} className="grid place-items-center rounded border border-purple/10 bg-white p-5 text-center shadow-sm">
                <img src={`${import.meta.env.BASE_URL}${image}`} alt={label} className="h-36 w-36 object-contain" />
                <p className="mt-3 font-bold text-purple">{label}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
