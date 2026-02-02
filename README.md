# MAKNE

MAKNE is a full-stack collaboration and agreement platform for creators, brands, and agencies.

## ✨ Features
- Email + OTP signup
- Secure password-based login
- Role-based onboarding (Creator, Brand, Agency)
- Real backend authentication (MongoDB, bcrypt)
- Clean, dark-themed UI

## 🛠 Tech Stack
- Next.js (App Router)
- MongoDB
- Tailwind CSS
- Nodemailer
- JWT (planned)

## 🚧 Status
Authentication & onboarding complete. Core product features in progress.


## Payment auto-release
Payments are released via a system job. In production, this job would be triggered by a cron/worker. For MVP, it is run manually via a protected system endpoint.