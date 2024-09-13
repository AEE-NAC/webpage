import React from 'react';

const WeeklySection = () => {
  return (
    <section className="container px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Word of the Week</h2>
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-primary-foreground">
              JN
            </div>
            <div>
              <h3 className="text-lg font-semibold">John 3:16</h3>
              <p className="text-muted-foreground">
                "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him
                should not perish, but have everlasting life."
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Featured Articles</h2>
          <div className="grid gap-4">
            <a className="group flex items-center gap-4 hover:bg-muted rounded-lg p-3" href="#" rel="ugc">
              <img
                src="/sequ.jpg"
                width="64"
                height="64"
                alt="Article Thumbnail"
                className="rounded-lg"
                style={{ aspectRatio: '64 / 64', objectFit: 'cover' }}
              />
              <div>
                <h3 className="text-lg font-semibold group-hover:underline">The Power of Prayer</h3>
                <p className="text-muted-foreground line-clamp-2">
                  Discover the transformative impact of prayer in your daily life.
                </p>
              </div>
            </a>
            <a className="group flex items-center gap-4 hover:bg-muted rounded-lg p-3" href="#" rel="ugc">
              <img
                src="/sequ.jpg"
                width="64"
                height="64"
                alt="Article Thumbnail"
                className="rounded-lg"
                style={{ aspectRatio: '64 / 64', objectFit: 'cover' }}
              />
              <div>
                <h3 className="text-lg font-semibold group-hover:underline">Navigating Life's Challenges</h3>
                <p className="text-muted-foreground line-clamp-2">
                  Practical guidance for overcoming obstacles and finding peace.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedBooks = () => {
    return (
      <section className="container px-4 md:px-6">
        <div className="bg-card rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a className="group flex flex-col items-center gap-2 hover:bg-muted rounded-lg p-3" href="#" rel="ugc">
              <img
                src="/sequ.jpg"
                width="120"
                height="160"
                alt="Book Cover"
                className="rounded-lg"
                style={{ aspectRatio: '120 / 160', objectFit: 'cover' }}
              />
              <h3 className="text-lg font-semibold group-hover:underline">The Pursuit of God</h3>
              <p className="text-muted-foreground text-sm">A.W. Tozer</p>
            </a>
            <a className="group flex flex-col items-center gap-2 hover:bg-muted rounded-lg p-3" href="#" rel="ugc">
              <img
                src="/sequ.jpg"
                width="120"
                height="160"
                alt="Book Cover"
                className="rounded-lg"
                style={{ aspectRatio: '120 / 160', objectFit: 'cover' }}
              />
              <h3 className="text-lg font-semibold group-hover:underline">Mere Christianity</h3>
              <p className="text-muted-foreground text-sm">C.S. Lewis</p>
            </a>
            <a className="group flex flex-col items-center gap-2 hover:bg-muted rounded-lg p-3" href="#" rel="ugc">
              <img
                src="/sequ.jpg"
                width="120"
                height="160"
                alt="Book Cover"
                className="rounded-lg"
                style={{ aspectRatio: '120 / 160', objectFit: 'cover' }}
              />
              <h3 className="text-lg font-semibold group-hover:underline">The Screwtape Letters</h3>
              <p className="text-muted-foreground text-sm">C.S. Lewis</p>
            </a>
            <a className="group flex flex-col items-center gap-2 hover:bg-muted rounded-lg p-3" href="#" rel="ugc">
              <img
                src="/sequ.jpg"
                width="120"
                height="160"
                alt="Book Cover"
                className="rounded-lg"
                style={{ aspectRatio: '120 / 160', objectFit: 'cover' }}
              />
              <h3 className="text-lg font-semibold group-hover:underline">The Cost of Discipleship</h3>
              <p className="text-muted-foreground text-sm">Dietrich Bonhoeffer</p>
            </a>
          </div>
        </div>
      </section>
    );
  };
  

const UpcomingEvents = () => {
  return (
    <section className="container px-4 md:px-6">
      <div className="bg-card rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <div className="bg-primary rounded-lg p-3 text-primary-foreground flex items-center justify-center">
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
                className="w-6 h-6"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:underline">Bible Study Group</h3>
            <p className="text-muted-foreground">
              Join us for a weekly Bible study group, exploring the scriptures and growing in faith together.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span>Every Wednesday, 7:00 PM</span>
            </div>
          </a>
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <div className="bg-primary rounded-lg p-3 text-primary-foreground flex items-center justify-center">
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
                className="w-6 h-6"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:underline">Worship Night</h3>
            <p className="text-muted-foreground">Join us for a special evening of worship, praise, and fellowship.</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span>June 15th, 7:00 PM</span>
            </div>
          </a>
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <div className="bg-primary rounded-lg p-3 text-primary-foreground flex items-center justify-center">
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
                className="w-6 h-6"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:underline">Youth Retreat</h3>
            <p className="text-muted-foreground">
              A weekend getaway for our youth, focused on spiritual growth and fellowship.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span>July 12-14</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
const TrainingSection = () => {
  return (
    <section className="container px-4 md:px-6">
      <div className="bg-card rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Training &amp; Formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <div className="bg-primary rounded-lg p-3 text-primary-foreground flex items-center justify-center">
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
                className="w-6 h-6"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:underline">Bible Study Workshops</h3>
            <p className="text-muted-foreground">
              Deepen your understanding of the Bible through our interactive workshops.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span>Every 2nd Saturday, 10:00 AM</span>
            </div>
          </a>
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <div className="bg-primary rounded-lg p-3 text-primary-foreground flex items-center justify-center">
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
                className="w-6 h-6"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:underline">Discipleship Mentoring</h3>
            <p className="text-muted-foreground">Receive one-on-one guidance and support in your spiritual journey.</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span>By appointment</span>
            </div>
          </a>
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <div className="bg-primary rounded-lg p-3 text-primary-foreground flex items-center justify-center">
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
                className="w-6 h-6"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold group-hover:underline">Theology Lectures</h3>
            <p className="text-muted-foreground">
              Explore deep theological topics through our engaging lecture series.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span>1st and 3rd Fridays, 7:00 PM</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
const NewsSection = () => {
  return (
    <section className="container px-4 md:px-6">
      <div className="bg-card rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">News &amp; Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a className="group flex flex-col gap-2 hover:bg-muted rounded-lg p-4" href="#" rel="ugc">
            <img
              src="/sequ.jpg"
              width="240"
              height="160"
              alt="News Thumbnail"
              className="rounded-lg"
              style={{ aspectRatio: '240 / 160', objectFit: 'cover' }}
            />
            <h3 className="text-lg font-semibold group-hover:underline">Announcing New Outreach Program</h3>
            <p className="text-muted-foreground line-clamp-2">
              We're excited to launch our new outreach program, designed to serve the local community and share the
              love of Christ.
            </p>
            <div className="flex"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

export {WeeklySection,FeaturedBooks,UpcomingEvents,TrainingSection,NewsSection};
