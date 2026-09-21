import React, { useState } from 'react';
import {
  X,
  LifeBuoy,
  Mail,
  Phone,
  Building2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Send,
} from 'lucide-react';
import CompanyLogo from './CompanyLogo';

const COMPANY_HELP_CONTACTS = [
  {
    name: 'Google India',
    domain: 'google.com',
    role: 'SDE-1 & SWE Internships',
    contact: 'Sarah Jenkins',
    title: 'University Talent Acquisition Lead',
    email: 'google-university-hiring@google.com',
    phone: '+91 80 6721 8000',
  },
  {
    name: 'Microsoft',
    domain: 'microsoft.com',
    role: 'SWE Summer Intern & PPO',
    contact: 'David Chen',
    title: 'College Hiring Lead',
    email: 'msft-campus-recruitment@microsoft.com',
    phone: '+91 80 4000 3000',
  },
  {
    name: 'Amazon',
    domain: 'amazon.com',
    role: 'AWS Cloud Support & Dev',
    contact: 'Anita Desai',
    title: 'Student Programs India & AWS Recruiter',
    email: 'amazon-university-support@amazon.com',
    phone: '+91 80 4108 5000',
  },
  {
    name: 'Cisco Systems',
    domain: 'cisco.com',
    role: 'Network Software Engineer',
    contact: 'Pooja Kulkarni',
    title: 'Early Career Programs Lead',
    email: 'cisco-university-support@cisco.com',
    phone: '+91 80 4426 0000',
  },
  {
    name: 'Goldman Sachs',
    domain: 'goldmansachs.com',
    role: 'Analyst - Global Markets Tech',
    contact: 'Rohan Mathur',
    title: 'Engineering Campus Talent Lead',
    email: 'gs-campusrecruiting@gs.com',
    phone: '+91 80 4127 0000',
  },
  {
    name: 'Adobe',
    domain: 'adobe.com',
    role: 'MTS - Creative Cloud & AI',
    contact: 'Meera Iyer',
    title: 'University Relations & Talent',
    email: 'adobe-university-talent@adobe.com',
    phone: '+91 120 244 4555',
  },
  {
    name: 'Deloitte',
    domain: 'deloitte.com',
    role: 'Technology Consulting Analyst',
    contact: 'Vikram Singhania',
    title: 'Campus Recruitment Lead (USI)',
    email: 'deloitte-campus-desk@deloitte.com',
    phone: '+91 40 6670 4000',
  },
];

const FAQS = [
  {
    q: 'How is student eligibility calculated for each recruitment drive?',
    a: 'Eligibility is automatically validated server-side by checking your live CGPA >= Cutoff, your Branch against the eligible branches list, your Active Backlogs <= Allowed limit, and your Graduation Batch Year.',
  },
  {
    q: 'How does the Institutional Single-Offer (1-Offer) Policy work?',
    a: 'To guarantee equitable job distribution across all batchmates, students who accept or get marked Selected in a drive cannot apply to new drives unless the new opportunity offers a higher dream package (>= 1.5x current CTC).',
  },
  {
    q: 'Can I update my resume link or CGPA before applying?',
    a: 'Yes, navigate to your Student Profile page and update your resume URL, technical skills, or academic info. All changes reflect immediately on all subsequent drive applications.',
  },
  {
    q: 'What should I do if I have an interview scheduling clash?',
    a: 'Immediately reach out to the TPO Grievance Desk at placement-grievance@college.edu or email the specific company recruiter using their dedicated help email listed below.',
  },
];

