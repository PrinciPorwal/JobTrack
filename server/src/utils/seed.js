const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const path = require('path');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to Atlas. Clearing existing data...');

    await Application.deleteMany({});
    await Interview.deleteMany({});
    await Resume.deleteMany({});

    console.log('[Seed] Creating single resume record...');
    await Resume.create({
      name: 'Software Engineer Resume',
      fileUrl: 'https://drive.google.com/file/d/1eRtfLSkRqj6cHBaE6ccAJZaeFa_ZJvuH/view?usp=sharing',
    });

    console.log('[Seed] Creating sample applications...');
    const now = new Date();

    const apps = await Application.create([
      {
        company: 'Google',
        jobTitle: 'Software Engineer (L4)',
        jobUrl: 'https://careers.google.com/jobs/results/12345678',
        location: 'Bengaluru, India / Hybrid',
        workMode: 'HYBRID',
        employmentType: 'FULL_TIME',
        salaryMin: 180000,
        salaryMax: 220000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 18),
        status: 'INTERVIEW',
        source: 'Referral',
        recruiter: {
          name: 'Sarah Jenkins',
          email: 'sjenkins@google.com',
          linkedin: 'https://linkedin.com/in/sarah-jenkins-tech',
        },
        jobDescription: 'Build high-throughput backend services and cloud infrastructure powering distributed search indexing.',
        notes: 'Referred by alumni. Prepared system design notes and caching strategies.',
      },
      {
        company: 'Microsoft',
        jobTitle: 'Software Development Engineer II',
        jobUrl: 'https://careers.microsoft.com/us/en/job/987654',
        location: 'Hyderabad, India / Hybrid',
        workMode: 'HYBRID',
        employmentType: 'FULL_TIME',
        salaryMin: 155000,
        salaryMax: 185000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 25),
        status: 'INTERVIEW',
        source: 'LinkedIn',
        recruiter: {
          name: 'David Chen',
          email: 'dchen@microsoft.com',
          linkedin: 'https://linkedin.com/in/davidchen-recruiter',
        },
        jobDescription: 'Work on Azure Core team designing resilient distributed cloud storage primitives.',
        notes: 'Passed initial coding challenge. Next round is deep system architecture.',
      },
      {
        company: 'Razorpay',
        jobTitle: 'Senior Frontend Engineer',
        jobUrl: 'https://razorpay.com/jobs/fe-sr',
        location: 'Bengaluru, India',
        workMode: 'HYBRID',
        employmentType: 'FULL_TIME',
        salaryMin: 140000,
        salaryMax: 170000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 35),
        status: 'OFFER',
        source: 'Wellfound',
        recruiter: {
          name: 'Ananya Sharma',
          email: 'ananya.s@razorpay.com',
          linkedin: 'https://linkedin.com/in/ananya-sharma-talent',
        },
        jobDescription: 'Lead checkout experience team, micro-frontends with React, TypeScript, and high-performance Web APIs.',
        notes: 'Offer letter received! Reviewing benefits and stock option vesting schedule.',
      },
      {
        company: 'Stripe',
        jobTitle: 'Backend Platform Engineer',
        jobUrl: 'https://stripe.com/jobs/backend-platform',
        location: 'Remote, Global',
        workMode: 'REMOTE',
        employmentType: 'FULL_TIME',
        salaryMin: 170000,
        salaryMax: 210000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
        status: 'SAVED',
        source: 'Company Website',
        recruiter: {
          name: 'Elena Rostova',
          email: 'erostova@stripe.com',
          linkedin: 'https://linkedin.com/in/elenarostova',
        },
        jobDescription: 'Scale core billing and payments ledger infrastructure handling billions in volume daily.',
        notes: 'Position opened yesterday. Need to tailor resume bullet points for distributed systems.',
      },
      {
        company: 'Uber',
        jobTitle: 'Software Engineer II - Dispatch',
        jobUrl: 'https://uber.com/careers/dispatch-sde2',
        location: 'Bengaluru, India',
        workMode: 'HYBRID',
        employmentType: 'FULL_TIME',
        salaryMin: 145000,
        salaryMax: 175000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8),
        status: 'APPLIED',
        source: 'LinkedIn',
        recruiter: {
          name: 'Vikram Mehta',
          email: 'vmehta@uber.com',
          linkedin: 'https://linkedin.com/in/vmehta-uber',
        },
        jobDescription: 'Real-time routing algorithms, spatial computing, low-latency microservices with Go and Kafka.',
        notes: 'Submitted online application with updated portfolio.',
      },
      {
        company: 'Notion',
        jobTitle: 'Product Infrastructure Engineer',
        jobUrl: 'https://notion.so/careers/prod-infra',
        location: 'Remote',
        workMode: 'REMOTE',
        employmentType: 'FULL_TIME',
        salaryMin: 150000,
        salaryMax: 180000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 12),
        status: 'APPLIED',
        source: 'Wellfound',
        recruiter: {
          name: 'Chloe Simmons',
          email: 'chloe@notion.com',
          linkedin: 'https://linkedin.com/in/chloesimmons',
        },
        jobDescription: 'Collaborative real-time editing infrastructure, operational transformation, conflict resolution.',
        notes: 'Huge fan of Notion products. Application submitted via referral link.',
      },
      {
        company: 'Amazon',
        jobTitle: 'SDE II - AWS DynamoDB',
        jobUrl: 'https://amazon.jobs/dynamo-sde2',
        location: 'Hyderabad, India',
        workMode: 'ONSITE',
        employmentType: 'FULL_TIME',
        salaryMin: 150000,
        salaryMax: 175000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 40),
        status: 'REJECTED',
        source: 'Naukri',
        recruiter: {
          name: 'Karan Malhotra',
          email: 'karanm@amazon.com',
          linkedin: 'https://linkedin.com/in/karanm-amazon',
        },
        jobDescription: 'NoSQL distributed database engine development and performance optimization.',
        notes: 'OA was tough on dynamic programming. Rejected after online assessment.',
      },
      {
        company: 'Meta',
        jobTitle: 'Production Engineer',
        jobUrl: 'https://metacareers.com/pe-global',
        location: 'London, UK / Onsite',
        workMode: 'ONSITE',
        employmentType: 'FULL_TIME',
        salaryMin: 165000,
        salaryMax: 195000,
        applicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 20),
        status: 'WITHDRAWN',
        source: 'LinkedIn',
        recruiter: {
          name: 'Marcus Vance',
          email: 'mvance@meta.com',
          linkedin: 'https://linkedin.com/in/marcusvance',
        },
        jobDescription: 'Linux kernel tuning, large scale site reliability and container fleet management.',
        notes: 'Withdrew application due to relocation restrictions.',
      },
    ]);

    console.log('[Seed] Applications seeded. Adding interview rounds...');
    const googleApp = apps.find((a) => a.company === 'Google');
    const msftApp = apps.find((a) => a.company === 'Microsoft');
    const razorpayApp = apps.find((a) => a.company === 'Razorpay');
    const amazonApp = apps.find((a) => a.company === 'Amazon');

    await Interview.create([
      {
        applicationId: googleApp._id,
        round: 'OA',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14),
        time: '14:00',
        interviewType: 'ONLINE',
        meetingLink: 'https://hackerrank.com/test/google-oa-2026',
        interviewer: 'Automated Platform',
        notes: 'Scored 100% on two graph & greedy algorithmic questions.',
        result: 'PASSED',
      },
      {
        applicationId: googleApp._id,
        round: 'TECHNICAL',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        time: '16:30',
        interviewType: 'VIDEO',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        interviewer: 'Alex Rivera (Staff Eng)',
        notes: 'Covered concurrency, thread pools, and LRU cache with locks.',
        result: 'PASSED',
      },
      {
        applicationId: googleApp._id,
        round: 'SYSTEM_DESIGN',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        time: '18:00',
        interviewType: 'VIDEO',
        meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
        interviewer: 'Priya Nair (Principal Eng)',
        notes: 'Upcoming round: Distributed Rate Limiter & Notification Service.',
        result: 'PENDING',
      },
      {
        applicationId: msftApp._id,
        round: 'TECHNICAL',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
        time: '11:00',
        interviewType: 'VIDEO',
        meetingLink: 'https://teams.microsoft.com/l/meetup/msft-round1',
        interviewer: 'Rohan Gupta',
        notes: 'Binary search tree rebalancing and Trie implementation.',
        result: 'PASSED',
      },
      {
        applicationId: msftApp._id,
        round: 'SYSTEM_DESIGN',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        time: '15:00',
        interviewType: 'VIDEO',
        meetingLink: 'https://teams.microsoft.com/l/meetup/msft-round2',
        interviewer: 'Emily Watson',
        notes: 'Design Azure Blob Storage metadata indexing service.',
        result: 'PENDING',
      },
      {
        applicationId: razorpayApp._id,
        round: 'TECHNICAL',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28),
        time: '15:00',
        interviewType: 'VIDEO',
        meetingLink: 'https://meet.google.com/rzp-tech',
        interviewer: 'Siddharth Roy',
        notes: 'Deep dive into React 19 reconciliation, hooks internals, and SSR.',
        result: 'PASSED',
      },
      {
        applicationId: razorpayApp._id,
        round: 'HR',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 22),
        time: '12:00',
        interviewType: 'PHONE',
        meetingLink: '',
        interviewer: 'Ananya Sharma (HR Head)',
        notes: 'Culture fit, team compensation expectations, offer details discussed.',
        result: 'PASSED',
      },
      {
        applicationId: amazonApp._id,
        round: 'OA',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 36),
        time: '10:00',
        interviewType: 'ONLINE',
        meetingLink: 'https://amazon.hirepro.in/assessment',
        interviewer: 'Automated OA',
        notes: 'Failed 2 corner cases on DP knapsack variation.',
        result: 'FAILED',
      },
    ]);

    console.log('[Seed] Database successfully seeded with rich JobTrack data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
