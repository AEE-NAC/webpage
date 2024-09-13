
const Link = ({ href, children, ...props }) => {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
      {...props}
    >
      {children}
    </a>
  );
};
export default function Home() {
  return (
    <div className="bg-[var(--ivory)] text-[var(--night)] min-h-screen">
      <main className="container mx-auto py-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="col-span-1 md:col-span-2">
          <div className="bg-[var(--blush)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Weekly Word</h2>
            <div className="flex items-start gap-4">
              <img
                src="/sequ.jpg"
                width="200"
                height="200"
                alt="Weekly Word"
                className="rounded-lg"
                style={{ aspectRatio: "200/200", objectFit: "cover" }}
              />
              <div>
                <h3 className="text-xl font-bold mb-2">The Power of Forgiveness</h3>
                <p className="text-[var(--battleship-gray)] mb-4">
                  Explore the transformative impact of forgiveness in our lives and communities.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
                  prefetch={false}
                >
                  Read More
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-[var(--blush)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="120"
                  height="120"
                  alt="Article 1"
                  className="rounded-lg"
                  style={{ aspectRatio: "120/120", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Navigating Spiritual Growth</h3>
                  <p className="text-[var(--battleship-gray)] mb-4">
                    Discover practical tips for deepening your faith and fostering spiritual growth.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
                    prefetch={false}
                  >
                    Read More
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="120"
                  height="120"
                  alt="Article 2"
                  className="rounded-lg"
                  style={{ aspectRatio: "120/120", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Cultivating Compassion</h3>
                  <p className="text-[var(--battleship-gray)] mb-4">
                    Explore ways to develop a heart of compassion and serve others.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
                    prefetch={false}
                  >
                    Read More
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--blush)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Available Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-[var(--ivory)] rounded-lg p-4 flex flex-col items-center">
                <img
                  src="/sequ.jpg"
                  width="140"
                  height="200"
                  alt="Book 1"
                  className="rounded-lg mb-4"
                  style={{ aspectRatio: "140/200", objectFit: "cover" }}
                />
                <h3 className="text-lg font-bold mb-2">The Power of Prayer</h3>
                <p className="text-[var(--battleship-gray)] mb-4">
                  Discover the transformative impact of prayer in your life.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
                  prefetch={false}
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-[var(--ivory)] rounded-lg p-4 flex flex-col items-center">
                <img
                  src="/sequ.jpg"
                  width="140"
                  height="200"
                  alt="Book 2"
                  className="rounded-lg mb-4"
                  style={{ aspectRatio: "140/200", objectFit: "cover" }}
                />
                <h3 className="text-lg font-bold mb-2">Embracing Forgiveness</h3>
                <p className="text-[var(--battleship-gray)] mb-4">Explore the path to forgiveness and healing.</p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
                  prefetch={false}
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-[var(--ivory)] rounded-lg p-4 flex flex-col items-center">
                <img
                  src="/sequ.jpg"
                  width="140"
                  height="200"
                  alt="Book 3"
                  className="rounded-lg mb-4"
                  style={{ aspectRatio: "140/200", objectFit: "cover" }}
                />
                <h3 className="text-lg font-bold mb-2">Living with Purpose</h3>
                <p className="text-[var(--battleship-gray)] mb-4">Discover your God-given purpose and live it out.</p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-[var(--celtic-blue)] font-medium hover:underline"
                  prefetch={false}
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="col-span-1">
          <div className="bg-[var(--blush)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Activities</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="80"
                  height="80"
                  alt="Activity 1"
                  className="rounded-lg"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Youth Group Meetup</h3>
                  <p className="text-[var(--battleship-gray)] mb-2">
                    Join us for a fun and engaging youth group gathering.
                  </p>
                  <div className="flex items-center gap-2 text-[var(--celtic-blue)]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>June 15, 2023</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="80"
                  height="80"
                  alt="Activity 2"
                  className="rounded-lg"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Bible Study Group</h3>
                  <p className="text-[var(--battleship-gray)] mb-2">Join us for a weekly Bible study and discussion.</p>
                  <div className="flex items-center gap-2 text-[var(--celtic-blue)]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Wednesdays, 7 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--blush)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Formation</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="80"
                  height="80"
                  alt="Formation 1"
                  className="rounded-lg"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Spiritual Retreats</h3>
                  <p className="text-[var(--battleship-gray)] mb-2">
                    Deepen your faith through our spiritual retreats.
                  </p>
                  <div className="flex items-center gap-2 text-[var(--celtic-blue)]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>July 12-15, 2023</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="80"
                  height="80"
                  alt="Formation 2"
                  className="rounded-lg"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Discipleship Classes</h3>
                  <p className="text-[var(--battleship-gray)] mb-2">
                    Grow in your faith through our discipleship classes.
                  </p>
                  <div className="flex items-center gap-2 text-[var(--celtic-blue)]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Tuesdays, 6 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--blush)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">News</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="80"
                  height="80"
                  alt="News 1"
                  className="rounded-lg"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">New Outreach Program Launched</h3>
                  <p className="text-[var(--battleship-gray)] mb-2">
                    Learn more about our new outreach program and how you can get involved.
                  </p>
                  <div className="flex items-center gap-2 text-[var(--celtic-blue)]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>June 1, 2023</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="/sequ.jpg"
                  width="80"
                  height="80"
                  alt="News 2"
                  className="rounded-lg"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div>
                  <h3 className="text-lg font-bold mb-2">Volunteer Opportunities Available</h3>
                  <p className="text-[var(--battleship-gray)] mb-2">
                    Explore the various ways you can volunteer and serve with our organization.
                  </p>
                  <div className="flex items-center gap-2 text-[var(--celtic-blue)]">
                    <CalendarIcon className="w-4 h-4" />
                    <span>May 15, 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[var(--english-violet)] text-[var(--ivory)] py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CrossIcon className="w-6 h-6" />
          <span className="text-sm">&copy; 2024 Christian Organization. All rights reserved.</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}


function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function CrossIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  )
}