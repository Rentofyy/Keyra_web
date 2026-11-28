"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Property Listing / Care Plan Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-3 py-1 rounded-full">
          Customer Support & Operations
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#0F1E36]">
          Contact KEYRA
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Have questions regarding property listings, verified field visits, or owner concierge packages in Pune West? Our dedicated support team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Details (Razorpay Merchant Disclosure) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="font-heading text-lg font-bold text-[#0F1E36]">
              Merchant &amp; Business Details
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">KEYRA</strong>
                  <span className="text-slate-500 font-medium">Owner &amp; Individual Merchant: Johnson Abraham</span>
                  <br />
                  <span>Balewadi High Street, Balewadi,</span>
                  <br />
                  <span>Pune, Maharashtra 411045, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#006A61] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Official Support Email</strong>
                  <a href="mailto:hellokeyra9@gmail.com" className="text-[#006A61] hover:underline font-semibold">
                    hellokeyra9@gmail.com
                  </a>
                  <br />
                  <a href="mailto:support@keyra.in" className="text-slate-500 hover:underline">
                    support@keyra.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Customer Helpline</strong>
                  <a href="tel:+916350321785" className="text-slate-900 font-semibold hover:underline">
                    +91 6350321785
                  </a>
                  <br />
                  <a href="tel:+919699720798" className="text-slate-600 hover:underline">
                    +91 9699720798
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Working Hours</strong>
                  <span>Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                  <br />
                  <span className="text-slate-400">Sunday: Field visits on appointment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grievance Redressal & Merchant Verification */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#006A61]" /> Merchant &amp; Grievance Redressal
            </h4>
            <p className="text-slate-600 leading-relaxed">
              In accordance with Information Technology Act 2000 and Razorpay Merchant Guidelines:
            </p>
            <p className="text-slate-700">
              <strong>Owner &amp; Merchant:</strong> Johnson Abraham (Individual)<br />
              <strong>Trade / Brand Name:</strong> KEYRA<br />
              <strong>Contact Email:</strong>{" "}
              <a href="mailto:hellokeyra9@gmail.com" className="text-[#006A61] hover:underline font-semibold">
                hellokeyra9@gmail.com
              </a>{" "}
              /{" "}
              <a href="mailto:support@keyra.in" className="text-[#006A61] hover:underline font-semibold">
                support@keyra.in
              </a>
            </p>
          </div>
        </div>

        {/* Message Inquiry Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-heading text-2xl font-black text-[#0F1E36]">
                  Message Sent Successfully
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out to KEYRA. Our Pune operations team will review your inquiry and contact you within 2 to 4 business hours.
                </p>
                <Button
                  variant="gold"
                  className="font-bold text-xs mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#0F1E36]">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill out the form below and our operations desk will connect with you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#C5A059] focus:outline-none bg-white"
                  >
                    <option value="Property Listing / Care Plan Inquiry">Property Listing / Care Plan Inquiry</option>
                    <option value="Assisted Property Visit Booking">Assisted Property Visit Booking</option>
                    <option value="Rental Agreement & Biometrics">Rental Agreement & Biometrics</option>
                    <option value="Payment or Invoice Query">Payment or Invoice Query</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please specify property locality, plan inquiry, or visit requirement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#C5A059] focus:outline-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full font-bold h-11 text-xs shadow-gold"
                >
                  <Send className="h-3.5 w-3.5 mr-2" /> Send Inquiry to Operations Desk
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
