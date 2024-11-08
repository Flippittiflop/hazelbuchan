"use client"

import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Instagram, Mail, Linkedin } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    grecaptcha: any;
    onloadCallback: () => void;
  }
}

interface FormInputs {
  name: string;
  email: string;
  message: string;
  'g-recaptcha-response': string;
}

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputs>();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize reCAPTCHA
    window.onloadCallback = () => {
      window.grecaptcha.render('recaptcha', {
        sitekey: '6LcoK3YqAAAAACVceEv38qC3jOufSheeno1V9p_R',
        callback: (response: string) => {
          setValue('g-recaptcha-response', response);
        }
      });
    };

    // Make reCAPTCHA response field required
    const el = document.getElementById('g-recaptcha-response');
    if (el) {
      el.setAttribute('required', 'required');
    }
  }, [setValue]);

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/xanyoypr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (<>
    <Script
        src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
        async
        defer
    />
    <style jsx global>{`
    #g-recaptcha-response {
      display: block !important;
      position: absolute;
      margin: -50px 0 0 0 !important;
      z-index: -999999;
      opacity: 0;
    }
  `}</style>
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

      <div className="flex justify-center space-x-6 mb-8">
        <a href="https://www.instagram.com/hazelbuchan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
          <Instagram size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </a>
        <a href="mailto:hazelmbuchan@gmail.com" className="text-gray-600 hover:text-red-600 transition-colors">
          <Mail size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </a>
        <a href="https://www.linkedin.com/in/hazelbuchan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
          <Linkedin size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </a>
      </div>

      {status === 'success' ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Thank you!</strong>
            <span className="block sm:inline"> Your message has been sent. I'll get back to you soon.</span>
          </div>
      ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {status === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> Something went wrong. Please try again later.</span>
                </div>
            )}

            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
              <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("name", { required: "Name is required" })}
                  disabled={isSubmitting}
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format"
                    }
                  })}
                  disabled={isSubmitting}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Message</label>
              <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  {...register("message", { required: "Message is required" })}
                  disabled={isSubmitting}
              ></textarea>
              {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
            </div>

            <div id="recaptcha" className="mb-4"></div>
            {errors['g-recaptcha-response'] && (
                <p className="mt-2 text-sm text-red-600">Please complete the reCAPTCHA</p>
            )}

            <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
      )}
    </div>
  </>);
}
