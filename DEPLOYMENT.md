# Deploying CampusConnect to Vercel

This repository is pre-configured for full-stack deployment on **Vercel** with:
- **Vite React Frontend** (served as optimized static assets with client-side SPA routing).
- **Express Backend API** (served via Vercel Serverless Functions under `/api/*`).
- **Cached Database Connection** for MongoDB Atlas.

---

## 1. Prerequisites (MongoDB Atlas Setup)

Since Vercel uses serverless functions, you need an external MongoDB connection (such as free-tier [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)):

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com/).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Vercel serverless functions can connect.
3. Under **Database Access**, create a database user with username and password.
4. Click **Connect** -> **Connect your application** (Driver: Node.js) and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority
   ```

---

## 2. Option A: Deploy via Vercel Web Dashboard (Recommended)

1. Push your project code to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..."** -> **"Project"**.
3. Import your repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (or `Other`)
   - **Root Directory**: `./` (leave default root)
   - **Build Command**: `cd client && npm install && npm run build` (pre-configured in `vercel.json`)
   - **Output Directory**: `client/dist` (pre-configured in `vercel.json`)
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   |---|---|---|
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/campusconnect` | MongoDB Atlas URI |
   | `JWT_SECRET` | `your_secure_random_jwt_secret_key` | Secret for JWT authentication |
   | `NODE_ENV` | `production` | Production environment flag |
6. Click **Deploy**.

---

## 3. Option B: Deploy via Vercel CLI (Command Line)

You can deploy directly from your terminal:

```bash
# 1. Run Vercel deployment tool
npx vercel

# 2. Follow the interactive prompts:
#   - Set up and deploy? [Y]
#   - Which scope? (Select your account)
#   - Link to existing project? [N]
#   - What's your project's name? campus-connect
#   - In which directory is your code located? ./
#   - Want to modify these settings? [N]

# 3. Add Environment Variables to your project:
npx vercel env add MONGODB_URI
npx vercel env add JWT_SECRET
npx vercel env add NODE_ENV

# 4. Deploy to Production:
npx vercel --prod
```

---

## 4. Verification & Testing

Once deployed, Vercel will give you a live URL (e.g. `https://campus-connect.vercel.app`):

- **Frontend App**: `https://<your-project>.vercel.app/`
- **Backend Health Check**: `https://<your-project>.vercel.app/api/health`
- **Re-Seed Demo Data (Optional)**: `POST https://<your-project>.vercel.app/api/seed`

### Default Demo Credentials
- **Admin**: `admin@campusconnect.edu` / `admin123`
- **Google Recruiter**: `recruiter.google@campusconnect.edu` / `recruiter123`
- **Student (Aarav)**: `aarav.cse@campusconnect.edu` / `student123`
- **Student (Diya)**: `diya.it@campusconnect.edu` / `student123`
