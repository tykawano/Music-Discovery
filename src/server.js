const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config/constants');
const artistRoutes = require('./routes/artistRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', artistRoutes);
app.use(errorHandler);
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Music Discovery App server running on http://localhost:${PORT}`);
  });
}
module.exports = app;
