import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Shield, AlertTriangle, Users, Mail, CheckCircle2, Phone, MapPin, Send } from 'lucide-react';

interface PolicyPagesProps {
  view: ActiveView;
  isUrdu: boolean;
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({ view, isUrdu }) => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSent(true);
  };

  if (view === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <Shield className="w-8 h-8 text-emerald-700" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
              <p className="text-xs text-slate-500">Last updated: Academic Year 2026</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
            <p>
              At <strong>Shami Academy</strong> (accessible from shami-academy.edu.pk / blogspot.com), the privacy of our visitors and students is of extreme importance to us. This Privacy Policy document outlines the types of personal information that is received and collected by Shami Academy and how it is used.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">1. Log Files & Analytics</h3>
            <p>
              Like many educational portals and WordPress/Blogger sites, Shami Academy makes use of standard log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks to analyze trends, administer the site, and gather broad academic demographic information.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">2. Cookies and Web Beacons</h3>
            <p>
              Shami Academy uses cookies to store information about visitors’ preferences, to record user-specific information on which pages the user accesses or visits (such as selected grade notes for Class 9, 10, 11, or 12), and to customize Web page content based on visitors’ browser type.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">3. Google AdSense & DoubleClick DART Cookie</h3>
            <p>
              Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">4. Children's Information Protection</h3>
            <p>
              We believe it is important to provide added protection for children online. Shami Academy is an academic study bank and does not knowingly collect any personally identifiable information from children under the age of 13.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'disclaimer') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Disclaimer</h1>
              <p className="text-xs text-slate-500">Official Academic & Educational Disclosure</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
            <p>
              If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <strong>princeshami365@gmail.com</strong>.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">1. Educational Purpose Only</h3>
            <p>
              All the information on this website — including notes, board pairing schemes, solved past paper exercises, and guess papers for Classes 9, 10, 11, and 12 — is published in good faith and for general educational and reference purposes only. Shami Academy does not make any warranties about the absolute completeness or reliability of this information.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">2. Official Board Alignment</h3>
            <p>
              Board assessment and pairing schemes are prepared by experienced teachers in accordance with the official paper pattern declared by Punjab Boards Committee of Chairmen (PBCC) and Federal Board (FBISE). However, boards reserve the right to introduce slight changes in paper patterns at their discretion. Students are advised to also prepare the complete textbook syllabus.
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-2">3. External Links & Copyright</h3>
            <p>
              From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical educational websites, we have no control over the content and nature of these sites.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <Users className="w-8 h-8 text-emerald-700" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">About Shami Academy</h1>
              <p className="text-xs text-slate-500">Nurturing Bright Futures Across Pakistan</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
            <p className="text-base font-medium text-slate-900">
              Welcome to <strong>Shami Academy</strong>, the trusted academic partner for secondary and higher secondary school students across Pakistan.
            </p>

            <p>
              Founded with the vision to make quality educational material accessible to every student free of cost, Shami Academy delivers comprehensive, teacher-reviewed study notes, board pairing schemes, solved numericals, and practice quizzes for Matric (9th & 10th) and Intermediate (11th & 12th).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Our Mission</h4>
                <p className="text-xs text-slate-600">
                  To eliminate the high cost of study guides and academies by providing 100% free, high-yield digital notes and exam schemes to every student in Pakistan.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Boards Covered</h4>
                <p className="text-xs text-slate-600">
                  All 9 Punjab Educational Boards (Lahore, Rawalpindi, Multan, Faisalabad, Gujranwala, Sahiwal, Bahawalpur, Sargodha, DG Khan), Federal Board (FBISE), KPK, and Sindh Boards.
                </p>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 pt-2">Academic Faculty</h3>
            <p>
              Our content is curated by senior subject specialists in Physics, Chemistry, Mathematics, Biology, Computer Science, and English with more than 15 years of board paper checking and evaluation experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'contact') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <Mail className="w-8 h-8 text-emerald-700" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Contact Us</h1>
              <p className="text-xs text-slate-500">We are here to assist students and educators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm text-slate-700">
              <p>
                Have questions regarding Class 9, 10, 11, or 12 notes, pairing schemes, or need assistance setting up your Blogger site? Get in touch with our support team.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>princeshami365@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>WhatsApp Academic Help Desk</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Lahore / Islamabad, Pakistan</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                <strong>Study Materials Request:</strong> Looking for a specific past paper or solved numerical? Send us the details and our academic faculty will upload it within 24 hours.
              </div>
            </div>

            <div>
              {formSent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-700">
                    Thank you for reaching out to Shami Academy. Our team will review your message and reply via email shortly.
                  </p>
                  <button
                    onClick={() => {
                      setFormSent(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmad Ali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject / Class</label>
                    <input
                      type="text"
                      placeholder="e.g. Class 10 Physics Notes Request"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type your message or inquiry here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Shami Academy</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Terms & Conditions
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-4 border-b border-slate-200">
          Terms & Conditions
        </h1>
        <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
          <p>
            By accessing Shami Academy, you agree to comply with and be bound by the following terms of use. All study materials, notes, and pairing schemes provided here are strictly for individual student educational use. Commercial redistribution without prior consent is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};