export default function HelpSupportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tpo');
  const [copiedEmail, setCopiedEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  if (!isOpen) return null;

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  const handleSendTicket = (e) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setTicketSubject('');
      setTicketMessage('');
      onClose();
    }, 2500);
  };

  const filteredCompanies = COMPANY_HELP_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
              <LifeBuoy className="w-5 h-5 text-blue-300 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Campus Placement Helpdesk & Support Center</h2>
              <p className="text-xs text-blue-200">
                Official TPO grievance cell, visiting recruiter contact directory, and student helpline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-2 space-x-2 overflow-x-auto">
          {[
            { id: 'tpo', label: 'TPO Placement Cell', icon: Building2 },
            { id: 'recruiters', label: 'Company HR Help Emails', icon: Mail, badge: COMPANY_HELP_CONTACTS.length },
            { id: 'ticket', label: 'Submit Support Ticket', icon: Send },
            { id: 'faqs', label: 'Placement FAQs & Policy', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: TPO Cell */}
          {activeTab === 'tpo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Training & Placement Cell (TPO)</h4>
                      <p className="text-xs text-slate-500">Central Career Advisory & Drive Coordination</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Head TPO:</span>
                      <span className="font-semibold">Prof. Rajesh Sharma</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-semibold">3rd Floor, Administrative Block</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Office Hours:</span>
                      <span className="font-semibold">Mon – Fri: 9:00 AM – 5:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">TPO Official Desk:</span>
                      <div className="flex items-center space-x-1.5">
                        <a
                          href="mailto:tpo-desk@college.edu"
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          tpo-desk@college.edu
                        </a>
                        <button
                          onClick={() => handleCopy('tpo-desk@college.edu')}
                          className="p-1 text-slate-400 hover:text-blue-600"
                          title="Copy Email"
                        >
                          {copiedEmail === 'tpo-desk@college.edu' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-rose-100 bg-rose-50/50 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Placement Grievance Redressal</h4>
                      <p className="text-xs text-slate-500">Policy Disputes, Clashes & Offer Issues</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-rose-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Grievance Officer:</span>
                      <span className="font-semibold">Dr. S. K. Mukherjee</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Response SLA:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Within 24 Business Hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">Grievance Email:</span>
                      <div className="flex items-center space-x-1.5">
                        <a
                          href="mailto:placement-grievance@college.edu"
                          className="font-semibold text-rose-600 hover:underline"
                        >
                          placement-grievance@college.edu
                        </a>
                        <button
                          onClick={() => handleCopy('placement-grievance@college.edu')}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Copy Email"
                        >
                          {copiedEmail === 'placement-grievance@college.edu' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Hotline Banner */}
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Live Drive Day Emergency Helpline</p>
                    <p className="text-xs text-slate-400">For ongoing test login issues or room allocations</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-emerald-400">+91 11 2659 1000</span>
                  <span className="block text-[10px] text-slate-400">Ext: 401 / 402</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Company Recruiter Directory */}
          {activeTab === 'recruiters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Direct official campus talent acquisition contacts for visiting corporate partners:
                </p>
                <input
                  type="text"
                  placeholder="Filter by company or HR name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCompanies.map((company, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <CompanyLogo name={company.name} size="md" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{company.name}</h4>
                          <span className="text-[11px] text-slate-500">{company.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {company.domain}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">HR Coordinator:</span>
                        <span className="font-medium text-slate-800">{company.contact}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Campus Help Email:</span>
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`mailto:${company.email}`}
                            className="font-medium text-blue-600 hover:underline truncate max-w-[170px]"
                            title={company.email}
                          >
                            {company.email}
                          </a>
                          <button
                            onClick={() => handleCopy(company.email)}
                            className="p-1 text-slate-400 hover:text-blue-600"
                            title="Copy Email"
                          >
                            {copiedEmail === company.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`mailto:${company.email}?subject=%5BCampus%20Placement%20Query%5D%20Regarding%20${encodeURIComponent(
                        company.name
                      )}%20Drive`}
                      className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg text-center flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Query to HR</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Submit Support Ticket */}
          {activeTab === 'ticket' && (
            <div className="max-w-xl mx-auto py-2">
              {feedbackSent ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Support Request Logged!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your query has been dispatched to the Placement Office & Technical Helpdesk. A coordinator will
                    respond to your registered email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Need assistance with profile verification, drive eligibility dispute, or technical issues? Submit your
                      inquiry directly to the TPO desk.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category / Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Eligibility dispute for Amazon Drive / CGPA discrepancy"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please provide details including Drive Name, Roll Number, and description of the query..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center space-x-2 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Query to TPO</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Placement FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Frequently asked questions regarding eligibility rules, institutional policy, and drive procedures:
              </p>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{faq.q}</span>
                    </h5>
                    <p className="text-xs text-slate-600 pl-5.5 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>CampusConnect Placement Cell • Institutional Support Desk</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
