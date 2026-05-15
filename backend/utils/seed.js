require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Project, Task } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create member users
    const member1Password = await bcrypt.hash('member123', 12);
    const member1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: member1Password,
      role: 'member',
    });

    const member2Password = await bcrypt.hash('member123', 12);
    const member2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: member2Password,
      role: 'member',
    });

    const member3Password = await bcrypt.hash('member123', 12);
    const member3 = await User.create({
      name: 'Carol White',
      email: 'carol@example.com',
      password: member3Password,
      role: 'member',
    });

    console.log('✅ Users created');

    // Create projects
    const project1 = await Project.create({
      title: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX.',
      created_by: admin.id,
    });

    const project2 = await Project.create({
      title: 'Mobile App Development',
      description: 'Build a cross-platform mobile application for iOS and Android.',
      created_by: admin.id,
    });

    const project3 = await Project.create({
      title: 'API Integration',
      description: 'Integrate third-party APIs for payment processing and notifications.',
      created_by: admin.id,
    });

    console.log('✅ Projects created');

    // Create tasks
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 3); // 3 days ago (overdue)
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
    const farFutureDate = new Date(today);
    farFutureDate.setDate(farFutureDate.getDate() + 14);

    await Task.bulkCreate([
      {
        title: 'Design Homepage Mockup',
        description: 'Create wireframes and high-fidelity mockups for the new homepage.',
        status: 'Completed',
        priority: 'High',
        due_date: pastDate.toISOString().split('T')[0],
        assigned_to: member1.id,
        project_id: project1.id,
      },
      {
        title: 'Implement Responsive Navigation',
        description: 'Build a fully responsive navigation bar with mobile hamburger menu.',
        status: 'In Progress',
        priority: 'High',
        due_date: futureDate.toISOString().split('T')[0],
        assigned_to: member1.id,
        project_id: project1.id,
      },
      {
        title: 'SEO Optimization',
        description: 'Optimize all pages for search engines including meta tags and structured data.',
        status: 'Pending',
        priority: 'Medium',
        due_date: farFutureDate.toISOString().split('T')[0],
        assigned_to: member2.id,
        project_id: project1.id,
      },
      {
        title: 'Setup React Native Project',
        description: 'Initialize the React Native project with navigation and state management.',
        status: 'Completed',
        priority: 'High',
        due_date: pastDate.toISOString().split('T')[0],
        assigned_to: member2.id,
        project_id: project2.id,
      },
      {
        title: 'Build Authentication Screens',
        description: 'Create login, signup, and forgot password screens for the mobile app.',
        status: 'In Progress',
        priority: 'High',
        due_date: futureDate.toISOString().split('T')[0],
        assigned_to: member3.id,
        project_id: project2.id,
      },
      {
        title: 'Push Notifications Setup',
        description: 'Integrate Firebase Cloud Messaging for push notifications.',
        status: 'Pending',
        priority: 'Medium',
        due_date: farFutureDate.toISOString().split('T')[0],
        assigned_to: member1.id,
        project_id: project2.id,
      },
      {
        title: 'Stripe Payment Integration',
        description: 'Integrate Stripe API for processing payments securely.',
        status: 'Pending',
        priority: 'High',
        due_date: pastDate.toISOString().split('T')[0], // overdue
        assigned_to: member2.id,
        project_id: project3.id,
      },
      {
        title: 'Email Notification Service',
        description: 'Set up SendGrid for transactional email notifications.',
        status: 'In Progress',
        priority: 'Medium',
        due_date: futureDate.toISOString().split('T')[0],
        assigned_to: member3.id,
        project_id: project3.id,
      },
      {
        title: 'API Documentation',
        description: 'Write comprehensive API documentation using Swagger/OpenAPI.',
        status: 'Pending',
        priority: 'Low',
        due_date: farFutureDate.toISOString().split('T')[0],
        assigned_to: member3.id,
        project_id: project3.id,
      },
    ]);

    console.log('✅ Tasks created');
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Admin:  admin@example.com  / admin123');
    console.log('  Member: alice@example.com  / member123');
    console.log('  Member: bob@example.com    / member123');
    console.log('  Member: carol@example.com  / member123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
