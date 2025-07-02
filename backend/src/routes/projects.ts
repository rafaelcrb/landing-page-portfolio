import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinary';

const router = express.Router();
const prisma = new PrismaClient();

// Get all visible projects (public endpoint)
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isVisible: true },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project by ID (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(id),
        isVisible: true
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all projects for admin (protected endpoint)
router.get('/admin/all', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(projects);
  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project (protected endpoint)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, tags, image, images, link, isVisible, isFeatured } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    let uploadedImage = null;
    let uploadedImages: string[] = [];

    // Upload main image if provided
    if (image) {
      uploadedImage = await uploadToCloudinary(image, 'portfolio/projects');
    }

    // Upload additional images if provided
    if (images && Array.isArray(images)) {
      for (const img of images) {
        const uploadedImg = await uploadToCloudinary(img, 'portfolio/projects');
        uploadedImages.push(uploadedImg);
      }
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        tags: tags || [],
        image: uploadedImage,
        images: uploadedImages,
        link,
        isVisible: isVisible !== undefined ? isVisible : true,
        isFeatured: isFeatured || false
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (protected endpoint)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, image, images, link, isVisible, isFeatured } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let uploadedImage = existingProject.image;
    let uploadedImages = existingProject.images;

    // Upload new main image if provided
    if (image && image !== existingProject.image) {
      uploadedImage = await uploadToCloudinary(image, 'portfolio/projects');
    }

    // Upload new additional images if provided
    if (images && Array.isArray(images)) {
      uploadedImages = [];
      for (const img of images) {
        if (typeof img === 'string' && img.startsWith('http')) {
          // Existing image URL
          uploadedImages.push(img);
        } else {
          // New image to upload
          const uploadedImg = await uploadToCloudinary(img, 'portfolio/projects');
          uploadedImages.push(uploadedImg);
        }
      }
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        tags: tags !== undefined ? tags : existingProject.tags,
        image: uploadedImage,
        images: uploadedImages,
        link: link !== undefined ? link : existingProject.link,
        isVisible: isVisible !== undefined ? isVisible : existingProject.isVisible,
        isFeatured: isFeatured !== undefined ? isFeatured : existingProject.isFeatured
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (protected endpoint)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

