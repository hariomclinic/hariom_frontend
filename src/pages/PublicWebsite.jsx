import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Star, Clock, Award, Heart, Leaf, ChevronDown } from 'lucide-react'
import doctorImg from '../assets/doctor.jpeg'

/**
 * PublicWebsite - The public-facing clinic website.
 *
 * Sections:
 *   1. Navbar
 *   2. Hero - Doctor profile with rotating ring
 *   3. About / Specializations
 *   4. Treatments
 *   5. Why Choose Us
 *   6. Contact
 *   7. Clinic Images Gallery
 *   8. Footer
 *
 * WhatsApp integration:
 *   Opens wa.me/<number>?text=<message> URL in new tab.
 *   This is the official WhatsApp click-to-chat API.
 *   No WhatsApp Business API needed - works for any number.
 */

const WHATSAPP_NUMBER = '919226993128'
const WHATSAPP_MESSAGE = encodeURIComponent('Hello Dr. Kalpesh, I would like to book an appointment at Hari Om Clinic.')

const treatments = [
  { name: 'Chronic Diseases', icon: '🫀', desc: 'Diabetes, Hypertension, Thyroid disorders' },
  { name: 'Skin Disorders', icon: '🌿', desc: 'Eczema, Psoriasis, Acne, Allergies' },
  { name: 'Respiratory', icon: '🫁', desc: 'Asthma, Bronchitis, Sinusitis, Allergic rhinitis' },
  { name: 'Digestive Issues', icon: '🌱', desc: 'IBS, Acidity, Constipation, Liver disorders' },
  { name: 'Joint & Bone', icon: '🦴', desc: 'Arthritis, Gout, Back pain, Cervical spondylosis' },
  { name: "Women's Health", icon: '🌸', desc: 'PCOD, Menstrual disorders, Hormonal imbalance' },
  { name: "Children's Health", icon: '👶', desc: 'Recurrent infections, Growth issues, Behavioral problems' },
  { name: 'Mental Wellness', icon: '🧠', desc: 'Anxiety, Depression, Stress, Insomnia' },
]

