import { setupWorker, rest } from 'msw';
import { db } from './database';

const simulateNetworkDelay = () => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 1000 + 200; // 200-1200ms
    const shouldError = Math.random() < 0.1; // 10% error rate for write operations
    
    setTimeout(() => {
      if (shouldError && Math.random() > 0.7) { // Reduce error rate slightly
        reject(new Error('Simulated network error'));
      } else {
        resolve();
      }
    }, delay);
  });
};

export const handlers = [
  // Authentication endpoints
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate auth delay
      
      const user = await db.users.where('email').equals(email).first();
      
      if (user && user.password === password) {
        return res(
          ctx.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token: `jwt_token_${user.id}_${Date.now()}`
          })
        );
      } else {
        return res(
          ctx.status(401),
          ctx.json({ success: false, message: 'Invalid email or password' })
        );
      }
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ success: false, message: 'Authentication service unavailable' })
      );
    }
  }),

  // Jobs endpoints
  rest.get('/api/jobs', async (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const status = req.url.searchParams.get('status') || '';
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const pageSize = parseInt(req.url.searchParams.get('pageSize') || '10');
    const sort = req.url.searchParams.get('sort') || 'order';

    let query = db.jobs.orderBy(sort);

    if (search) {
      query = query.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (status) {
      query = query.filter(job => job.status === status);
    }

    const jobs = await query.toArray();
    const total = jobs.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

    await new Promise(resolve => setTimeout(resolve, 300));

    return res(
      ctx.json({
        jobs: paginatedJobs,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      })
    );
  }),

  rest.post('/api/jobs', async (req, res, ctx) => {
    try {
      await simulateNetworkDelay();
      
      const jobData = await req.json();
      
      // Check for duplicate slug
      const existingJob = await db.jobs.where('slug').equals(jobData.slug).first();
      if (existingJob) {
        return res(
          ctx.status(400),
          ctx.json({ message: 'Job with this slug already exists' })
        );
      }
      
      const maxOrder = await db.jobs.orderBy('order').last();
      const newOrder = maxOrder ? maxOrder.order + 1 : 0;
      
      const job = {
        ...jobData,
        order: newOrder,
        createdAt: new Date(),
        status: jobData.status || 'active'
      };
      
      const id = await db.jobs.add(job);
      const createdJob = await db.jobs.get(id);
      
      return res(ctx.json(createdJob));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to create job: ' + error.message })
      );
    }
  }),

  rest.patch('/api/jobs/:id', async (req, res, ctx) => {
    try {
      await simulateNetworkDelay();
      
      const { id } = req.params;
      const updates = await req.json();
      
      // Check if slug is being updated and is unique
      if (updates.slug) {
        const existingJob = await db.jobs.where('slug').equals(updates.slug).and(job => job.id !== parseInt(id)).first();
        if (existingJob) {
          return res(
            ctx.status(400),
            ctx.json({ message: 'Job with this slug already exists' })
          );
        }
      }
      
      await db.jobs.update(parseInt(id), { ...updates, updatedAt: new Date() });
      const updatedJob = await db.jobs.get(parseInt(id));
      
      return res(ctx.json(updatedJob));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to update job: ' + error.message })
      );
    }
  }),

  rest.patch('/api/jobs/:id/reorder', async (req, res, ctx) => {
    try {
      await simulateNetworkDelay();
      
      const { id } = req.params;
      const { fromOrder, toOrder } = await req.json();
      
      // Get all jobs to reorder
      const jobs = await db.jobs.orderBy('order').toArray();
      
      // Find the job being moved
      const movingJobIndex = jobs.findIndex(job => job.id === parseInt(id));
      if (movingJobIndex === -1) {
        throw new Error('Job not found');
      }
      
      const movingJob = jobs[movingJobIndex];
      
      // Remove the job from its current position
      jobs.splice(movingJobIndex, 1);
      
      // Insert it at the new position
      const newIndex = fromOrder < toOrder ? toOrder - 1 : toOrder;
      jobs.splice(newIndex, 0, movingJob);
      
      // Update all order values
      const updates = jobs.map((job, index) => ({
        id: job.id,
        order: index
      }));
      
      // Batch update
      await db.transaction('rw', db.jobs, async () => {
        for (const update of updates) {
          await db.jobs.update(update.id, { order: update.order });
        }
      });
      
      return res(ctx.json({ success: true }));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to reorder job: ' + error.message })
      );
    }
  }),

  // Candidates endpoints
  rest.get('/api/candidates', async (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const stage = req.url.searchParams.get('stage') || '';
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const pageSize = parseInt(req.url.searchParams.get('pageSize') || '50');

    let candidates = await db.candidates.orderBy('createdAt').reverse().toArray();

    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower)
      );
    }

    if (stage) {
      candidates = candidates.filter(candidate => candidate.stage === stage);
    }

    const total = candidates.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedCandidates = candidates.slice(startIndex, startIndex + pageSize);

    // Add job information to candidates
    const candidatesWithJobs = await Promise.all(
      paginatedCandidates.map(async (candidate) => {
        const job = await db.jobs.get(candidate.jobId);
        return { ...candidate, job: job || null };
      })
    );

    await new Promise(resolve => setTimeout(resolve, 200));

    return res(
      ctx.json({
        candidates: candidatesWithJobs,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      })
    );
  }),

  rest.get('/api/candidates/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const candidate = await db.candidates.get(parseInt(id));
    
    if (!candidate) {
      return res(ctx.status(404), ctx.json({ message: 'Candidate not found' }));
    }

    const job = await db.jobs.get(candidate.jobId);
    const candidateWithJob = { ...candidate, job };

    return res(ctx.json(candidateWithJob));
  }),

  rest.patch('/api/candidates/:id', async (req, res, ctx) => {
    try {
      await simulateNetworkDelay();
      
      const { id } = req.params;
      const updates = await req.json();
      
      const candidate = await db.candidates.get(parseInt(id));
      if (!candidate) {
        return res(ctx.status(404), ctx.json({ message: 'Candidate not found' }));
      }
      
      const oldStage = candidate.stage;
      
      await db.candidates.update(parseInt(id), { 
        ...updates, 
        updatedAt: new Date() 
      });
      
      // Add timeline entry if stage changed
      if (updates.stage && updates.stage !== oldStage) {
        await db.candidateTimeline.add({
          candidateId: parseInt(id),
          stage: updates.stage,
          timestamp: new Date(),
          notes: updates.notes || `Stage updated from ${oldStage} to ${updates.stage}`
        });
      }
      
      const updatedCandidate = await db.candidates.get(parseInt(id));
      const job = await db.jobs.get(updatedCandidate.jobId);
      
      return res(ctx.json({ ...updatedCandidate, job }));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to update candidate: ' + error.message })
      );
    }
  }),

  rest.get('/api/candidates/:id/timeline', async (req, res, ctx) => {
    const { id } = req.params;
    
    const timeline = await db.candidateTimeline
      .where('candidateId')
      .equals(parseInt(id))
      .orderBy('timestamp')
      .toArray();
    
    return res(ctx.json(timeline));
  }),

  // Assessment endpoints
  rest.get('/api/assessments/:jobId', async (req, res, ctx) => {
    const { jobId } = req.params;
    
    const assessment = await db.assessments
      .where('jobId')
      .equals(parseInt(jobId))
      .first();
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return res(ctx.json(assessment || null));
  }),

  rest.put('/api/assessments/:jobId', async (req, res, ctx) => {
    try {
      await simulateNetworkDelay();
      
      const { jobId } = req.params;
      const assessmentData = await req.json();
      
      const existing = await db.assessments
        .where('jobId')
        .equals(parseInt(jobId))
        .first();
      
      if (existing) {
        await db.assessments.update(existing.id, { 
          ...assessmentData, 
          updatedAt: new Date() 
        });
        const updated = await db.assessments.get(existing.id);
        return res(ctx.json(updated));
      } else {
        const id = await db.assessments.add({
          ...assessmentData,
          jobId: parseInt(jobId),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        const created = await db.assessments.get(id);
        return res(ctx.json(created));
      }
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to save assessment: ' + error.message })
      );
    }
  }),

  rest.post('/api/assessments/:jobId/submit', async (req, res, ctx) => {
    try {
      const { jobId } = req.params;
      const { candidateId, responses } = await req.json();
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const id = await db.assessmentResponses.add({
        assessmentId: parseInt(jobId),
        candidateId,
        responses,
        submittedAt: new Date(),
        score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
      });
      
      return res(ctx.json({ id, success: true, message: 'Assessment submitted successfully' }));
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Failed to submit assessment: ' + error.message })
      );
    }
  })
];

export const worker = setupWorker(...handlers);