'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AnimateIn } from '@/components/ui/AnimateIn';

export default function ContactPage() {
  const t = useTranslations('contact');
  const footer = useTranslations('footer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', consent: false });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-20">
      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left Side - Contact Info */}
            <AnimateIn>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
                  {t('label')}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-12">
                  {t('title')} <span className="text-gray-300">{t('titleHighlight')}</span>
                </h1>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {footer('address')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <a
                        href={`tel:${footer('phone')}`}
                        className="text-gray-700 hover:text-black transition-colors font-semibold"
                      >
                        {footer('phone')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <a
                        href={`mailto:${footer('email')}`}
                        className="text-gray-700 hover:text-black transition-colors"
                      >
                        {footer('email')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Right Side - Contact Form */}
            <AnimateIn delay={0.2}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input
                      type="text"
                      placeholder={t('form.name')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 border-b border-gray-300 focus:border-black outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      placeholder={t('form.email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 border-b border-gray-300 focus:border-black outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <textarea
                      placeholder={t('form.message')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                      className="w-full pl-12 pr-4 py-3 border-b border-gray-300 focus:border-black outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    required
                    className="mt-1 w-4 h-4"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700">
                    Concordo que os meus dados submetidos sejam{' '}
                    <span className="underline">recolhidos e armazenados</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full md:w-auto px-8 py-3 bg-[rgb(250,59,30)] hover:bg-[rgb(230,39,10)] text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {status === 'loading' ? 'A enviar...' : t('form.submit')}
                </button>

                {status === 'success' && (
                  <p className="text-green-600">{t('form.success')}</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600">{t('form.error')}</p>
                )}
              </form>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="h-[500px] w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3185.2662381745863!2d-7.9242281248339825!3d37.027297854866276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd05537ec2bfa8f3%3A0x5aaba1c1931fc7b8!2sFlow%20Productions!5e0!3m2!1spt-PT!2spt!4v1771512792452!5m2!1spt-PT!2spt"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Flow Productions - Edifício UAlg Tec Campus, Campus da Penha, Faro"
        />
      </section>
    </div>
  );
}
