import React from 'react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Welcome to Nexus<span className="text-primary">News</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Your home for fresh insights, real stories, and meaningful conversations.
        </p>
      </div>

      <div className="prose prose-lg prose-blue mx-auto text-gray-700">
        <p className="lead text-xl font-medium mb-8">
          NexusNews is a modern publishing platform built for readers and writers who value clarity, depth, and authenticity. We provide a clean, responsive, and engaging environment where ideas can be shared freely and discovered easily.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-blue-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mt-0">Our Mission</h2>
            <p className="mb-0">
              Our mission is simple: <strong>to connect people through stories, knowledge, and creativity.</strong> NexusNews was created to give individuals a space where quality content can shine without noise or distractions.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mt-0">How We Began</h2>
            <p className="mb-0">
              NexusNews started from a passion for writing and a desire to build a platform that feels simple, elegant, and truly enjoyable to use. We set out to create something better — a place where your thoughts and creativity take center stage.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
        <ul className="space-y-2">
          <li><strong>Diverse Topics</strong> — technology, lifestyle, culture, opinions, personal experiences, and more.</li>
          <li><strong>A Clean Reading Experience</strong> — minimalistic design, easy navigation, and fast loading for all devices.</li>
          <li><strong>Community Interaction</strong> — readers can engage with posts through comments and discussions.</li>
          <li><strong>Consistent Updates</strong> — new posts added regularly to keep you informed and inspired.</li>
        </ul>

        <hr className="my-12 border-gray-200" />

        <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          {[
            { title: 'Authenticity', desc: 'We value honest voices and original content.' },
            { title: 'Quality', desc: 'We prioritize meaningful writing and well-crafted stories.' },
            { title: 'Community', desc: 'We believe in warmth, connection, and shared experiences.' },
            { title: 'Growth', desc: 'We strive to improve continuously — in content and UX.' }
          ].map((val, idx) => (
            <div key={idx} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs mt-1 mr-3">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{val.title}</h3>
                <p className="text-gray-600 text-sm">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-900 text-white p-8 rounded-2xl text-center not-prose">
          <h3 className="text-2xl font-bold mb-4">Why NexusNews Stands Out</h3>
          <ul className="text-left max-w-md mx-auto space-y-3 text-gray-300 mb-6">
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> A refreshing, user-friendly design</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Thoughtful content across various themes</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> A platform built to support writers and engage readers</li>
          </ul>
          <p className="font-serif italic text-lg">
            "Whether you’re here to read, share your thoughts, or explore new perspectives, NexusNews is your space."
          </p>
        </div>
      </div>
    </div>
  );
};