const clinicImages = [
  { url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop', alt: 'Clinic Reception' },
  { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop', alt: 'Consultation Room' },
  { url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', alt: 'Medicine Cabinet' },
  { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', alt: 'Homeopathic Medicines' },
  { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop', alt: 'Doctor Consultation' },
  { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop', alt: 'Clinic Exterior' },
]

export default function PublicWebsite() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-white">

      {/* ===== NAVBAR ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className={`font-serif font-bold text-lg ${scrolled ? 'text-green-800' : 'text-white'}`}>
              Hari Om Clinic
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['about', 'treatments', 'contact'].map(section => (
              <button key={section} onClick={() => scrollTo(section)}
                className={`text-sm font-medium capitalize transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-green-700' : 'text-white/90 hover:text-white'
                }`}>
                {section}
              </button>
            ))}
            <Link to="/login"
              className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium
                         hover:bg-green-800 transition-colors shadow-md">
              Doctor Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900
                           flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute text-6xl"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: 0.3 }}>
              🌿
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Rotating profile */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative inline-block mb-8"
          >
            {/* Outer rotating dashed ring */}
            <div className="w-52 h-52 rounded-full border-4 border-dashed border-green-300/60 rotate-ring absolute inset-0" />
            {/* Inner rotating ring with leaves */}
            <div className="w-52 h-52 rounded-full border-2 border-green-400/40 absolute inset-0"
              style={{ animation: 'rotate-ring 12s linear infinite reverse' }} />

            {/* Profile image */}
            <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 mx-auto">
              <img
                src={doctorImg}
                alt="Dr. Kalpesh Pashte"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-green-800
                         px-4 py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap z-20"
            >
              ✅ Available for Consultation
            </motion.div>
          </motion.div>

          {/* Doctor name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mt-6 mb-2"
          >
            Dr. Kalpesh Pashte
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-green-200 text-xl mb-2"
          >
            Homeopathic Physician & Consultant
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            <span className="text-green-200 text-sm ml-1">10+ Years Experience</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-green-100 text-lg italic mb-10"
          >
            "Hari Om Clinic — Health is Wealth"
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-full
                         font-semibold hover:bg-[#1ebe5d] transition-all shadow-lg hover:shadow-xl
                         hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Now
            </a>
            <a href="tel:9226993128"
              className="flex items-center gap-2 bg-white text-green-800 px-8 py-3.5 rounded-full
                         font-semibold hover:bg-green-50 transition-all shadow-lg hover:scale-105 active:scale-95">
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 cursor-pointer"
          onClick={() => scrollTo('about')}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium text-sm uppercase tracking-widest">About</span>
            <h2 className="text-4xl font-serif font-bold text-gray-800 mt-2">
              About Dr. Kalpesh Pashte
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img
                  src={doctorImg}
                  alt="Dr. Kalpesh Pashte"
                  className="w-80 h-80 rounded-3xl object-cover object-top shadow-2xl mx-auto"
                />
                <div className="absolute -bottom-4 -right-4 bg-green-700 text-white p-4 rounded-2xl shadow-lg">
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-xs text-green-200">Years Experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-600 leading-relaxed text-lg">
                Dr. Kalpesh Pashte is a dedicated Homeopathic Physician with over 10 years of clinical
                experience. Practicing at Hari Om Clinic in Shirishpada, Wada, he has helped thousands
                of patients achieve lasting health through the gentle, holistic science of Homeopathy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Homeopathy treats the whole person — mind, body, and spirit — using highly diluted natural
                substances to stimulate the body's own healing mechanisms. It is safe, effective, and
                free from harmful side effects.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, label: 'BHMS Qualified', sub: 'Certified Homeopath' },
                  { icon: Heart, label: '5000+ Patients', sub: 'Successfully Treated' },
                  { icon: Clock, label: 'Daily OPD', sub: 'Mon - Sat, 9AM - 7PM' },
                  { icon: Leaf, label: 'Natural Healing', sub: 'No Side Effects' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-500 text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TREATMENTS SECTION ===== */}
      <section id="treatments" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium text-sm uppercase tracking-widest">Specializations</span>
            <h2 className="text-4xl font-serif font-bold text-gray-800 mt-2">Treatments We Offer</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Comprehensive homeopathic care for a wide range of acute and chronic conditions
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {treatments.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-2xl p-5 text-center shadow-sm border border-green-100 cursor-default"
              >
                <div className="text-4xl mb-3">{t.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{t.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium text-sm uppercase tracking-widest">Contact</span>
            <h2 className="text-4xl font-serif font-bold text-gray-800 mt-2">Get In Touch</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Phone,
                title: 'Call Us',
                lines: ['92269 93128'],
                href: 'tel:9226993128',
                color: 'bg-blue-500',
              },
              {
                icon: Mail,
                title: 'Email Us',
                lines: ['hariomclinic7746@gmail.com'],
                href: 'mailto:hariomclinic7746@gmail.com',
                color: 'bg-red-500',
              },
              {
                icon: MapPin,
                title: 'Visit Us',
                lines: ['At Post Shirishpada', 'Tal: Wada, Dist: Palghar 421312'],
                href: 'https://maps.google.com/?q=Shirishpada+Wada+Palghar',
                color: 'bg-green-600',
              },
            ].map(({ icon: Icon, title, lines, href, color }) => (
              <motion.a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="card text-center hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                {lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
              </motion.a>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-3xl p-10 text-center text-white"
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-serif font-bold mb-2">Chat on WhatsApp</h3>
            <p className="text-green-200 mb-6">
              Click below to directly message Dr. Kalpesh Pashte on WhatsApp for appointments and queries
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 rounded-full
                         font-bold text-lg hover:bg-[#1ebe5d] transition-all shadow-xl
                         hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              Open WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== CLINIC IMAGES GALLERY ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-green-600 font-medium text-sm uppercase tracking-widest">Gallery</span>
            <h2 className="text-4xl font-serif font-bold text-gray-800 mt-2">Our Clinic</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {clinicImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl overflow-hidden shadow-md aspect-video"
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌿</span>
                <span className="font-serif font-bold text-xl">Hari Om Clinic</span>
              </div>
              <p className="text-green-300 text-sm leading-relaxed">
                Providing holistic homeopathic care to the community of Wada, Palghar since 2014.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-200">Quick Links</h4>
              <div className="space-y-2">
                {['About', 'Treatments', 'Contact'].map(link => (
                  <button key={link} onClick={() => scrollTo(link.toLowerCase())}
                    className="block text-green-300 hover:text-white text-sm transition-colors">
                    {link}
                  </button>
                ))}
                <Link to="/login" className="block text-green-300 hover:text-white text-sm transition-colors">
                  Doctor Login
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-200">Contact</h4>
              <div className="space-y-2 text-green-300 text-sm">
                <p>📞 92269 93128</p>
                <p>✉️ hariomclinic7746@gmail.com</p>
                <p>📍 Shirishpada, Wada, Palghar 421312</p>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 pt-6 text-center text-green-400 text-sm">
            <p>© 2024 Hari Om Clinic. All rights reserved. | Dr. Kalpesh Pashte — BHMS</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full
                   flex items-center justify-center shadow-2xl"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </motion.a>
    </div>
  )
}
