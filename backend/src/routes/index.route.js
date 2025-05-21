import userRoutes from './user.route.js';
import adminRoutes from './admin.route.js';
import authRoutes from './auth.route.js';
import songRoutes from './song.route.js';
import albumRoutes from './album.route.js';
import statRoutes from './stat.route.js';
import genreRoutes from './genre.route.js'

export default (app) => {
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/songs', songRoutes);
  app.use('/api/albums', albumRoutes);
  app.use('/api/stats', statRoutes);
  app.use('/api/genre', genreRoutes)
};