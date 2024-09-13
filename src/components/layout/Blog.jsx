import React from 'react';

const Blog = () => {
  return (
    <section id="blog" className="bg-[#fdfff4ff] px-[26px] py-12 md:py-24 lg:py-32">
      <div className="container">
        <div className="space-y-4 text-center">
          <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">
            From the Blog
          </div>
          <h2 className="text-3xl font-bold text-[#0f0f0fff]">Inspiring Stories, Uplifting Insights</h2>
          <p className="text-[#878578ff]">
            Stay up-to-date with the latest news, stories, and updates from Children's Hope.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div
            className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
            data-v0-t="card"
          >
            <img
              src="/placeholder.svg"
              width="400"
              height="250"
              alt="Blog Post 1"
              className="w-full h-48 object-cover"
              style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
            />
            <div className="p-6 space-y-2">
              <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">
                Education
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0fff]">Empowering the Next Generation</h3>
              <p className="text-[#878578ff]">
                Learn how our education programs are transforming the lives of underprivileged children.
              </p>
              <a className="inline-flex items-center gap-2 text-[#D8394D] hover:underline" href="#" rel="ugc">
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
          <div
            className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
            data-v0-t="card"
          >
            <img
              src="/placeholder.svg"
              width="400"
              height="250"
              alt="Blog Post 2"
              className="w-full h-48 object-cover"
              style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
            />
            <div className="p-6 space-y-2">
              <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">
                Healthcare
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0fff]">Providing Vital Medical Care</h3>
              <p className="text-[#878578ff]">
                Discover how our healthcare initiatives are improving the lives of children in need.
              </p>
              <a className="inline-flex items-center gap-2 text-[#D8394D] hover:underline" href="#" rel="ugc">
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
          <div
            className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
            data-v0-t="card"
          >
            <img
              src="/placeholder.svg"
              width="400"
              height="250"
              alt="Blog Post 3"
              className="w-full h-48 object-cover"
              style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
            />
            <div className="p-6 space-y-2">
              <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">
                Spiritual Guidance
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0fff]">Nurturing the Soul, Uplifting the Spirit</h3>
              <p className="text-[#878578ff]">
                Explore how our spiritual programs are helping children find hope and inspiration.
              </p>
              <a className="inline-flex items-center gap-2 text-[#D8394D] hover:underline" href="#" rel="ugc">
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;